import { useEffect, useState } from "react";
import {
  UserRound,
  Link2,
  Bell,
  Loader2,
  Zap,
  Check,
  Plus,
  X,
  Save,
  Sparkles,
  Mail,
  Smartphone,
  ShieldCheck,
  AtSign,
  BriefcaseBusiness,
  Music2,
  Settings2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/config";
import { auth } from "../Firebase/auth";

// lucide-react no longer ships brand icons, so these two are drawn here
const Instagram = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    description: "Photos, reels and stories",
    color: "#E1306C",
    bg: "#FFF0F5",
    icon: Instagram,
    placeholder: "@yourusername",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    description: "Posts and conversations",
    color: "#202020",
    bg: "#F3F3F3",
    icon: AtSign,
    placeholder: "@handle",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional content",
    color: "#0A66C2",
    bg: "#EAF4FF",
    icon: BriefcaseBusiness,
    placeholder: "Profile URL or username",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Short-form videos",
    color: "#111111",
    bg: "#F1F1F1",
    icon: Music2,
    placeholder: "@tiktokhandle",
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Pages and communities",
    color: "#1877F2",
    bg: "#EAF2FF",
    icon: Facebook,
    placeholder: "Page name or URL",
  },
];

function SectionHeader({ icon: Icon, title, description, color = "#7C3AED" }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12`, color }}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-base font-bold tracking-tight text-[#241528]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-5 text-[#85808D]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#7C3AED]" : "bg-[#D9D5DF]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F6FA] text-[#71677C]">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#30263A]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[#8A8492]">
            {description}
          </p>
        </div>
      </div>

      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function InputField({ label, hint, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#39303F]">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-[#E8E3EC] bg-white px-4 py-3 text-sm text-[#241528] outline-none transition placeholder:text-[#B0AAB7] hover:border-[#D2C5E5] focus:border-[#9B72E8] focus:ring-4 focus:ring-[#7C3AED]/[0.07]"
      />
      {hint && (
        <p className="mt-2 text-xs leading-5 text-[#8A8492]">{hint}</p>
      )}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [socialHandles, setSocialHandles] = useState({});
  const [remindersEmail, setRemindersEmail] = useState(true);
  const [remindersInApp, setRemindersInApp] = useState(true);
  const [niche, setNiche] = useState("");
  const [username, setUsername] = useState("");
  const [alertCategories, setAlertCategories] = useState([]);
  const [alertCategoryInput, setAlertCategoryInput] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [checkingTrends, setCheckingTrends] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        const data = snap.exists()
          ? snap.data()
          : {
              email: currentUser.email,
              full_name: currentUser.displayName || "Creator",
            };

        setUser(data);
        setNiche(data.niche || "");
        setUsername(data.username || "");
        setConnectedAccounts(data.connected_accounts || []);
        setSocialHandles(data.social_handles || {});
        setRemindersEmail(data.reminders_email !== false);
        setRemindersInApp(data.reminders_in_app !== false);
        setAlertCategories(data.alert_categories || []);
        setAlertsEnabled(data.trend_alerts_enabled || false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const toggleAccount = (platformId) => {
    setConnectedAccounts((previous) =>
      previous.includes(platformId)
        ? previous.filter((id) => id !== platformId)
        : [...previous, platformId]
    );
  };

  const addAlertCategory = () => {
    const category = alertCategoryInput.trim();

    if (!category) return;

    if (alertCategories.includes(category)) {
      toast.info("This category has already been added");
      return;
    }

    setAlertCategories((previous) => [...previous, category]);
    setAlertCategoryInput("");
  };

  const checkTrendsNow = () => {
    setCheckingTrends(true);
    toast.info("Automated trend alerts are not available yet.");
    setCheckingTrends(false);
  };

  const saveProfile = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Please sign in again");
      return;
    }

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          email: currentUser.email,
          full_name: currentUser.displayName || user?.full_name || "Creator",
          niche,
          username,
          connected_accounts: connectedAccounts,
          social_handles: socialHandles,
          reminders_email: remindersEmail,
          reminders_in_app: remindersInApp,
          alert_categories: alertCategories,
          trend_alerts_enabled: alertsEnabled,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center bg-white">
        <Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const displayName =
    user?.full_name || auth.currentUser?.displayName || "Creator";
  const email = user?.email || auth.currentUser?.email || "";
  const initials = displayName.charAt(0).toUpperCase();
  const isExpired =
    user?.plan === "free" &&
    user?.planRenewalDate &&
    new Date(user.planRenewalDate) < new Date();

  return (
    // LayOut already provides <main> and the header, so this is a plain div
    <div className="w-full flex-1 bg-white px-4 py-7 text-[#241528] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-[#EEEAF2] pb-7 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B5CF6]">
              <Settings2 size={14} />
              Workspace settings
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#241528] sm:text-4xl">
              Your profile<span className="text-[#8B5CF6]">.</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#827B89]">
              Manage your creator identity, social accounts and preferences.
            </p>
          </div>

          <Button
            onClick={saveProfile}
            disabled={saving}
            className="h-11 rounded-xl bg-[#7C3AED] px-5 font-semibold text-white shadow-none hover:bg-[#6D28D9]"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </header>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[245px_minmax(0,1fr)]">
          {/* Left profile summary (top-24 clears the sticky header) */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-[#EAE5EF] bg-white p-5">
              <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-2xl font-bold text-white">
                  {initials}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                    <Check size={11} className="text-white" />
                  </span>
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[#241528]">
                    {displayName}
                  </h2>
                  <p className="mt-1 break-all text-xs leading-5 text-[#898290]">
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge className="border border-[#E9DDFB] bg-[#F5EEFF] text-[#6D28D9] hover:bg-[#F5EEFF]">
                  {user?.role || "Creator"}
                </Badge>
                <Badge className="border border-[#EAE5EF] bg-white text-[#6E6578] hover:bg-white">
                  {(user?.plan || "free").toUpperCase()} PLAN
                </Badge>
              </div>

              <div className="mt-5 border-t border-[#F0ECF3] pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#898290]">Social accounts</span>
                  <span className="font-semibold text-[#39303F]">
                    {connectedAccounts.length} of {PLATFORMS.length}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F0ECF3]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] transition-all"
                    style={{
                      width: `${
                        (connectedAccounts.length / PLATFORMS.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#EAE5EF] bg-[#FCFAFE] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FF] text-[#7C3AED]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#30263A]">
                    Your account
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#898290]">
                    Your profile settings are stored with your Illia account.
                  </p>
                </div>
              </div>
            </section>

            {isExpired && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Your plan has expired
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-800">
                  You are currently on the free plan. You can upgrade again
                  whenever you're ready.
                </p>
              </div>
            )}
          </aside>

          {/* Main settings */}
          <div className="min-w-0 space-y-6">
            {/* Personal information */}
            <section className="rounded-2xl border border-[#EAE5EF] bg-white p-5 sm:p-7">
              <SectionHeader
                icon={UserRound}
                title="Personal information"
                description="Make your creator profile yours."
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  label="Display name / handle"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="@yourusername"
                />

                <InputField
                  label="Email address"
                  value={email}
                  readOnly
                  hint="Your email is managed by your sign-in provider."
                  className="cursor-not-allowed"
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Content niche"
                    value={niche}
                    onChange={(event) => setNiche(event.target.value)}
                    placeholder="e.g. lifestyle, tech, fashion, education..."
                    hint="Illia can use your niche to tailor content ideas and captions."
                  />
                </div>
              </div>
            </section>

            {/* Connected platforms */}
            <section className="rounded-2xl border border-[#EAE5EF] bg-white p-5 sm:p-7">
              <SectionHeader
                icon={Link2}
                title="Social platforms"
                description="Manage the platforms associated with your creator workflow."
              />

              <div className="space-y-3">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  const isConnected = connectedAccounts.includes(platform.id);

                  return (
                    <div
                      key={platform.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        isConnected
                          ? "border-[#D9C8F5] bg-[#FCFAFF]"
                          : "border-[#EEEAF2] bg-white hover:border-[#DCD3E7]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: platform.bg,
                              color: platform.color,
                            }}
                          >
                            <Icon size={21} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-[#30263A]">
                                {platform.label}
                              </p>
                              {isConnected && (
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                  <Check size={12} />
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#898290]">
                              {platform.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleAccount(platform.id)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                            isConnected
                              ? "border border-[#E3D5F8] bg-[#F4EDFF] text-[#6D28D9] hover:bg-[#EDE2FF]"
                              : "border border-[#E5DFE9] bg-white text-[#50465B] hover:border-[#BFA6E8] hover:text-[#6D28D9]"
                          }`}
                        >
                          {isConnected ? "Remove" : "Select account"}
                        </button>
                      </div>

                      <div className="mt-4">
                        <input
                          value={socialHandles[platform.id] || ""}
                          onChange={(event) =>
                            setSocialHandles((previous) => ({
                              ...previous,
                              [platform.id]: event.target.value,
                            }))
                          }
                          placeholder={platform.placeholder}
                          className="w-full rounded-lg border border-[#EAE5EF] bg-white px-3 py-2.5 text-xs text-[#30263A] outline-none placeholder:text-[#B0AAB7] focus:border-[#9B72E8] focus:ring-2 focus:ring-[#7C3AED]/10"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 rounded-lg bg-[#F8F6FA] p-3 text-xs leading-5 text-[#7F7788]">
                Selecting a platform here records your preference. It does not
                authorize Illia to access that platform. Real account
                connections require the relevant platform's authentication
                flow and API permissions.
              </p>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-[#EAE5EF] bg-white p-5 sm:p-7">
              <SectionHeader
                icon={Bell}
                title="Notifications"
                description="Choose how you want to receive publishing reminders."
                color="#DB2777"
              />

              <div className="divide-y divide-[#F0ECF3]">
                <SettingRow
                  icon={Mail}
                  title="Email reminders"
                  description="Receive reminders in your inbox."
                  checked={remindersEmail}
                  onChange={setRemindersEmail}
                />

                <SettingRow
                  icon={Smartphone}
                  title="In-app notifications"
                  description="See reminders and updates inside Illia."
                  checked={remindersInApp}
                  onChange={setRemindersInApp}
                />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#FAF7FF] p-3">
                <Bell size={15} className="mt-0.5 shrink-0 text-[#7C3AED]" />
                <p className="text-xs leading-5 text-[#756782]">
                  Your configured preferences will be saved. Reminder delivery
                  also depends on your notification backend being enabled.
                </p>
              </div>
            </section>

            {/* Trend alerts */}
            <section className="rounded-2xl border border-[#EAE5EF] bg-white p-5 sm:p-7">
              <SectionHeader
                icon={Zap}
                title="Trend alerts"
                description="Choose the topics you want to keep an eye on."
                color="#D97706"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#39303F]">
                  Topics and categories
                </label>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addAlertCategory();
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={alertCategoryInput}
                    onChange={(event) =>
                      setAlertCategoryInput(event.target.value)
                    }
                    placeholder="e.g. African tech, fashion, AI..."
                    className="min-w-0 flex-1 rounded-xl border border-[#E8E3EC] bg-white px-4 py-3 text-sm text-[#241528] outline-none placeholder:text-[#B0AAB7] focus:border-[#9B72E8] focus:ring-4 focus:ring-[#7C3AED]/[0.07]"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-auto rounded-xl border-[#E5D8F6] px-4 text-[#6D28D9] hover:bg-[#F7F1FF]"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  {alertCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E7D9FA] bg-[#F7F1FF] py-1.5 pl-3 pr-2 text-xs font-medium text-[#6D28D9]"
                    >
                      {category}
                      <button
                        type="button"
                        aria-label={`Remove ${category}`}
                        onClick={() =>
                          setAlertCategories((previous) =>
                            previous.filter((item) => item !== category)
                          )
                        }
                        className="rounded-full p-0.5 hover:bg-[#E8D8FF]"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  {alertCategories.length === 0 && (
                    <p className="text-xs text-[#98919F]">
                      No categories added yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="my-6 border-t border-[#F0ECF3]" />

              <SettingRow
                icon={Sparkles}
                title="Enable daily trend alerts"
                description="Save your preference for daily trend notifications."
                checked={alertsEnabled}
                onChange={setAlertsEnabled}
              />

              <Button
                type="button"
                variant="outline"
                onClick={checkTrendsNow}
                disabled={checkingTrends}
                className="mt-4 h-11 w-full rounded-xl border-[#E8D8FA] bg-white font-semibold text-[#6D28D9] hover:bg-[#F8F3FF]"
              >
                {checkingTrends ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Check trends now
                <ArrowUpRight size={15} className="ml-2" />
              </Button>

              <p className="mt-3 text-xs leading-5 text-[#98919F]">
                Automated trend checks and email delivery need to be connected
                to your backend.
              </p>
            </section>

            {/* Bottom actions */}
            <div className="sticky bottom-3 z-10 rounded-2xl border border-[#EAE5EF] bg-white/95 p-3 shadow-[0_8px_30px_rgba(36,21,40,0.08)] backdrop-blur">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="px-2 text-xs text-[#898290]">
                  Your changes are not saved until you select Save changes.
                </p>

                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="h-11 rounded-xl bg-[#7C3AED] px-6 font-semibold text-white hover:bg-[#6D28D9]"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>

            <footer className="flex items-center justify-center gap-2 pb-5 pt-1 text-xs text-[#A39BAA]">
              <Sparkles size={13} />
              ILLIA Studio · Made for African creators
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}