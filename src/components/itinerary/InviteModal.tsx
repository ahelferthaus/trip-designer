import { useState, useEffect } from "react";
import { sendTripInvite, getInvitationsForTrip } from "../../lib/tripInvitations";
import type { TripInvitation } from "../../lib/types";

interface InviteModalProps {
  tripId: string;
  invitedBy: string;
  inviteCode: string;
  onClose: () => void;
}

export default function InviteModal({ tripId, invitedBy, inviteCode, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<TripInvitation[]>([]);

  useEffect(() => {
    getInvitationsForTrip(tripId).then(setInvitations);
  }, [tripId]);

  const handleSend = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const inv = await sendTripInvite(tripId, invitedBy, email.trim());
      if (inv) {
        setInvitations(prev => [inv, ...prev]);
        setSent(true);
        setEmail("");
        setTimeout(() => setSent(false), 2000);
      } else {
        setError("Failed to send invite");
      }
    } catch {
      setError("Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const shareLink = `${window.location.origin}/join/${inviteCode}`;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-8 safe-bottom"
        style={{ backgroundColor: "var(--td-bg)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold" style={{ color: "var(--td-label)" }}>Invite to Trip</h3>
          <button onClick={onClose} className="text-[17px]" style={{ color: "var(--td-secondary)" }}>Done</button>
        </div>

        {/* Share link */}
        <div className="rounded-2xl px-4 py-3 mb-4 shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
          <p className="text-[12px] uppercase tracking-wide mb-1" style={{ color: "var(--td-secondary)" }}>Share link</p>
          <p className="text-[13px] break-all" style={{ color: "var(--td-label)" }}>{shareLink}</p>
          <button
            onClick={() => { navigator.clipboard.writeText(shareLink); }}
            className="text-[13px] font-medium mt-1"
            style={{ color: "var(--td-accent)" }}
          >
            Copy link
          </button>
        </div>

        {/* Email invite */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-4 py-3 rounded-2xl text-[15px] bg-transparent focus:outline-none"
            style={{
              backgroundColor: "var(--td-card)",
              color: "var(--td-label)",
              border: "1px solid var(--td-separator)",
            }}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !email.trim()}
            className="px-4 py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
            style={{
              backgroundColor: email.trim() ? "var(--td-accent)" : "var(--td-fill)",
              color: email.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
            }}
          >
            {sending ? "..." : "Send"}
          </button>
        </div>

        {sent && (
          <p className="text-[13px] mb-2" style={{ color: "#34C759" }}>Invite sent!</p>
        )}
        {error && (
          <p className="text-[13px] mb-2" style={{ color: "#FF3B30" }}>{error}</p>
        )}

        {/* Pending invites */}
        {invitations.length > 0 && (
          <div>
            <p className="text-[12px] uppercase tracking-wide mb-2" style={{ color: "var(--td-secondary)" }}>
              Pending invites
            </p>
            <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
              style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
              {invitations.map(inv => (
                <div key={inv.id} className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[14px] truncate" style={{ color: "var(--td-label)" }}>{inv.invited_email}</span>
                  <span
                    className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: inv.status === "accepted" ? "#34C75920" : "var(--td-fill)",
                      color: inv.status === "accepted" ? "#34C759" : "var(--td-secondary)",
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
