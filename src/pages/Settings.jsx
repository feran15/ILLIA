import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "sonner";
import { Icon } from "../components/Studio/UI";
import { aiApi } from "../lib/api";

/* ------------------------------------------------------------------ */
/* Preferences storage                                                 */
/* ------------------------------------------------------------------ */

const SETTINGS_KEY = "illia_settings_v1";
const ONBOARD_KEY = "illia_onboarded_v1"; // same key the Create page uses

const DEFAULT_SETTINGS = {
  replyStyle: "balanced", // concise | balanced | detailed
  tone: "friendly", // friendly | professional | playful
  voiceLang: "en-US",
};

// Other pages (for example Create) can import this to read the saved choices.
export function getIlliaSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

const REPLY_STYLES = [
  ["concise", "Concise"],
  ["balanced", "Balanced"],
  ["detailed", "Detailed"],
];

const TONES = [
  ["friendly", "Friendly"],
  ["professional", "Professional"],
  ["playful", "Playful"],
];

const VOICE_LANGS = [
  ["en-US", "English (US)"],
  ["en-GB", "English (UK)"],
  ["en-NG", "English (Nigeria)"],
  ["fr-FR", "French"],
];

const I = {
  user: "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21c1.5-4 5-6 8-6s6.5 2 8 6",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.5 7.5L3 20l1-4.5A8.5 8.5 0 1 1 21 11.5z",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.2 2-2.5 3.5M12 17h.01",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
};

/* ------------------------------------------------------------------ */
/* Shared styles (same tokens as the Create page)                      */
/* ------------------------------------------------------------------ */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";
const btnPrimary = `${btnBase} grad text-white shadow-lg shadow-violet-500/30 hover:-translate-y-px`;
const btnSecondary = `${btnBase} border-[1.5px] border-line bg-surf text-ink hover:border-vio hover:bg-alt`;
const btnDanger = `${btnBase} bg-rose-500 text-white hover:-translate-y-px`;
const btnSm = "!px-4 !py-2.5 !text-[13px]";

const fieldCls =
  "w-full rounded-xl border-[1.5px] border-line bg-alt px-3.5 py-3 text-base text-ink outline-none focus:border-vio focus:bg-surf sm:text-[14.5px]";

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Section({ icon, title, description, children }) {
  return (
    <section className="mb-4 rounded-[20px] border border-line bg-surf p-4 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="soft grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] text-violet-300">
          <Icon d={icon} className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-[15px] font-extrabold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[13px] leading-normal text-mute">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function Row({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-line py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <div className="text-[14px] font-bold">{label}</div>
        {hint && (
          <div className="mt-0.5 text-[12.5px] leading-normal text-faint">
            {hint}
          </div>
        )}
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Segmented({ options, value, onChange, label }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex gap-1 rounded-full border border-line bg-alt p-1"
    >
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          className={`rounded-full px-3.5 py-2 text-[13px] font-bold transition ${
            value === id
              ? "grad text-white shadow-lg shadow-violet-500/30"
              : "text-mute hover:text-ink"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90dvh] w-full max-w-[400px] overflow-y-auto rounded-3xl bg-surf p-5 shadow-2xl sm:p-7">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settings page                                                       */
/* ------------------------------------------------------------------ */

export default function Settings() {
  const [user, setUser] = useState(getAuth().currentUser);
  const [settings, setSettings] = useState(getIlliaSettings);

  const [displayName, setDisplayName] = useState(
    getAuth().currentUser?.displayName || ""
  );
  const [savingName, setSavingName] = useState(false);

  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Keep the signed-in user up to date.
  useEffect(() => {
    return onAuthStateChanged(getAuth(), (next) => {
      setUser(next);
      setDisplayName(next?.displayName || "");
    });
  }, []);

  // Save preference changes on this device.
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage may be blocked; the choices still apply for this visit.
    }
  }, [settings]);

  const update = (key) => (value) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const email = user?.email || "";
  const initial = (displayName || email || "?").trim().charAt(0).toUpperCase();
  const usesPassword = Boolean(
    user?.providerData?.some((p) => p.providerId === "password")
  );
  const nameChanged =
    displayName.trim() !== (user?.displayName || "") && displayName.trim();

  async function saveName() {
    if (!user || !nameChanged || savingName) return;

    setSavingName(true);

    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success("Name updated");
    } catch (error) {
      console.error("Update name error:", error);
      toast.error("Couldn't update your name. Try again.");
    } finally {
      setSavingName(false);
    }
  }

  async function sendReset() {
    if (!email || sendingReset) return;

    setSendingReset(true);

    try {
      await sendPasswordResetEmail(getAuth(), email);
      toast.success(`Reset link sent to ${email}`);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Couldn't send the reset email. Try again.");
    } finally {
      setSendingReset(false);
    }
  }

  function replayGuide() {
    try {
      localStorage.removeItem(ONBOARD_KEY);
      toast.success("The feature guide will show next time you open Create.");
    } catch {
      toast.error("Couldn't reset the guide on this browser.");
    }
  }

  async function clearConversations() {
    if (clearing) return;

    setClearing(true);

    try {
      const data = await aiApi.get("/api/create/threads", { method: "GET" });
      const threads = data.threads || [];

      if (!threads.length) {
        setClearOpen(false);
        toast("You have no conversations to delete.");
        return;
      }

      const results = await Promise.allSettled(
        threads.map((thread) =>
          aiApi.delete(`/api/create/threads/${thread.id}`, {
            method: "DELETE",
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected").length;

      setClearOpen(false);

      if (failed) {
        toast.error(`${failed} conversation(s) could not be deleted.`);
      } else {
        toast.success("All conversations deleted.");
      }
    } catch (error) {
      console.error("Clear conversations error:", error);
      toast.error("Couldn't delete your conversations. Try again.");
    } finally {
      setClearing(false);
    }
  }

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut(getAuth());
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Couldn't sign you out. Try again.");
      setSigningOut(false);
    }
  }

  return (
    <div className="illia-create-theme min-h-screen w-full px-3 pb-8 pt-16 sm:px-4 lg:py-6">
      <style>{`
        .illia-create-theme {
          background: #241528;
          color: #FFFFFF;
          color-scheme: dark;
        }
        .illia-create-theme .bg-surf { background-color: #2F2138; }
        .illia-create-theme .bg-alt { background-color: #3B2945; }
        .illia-create-theme .text-ink { color: #FFFFFF; }
        .illia-create-theme .text-mute { color: #D8C9DF !important; }
        .illia-create-theme .text-faint { color: #B5A3BE !important; }
        .illia-create-theme .border-line { border-color: #503B5B !important; }
        .illia-create-theme .soft { background-color: #49305A !important; }
        .illia-create-theme .grad {
          background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%) !important;
          color: #FFFFFF !important;
        }
        .illia-create-theme textarea,
        .illia-create-theme input,
        .illia-create-theme select {
          background-color: #3B2945;
          color: #FFFFFF;
        }
        .illia-create-theme input::placeholder { color: #B5A3BE; }
        .illia-create-theme button:focus-visible,
        .illia-create-theme input:focus-visible,
        .illia-create-theme select:focus-visible {
          outline: 2px solid #A78BFA;
          outline-offset: 2px;
        }
      `}</style>

      <div className="mx-auto w-full max-w-[720px]">
        <header className="mb-5">
          <h1 className="text-xl font-extrabold">Settings</h1>
          <p className="mt-1 text-[13.5px] text-mute">
            Manage your account and how ILLIA works for you.
          </p>
        </header>

        {/* Profile */}
        <Section
          icon={I.user}
          title="Profile"
          description="How you appear in ILLIA."
        >
          <div className="mb-5 flex items-center gap-3.5">
            <span className="grad grid h-14 w-14 shrink-0 place-items-center rounded-full text-xl font-extrabold text-white">
              {initial}
            </span>

            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold">
                {displayName || "No name yet"}
              </div>
              <div className="truncate text-[13px] text-faint">
                {email || "Not signed in"}
              </div>
            </div>
          </div>

          <label
            htmlFor="set-name"
            className="mb-2 block text-xs font-extrabold text-faint"
          >
            Display name
          </label>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              id="set-name"
              maxLength={60}
              value={displayName}
              disabled={!user}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              placeholder="Your name"
              className={fieldCls}
            />

            <button
              type="button"
              onClick={saveName}
              disabled={!nameChanged || savingName}
              className={`${btnPrimary} ${btnSm} shrink-0`}
            >
              {savingName ? "Saving..." : "Save name"}
            </button>
          </div>
        </Section>

        {/* Preferences */}
        <Section
          icon={I.chat}
          title="Preferences"
          description="Saved on this device."
        >
          <Row
            label="Reply length"
            hint="How much detail ILLIA gives by default."
          >
            <Segmented
              label="Reply length"
              options={REPLY_STYLES}
              value={settings.replyStyle}
              onChange={update("replyStyle")}
            />
          </Row>

          <Row label="Tone" hint="The voice ILLIA writes in.">
            <Segmented
              label="Tone"
              options={TONES}
              value={settings.tone}
              onChange={update("tone")}
            />
          </Row>

          <Row
            label="Voice input language"
            hint="The language you speak when you use the mic."
          >
            <select
              aria-label="Voice input language"
              value={settings.voiceLang}
              onChange={(e) => update("voiceLang")(e.target.value)}
              className={`${fieldCls} !w-auto min-w-[190px]`}
            >
              {VOICE_LANGS.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </Row>
        </Section>

        {/* Help */}
        <Section
          icon={I.help}
          title="Help"
          description="New here, or want a refresher?"
        >
          <Row
            label="Feature guide"
            hint="Show the welcome walkthrough again."
          >
            <button
              type="button"
              onClick={replayGuide}
              className={`${btnSecondary} ${btnSm}`}
            >
              Show guide again
            </button>
          </Row>
        </Section>

        {/* Data */}
        <Section
          icon={I.database}
          title="Your data"
          description="Control what ILLIA keeps."
        >
          <Row
            label="Delete all conversations"
            hint="Permanently removes every chat in your history. Projects stay."
          >
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className={`${btnSecondary} ${btnSm} hover:!border-rose-500 hover:!text-rose-400`}
            >
              <Icon d={I.trash} className="h-4 w-4" />
              Delete conversations
            </button>
          </Row>
        </Section>

        {/* Account */}
        <Section icon={I.mail} title="Account">
          {usesPassword && (
            <Row
              label="Password"
              hint={`We'll email a reset link to ${email}.`}
            >
              <button
                type="button"
                onClick={sendReset}
                disabled={sendingReset}
                className={`${btnSecondary} ${btnSm}`}
              >
                {sendingReset ? "Sending..." : "Send reset link"}
              </button>
            </Row>
          )}

          <Row label="Sign out" hint="You'll need to sign in again to use ILLIA.">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut || !user}
              className={`${btnSecondary} ${btnSm}`}
            >
              <Icon d={I.logout} className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </Row>
        </Section>
      </div>

      <Modal open={clearOpen} onClose={() => !clearing && setClearOpen(false)}>
        <div className="text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
            <Icon d={I.trash} className="h-6 w-6" />
          </span>

          <h4 className="mb-2 text-lg font-extrabold">
            Delete all conversations?
          </h4>

          <p className="mb-[22px] text-sm leading-normal text-mute">
            Every chat in your history will be permanently deleted. This can't
            be undone.
          </p>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setClearOpen(false)}
              disabled={clearing}
              className={`${btnSecondary} flex-1`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={clearConversations}
              disabled={clearing}
              className={`${btnDanger} flex-1`}
            >
              {clearing ? "Deleting..." : "Delete all"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}