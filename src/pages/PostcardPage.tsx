import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { supabase } from "../lib/supabase";
import { savePostcard, sendPostcard } from "../lib/postcardProvider";

type Template = "minimal" | "vintage" | "family";
type DeliveryType = "email" | "sms" | "print";
type Step = "photo" | "message" | "style" | "delivery" | "recipient" | "preview" | "sent";

const TEMPLATES: Record<Template, { name: string; font: string; bg: string; overlay: string; textColor: string; accent: string }> = {
  minimal: {
    name: "Minimal Luxury",
    font: "'Georgia', serif", bg: "#FAFAF8",
    overlay: "rgba(0,0,0,0.03)", textColor: "#1A1A1A", accent: "#C8A97E",
  },
  vintage: {
    name: "Vintage Travel",
    font: "'Courier New', monospace", bg: "#F5E6D3",
    overlay: "rgba(139,69,19,0.05)", textColor: "#3E2723", accent: "#8B4513",
  },
  family: {
    name: "Family Vacation",
    font: "'Comic Sans MS', 'Marker Felt', sans-serif", bg: "#FFF8E7",
    overlay: "rgba(255,152,0,0.03)", textColor: "#333", accent: "#FF6B35",
  },
};

function resizeImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Blob fail")), "image/jpeg", quality);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export default function PostcardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("photo");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [_photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<Template>("minimal");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("email");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState({ street1: "", street2: "", city: "", state: "", postalCode: "", country: "US" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TEMPLATES[template];

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !supabase) return;
    setPhotoFile(file);
    setUploading(true);

    const resized = await resizeImage(file);
    const path = `postcards/${user.id}/${Date.now()}.jpg`;
    const { error: uploadErr } = await supabase.storage
      .from("trip-photos")
      .upload(path, resized, { contentType: "image/jpeg", upsert: true });

    if (!uploadErr) {
      const { data } = supabase.storage.from("trip-photos").getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
    }
    setUploading(false);
    if (!uploadErr) setStep("message");
  };

  const handleSend = async () => {
    if (!user || !photoUrl) return;
    setSending(true);
    setError(null);

    const postcard = await savePostcard({
      trip_id: tripId,
      user_id: user.id,
      photo_url: photoUrl,
      message,
      template,
      recipient_name: recipientName,
      recipient_email: deliveryType === "email" ? recipientEmail : null,
      recipient_phone: deliveryType === "sms" ? recipientPhone : null,
      recipient_address: deliveryType === "print" ? address : null,
      delivery_type: deliveryType,
    });

    if (!postcard) {
      setError("Failed to save postcard");
      setSending(false);
      return;
    }

    const result = await sendPostcard(postcard);
    if (result.success) {
      setStep("sent");
    } else {
      setError(result.error || "Send failed");
    }
    setSending(false);
  };

  const canProceed = () => {
    if (step === "recipient") {
      if (deliveryType === "email") return recipientName.trim() && recipientEmail.includes("@");
      if (deliveryType === "sms") return recipientName.trim() && recipientPhone.length >= 10;
      if (deliveryType === "print") return recipientName.trim() && address.street1 && address.city && address.postalCode;
    }
    return true;
  };

  // --- Postcard Preview Component ---
  const PostcardFront = () => (
    <div className="rounded-xl overflow-hidden shadow-xl" style={{ aspectRatio: "6/4" }}>
      {photoUrl ? (
        <img src={photoUrl} alt="Postcard" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: t.bg }}>
          <span className="text-[40px]">📸</span>
        </div>
      )}
    </div>
  );

  const PostcardBack = () => (
    <div className="rounded-xl overflow-hidden shadow-xl p-6 flex flex-col justify-between"
      style={{ aspectRatio: "6/4", backgroundColor: t.bg }}>
      <div>
        <p className="text-[16px] leading-relaxed" style={{ fontFamily: t.font, color: t.textColor }}>
          {message || "Your message here…"}
        </p>
      </div>
      <div className="flex items-end justify-between mt-4">
        <p className="text-[10px] italic" style={{ color: t.accent }}>Sent with VYBR</p>
        <div className="text-right">
          <p className="text-[12px] font-semibold" style={{ color: t.textColor }}>{recipientName || "Recipient"}</p>
          {deliveryType === "print" && address.city && (
            <p className="text-[10px]" style={{ color: t.textColor + "99" }}>{address.city}, {address.state}</p>
          )}
        </div>
      </div>
    </div>
  );

  // --- Sent Screen ---
  if (step === "sent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-center animate-fade-scale-in">
          <div className="text-6xl mb-4">💌</div>
          <h2 className="text-[26px] font-black mb-2" style={{ color: "var(--td-label)" }}>
            Postcard sent!
          </h2>
          <p className="text-[15px] mb-8" style={{ color: "var(--td-secondary)" }}>
            {deliveryType === "print"
              ? `A physical postcard is on its way to ${recipientName}.`
              : `Your postcard was sent to ${recipientName}.`}
          </p>
          <button onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#1A1A1A" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
        <button onClick={() => step === "photo" ? navigate(-1) : setStep(
          step === "message" ? "photo" : step === "style" ? "message" :
          step === "delivery" ? "style" : step === "recipient" ? "delivery" : "recipient"
        )} className="text-[15px] font-medium text-white/70 active:opacity-70">
          {step === "photo" ? "‹ Cancel" : "‹ Back"}
        </button>
        <p className="text-[13px] text-white/50 font-medium">
          {step === "photo" ? "Choose Photo" : step === "message" ? "Write Message" :
           step === "style" ? "Pick Style" : step === "delivery" ? "Delivery" :
           step === "recipient" ? "Recipient" : "Preview"}
        </p>
        <div className="w-16" />
      </div>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col">
        {/* Step: Photo */}
        {step === "photo" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <PostcardFront />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              {uploading ? "Uploading…" : photoUrl ? "Change Photo" : "Take or Choose Photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            {photoUrl && (
              <button onClick={() => setStep("message")}
                className="text-[15px] font-semibold text-white/70 active:opacity-70">
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Step: Message */}
        {step === "message" && (
          <div className="flex-1 flex flex-col gap-5">
            <PostcardFront />
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 200))}
              placeholder="Write your message…"
              rows={4}
              maxLength={200}
              autoFocus
              className="w-full px-4 py-4 rounded-2xl text-[16px] bg-transparent resize-none focus:outline-none"
              style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.15)", fontFamily: t.font }}
            />
            <div className="flex justify-between text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>{message.length}/200</span>
              <button onClick={() => setStep("style")} disabled={!message.trim()}
                className="text-[15px] font-bold active:opacity-70"
                style={{ color: message.trim() ? "var(--td-accent)" : "rgba(255,255,255,0.2)" }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step: Style */}
        {step === "style" && (
          <div className="flex-1 flex flex-col gap-4">
            <PostcardBack />
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold mt-2">Choose a style</p>
            <div className="flex flex-col gap-2">
              {(Object.entries(TEMPLATES) as [Template, typeof TEMPLATES["minimal"]][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setTemplate(key)}
                  className="rounded-xl px-4 py-3.5 flex items-center gap-3 active:opacity-70"
                  style={{
                    backgroundColor: template === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    border: template === key ? `2px solid ${val.accent}` : "2px solid transparent",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: val.bg, border: `2px solid ${val.accent}` }} />
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-white">{val.name}</p>
                    <p className="text-[11px] text-white/50" style={{ fontFamily: val.font }}>Preview text</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("delivery")}
              className="mt-auto w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
              style={{ backgroundColor: t.accent, color: "white" }}>
              Next →
            </button>
          </div>
        )}

        {/* Step: Delivery */}
        {step === "delivery" && (
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold">How to send it</p>
            {([
              { type: "email" as DeliveryType, icon: "📧", title: "Email", desc: "Send a digital postcard by email" },
              { type: "sms" as DeliveryType, icon: "💬", title: "Text Message", desc: "Send via SMS with photo link" },
              { type: "print" as DeliveryType, icon: "📮", title: "Physical Mail", desc: "Print & mail a real postcard" },
            ]).map(({ type, icon, title, desc }) => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className="rounded-xl px-4 py-4 flex items-center gap-4 active:opacity-70"
                style={{
                  backgroundColor: deliveryType === type ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: deliveryType === type ? `2px solid ${t.accent}` : "2px solid transparent",
                }}
              >
                <span className="text-[28px]">{icon}</span>
                <div className="text-left">
                  <p className="text-[15px] font-semibold text-white">{title}</p>
                  <p className="text-[12px] text-white/50">{desc}</p>
                </div>
              </button>
            ))}
            <button onClick={() => setStep("recipient")}
              className="mt-auto w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
              style={{ backgroundColor: t.accent, color: "white" }}>
              Next →
            </button>
          </div>
        )}

        {/* Step: Recipient */}
        {step === "recipient" && (
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold">Recipient</p>
            <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)}
              placeholder="Recipient name" className="w-full px-4 py-3.5 rounded-xl text-[15px] bg-transparent focus:outline-none"
              style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.15)" }} />

            {deliveryType === "email" && (
              <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                placeholder="Email address" className="w-full px-4 py-3.5 rounded-xl text-[15px] bg-transparent focus:outline-none"
                style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.15)" }} />
            )}

            {deliveryType === "sms" && (
              <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)}
                placeholder="Phone number" className="w-full px-4 py-3.5 rounded-xl text-[15px] bg-transparent focus:outline-none"
                style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.15)" }} />
            )}

            {deliveryType === "print" && (
              <>
                {(["street1", "city", "state", "postalCode"] as const).map(key => (
                  <input key={key} type="text" value={address[key]}
                    onChange={e => setAddress(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={key === "street1" ? "Street address" : key === "postalCode" ? "ZIP code" : key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full px-4 py-3.5 rounded-xl text-[15px] bg-transparent focus:outline-none"
                    style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.15)" }} />
                ))}
              </>
            )}

            {error && <p className="text-[13px] text-center" style={{ color: "#FF3B30" }}>{error}</p>}

            <button onClick={() => setStep("preview")} disabled={!canProceed()}
              className="mt-auto w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
              style={{
                backgroundColor: canProceed() ? t.accent : "rgba(255,255,255,0.1)",
                color: canProceed() ? "white" : "rgba(255,255,255,0.3)",
              }}>
              Preview →
            </button>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold text-center">Front</p>
            <PostcardFront />
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold text-center mt-2">Back</p>
            <PostcardBack />

            {error && <p className="text-[13px] text-center" style={{ color: "#FF3B30" }}>{error}</p>}

            <button onClick={handleSend} disabled={sending}
              className="mt-auto w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98]"
              style={{ backgroundColor: t.accent, color: "white", boxShadow: `0 4px 16px ${t.accent}40` }}>
              {sending ? "Sending…" : deliveryType === "print" ? "Send Physical Postcard" : "Send Postcard"}
            </button>
            <p className="text-[11px] text-center text-white/30">
              {deliveryType === "print" ? "Printed & mailed via Lob · Arrives in 3-7 days" :
               deliveryType === "sms" ? "Opens your messaging app" : "Sends via email"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
