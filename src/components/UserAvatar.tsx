import type { UserProfile } from "../lib/types";

interface UserAvatarProps {
  name: string;
  profile?: UserProfile | null;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  showLabel?: boolean;
}

const SIZES = {
  sm: { circle: "w-8 h-8", text: "text-[11px]", label: "text-[10px] max-w-[48px]" },
  md: { circle: "w-12 h-12", text: "text-[15px]", label: "text-[11px] max-w-[60px]" },
  lg: { circle: "w-16 h-16", text: "text-[20px]", label: "text-[13px] max-w-[72px]" },
};

export default function UserAvatar({ name, profile, active, size = "md", onClick, showLabel = true }: UserAvatarProps) {
  const s = SIZES[size];

  const renderContent = () => {
    if (profile?.avatar_type === "emoji" && profile.avatar_value) {
      return <span>{profile.avatar_value}</span>;
    }
    if (profile?.avatar_type === "upload" && profile.avatar_value) {
      return (
        <img
          src={profile.avatar_value}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    // Default: initials
    const initials = (profile?.avatar_value || name).slice(0, 2).toUpperCase();
    return <span>{initials}</span>;
  };

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity"
    >
      <div
        className={`${s.circle} rounded-full flex items-center justify-center ${s.text} font-semibold overflow-hidden`}
        style={{
          backgroundColor: active ? "var(--td-accent)" : "var(--td-fill)",
          color: active ? "var(--td-accent-text)" : "var(--td-label)",
          border: active ? "2px solid var(--td-accent)" : "2px solid transparent",
        }}
      >
        {renderContent()}
      </div>
      {showLabel && (
        <span className={`${s.label} truncate`} style={{ color: "var(--td-secondary)" }}>
          {profile?.display_name || name}
        </span>
      )}
    </Wrapper>
  );
}
