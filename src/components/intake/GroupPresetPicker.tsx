import { useState, useEffect } from "react";
import { getPartners, getGroups } from "../../lib/travelPartners";
import type { TravelPartner, PartnerGroup, GroupMember } from "../../lib/types";

interface GroupPresetPickerProps {
  userId: string;
  onLoadGroup: (members: GroupMember[]) => void;
}

export default function GroupPresetPicker({ userId, onLoadGroup }: GroupPresetPickerProps) {
  const [partners, setPartners] = useState<TravelPartner[]>([]);
  const [groups, setGroups] = useState<PartnerGroup[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPartners(userId).then(setPartners);
    getGroups(userId).then(setGroups);
  }, [userId]);

  if (groups.length === 0) return null;

  const handleSelect = (group: PartnerGroup) => {
    const members: GroupMember[] = group.partner_ids
      .map(pid => partners.find(p => p.id === pid))
      .filter((p): p is TravelPartner => !!p)
      .map(p => ({ name: p.name, type: p.type as "adult" | "child", age: p.age }));
    onLoadGroup(members);
    setOpen(false);
  };

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[15px] font-medium px-4 py-2 rounded-xl active:opacity-70"
        style={{ backgroundColor: "var(--td-fill)", color: "var(--td-accent)" }}
      >
        Load Group {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-2xl overflow-hidden shadow-sm divide-y"
          style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
          {groups.map(g => {
            const memberNames = g.partner_ids
              .map(pid => partners.find(p => p.id === pid)?.name)
              .filter(Boolean)
              .join(", ");
            return (
              <button
                key={g.id}
                onClick={() => handleSelect(g)}
                className="w-full text-left px-4 py-3 active:opacity-70"
              >
                <span className="text-[15px] font-medium" style={{ color: "var(--td-label)" }}>{g.name}</span>
                <span className="text-[12px] block mt-0.5" style={{ color: "var(--td-secondary)" }}>
                  {memberNames}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
