import { useState, useEffect } from "react";
import {
  getPartners,
  addPartner,
  deletePartner,
  getGroups,
  addGroup,
  deleteGroup,
} from "../../lib/travelPartners";
import type { TravelPartner, PartnerGroup } from "../../lib/types";

export default function TravelPartnersSection({ userId }: { userId: string }) {
  const [partners, setPartners] = useState<TravelPartner[]>([]);
  const [groups, setGroups] = useState<PartnerGroup[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"adult" | "child">("adult");
  const [newAge, setNewAge] = useState<number | undefined>();
  const [groupName, setGroupName] = useState("");
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);

  useEffect(() => {
    getPartners(userId).then(setPartners);
    getGroups(userId).then(setGroups);
  }, [userId]);

  const handleAddPartner = async () => {
    if (!newName.trim()) return;
    const p = await addPartner(userId, {
      name: newName.trim(),
      type: newType,
      age: newType === "child" ? newAge : undefined,
    });
    if (p) setPartners(prev => [...prev, p]);
    setNewName("");
    setNewType("adult");
    setNewAge(undefined);
  };

  const handleDeletePartner = async (id: string) => {
    await deletePartner(id);
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  const handleAddGroup = async () => {
    if (!groupName.trim() || selectedPartnerIds.length === 0) return;
    const g = await addGroup(userId, groupName.trim(), selectedPartnerIds);
    if (g) setGroups(prev => [...prev, g]);
    setGroupName("");
    setSelectedPartnerIds([]);
    setShowGroupForm(false);
  };

  const handleDeleteGroup = async (id: string) => {
    await deleteGroup(id);
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const togglePartnerForGroup = (id: string) => {
    setSelectedPartnerIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Partners list */}
      <section>
        <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
          Travel Partners
        </p>
        <div className="rounded-2xl overflow-hidden shadow-sm divide-y" style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
          {partners.length === 0 && (
            <div className="px-4 py-3">
              <span className="text-[14px]" style={{ color: "var(--td-secondary)" }}>No partners saved yet</span>
            </div>
          )}
          {partners.map(p => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-[15px]" style={{ color: "var(--td-label)" }}>{p.name}</span>
                <span className="text-[12px] ml-2" style={{ color: "var(--td-secondary)" }}>
                  {p.type}{p.age ? `, ${p.age}` : ""}
                </span>
              </div>
              <button
                onClick={() => handleDeletePartner(p.id)}
                className="text-xl leading-none"
                style={{ color: "#FF3B30" }}
              >
                −
              </button>
            </div>
          ))}
        </div>

        {/* Add partner form */}
        <div className="mt-2 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
          <div className="px-4 py-3 flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Name"
              className="flex-1 text-[15px] bg-transparent focus:outline-none"
              style={{ color: "var(--td-label)" }}
              onKeyDown={e => e.key === "Enter" && handleAddPartner()}
            />
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as "adult" | "child")}
              className="text-[13px] bg-transparent focus:outline-none"
              style={{ color: "var(--td-accent)" }}
            >
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select>
            {newType === "child" && (
              <input
                type="number"
                value={newAge ?? ""}
                onChange={e => setNewAge(parseInt(e.target.value) || undefined)}
                placeholder="Age"
                min={1}
                max={17}
                className="w-12 text-[13px] text-right bg-transparent focus:outline-none"
                style={{ color: "var(--td-label)" }}
              />
            )}
            <button
              onClick={handleAddPartner}
              disabled={!newName.trim()}
              className="px-3 py-1.5 rounded-xl text-[13px] font-semibold"
              style={{
                backgroundColor: newName.trim() ? "var(--td-accent)" : "var(--td-fill)",
                color: newName.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section>
        <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
          Partner Groups
        </p>
        <div className="rounded-2xl overflow-hidden shadow-sm divide-y" style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
          {groups.length === 0 && (
            <div className="px-4 py-3">
              <span className="text-[14px]" style={{ color: "var(--td-secondary)" }}>No groups yet</span>
            </div>
          )}
          {groups.map(g => {
            const memberNames = g.partner_ids
              .map(pid => partners.find(p => p.id === pid)?.name)
              .filter(Boolean)
              .join(", ");
            return (
              <div key={g.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[15px] font-medium" style={{ color: "var(--td-label)" }}>{g.name}</span>
                  <span className="text-[12px] block mt-0.5" style={{ color: "var(--td-secondary)" }}>
                    {memberNames || "No members"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteGroup(g.id)}
                  className="text-xl leading-none"
                  style={{ color: "#FF3B30" }}
                >
                  −
                </button>
              </div>
            );
          })}
        </div>

        {!showGroupForm ? (
          <button
            onClick={() => setShowGroupForm(true)}
            className="text-[15px] px-4 py-2 mt-2"
            style={{ color: "var(--td-accent)" }}
          >
            + Create group
          </button>
        ) : (
          <div className="mt-2 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <div className="px-4 py-3 flex flex-col gap-3">
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Group name (e.g. Family)"
                className="text-[15px] bg-transparent focus:outline-none"
                style={{ color: "var(--td-label)" }}
              />
              <div className="flex flex-wrap gap-2">
                {partners.map(p => {
                  const selected = selectedPartnerIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePartnerForGroup(p.id)}
                      className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: selected ? "var(--td-accent)" : "var(--td-fill)",
                        color: selected ? "var(--td-accent-text)" : "var(--td-label)",
                      }}
                    >
                      {p.name}
                    </button>
                  );
                })}
                {partners.length === 0 && (
                  <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>Add partners first</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowGroupForm(false); setGroupName(""); setSelectedPartnerIds([]); }}
                  className="flex-1 py-2 rounded-xl text-[13px]"
                  style={{ color: "var(--td-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  disabled={!groupName.trim() || selectedPartnerIds.length === 0}
                  className="flex-1 py-2 rounded-xl text-[13px] font-semibold"
                  style={{
                    backgroundColor: groupName.trim() && selectedPartnerIds.length > 0 ? "var(--td-accent)" : "var(--td-fill)",
                    color: groupName.trim() && selectedPartnerIds.length > 0 ? "var(--td-accent-text)" : "var(--td-secondary)",
                  }}
                >
                  Save Group
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
