import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";
import { Icon } from "./UI"; // adjust the path to wherever your UI components live

/* ------------------------------------------------------------------ */
/* Config + helpers                                                    */
/* ------------------------------------------------------------------ */

const API_BASE_URL = "https://ai.illiasmartai.workers.dev";

const I = {
  spark: "M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.5 7.5L3 20l1-4.5A8.5 8.5 0 1 1 21 11.5z",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2",
  plus: "M12 5v14M5 12h14",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  clip: "M21.4 11.1 12.7 19.7a5.6 5.6 0 0 1-8-8L13.1 3.3a3.9 3.9 0 0 1 5.6 5.5l-8.5 8.5a2.2 2.2 0 0 1-3.1-3.1l7.8-7.8",
  mic: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10a7 7 0 0 0 14 0M12 17v4M9 21h6",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  copy: "M11 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM5 15V5a2 2 0 0 1 2-2h10",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  back: "M15 18l-6-6 6-6",
  x: "M6 6l12 12M18 6 6 18",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.2 2-2.5 3.5M12 17h.01",
  user: "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21c1.5-4 5-6 8-6s6.5 2 8 6",
};

const GREETING = {
  id: "greeting",
  role: "assistant",
  animate: false,
  content:
    "Hey there. I am your AI content assistant. Ask me anything about content creation, captions, post ideas, growth strategy or a full content plan, all in one conversation, and I will remember what you tell me for next time.",
};

const ONBOARDING = [
  ["Welcome to Create", "Everything here is free and unlimited. Let's take a 30 second look at what you can do."],
  ["Ask AI, anything", "Chat with your content assistant about growth, strategy, captions or ideas, all in one place. Attach an image for context, or tap the mic and just speak instead of typing."],
  ["One assistant, no switching", "Ask for captions, post ideas or a full content plan in the same conversation and ILLIA figures out what you need and does all of it at once."],
  ["Keep chats organized in Projects", "Create a project for each brand, campaign or client. Every chat inside it stays grouped together, and picks up the same context automatically."],
  ["Remembers you", "ILLIA picks up on your niche, platforms, goals and tone over time, and every reply gets more personal to you. Check the History tab any time to see everything you have talked about."],
  ["Always improving", "Found a bug, or have a feature you wish existed? Head to Feedback any time, you can even speak your feedback instead of typing it."],
];

const ONBOARD_KEY = "illia_onboarded_v1";

async function callBackend(path, { method = "POST", payload } = {}) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not signed in");

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 20000);

  try {
    const token = await user.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    if (payload !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      let detail = text;
      try {
        detail = JSON.parse(text).error || text;
      } catch {
        /* not JSON */
      }
      const err = new Error(detail || `Backend error (HTTP ${res.status})`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    if (!err.status) {
      err.message = timedOut
        ? "The backend took too long to respond (timed out after 20s)"
        : `Could not reach the backend at ${API_BASE_URL} (network or CORS issue)`;
    }
    console.error(`[ILLIA backend] ${method} ${path} failed:`, err.status || "network", err.message);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function relativeTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const stripMarkdown = (raw) =>
  raw.replace(/\*\*(.*?)\*\*/g, "$1").replace(/^#{1,4}\s*/gm, "").replace(/^[-*]\s+/gm, "\u2022 ");

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const inline = (s) =>
  s.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 ? <strong key={i} className="font-extrabold">{part}</strong> : part
  );

/** Renders the small markdown subset the AI uses, without dangerouslySetInnerHTML. */
function Markdown({ text }) {
  const out = [];
  let list = null;
  let para = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(
      <p key={out.length} className="mb-2.5 last:mb-0">
        {para.map((l, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {inline(l)}
          </span>
        ))}
      </p>
    );
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const Tag = list.type;
    out.push(
      <Tag
        key={out.length}
        className={`mb-2.5 flex flex-col gap-1.5 pl-5 last:mb-0 ${Tag === "ol" ? "list-decimal" : "list-disc"}`}
      >
        {list.items.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </Tag>
    );
    list = null;
  };

  text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line) => {
      const t = line.trim();
      const heading = t.match(/^#{1,4}\s+(.*)$/);
      const bullet = t.match(/^[-*]\s+(.*)$/);
      const numbered = t.match(/^\d+[.)]\s+(.*)$/);

      if (!t) {
        flushPara();
        flushList();
      } else if (heading) {
        flushPara();
        flushList();
        out.push(
          <h4 key={out.length} className="mb-1.5 mt-3 text-[14.5px] font-extrabold first:mt-0">
            {inline(heading[1])}
          </h4>
        );
      } else if (bullet || numbered) {
        flushPara();
        const type = bullet ? "ul" : "ol";
        if (list && list.type !== type) flushList();
        if (!list) list = { type, items: [] };
        list.items.push((bullet || numbered)[1]);
      } else {
        flushList();
        para.push(t);
      }
    });
  flushPara();
  flushList();
  return <>{out}</>;
}

/** Typewriter reveal, swaps to fully formatted markdown when finished. */
function AssistantText({ text, animate, onDone, onTick }) {
  const plain = useMemo(() => stripMarkdown(text), [text]);
  const [shown, setShown] = useState(animate ? 0 : plain.length);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduced || !plain.length) {
      setShown(plain.length);
      onDone?.();
      return;
    }
    const total = plain.length;
    const duration = Math.min(1800, Math.max(260, total * 10));
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setShown(Math.floor(p * total));
      onTick?.();
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setShown(total);
        onDone?.();
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (shown >= plain.length) return <Markdown text={text} />;
  return (
    <span className="whitespace-pre-wrap">
      {plain.slice(0, shown)}
      <span className="ml-px inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle opacity-60" />
    </span>
  );
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold text-faint transition-colors hover:text-vio"
    >
      <Icon d={icon} className="h-[13px] w-[13px]" />
      {label}
    </button>
  );
}

function Media({ attachment }) {
  if (!attachment) return null;
  const src = attachment.previewUrl || attachment.url;
  if (!src) return null;
  const isVideo = attachment.type?.includes("video");
  return (
    <div className="mb-2 max-h-60 w-full max-w-60 overflow-hidden rounded-xl bg-black/10">
      {isVideo ? (
        <video src={src} controls playsInline muted className="h-full w-full object-cover" />
      ) : (
        <img src={src} alt={attachment.name || "Attachment"} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function Message({ msg, onEdit, onTick }) {
  const [done, setDone] = useState(msg.role === "user" || !msg.animate);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => toast.success("Copied to clipboard"));
  };

  return (
    <div
      className={`flex gap-2.5 sm:gap-3 ${
        isUser ? "max-w-[92%] flex-row-reverse self-end sm:max-w-[78%]" : "max-w-[96%] sm:max-w-[82%]"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
          isUser ? "border border-line bg-alt text-mute" : "grad text-white"
        }`}
      >
        <Icon d={isUser ? I.user : I.spark} className="h-[15px] w-[15px]" />
      </span>

      <div className="min-w-0">
        <div
          className={`break-words px-3.5 py-3 text-[14.5px] leading-relaxed sm:px-4 ${
            isUser
              ? "grad rounded-2xl rounded-br text-white"
              : "rounded-2xl rounded-bl border border-line bg-alt text-ink"
          }`}
        >
          {isUser && <Media attachment={msg.attachment} />}
          {isUser ? (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          ) : (
            <AssistantText text={msg.content} animate={msg.animate} onDone={() => setDone(true)} onTick={onTick} />
          )}
        </div>

        {done && (
          <div className={`mt-2 flex gap-3 ${isUser ? "justify-end" : ""}`}>
            {isUser && <ActionBtn icon={I.edit} label="Edit" onClick={() => onEdit(msg.content)} />}
            <ActionBtn icon={I.copy} label="Copy" onClick={copy} />
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex max-w-[82%] gap-3">
      <span className="grad grid h-8 w-8 shrink-0 place-items-center rounded-full text-black">
        <Icon d={I.spark} className="h-[15px] w-[15px]" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl border border-line bg-alt px-[18px] py-3.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ThreadRow({ thread, active, projectName, onOpen, onDelete }) {
  return (
    <div
      onClick={() => onOpen(thread)}
      className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-3.5 py-3.5 transition hover:-translate-y-px sm:gap-3.5 sm:px-4 ${
        active ? "soft border-vio" : "border-line bg-surf hover:border-vio/30"
      }`}
    >
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-alt text-vio">
        <Icon d={I.chat} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold">{thread.title}</div>
        <div className="mt-0.5 truncate text-[11.5px] text-black">
          {relativeTime(thread.updatedAt)}
          {projectName ? ` · ${projectName}` : ""}
        </div>
      </div>
      <button
        type="button"
        aria-label="Delete conversation"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(thread);
        }}
        className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[9px] bg-alt text-faint hover:text-rose-500 sm:h-[30px] sm:w-[30px]"
      >
        <Icon d={I.trash} className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EmptyState({ icon, title, hint }) {
  return (
    <div className="col-span-full rounded-[20px] border border-line bg-surf px-5 py-12 text-center text-faint">
      <Icon d={icon} className="mx-auto mb-3.5 h-[34px] w-[34px] opacity-50" />
      <p className="mb-1 text-[15px] font-bold text-mute">{title}</p>
      <p className="text-[13.5px]">{hint}</p>
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

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";
const btnPrimary = `${btnBase} grad text-white shadow-lg shadow-violet-500/30 hover:-translate-y-px`;
const btnSecondary = `${btnBase} border-[1.5px] border-line bg-surf text-ink hover:border-vio hover:bg-alt`;
const btnDanger = `${btnBase} bg-rose-500 text-white hover:-translate-y-px`;
const btnSm = "!px-4 !py-2.5 !text-[13px]";
// text-base on phones stops iOS Safari from zooming into the field
const fieldCls =
  "w-full rounded-xl border-[1.5px] border-line bg-alt px-3.5 py-3 text-base text-ink outline-none focus:border-vio focus:bg-surf sm:text-[14.5px]";
const cardHeader =
  "mb-[18px] flex flex-wrap items-center justify-between gap-3.5 rounded-[20px] border border-line bg-surf p-4 sm:p-6";

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function Create() {
  const [tab, setTab] = useState("ask");

  // chat
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState("");
  const [recording, setRecording] = useState(false);

  // threads + projects
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [threadTitle, setThreadTitle] = useState("New chat");
  const [threads, setThreads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const [clearing, setClearing] = useState(false);

  // modals
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardIndex, setOnboardIndex] = useState(0);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const recognizerRef = useRef(null);
  const idRef = useRef(0);
  const sendRef = useRef(null);

  const nextId = () => `m${++idRef.current}`;
  const scrollBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const projectName = useCallback(
    (id) => projects.find((p) => p.id === id)?.name || null,
    [projects]
  );
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;
  const currentChatProjectId = activeThreadId
    ? threads.find((t) => t.id === activeThreadId)?.projectId
    : pendingProjectId;

  useEffect(scrollBottom, [messages, sending, scrollBottom]);

  /* ---------- data loading ---------- */

  const refreshThreads = useCallback(async () => {
    try {
      const data = await callBackend("/api/create/threads", { method: "GET" });
      setThreads(data.threads || []);
    } catch {
      /* keep last list */
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    try {
      const data = await callBackend("/api/create/projects", { method: "GET" });
      setProjects(data.projects || []);
    } catch {
      /* keep last list */
    }
  }, []);

  // initial load: health check, lists, onboarding
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) setBanner(`Backend reachable but returned HTTP ${res.status} on /health.`);
        else setBanner("");
      })
      .catch((err) =>
        setBanner(
          `Can't reach the backend at ${API_BASE_URL}. This is usually a CORS setting (ALLOWED_ORIGINS) or the Worker not being deployed. Details: ${err?.message || err}`
        )
      )
      .finally(() => clearTimeout(timer));

    refreshThreads();
    refreshProjects();

    let onboardTimer;
    try {
      if (!localStorage.getItem(ONBOARD_KEY)) {
        onboardTimer = setTimeout(() => setOnboardOpen(true), 600);
      }
    } catch {
      /* storage blocked */
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(onboardTimer);
      controller.abort();
    };
  }, [refreshThreads, refreshProjects]);

  /* ---------- chat actions ---------- */

  function startNewChat(projectId = null) {
    setActiveThreadId(null);
    setPendingProjectId(projectId);
    setThreadTitle("New chat");
    setMessages([GREETING]);
  }

  async function openThread(thread) {
    setActiveThreadId(thread.id);
    setThreadTitle(thread.title || "New chat");
    setTab("ask");
    try {
      const data = await callBackend(`/api/create/threads/${thread.id}/messages`, { method: "GET" });
      const loaded = (data.messages || [])
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ id: nextId(), role: m.role, content: m.content, animate: false }));
      setMessages(loaded.length ? loaded : [GREETING]);
    } catch {
      setMessages([GREETING]);
    }
  }

  async function deleteThread(thread) {
    try {
      await callBackend(`/api/create/threads/${thread.id}`, { method: "DELETE" });
      if (thread.id === activeThreadId) startNewChat(activeProjectId);
      await refreshThreads();
    } catch {
      toast.error("Couldn't remove that conversation");
    }
  }

  async function clearHistory() {
    setClearing(true);
    await Promise.all(
      threads.map((t) => callBackend(`/api/create/threads/${t.id}`, { method: "DELETE" }).catch(() => {}))
    );
    startNewChat();
    await refreshThreads();
    setClearing(false);
    toast.success("All conversations cleared");
  }

  async function send(override) {
    const text = (typeof override === "string" ? override : input).trim();
    if ((!text && !attachment) || sending) return;

    const att = attachment;
    const isImage = att?.type?.includes("image");
    setMessages((m) => [
      ...m,
      { id: nextId(), role: "user", content: text || "Take a look at this", attachment: att },
    ]);
    setInput("");
    setAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(true);

    try {
      const data = await callBackend("/api/create/chat", {
        payload: {
          message: text,
          image_base64: isImage ? att.base64 : null,
          threadId: activeThreadId,
          projectId: activeThreadId ? undefined : pendingProjectId,
        },
      });
      setBanner("");
      setMessages((m) => [...m, { id: nextId(), role: "assistant", content: data.reply, animate: true }]);
      if (data.threadId && data.threadId !== activeThreadId) {
        setActiveThreadId(data.threadId);
        setPendingProjectId(null);
      }
      refreshThreads();
    } catch (err) {
      const detail = err?.message || "Unknown error";
      setBanner(`The AI didn't respond: ${detail}`);
      toast.error("AI backend error, see the banner above the chat");

      let fallback = null;
      try {
        fallback = window.ILLIA_FALLBACK?.answerChat?.(`${text} ${att ? (att.type?.includes("video") ? "video attached" : "image attached") : ""}`);
      } catch (e) {
        console.error("Offline fallback also failed:", e);
      }
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          animate: true,
          content: fallback || `Sorry, I couldn't reach the AI just now (${detail}). Please try again in a moment.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }
  sendRef.current = send;

  // Lets the Home composer hand a prompt to this page (event based).
  useEffect(() => {
    const handler = (e) => {
      const prompt = e.detail?.prompt;
      if (prompt) sendRef.current?.(prompt);
    };
    window.addEventListener("illia:composer-submit", handler);
    return () => window.removeEventListener("illia:composer-submit", handler);
  }, []);

  // Picks up the prompt Home saves in sessionStorage before navigating here.
  useEffect(() => {
    let saved = null;
    try {
      saved = sessionStorage.getItem("illia_home_prompt");
      if (saved) sessionStorage.removeItem("illia_home_prompt");
    } catch {
      /* storage blocked */
    }
    if (saved) {
      setInput(saved);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.style.height = "auto";
        el.style.height = `${Math.min(120, el.scrollHeight)}px`;
      });
    }
  }, []);

  function editMessage(text) {
    setInput(text);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.style.height = "auto";
      el.style.height = `${Math.min(120, el.scrollHeight)}px`;
    });
    toast("Message loaded, edit and send again");
  }

  /* ---------- attachments + voice ---------- */

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);

    const next = { name: file.name, type: file.type, previewUrl: URL.createObjectURL(file), base64: null };
    setAttachment(next);

    // Backend only reads images, so only images get a base64 copy.
    if (file.type.includes("image")) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const b64 = result.slice(result.indexOf(",") + 1);
        setAttachment((cur) => (cur && cur.previewUrl === next.previewUrl ? { ...cur, base64: b64 } : cur));
      };
      reader.readAsDataURL(file);
    }
  }

  function removeAttachment() {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
  }

  function toggleMic() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      toast("Voice input is not supported in this browser");
      return;
    }
    if (recording) {
      recognizerRef.current?.stop();
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setInput(transcript);
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recognizerRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch {
      toast.error("Could not start the microphone");
    }
  }

  /* ---------- projects ---------- */

  async function createProject() {
    const name = newProjectName.trim();
    if (!name) {
      toast("Give your project a name first");
      return;
    }
    setCreatingProject(true);
    try {
      const data = await callBackend("/api/create/projects", {
        payload: { name, description: newProjectDesc.trim() },
      });
      setNewProjectOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      await refreshProjects();
      toast.success("Project created");
      if (data?.id) setActiveProjectId(data.id);
    } catch {
      toast.error("Couldn't create the project, try again");
    } finally {
      setCreatingProject(false);
    }
  }

  async function deleteProject() {
    if (!activeProjectId) return;
    setDeletingProject(true);
    try {
      await callBackend(`/api/create/projects/${activeProjectId}`, { method: "DELETE" });
      const removedId = activeProjectId;
      setDeleteProjectOpen(false);
      setActiveProjectId(null);
      toast.success("Project deleted");
      await Promise.all([refreshProjects(), refreshThreads()]);
      const active = threads.find((t) => t.id === activeThreadId);
      if (active?.projectId === removedId) startNewChat();
    } catch {
      toast.error("Couldn't delete the project");
    } finally {
      setDeletingProject(false);
    }
  }

  /* ---------- onboarding ---------- */

  function closeOnboarding(markSeen) {
    setOnboardOpen(false);
    if (markSeen) {
      try {
        localStorage.setItem(ONBOARD_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }

  /* ---------- render ---------- */

  const TABS = [
    ["ask", "Ask AI", I.chat],
    ["projects", "Projects", I.folder],
    ["history", "History", I.clock],
  ];

  const projectThreads = threads.filter((t) => t.projectId === activeProjectId);
  const lastStep = onboardIndex === ONBOARDING.length - 1;

  return (
    // pt-16 on phones leaves room for the sidebar's fixed menu button
    <div className="illia-create-theme min-h-screen w-full px-3 pb-6 pt-16 sm:px-4 lg:py-6">
      <style>{`
        .illia-create-theme {
          background: white;
          color: #FFFFFF;
          color-scheme: dark;
        }

        .illia-create-theme .bg-surf {
          background-color: #351D4C !important;
        }

        .illia-create-theme .bg-alt {
          background-color: #3B2945 !important;
        }

        .illia-create-theme .text-ink {
          color: #FFFFFF !important;
        }

        .illia-create-theme .text-mute {
          color: #D8C9DF !important;
        }

        .illia-create-theme .text-faint {
          color: #B5A3BE !important;
        }

        .illia-create-theme .border-line {
          border-color: #503B5B !important;
        }

        .illia-create-theme .soft {
          background-color: #49305A !important;
        }

        .illia-create-theme .grad {
          background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%) !important;
          color: #FFFFFF !important;
        }

        .illia-create-theme textarea,
        .illia-create-theme input {
          background-color: #3B2945;
          color: #FFFFFF;
        }

        .illia-create-theme textarea::placeholder,
        .illia-create-theme input::placeholder {
          color: #B5A3BE;
        }

        .illia-create-theme .text-black {
          color: #FFFFFF !important;
        }

        .illia-create-theme .text-violet-700 {
          color: #C4B5FD !important;
        }

        .illia-create-theme .hover\\:text-ink:hover {
          color: #FFFFFF !important;
        }
      `}</style>

      <div className="mx-auto w-full max-w-[980px]">
        {/* Tabs + help */}
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-[22px] sm:gap-3">
          <div
            className="flex min-w-0 flex-1 gap-1 rounded-full border border-line bg-alt p-1 sm:inline-flex sm:flex-none"
            role="tablist"
          >
            {TABS.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => {
                  setTab(id);
                  if (id === "history") refreshThreads();
                  if (id === "projects") {
                    refreshProjects();
                    refreshThreads();
                  }
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-[13px] font-bold transition sm:flex-none sm:gap-[7px] sm:px-[18px] sm:text-sm ${
                  tab === id ? "grad text-black shadow-lg shadow-violet-500/30" : "text-mute hover:text-ink"
                }`}
              >
                <Icon d={icon} className="hidden h-4 w-4 sm:block" />
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Show feature guide"
            onClick={() => {
              setOnboardIndex(0);
              setOnboardOpen(true);
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-line bg-surf text-ink hover:border-vio"
          >
            <Icon d={I.help} className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* ---------------- Ask AI ---------------- */}
        {tab === "ask" && (
          <section className="flex h-[calc(100dvh-160px)] min-h-[420px] flex-col rounded-[20px] border border-line bg-surf lg:h-[calc(100dvh-130px)]">
            <div className="flex shrink-0 items-center justify-between gap-2.5 border-b border-line px-3 py-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                <span className="truncate text-[13px] font-bold text-mute">{threadTitle}</span>
                {projectName(currentChatProjectId) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("projects");
                      setActiveProjectId(currentChatProjectId);
                    }}
                    className="soft inline-flex max-w-[110px] shrink-0 items-center gap-1.5 rounded-full border border-vio/20 py-[5px] pl-2 pr-2.5 text-[11.5px] font-bold text-violet-700 hover:border-vio sm:max-w-[180px] dark:text-violet-200"
                  >
                    <Icon d={I.folder} className="h-3 w-3 shrink-0" />
                    <span className="truncate">{projectName(currentChatProjectId)}</span>
                  </button>
                )}
              </div>
              <button type="button" onClick={() => startNewChat(null)} className={`${btnSecondary} ${btnSm} shrink-0`}>
                <Icon d={I.plus} className="h-4 w-4" />
                New Chat
              </button>
            </div>

            {banner && (
              <div className="mx-3 mt-3 break-words rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-[13px] leading-normal text-rose-600 sm:mx-4 dark:text-rose-300">
                {banner}
              </div>
            )}

            <div ref={scrollRef} className="flex flex-1 flex-col gap-[18px] overflow-y-auto p-3 sm:p-6">
              {messages.map((m) => (
                <Message key={m.id} msg={m} onEdit={editMessage} onTick={scrollBottom} />
              ))}
              {sending && <TypingIndicator />}
            </div>

            <div className="border-t border-line px-3 py-3.5 sm:px-4">
              {attachment && (
                <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-line bg-alt px-3 py-2 text-[13px] font-semibold">
                  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surf">
                    {attachment.type?.includes("image") ? (
                      <img src={attachment.previewUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <video src={attachment.previewUrl} muted className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
                  <button type="button" aria-label="Remove attachment" onClick={removeAttachment} className="text-faint hover:text-ink">
                    <Icon d={I.x} className="h-[15px] w-[15px]" />
                  </button>
                </div>
              )}

              {/* On phones the textarea takes the full row and the buttons sit under it */}
              <div className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  placeholder="Ask anything, or attach an image for context"
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(120, e.target.scrollHeight)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="order-first max-h-[120px] min-h-[40px] w-full resize-none rounded-[14px] border-[1.5px] border-line bg-alt px-3.5 py-2.5 text-base leading-normal text-ink outline-none placeholder:text-faint focus:border-vio focus:bg-surf sm:order-none sm:w-auto sm:flex-1 sm:text-[14.5px]"
                />

                <button
                  type="button"
                  aria-label="Attach image or video"
                  onClick={() => fileRef.current?.click()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[1.5px] border-line bg-alt text-mute hover:border-vio hover:text-vio sm:order-first"
                >
                  <Icon d={I.clip} className="h-[18px] w-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label="Record voice message"
                  onClick={toggleMic}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[1.5px] sm:order-first ${
                    recording
                      ? "animate-pulse border-rose-500 bg-rose-500/10 text-rose-500"
                      : "border-line bg-alt text-mute hover:border-vio hover:text-vio"
                  }`}
                >
                  <Icon d={I.mic} className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  aria-label="Send message"
                  onClick={() => send()}
                  disabled={sending || (!input.trim() && !attachment)}
                  className="grad ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white disabled:opacity-50 sm:ml-0"
                >
                  <Icon d={I.send} className="h-[17px] w-[17px]" />
                </button>
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*,video/*" className="sr-only" onChange={handleFile} />
          </section>
        )}

        {/* ---------------- Projects ---------------- */}
        {tab === "projects" && !activeProject && (
          <section>
            <div className={cardHeader}>
              <div className="min-w-0">
                <div className="text-[15px] font-extrabold">Projects</div>
                <div className="mt-0.5 text-[13px] text-mute">Group related chats together, each one keeps its own context</div>
              </div>
              <button type="button" onClick={() => setNewProjectOpen(true)} className={`${btnPrimary} ${btnSm}`}>
                <Icon d={I.plus} className="h-4 w-4" />
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 ? (
                <EmptyState icon={I.folder} title="No projects yet" hint="Create one to keep related chats and context together" />
              ) : (
                projects.map((p) => {
                  const count = threads.filter((t) => t.projectId === p.id).length;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProjectId(p.id)}
                      className="flex min-h-[128px] flex-col gap-2.5 rounded-2xl border border-line bg-surf p-[18px] text-left transition hover:-translate-y-0.5 hover:border-vio/30 hover:shadow-lg"
                    >
                      <span className="soft grid h-[38px] w-[38px] place-items-center rounded-[11px] text-violet-700 dark:text-violet-200">
                        <Icon d={I.folder} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="w-full truncate text-[14.5px] font-extrabold">{p.name}</span>
                      <span className="line-clamp-2 flex-1 text-[12.5px] leading-normal text-mute">{p.description}</span>
                      <span className="w-full border-t border-line pt-2.5 text-[11.5px] font-bold text-faint">
                        {count} {count === 1 ? "chat" : "chats"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        )}

        {tab === "projects" && activeProject && (
          <section>
            <button
              type="button"
              onClick={() => setActiveProjectId(null)}
              className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surf px-3.5 py-2 text-[13.5px] font-bold text-mute hover:text-vio"
            >
              <Icon d={I.back} className="h-4 w-4" />
              Projects
            </button>

            <div className={`${cardHeader} !items-start`}>
              <div className="min-w-0 break-words">
                <div className="text-[17px] font-extrabold">{activeProject.name}</div>
                <div className="mt-1 text-[13px] text-mute">{activeProject.description || "No description added"}</div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    startNewChat(activeProject.id);
                    setTab("ask");
                  }}
                  className={`${btnSecondary} ${btnSm}`}
                >
                  <Icon d={I.plus} className="h-4 w-4" />
                  New Chat
                </button>
                <button
                  type="button"
                  aria-label="Delete project"
                  onClick={() => setDeleteProjectOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line bg-surf hover:border-rose-500 hover:text-rose-500"
                >
                  <Icon d={I.trash} className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {projectThreads.length === 0 ? (
                <EmptyState icon={I.clock} title="No chats in this project yet" hint="Start a new chat above to begin" />
              ) : (
                projectThreads.map((t) => (
                  <ThreadRow
                    key={t.id}
                    thread={t}
                    active={t.id === activeThreadId}
                    onOpen={openThread}
                    onDelete={deleteThread}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* ---------------- History ---------------- */}
        {tab === "history" && (
          <section>
            <div className={cardHeader}>
              <div className="min-w-0">
                <div className="text-[15px] font-extrabold">Conversation History</div>
                <div className="mt-0.5 text-[13px] text-mute">
                  Every chat you've had with ILLIA, pick one up where you left off
                </div>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                disabled={clearing || threads.length === 0}
                className={`${btnSecondary} ${btnSm}`}
              >
                {clearing ? "Clearing..." : "Clear All"}
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {threads.length === 0 ? (
                <EmptyState icon={I.clock} title="No conversations yet" hint="Start a chat in Ask AI and it will show up here" />
              ) : (
                threads.map((t) => (
                  <ThreadRow
                    key={t.id}
                    thread={t}
                    active={t.id === activeThreadId}
                    projectName={projectName(t.projectId)}
                    onOpen={openThread}
                    onDelete={deleteThread}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* ---------------- Modals ---------------- */}
        <Modal open={newProjectOpen} onClose={() => setNewProjectOpen(false)}>
          <span className="soft mb-4 grid h-14 w-14 place-items-center rounded-2xl text-violet-700 dark:text-violet-200">
            <Icon d={I.folder} className="h-6 w-6" />
          </span>
          <h4 className="mb-1.5 text-lg font-extrabold">New project</h4>
          <p className="mb-[18px] text-sm leading-normal text-mute">
            Group chats about the same topic together, ILLIA keeps this context in mind across every chat inside it.
          </p>

          <label htmlFor="np-name" className="mb-2 block text-xs font-extrabold text-faint">
            Name
          </label>
          <input
            id="np-name"
            autoFocus
            maxLength={60}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createProject()}
            placeholder="e.g. Ramadan Campaign"
            className={`${fieldCls} mb-4`}
          />

          <label htmlFor="np-desc" className="mb-2 block text-xs font-extrabold text-faint">
            Description <span className="font-semibold">(optional)</span>
          </label>
          <textarea
            id="np-desc"
            rows={3}
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            placeholder="What is this project about?"
            className={`${fieldCls} mb-[22px] min-h-[70px] resize-y`}
          />

          <div className="flex gap-2.5">
            <button type="button" onClick={() => setNewProjectOpen(false)} className={`${btnSecondary} flex-1`}>
              Cancel
            </button>
            <button type="button" onClick={createProject} disabled={creatingProject} className={`${btnPrimary} flex-1`}>
              {creatingProject ? "Creating..." : "Create Project"}
            </button>
          </div>
        </Modal>

        <Modal open={deleteProjectOpen} onClose={() => setDeleteProjectOpen(false)}>
          <div className="text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
              <Icon d={I.trash} className="h-6 w-6" />
            </span>
            <h4 className="mb-2 text-lg font-extrabold">Delete this project?</h4>
            <p className="mb-[22px] break-words text-sm leading-normal text-mute">
              Every chat inside <strong>{activeProject?.name || "this project"}</strong> will be permanently deleted too.
              This can't be undone.
            </p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setDeleteProjectOpen(false)} className={`${btnSecondary} flex-1`}>
                Cancel
              </button>
              <button type="button" onClick={deleteProject} disabled={deletingProject} className={`${btnDanger} flex-1`}>
                {deletingProject ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal open={onboardOpen} onClose={() => closeOnboarding(true)}>
          <span className="grad mb-4 grid h-[52px] w-[52px] place-items-center rounded-2xl text-white">
            <Icon d={I.spark} className="h-6 w-6" />
          </span>
          <h4 className="mb-2 text-[19px] font-extrabold">{ONBOARDING[onboardIndex][0]}</h4>
          <p className="min-h-[110px] text-sm leading-relaxed text-mute">{ONBOARDING[onboardIndex][1]}</p>

          <div className="my-5 flex gap-[7px]">
            {ONBOARDING.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Step ${i + 1}`}
                onClick={() => setOnboardIndex(i)}
                className={`h-2 rounded-full transition-all ${i === onboardIndex ? "w-[22px] bg-vio" : "w-2 bg-line"}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => closeOnboarding(true)}
              className="px-1.5 py-3 text-[13.5px] font-bold text-faint hover:text-mute"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => setOnboardIndex((i) => i - 1)}
              className={`${btnSecondary} flex-1 ${onboardIndex === 0 ? "invisible" : ""}`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => (lastStep ? closeOnboarding(true) : setOnboardIndex((i) => i + 1))}
              className={`${btnPrimary} flex-1`}
            >
              {lastStep ? "Start Creating" : "Next"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}