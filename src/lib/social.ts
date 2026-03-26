import { supabase } from "./supabase";
import type { UserProfile } from "./types";

// --- Follows ---

export async function followUser(followingId: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // Check if target is public
  const { data: targetProfile } = await supabase
    .from("user_profiles")
    .select("is_public")
    .eq("id", followingId)
    .single();
  const status = targetProfile?.is_public === false ? "pending" : "accepted";
  await supabase.from("user_follows").upsert(
    { follower_id: user.id, following_id: followingId, status },
    { onConflict: "follower_id,following_id" }
  );
  // Add to feed if accepted
  if (status === "accepted") {
    await addFeedItem(user.id, "followed", undefined, { following_id: followingId });
  }
}

export async function unfollowUser(followingId: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);
}

export async function acceptFollowRequest(followerId: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_follows")
    .update({ status: "accepted" })
    .eq("follower_id", followerId)
    .eq("following_id", user.id);
}

export async function getFollowers(userId: string): Promise<Array<{ id: string; profile: UserProfile; status: string }>> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("user_follows")
    .select("follower_id, status, user_profiles!user_follows_follower_id_fkey(*)")
    .eq("following_id", userId);
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.follower_id as string,
    profile: r.user_profiles as unknown as UserProfile,
    status: r.status as string,
  }));
}

export async function getFollowing(userId: string): Promise<Array<{ id: string; profile: UserProfile }>> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("user_follows")
    .select("following_id, user_profiles!user_follows_following_id_fkey(*)")
    .eq("follower_id", userId)
    .eq("status", "accepted");
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.following_id as string,
    profile: r.user_profiles as unknown as UserProfile,
  }));
}

export async function getFollowCounts(userId: string): Promise<{ followers: number; following: number }> {
  if (!supabase) return { followers: 0, following: 0 };
  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("following_id", userId).eq("status", "accepted"),
    supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("follower_id", userId).eq("status", "accepted"),
  ]);
  return { followers: followers ?? 0, following: following ?? 0 };
}

export async function getFollowStatus(targetUserId: string): Promise<"none" | "pending" | "accepted"> {
  if (!supabase) return "none";
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "none";
  const { data } = await supabase
    .from("user_follows")
    .select("status")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .single();
  if (!data) return "none";
  return data.status as "pending" | "accepted";
}

// --- Comments ---

export interface Comment {
  id: string;
  trip_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  author_name: string;
  author_avatar_type: string;
  author_avatar_value: string;
  replies?: Comment[];
}

export async function getComments(tripId: string): Promise<Comment[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_comments")
    .select("*, user_profiles(display_name, avatar_type, avatar_value)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  const all = (data ?? []).map((r: Record<string, unknown>) => {
    const p = r.user_profiles as Record<string, string> | null;
    return {
      id: r.id as string,
      trip_id: r.trip_id as string,
      user_id: r.user_id as string,
      parent_id: r.parent_id as string | null,
      body: r.body as string,
      created_at: r.created_at as string,
      author_name: p?.display_name ?? "Anonymous",
      author_avatar_type: p?.avatar_type ?? "initials",
      author_avatar_value: p?.avatar_value ?? "",
      replies: [] as Comment[],
    };
  });

  // Thread: group replies under parents
  const topLevel: Comment[] = [];
  const byId = new Map<string, Comment>();
  for (const c of all) byId.set(c.id, c);
  for (const c of all) {
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.replies!.push(c);
    } else {
      topLevel.push(c);
    }
  }
  return topLevel;
}

export async function addComment(tripId: string, body: string, parentId?: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("trip_comments").insert({
    trip_id: tripId,
    user_id: user.id,
    parent_id: parentId ?? null,
    body,
  });
  await addFeedItem(user.id, "commented", tripId, { body: body.slice(0, 100) });
}

export async function deleteComment(commentId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("trip_comments").delete().eq("id", commentId);
}

// --- Likes ---

export async function likeTrip(tripId: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("trip_likes").upsert(
    { trip_id: tripId, user_id: user.id },
    { onConflict: "trip_id,user_id" }
  );
  // Increment count
  const { data: trip } = await supabase.from("trips").select("likes_count").eq("id", tripId).single();
  if (trip) {
    await supabase.from("trips").update({ likes_count: (trip.likes_count ?? 0) + 1 }).eq("id", tripId);
  }
  await addFeedItem(user.id, "liked", tripId, {});
}

export async function unlikeTrip(tripId: string): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("trip_likes")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", user.id);
  const { data: trip } = await supabase.from("trips").select("likes_count").eq("id", tripId).single();
  if (trip) {
    await supabase.from("trips").update({ likes_count: Math.max(0, (trip.likes_count ?? 1) - 1) }).eq("id", tripId);
  }
}

export async function hasLiked(tripId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("trip_likes")
    .select("trip_id")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();
  return !!data;
}

export async function getLikeCount(tripId: string): Promise<number> {
  if (!supabase) return 0;
  const { count } = await supabase
    .from("trip_likes")
    .select("*", { count: "exact", head: true })
    .eq("trip_id", tripId);
  return count ?? 0;
}

// --- Activity Feed ---

export interface FeedItem {
  id: string;
  actor_id: string;
  action_type: string;
  trip_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  actor_name: string;
  actor_avatar_type: string;
  actor_avatar_value: string;
  trip_title?: string;
  trip_destination?: string;
}

async function addFeedItem(actorId: string, actionType: string, tripId?: string, metadata?: Record<string, unknown>): Promise<void> {
  if (!supabase) return;
  await supabase.from("activity_feed").insert({
    actor_id: actorId,
    action_type: actionType,
    trip_id: tripId ?? null,
    metadata: metadata ?? {},
  });
}

export async function getFeed(userId: string, limit = 50): Promise<FeedItem[]> {
  if (!supabase) return [];

  // Get who I follow
  const { data: follows } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", userId)
    .eq("status", "accepted");

  const followingIds = (follows ?? []).map((f: Record<string, string>) => f.following_id);
  if (followingIds.length === 0) return [];

  const { data } = await supabase
    .from("activity_feed")
    .select("*, user_profiles!activity_feed_actor_id_fkey(display_name, avatar_type, avatar_value), trips(title, destination)")
    .in("actor_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r: Record<string, unknown>) => {
    const p = r.user_profiles as Record<string, string> | null;
    const t = r.trips as Record<string, string> | null;
    return {
      id: r.id as string,
      actor_id: r.actor_id as string,
      action_type: r.action_type as string,
      trip_id: r.trip_id as string | null,
      metadata: (r.metadata ?? {}) as Record<string, unknown>,
      created_at: r.created_at as string,
      actor_name: p?.display_name ?? "Someone",
      actor_avatar_type: p?.avatar_type ?? "initials",
      actor_avatar_value: p?.avatar_value ?? "",
      trip_title: t?.title,
      trip_destination: t?.destination,
    };
  });
}

// --- Public Profile ---

export async function getPublicProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as UserProfile | null;
}

export async function getPublishedTripsForUser(userId: string): Promise<Array<{ id: string; title: string; destination: string; start_date: string; end_date: string; likes_count: number; clone_count: number }>> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trips")
    .select("id, title, destination, start_date, end_date, likes_count, clone_count")
    .eq("user_id", userId)
    .eq("is_published", true)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });
  return (data ?? []) as Array<{ id: string; title: string; destination: string; start_date: string; end_date: string; likes_count: number; clone_count: number }>;
}
