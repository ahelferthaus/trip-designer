export type BudgetLevel = "budget" | "mid" | "splurge";
export type TripVibe = "relaxed" | "adventure" | "culture" | "food" | "nightlife" | "nature" | "family" | "romance";
export type SlotType = "morning" | "afternoon" | "evening" | "flex";
export type ActivityCategory = "food" | "attraction" | "adventure" | "rest" | "transport";
export type WeatherSensitivity = "indoor" | "outdoor" | "either";
export type SlotStatus = "open" | "decided";
export type TripStatus = "planning" | "active" | "completed";
export type MemberRole = "owner" | "collaborator";

export interface Location {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  google_place_id?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: Location;
  start_date: string;
  end_date: string;
  created_by: string;
  invite_code?: string;
  budget_level: BudgetLevel;
  budget_amount?: number;
  vibes: TripVibe[];
  group_size: number;
  group_description?: string;
  must_haves?: string;
  avoid?: string;
  status: TripStatus;
  created_at: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  date: string;
  day_number: number;
  title?: string;
  notes?: string;
}

export interface ActivitySlot {
  id: string;
  day_id: string;
  slot_type: SlotType;
  start_time?: string;
  end_time?: string;
  selected_option_id?: string;
  status: SlotStatus;
}

export interface ActivityOption {
  id: string;
  slot_id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  estimated_cost_per_person?: number;
  duration_minutes?: number;
  location?: Location;
  photo_url?: string;
  booking_url?: string;
  weather_sensitivity: WeatherSensitivity;
  ai_generated: boolean;
  why_this_fits?: string;
  // New fields for write-in and booking
  isCustom?: boolean;
  isBooked?: boolean;
  bookedBy?: string;
  createdBy?: string;
}

export interface SlotOptions {
  [slotId: string]: ActivityOption[];
}

export interface Vote {
  id: string;
  option_id: string;
  user_id: string;
  value: "up" | "down";
  created_at: string;
}

export interface Attendance {
  id: string;
  day_id: string;
  user_id: string;
  attending: boolean;
  note?: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id?: string;
  display_name: string;
  role: MemberRole;
}

export interface GroupMember {
  name: string;
  type: "adult" | "child";
  age?: number;
}

export interface LodgingOption {
  city: string;
  checkIn: string;
  checkOut: string;
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

export type AvatarType = "initials" | "emoji" | "upload";

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_type: AvatarType;
  avatar_value: string;
  default_passcode: string;
}

export interface TravelPartner {
  id: string;
  user_id: string;
  name: string;
  type: "adult" | "child";
  age?: number;
}

export interface PartnerGroup {
  id: string;
  user_id: string;
  name: string;
  partner_ids: string[];
}

export interface TripInvitation {
  id: string;
  trip_id: string;
  invited_by: string;
  invited_email: string;
  status: "pending" | "accepted" | "expired";
  token: string;
  expires_at: string;
}

export interface IntakeFormData {
  destination: Location | null;
  start_date: string;
  end_date: string;
  group_members: GroupMember[];
  budget_level: BudgetLevel | null;
  budget_amount?: number;
  budget_currency?: Currency;
  budget_per_person?: boolean;
  vibes: TripVibe[];
  must_haves?: string;
  avoid?: string;
  dietary?: string;
  mobility?: string;
}
