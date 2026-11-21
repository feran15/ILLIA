import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";
import { Icon } from "../components/Studio/UI";
import { aiApi } from "../lib/api";

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

// This must point to your Core Worker, not the AI Worker.
const CORE_API_URL = import.meta.env.VITE_CORE_API_URL?.replace(/\/+$/, "");

// The AI Worker (the one with /api/create/chat and /api/create/transcribe).
// Use the same URL that ../lib/api uses for aiApi. If your env variable has a
// different name, change it here.
const AI_API_URL = import.meta.env.VITE_AI_API_URL?.replace(/\/+$/, "");

// Document limits. MAX_DOC_CHARS must not exceed AI_MAX_DOCUMENT_CHARS on the worker.
const MAX_DOC_CHARS = 30000;
const MAX_DOC_BYTES = 15 * 1024 * 1024;
const MAX_RECORD_MS = 120000; // auto-stop voice recording after 2 minutes

const TEXT_EXTENSIONS = [
  "txt",
  "md",
  "markdown",
  "csv",
  "tsv",
  "json",
  "log",
  "html",
  "htm",
  "xml",
];

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
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
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
  ["Ask AI, anything", "Chat with your content assistant about growth, strategy, captions or ideas, all in one place. Attach an image or a document for context, or tap the mic and just speak instead of typing."],
  ["One assistant, no switching", "Ask for captions, post ideas or a full content plan in the same conversation and ILLIA figures out what you need and does all of it at once."],
  ["Keep chats organized in Projects", "Create a project for each brand, campaign or client. Every chat inside it stays grouped together, and picks up the same context automatically."],
  ["Remembers you", "ILLIA picks up on your niche, platforms, goals and tone over time, and every reply gets more personal to you. Check the History tab any time to see everything you have talked about."],
  ["Always improving", "Found a bug, or have a feature you wish existed? Head to Feedback any time, you can even speak your feedback instead of typing it."],
];

const ONBOARD_KEY = "illia_onboarded_v1";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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
  raw
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^#{1,4}\s*/gm, "")
    .replace(/^[-*]\s+/gm, "\u2022 ");

const inline = (s) =>
  s.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-extrabold">
        {part}
      </strong>
    ) : (
      part
    )
  );

async function compressImageForAI(file) {
  const bitmap = await createImageBitmap(file);

  try {
    const MAX_DIMENSION = 1024;

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not process this image.");
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Image compression failed.")),
        "image/jpeg",
        0.78
      );
    });

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error("Could not read compressed image."));
      reader.readAsDataURL(blob);
    });

    return {
      base64: dataUrl.split(",")[1],
      mimeType: "image/jpeg",
    };
  } finally {
    bitmap.close();
  }
}

/* ---------------- Document text extraction (runs in the browser) ---------------- */

function fileExtension(name = "") {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

// Returns "pdf" | "docx" | "text" | "legacy-doc" | null
function documentKind(file) {
  const ext = fileExtension(file.name);

  if (ext === "pdf" || file.type === "application/pdf") return "pdf";
  if (
    ext === "docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  if (ext === "doc" || file.type === "application/msword") return "legacy-doc";
  if (
    file.type.startsWith("text/") ||
    file.type === "application/json" ||
    TEXT_EXTENSIONS.includes(ext)
  ) {
    return "text";
  }

  return null;
}

async function extractPdfText(file) {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;

  const pages = [];
  let total = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text) {
      pages.push(`[Page ${i}]\n${text}`);
      total += text.length;
    }

    // Stop early once we already have more than the backend will accept.
    if (total > MAX_DOC_CHARS) break;
  }

  return pages.join("\n\n");
}

async function extractDocxText(file) {
  const mod = await import("mammoth/mammoth.browser");
  const mammoth = mod.default || mod;
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return result.value || "";
}

async function extractDocumentText(file, kind) {
  let raw = "";

  if (kind === "pdf") raw = await extractPdfText(file);
  else if (kind === "docx") raw = await extractDocxText(file);
  else raw = await file.text();

  const text = raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (!text) {
    throw new Error(
      kind === "pdf"
        ? "No readable text found. This PDF may be a scan or image-only."
        : "No readable text found in this file."
    );
  }

  const truncated = text.length > MAX_DOC_CHARS;

  return {
    text: truncated ? text.slice(0, MAX_DOC_CHARS) : text,
    truncated,
  };
}

function pickAudioMime() {
  if (typeof MediaRecorder === "undefined") return "";

  const options = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  return options.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

/* ------------------------------------------------------------------ */
/* Presentational components                                           */
/* ------------------------------------------------------------------ */

function Markdown({ text = "" }) {
  const out = [];
  let list = null;
  let para = [];
  let table = null;

  const splitRow = (t) =>
    t.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  // Turns <br> inside a cell into a real line break instead of showing the tag.
  const renderCell = (cell) =>
    cell.split(/<br\s*\/?>/i).map((part, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {inline(part)}
      </span>
    ));

  const flushTable = () => {
    if (!table) return;

    const [head, ...body] = table.rows;

    out.push(
      <div
        key={out.length}
        className="mb-3 overflow-x-auto rounded-xl border border-line"
      >
        <table className="w-full min-w-[420px] border-collapse text-left text-[13.5px]">
          <thead className="bg-surf">
            <tr>
              {head.map((c, i) => (
                <th
                  key={i}
                  className="border-b border-line px-3 py-2.5 align-top font-extrabold"
                >
                  {renderCell(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-t border-line first:border-t-0">
                {row.map((c, i) => (
                  <td
                    key={i}
                    className="px-3 py-2.5 align-top leading-relaxed"
                  >
                    {renderCell(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    table = null;
  };

  const flushPara = () => {
    if (!para.length) return;

    out.push(
      <p key={out.length} className="mb-2.5 last:mb-0">
        {para.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {inline(line)}
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
        className={`mb-2.5 flex flex-col gap-1.5 pl-5 last:mb-0 ${
          Tag === "ol" ? "list-decimal" : "list-disc"
        }`}
      >
        {list.items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
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

      if (/^\|.*\|$/.test(t)) {
        flushPara();
        flushList();

        // Skip the |-----|-----| separator row.
        if (/^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(t)) return;

        if (!table) table = { rows: [] };
        table.rows.push(splitRow(t));
        return;
      }

      if (table) flushTable();

      if (!t) {
        flushPara();
        flushList();
      } else if (heading) {
        flushPara();
        flushList();

        out.push(
          <h4
            key={out.length}
            className="mb-1.5 mt-3 text-[14.5px] font-extrabold first:mt-0"
          >
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
  flushTable();

  return <>{out}</>;
}

function AssistantText({ text, animate, onDone, onTick }) {
  const plain = useMemo(() => stripMarkdown(text || ""), [text]);
  const [shown, setShown] = useState(animate ? 0 : plain.length);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setShown(total);
        onDone?.();
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (shown >= plain.length) {
    return <Markdown text={text} />;
  }

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

  // Documents show as a small file chip instead of a picture.
  if (attachment.kind === "document") {
    return (
      <div className="mb-2 flex max-w-60 items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-[13px] font-semibold">
        <Icon d={I.file} className="h-4 w-4 shrink-0" />
        <span className="truncate">{attachment.name || "Document"}</span>
      </div>
    );
  }

  const src = attachment.previewUrl || attachment.url;
  if (!src) return null;

  const isVideo = attachment.type?.includes("video");

  return (
    <div className="mb-2 max-h-60 w-full max-w-60 overflow-hidden rounded-xl ">
      {isVideo ? (
        <video
          src={src}
          controls
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt={attachment.name || "Attachment"}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Message({ msg, onEdit, onTick }) {
  const [done, setDone] = useState(msg.role === "user" || !msg.animate);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard
      .writeText(msg.content)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Could not copy message"));
  };

  return (
    <div
      className={`flex gap-2.5 sm:gap-3 ${
        isUser
          ? "max-w-[92%] flex-row-reverse self-end sm:max-w-[78%]"
          : "max-w-[96%] sm:max-w-[82%]"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
          isUser
            ? "border border-line bg-alt text-mute"
            : "grad text-white"
        }`}
      >
        <Icon
          d={isUser ? I.user : I.spark}
          className="h-[15px] w-[15px]"
        />
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
            <AssistantText
              text={msg.content}
              animate={msg.animate && !/^\|.*\|$/m.test(msg.content || "")}
              onDone={() => setDone(true)}
              onTick={onTick}
            />
          )}
        </div>

        {done && (
          <div className={`mt-2 flex gap-3 ${isUser ? "justify-end" : ""}`}>
            {isUser && (
              <ActionBtn
                icon={I.edit}
                label="Edit"
                onClick={() => onEdit(msg.content)}
              />
            )}
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
      <span className="grad grid h-8 w-8 shrink-0 place-items-center rounded-full text-white">
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
        active
          ? "soft border-vio"
          : "border-line bg-surf hover:border-vio/30"
      }`}
    >
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-alt text-vio">
        <Icon d={I.chat} className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold">
          {thread.title}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-faint">
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
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="max-h-[90dvh] w-full max-w-[400px] overflow-y-auto rounded-3xl bg-surf p-5 shadow-2xl sm:p-7">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

const btnPrimary = `${btnBase} grad text-white shadow-lg shadow-violet-500/30 hover:-translate-y-px`;
const btnSecondary = `${btnBase} border-[1.5px] border-line bg-surf text-ink hover:border-vio hover:bg-alt`;
const btnDanger = `${btnBase} bg-rose-500 text-white hover:-translate-y-px`;
const btnSm = "!px-4 !py-2.5 !text-[13px]";

const fieldCls =
  "w-full rounded-xl border-[1.5px] border-line bg-alt px-3.5 py-3 text-base text-ink outline-none focus:border-vio focus:bg-surf sm:text-[14.5px]";

const cardHeader =
  "mb-[18px] flex flex-wrap items-center justify-between gap-3.5 rounded-[20px] border border-line bg-surf p-4 sm:p-6";

/* ------------------------------------------------------------------ */
/* Main Create page                                                    */
/* ------------------------------------------------------------------ */

export default function Create() {
  const [tab, setTab] = useState("ask");

  // Chat
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  // Threads and projects
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [threadTitle, setThreadTitle] = useState("New chat");
  const [threads, setThreads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const [clearing, setClearing] = useState(false);

  // Modals
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardIndex, setOnboardIndex] = useState(0);

  // Scheduling
  const [scheduleProposal, setScheduleProposal] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  // Refs
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const recognizerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordTimerRef = useRef(null);
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

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || null;

  const currentChatProjectId = activeThreadId
    ? threads.find((t) => t.id === activeThreadId)?.projectId
    : pendingProjectId;

  useEffect(scrollBottom, [messages, sending, scheduleProposal, scrollBottom]);

  // Release the microphone if the page is left mid-recording.
  useEffect(() => {
    return () => {
      clearTimeout(recordTimerRef.current);

      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state === "recording") {
        recorder.onstop = null;
        recorder.stream?.getTracks().forEach((track) => track.stop());

        try {
          recorder.stop();
        } catch {
          // Already stopped.
        }
      }

      recognizerRef.current?.abort?.();
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Data loading                                                      */
  /* ---------------------------------------------------------------- */

  const refreshThreads = useCallback(async () => {
    try {
      const data = await aiApi.get("/api/create/threads", {
        method: "GET",
      });
      setThreads(data.threads || []);
    } catch {
      // Keep the last successfully loaded list.
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    try {
      const data = await aiApi.get("/api/create/projects", {
        method: "GET",
      });
      setProjects(data.projects || []);
    } catch {
      // Keep the last successfully loaded list.
    }
  }, []);

  useEffect(() => {
    refreshThreads();
    refreshProjects();

    let onboardTimer;

    try {
      if (!localStorage.getItem(ONBOARD_KEY)) {
        onboardTimer = setTimeout(() => setOnboardOpen(true), 600);
      }
    } catch {
      // Storage may be unavailable.
    }

    return () => clearTimeout(onboardTimer);
  }, [refreshThreads, refreshProjects]);

  /* ---------------------------------------------------------------- */
  /* Chat actions                                                      */
  /* ---------------------------------------------------------------- */

  function startNewChat(projectId = null) {
    setActiveThreadId(null);
    setPendingProjectId(projectId);
    setThreadTitle("New chat");
    setMessages([GREETING]);
    setScheduleProposal(null);
    setBanner("");
    setInput("");
  }

  async function openThread(thread) {
    setActiveThreadId(thread.id);
    setPendingProjectId(null);
    setThreadTitle(thread.title || "New chat");
    setTab("ask");
    setScheduleProposal(null);

    try {
      const data = await aiApi.get(
        `/api/create/threads/${thread.id}/messages`,
        { method: "GET" }
      );

      const loaded = (data.messages || [])
        .filter(
          (m) => m.role === "user" || m.role === "assistant"
        )
        .map((m) => ({
          id: nextId(),
          role: m.role,
          content: m.content,
          animate: false,
        }));

      setMessages(loaded.length ? loaded : [GREETING]);
    } catch {
      setMessages([GREETING]);
    }
  }

  async function deleteThread(thread) {
    try {
      await aiApi.delete(`/api/create/threads/${thread.id}`, {
        method: "DELETE",
      });

      if (thread.id === activeThreadId) {
        startNewChat(activeProjectId);
      }

      await refreshThreads();
      toast.success("Conversation deleted.");
    } catch {
      toast.error("Couldn't remove that conversation");
    }
  }

  async function clearHistory() {
    if (clearing) return;

    setClearing(true);

    try {
      const results = await Promise.allSettled(
        threads.map((thread) =>
          aiApi.delete(`/api/create/threads/${thread.id}`)
        )
      );

      const failed = results.filter(
        (result) => result.status === "rejected"
      );

      await refreshThreads();

      if (failed.length) {
        toast.error(
          `${failed.length} conversation(s) could not be deleted.`
        );
      } else {
        startNewChat();
        toast.success("All conversations cleared.");
      }
    } catch (error) {
      console.error("Clear history error:", error);
      toast.error("Couldn't clear conversation history.");
    } finally {
      setClearing(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Scheduling                                                        */
  /* ---------------------------------------------------------------- */

  async function confirmSchedule() {
    if (!scheduleProposal || scheduling) return;

    if (!CORE_API_URL) {
      toast.error(
        "Core Worker URL is not configured. Set VITE_CORE_API_URL in Vercel."
      );
      return;
    }

    const proposal = scheduleProposal;
    const platforms = Array.isArray(proposal.platforms)
      ? proposal.platforms
      : [];

    try {
      setScheduling(true);

      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("Please sign in again.");
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `${CORE_API_URL}/api/calendar/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: proposal.topic || "",
            content: proposal.content || "",
            platforms,
            date: proposal.date,
            time: proposal.time,
            timezone: proposal.timezone || "Africa/Lagos",
            mode: proposal.mode === "auto" ? "auto" : "reminder",
            mediaUrls: Array.isArray(proposal.mediaUrls)
              ? proposal.mediaUrls
              : [],
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Could not schedule this post."
        );
      }

      const savedPost =
        result.post || result.data?.post || null;

      const publishingStatus =
        savedPost?.status === "scheduled"
          ? "Auto-publish scheduled"
          : savedPost?.status === "reminder_no_channels_connected"
            ? "Saved as a reminder (no connected social account)"
            : "Reminder";

      setScheduleProposal(null);

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: "assistant",
          animate: false,
          content:
            `Your post has been saved to your Content Calendar successfully.\n\n` +
            `**Platform:** ${platforms.join(", ") || "Not specified"}\n` +
            `**Date:** ${proposal.date}\n` +
            `**Time:** ${proposal.time}\n` +
            `**Publishing mode:** ${publishingStatus}\n\n` +
            `You can view it in your Content Calendar.`,
        },
      ]);

      toast.success("Post added to your Content Calendar.");
    } catch (error) {
      console.error("ILLIA scheduling error:", error);
      toast.error(error.message || "Scheduling failed.");
    } finally {
      setScheduling(false);
    }
  }

  function cancelSchedule() {
    if (scheduling) return;
    setScheduleProposal(null);
    toast("Scheduling cancelled.");
  }

  /* ---------------------------------------------------------------- */
  /* Send chat message                                                 */
  /* ---------------------------------------------------------------- */

  async function send(override) {
    const text = (
      typeof override === "string" ? override : input
    ).trim();

    if ((!text && !attachment) || sending) return;

    const att = attachment;
    const isImage = att?.type?.startsWith("image/");
    const isDocument = att?.kind === "document";

    if (att?.processing) {
      toast.error("Please wait for the attachment to finish processing.");
      return;
    }

    if (isImage && !att.base64) {
      toast.error("This image could not be processed. Please try another one.");
      return;
    }

    if (isDocument && !att.docText) {
      toast.error("This document has no readable text.");
      return;
    }

    const userMessage = {
      id: nextId(),
      role: "user",
      content:
        text ||
        (isImage
          ? "Please analyse this image."
          : isDocument
            ? "Please review this document."
            : "Please review this attachment."),
      attachment: att
        ? {
            name: att.name,
            type: att.type,
            kind: att.kind,
            previewUrl: att.previewUrl,
            url: att.url,
          }
        : null,
    };

    setSending(true);
    setBanner("");
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setAttachment(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const data = await aiApi.post("/api/create/chat", {
        message: text,
        image_base64: isImage ? att.base64 : null,
        document_text: isDocument ? att.docText : undefined,
        document_name: isDocument ? att.name : undefined,
        threadId: activeThreadId,
        projectId: activeThreadId ? undefined : pendingProjectId,
      });

      setBanner("");

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: "assistant",
          content:
            data.reply ||
            "I couldn't generate a response. Please try again.",
          animate: true,
        },
      ]);

      // Support both camelCase and snake_case response formats.
      const proposal =
        data.scheduleProposal ||
        data.schedule_proposal ||
        data.action?.scheduleProposal ||
        null;

      if (
        proposal?.requiresConfirmation &&
        proposal.date &&
        proposal.time
      ) {
        setScheduleProposal(proposal);
      } else {
        setScheduleProposal(null);
      }

      if (data.threadId && data.threadId !== activeThreadId) {
        setActiveThreadId(data.threadId);
        setPendingProjectId(null);
      }

      if (data.title) {
        setThreadTitle(data.title);
      }

      await refreshThreads();
    } catch (err) {
      const detail = err?.message || "Unknown error";

      setBanner(`The AI didn't respond: ${detail}`);
      toast.error("AI backend error, see the banner above the chat");

      let fallback = null;

      try {
        fallback = window.ILLIA_FALLBACK?.answerChat?.(
          `${text} ${
            att
              ? att.type?.includes("video")
                ? "video attached"
                : isDocument
                  ? "document attached"
                  : "image attached"
              : ""
          }`
        );
      } catch (e) {
        console.error("Offline fallback also failed:", e);
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: "assistant",
          animate: true,
          content:
            fallback ||
            `Sorry, I couldn't reach the AI just now (${detail}). Please try again in a moment.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  sendRef.current = send;

  /* ---------------------------------------------------------------- */
  /* Home composer integration                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const handler = (e) => {
      const prompt = e.detail?.prompt;
      if (prompt) sendRef.current?.(prompt);
    };

    window.addEventListener("illia:composer-submit", handler);

    return () =>
      window.removeEventListener("illia:composer-submit", handler);
  }, []);

  useEffect(() => {
    let saved = null;

    try {
      saved = sessionStorage.getItem("illia_home_prompt");

      if (saved) {
        sessionStorage.removeItem("illia_home_prompt");
      }
    } catch {
      // Storage blocked.
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

  /* ---------------------------------------------------------------- */
  /* Attachments                                                       */
  /* ---------------------------------------------------------------- */

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const docKind = !isImage && !isVideo ? documentKind(file) : null;

    if (docKind === "legacy-doc") {
      toast.error(
        "Old .doc files aren't supported. Please save it as .docx or PDF and try again."
      );
      return;
    }

    if (!isImage && !isVideo && !docKind) {
      toast.error(
        "Please select an image, video, PDF, Word (.docx) or text file."
      );
      return;
    }

    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    /* ---------- Documents (PDF, DOCX, text) ---------- */
    if (docKind) {
      if (file.size > MAX_DOC_BYTES) {
        toast.error("That file is too large. Please keep it under 15 MB.");
        return;
      }

      const docId = nextId();

      setAttachment({
        docId,
        name: file.name,
        type: file.type || docKind,
        kind: "document",
        previewUrl: null,
        docText: null,
        processing: true,
      });

      try {
        const { text, truncated } = await extractDocumentText(file, docKind);

        setAttachment((current) =>
          current?.docId === docId
            ? { ...current, docText: text, processing: false }
            : current
        );

        if (truncated) {
          toast(
            "Document is long, so ILLIA will read the first part of it."
          );
        } else {
          toast.success("Document ready for AI analysis");
        }
      } catch (error) {
        console.error("Document extraction error:", error);

        setAttachment((current) =>
          current?.docId === docId ? null : current
        );

        toast.error(error.message || "Could not read this document.");
      }

      return;
    }

    /* ---------- Images and videos (unchanged behaviour) ---------- */
    const previewUrl = URL.createObjectURL(file);

    const next = {
      name: file.name,
      type: file.type,
      previewUrl,
      base64: null,
      processing: isImage,
    };

    setAttachment(next);

    // Videos retain the existing preview behavior.
    if (!isImage) return;

    try {
      const compressed = await compressImageForAI(file);

      setAttachment((current) => {
        if (!current || current.previewUrl !== previewUrl) {
          return current;
        }

        return {
          ...current,
          base64: compressed.base64,
          mimeType: compressed.mimeType,
          processing: false,
        };
      });

      toast.success("Image ready for AI analysis");
    } catch (error) {
      console.error("Image compression error:", error);

      setAttachment((current) => {
        if (!current || current.previewUrl !== previewUrl) {
          return current;
        }

        return {
          ...current,
          processing: false,
          base64: null,
        };
      });

      toast.error(error.message || "Could not process this image.");
    }
  }

  function removeAttachment() {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    setAttachment(null);
  }

  /* ---------------------------------------------------------------- */
  /* Voice input                                                       */
  /* ---------------------------------------------------------------- */

  function appendToInput(text) {
    if (!text) return;

    setInput((current) => (current ? `${current} ${text}` : text));

    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;

      el.focus();
      el.style.height = "auto";
      el.style.height = `${Math.min(120, el.scrollHeight)}px`;
    });
  }

  async function transcribeBlob(blob, mimeType) {
    setTranscribing(true);

    try {
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("Please sign in again.");
      }

      const token = await user.getIdToken();

      const form = new FormData();
      form.append(
        "audio",
        blob,
        `recording.${mimeType.includes("mp4") ? "mp4" : "webm"}`
      );

      // Do not set Content-Type here; the browser adds the multipart boundary.
      const response = await fetch(`${AI_API_URL}/api/create/transcribe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Could not transcribe that recording."
        );
      }

      appendToInput(data.text);
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error(error.message || "Could not transcribe that recording.");
    } finally {
      setTranscribing(false);
    }
  }

  async function startServerRecording() {
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error(
        "Microphone access was blocked. Allow it in your browser settings."
      );
      return;
    }

    const mimeType = pickAudioMime();

    let recorder;

    try {
      recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      toast.error("Could not start the microphone");
      return;
    }

    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      clearTimeout(recordTimerRef.current);
      stream.getTracks().forEach((track) => track.stop());
      setRecording(false);

      const type = recorder.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];

      if (blob.size < 1000) {
        toast("That was too short. Hold on a little longer and try again.");
        return;
      }

      await transcribeBlob(blob, type);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);

    // Safety stop so recordings never run on forever.
    recordTimerRef.current = setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, MAX_RECORD_MS);
  }

  // Fallback used only when server transcription isn't available
  // (no AI worker URL configured, or MediaRecorder unsupported).
  function startBrowserSpeech() {
    const Ctor =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!Ctor) {
      toast("Voice input is not supported in this browser");
      return;
    }

    const rec = new Ctor();

    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

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

  function toggleMic() {
    if (transcribing) return;

    if (recording) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      } else {
        recognizerRef.current?.stop();
      }
      return;
    }

    const canRecordToServer =
      Boolean(AI_API_URL) &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== "undefined";

    if (canRecordToServer) {
      startServerRecording();
    } else {
      startBrowserSpeech();
    }
  }

  /* ---------------------------------------------------------------- */
  /* Projects                                                          */
  /* ---------------------------------------------------------------- */

  async function createProject() {
    const name = newProjectName.trim();

    if (!name) {
      toast("Give your project a name first");
      return;
    }

    setCreatingProject(true);

    try {
      const data = await aiApi.post("/api/create/projects", {
        name,
        description: newProjectDesc.trim(),
      });

      setNewProjectOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");

      await refreshProjects();

      toast.success("Project created");

      if (data?.id) {
        setActiveProjectId(data.id);
      }
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
      await aiApi.delete(
        `/api/create/projects/${activeProjectId}`
      );

      const removedId = activeProjectId;

      setDeleteProjectOpen(false);
      setActiveProjectId(null);

      toast.success("Project deleted");

      await Promise.all([refreshProjects(), refreshThreads()]);

      const active = threads.find(
        (t) => t.id === activeThreadId
      );

      if (active?.projectId === removedId) {
        startNewChat();
      }
    } catch {
      toast.error("Couldn't delete the project");
    } finally {
      setDeletingProject(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Onboarding                                                        */
  /* ---------------------------------------------------------------- */

  function closeOnboarding(markSeen) {
    setOnboardOpen(false);

    if (markSeen) {
      try {
        localStorage.setItem(ONBOARD_KEY, "1");
      } catch {
        // Ignore storage errors.
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  const TABS = [
    ["ask", "Ask AI", I.chat],
    ["projects", "Projects", I.folder],
    ["history", "History", I.clock],
  ];

  const projectThreads = threads.filter(
    (t) => t.projectId === activeProjectId
  );

  const lastStep = onboardIndex === ONBOARDING.length - 1;

  return (
    <div className="illia-create-theme min-h-screen w-full px-3 pb-6 pt-16 sm:px-4 lg:py-6">
      <style>{`
        .illia-create-theme {
          background: #241528;
          color: #FFFFFF;
          color-scheme: dark;
        }

        .illia-create-theme .bg-surf {
          background-color: #2F2138;
        }

        .illia-create-theme .bg-alt {
          background-color: #3B2945;
        }

        .illia-create-theme .text-ink {
          color: #FFFFFF;
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

        .illia-create-theme button:focus-visible,
        .illia-create-theme textarea:focus-visible,
        .illia-create-theme input:focus-visible {
          outline: 2px solid #A78BFA;
          outline-offset: 2px;
        }
      `}</style>

      <div className="mx-auto w-full max-w-[980px]">
        {/* Tabs and help */}
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
                  tab === id
                    ? "grad text-white shadow-lg shadow-violet-500/30"
                    : "text-mute hover:text-ink"
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

        {/* ---------------------------------------------------------- */}
        {/* Ask AI                                                      */}
        {/* ---------------------------------------------------------- */}

        {tab === "ask" && (
          <section className="flex h-[calc(100dvh-160px)] min-h-[420px] flex-col rounded-[20px] border border-line bg-surf lg:h-[calc(100dvh-130px)]">
            {/* Chat header */}
            <div className="flex shrink-0 items-center justify-between gap-2.5 border-b border-line px-3 py-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                <span className="truncate text-[13px] font-bold text-mute">
                  {threadTitle}
                </span>

                {projectName(currentChatProjectId) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("projects");
                      setActiveProjectId(currentChatProjectId);
                    }}
                    className="soft inline-flex max-w-[110px] shrink-0 items-center gap-1.5 rounded-full border border-vio/20 py-[5px] pl-2 pr-2.5 text-[11.5px] font-bold text-violet-300 hover:border-vio sm:max-w-[180px]"
                  >
                    <Icon
                      d={I.folder}
                      className="h-3 w-3 shrink-0"
                    />
                    <span className="truncate">
                      {projectName(currentChatProjectId)}
                    </span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => startNewChat(null)}
                className={`${btnSecondary} ${btnSm} shrink-0`}
              >
                <Icon d={I.plus} className="h-4 w-4" />
                New Chat
              </button>
            </div>

            {banner && (
              <div className="mx-3 mt-3 break-words rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-[13px] leading-normal text-rose-300 sm:mx-4">
                {banner}
              </div>
            )}

            {/* Scrollable conversation area */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4"
            >
              <div className="flex flex-col gap-5">
                {messages.map((m) => (
                  <Message
                    key={m.id}
                    msg={m}
                    onEdit={editMessage}
                    onTick={scrollBottom}
                  />
                ))}

                {/* Scheduling confirmation card */}
                {scheduleProposal && (
                  <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-line bg-alt p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                        <Icon d={I.clock} className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-sm font-extrabold text-ink">
                          Confirm scheduled post
                        </p>
                        <p className="text-xs text-faint">
                          Review the details before adding it to your calendar.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-line bg-surf p-3 text-sm">
                      <div>
                        <p className="text-xs text-faint">
                          Post content
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-ink">
                          {scheduleProposal.content ||
                            scheduleProposal.topic ||
                            "No post content provided"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
                        <div>
                          <p className="text-xs text-faint">
                            Platforms
                          </p>
                          <p className="mt-1 font-semibold capitalize text-ink">
                            {Array.isArray(scheduleProposal.platforms)
                              ? scheduleProposal.platforms.join(", ")
                              : "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-faint">
                            Publishing mode
                          </p>
                          <p className="mt-1 font-semibold capitalize text-ink">
                            {scheduleProposal.mode === "auto"
                              ? "Auto-publish"
                              : "Reminder"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-faint">Date</p>
                          <p className="mt-1 font-semibold text-ink">
                            {scheduleProposal.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-faint">Time</p>
                          <p className="mt-1 font-semibold text-ink">
                            {scheduleProposal.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={cancelSchedule}
                        disabled={scheduling}
                        className={`${btnSecondary} flex-1`}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={confirmSchedule}
                        disabled={scheduling}
                        className={`${btnPrimary} flex-1`}
                      >
                        {scheduling
                          ? "Scheduling..."
                          : "Confirm & Schedule"}
                      </button>
                    </div>
                  </div>
                )}

                {sending && <TypingIndicator />}
              </div>
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-line px-3 py-3.5 sm:px-4">
              {(recording || transcribing) && (
                <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-line bg-alt px-3 py-2 text-[13px] font-semibold">
                  <span
                    className={`h-2 w-2 rounded-full bg-rose-500 ${
                      recording ? "animate-pulse" : "opacity-40"
                    }`}
                  />
                  <span className="text-mute">
                    {transcribing
                      ? "Transcribing your voice..."
                      : "Listening... tap the mic again to stop"}
                  </span>
                </div>
              )}

              {attachment && (
                <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-line bg-alt px-3 py-2 text-[13px] font-semibold">
                  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surf">
                    {attachment.kind === "document" ? (
                      <Icon
                        d={I.file}
                        className="h-4 w-4 text-violet-300"
                      />
                    ) : attachment.type?.includes("image") ? (
                      <img
                        src={attachment.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={attachment.previewUrl}
                        muted
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {attachment.processing
                      ? attachment.kind === "document"
                        ? "Reading document..."
                        : "Optimizing image..."
                      : attachment.name}
                  </span>

                  <button
                    type="button"
                    aria-label="Remove attachment"
                    onClick={removeAttachment}
                    className="text-faint hover:text-ink"
                  >
                    <Icon d={I.x} className="h-[15px] w-[15px]" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  placeholder="Ask anything, or attach an image or document"
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(
                      120,
                      e.target.scrollHeight
                    )}px`;
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
                  aria-label="Attach image, video or document"
                  onClick={() => fileRef.current?.click()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[1.5px] border-line bg-alt text-mute hover:border-vio hover:text-vio sm:order-first"
                >
                  <Icon d={I.clip} className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  aria-label={
                    recording
                      ? "Stop recording"
                      : "Record voice message"
                  }
                  onClick={toggleMic}
                  disabled={transcribing}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[1.5px] disabled:opacity-50 sm:order-first ${
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
                  disabled={
                    sending ||
                    recording ||
                    transcribing ||
                    attachment?.processing ||
                    (!input.trim() && !attachment)
                  }
                  className="grad ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white disabled:opacity-50 sm:ml-0"
                >
                  <Icon d={I.send} className="h-[17px] w-[17px]" />
                </button>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,.pdf,.docx,.txt,.md,.csv,.json"
              className="sr-only"
              onChange={handleFile}
            />
          </section>
        )}

        {/* ---------------------------------------------------------- */}
        {/* Projects                                                     */}
        {/* ---------------------------------------------------------- */}

        {tab === "projects" && !activeProject && (
          <section>
            <div className={cardHeader}>
              <div className="min-w-0">
                <div className="text-[15px] font-extrabold">
                  Projects
                </div>
                <div className="mt-0.5 text-[13px] text-mute">
                  Group related chats together, each one keeps its own context
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNewProjectOpen(true)}
                className={`${btnPrimary} ${btnSm}`}
              >
                <Icon d={I.plus} className="h-4 w-4" />
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 ? (
                <EmptyState
                  icon={I.folder}
                  title="No projects yet"
                  hint="Create one to keep related chats and context together"
                />
              ) : (
                projects.map((p) => {
                  const count = threads.filter(
                    (t) => t.projectId === p.id
                  ).length;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProjectId(p.id)}
                      className="flex min-h-[128px] flex-col gap-2.5 rounded-2xl border border-line bg-surf p-[18px] text-left transition hover:-translate-y-0.5 hover:border-vio/30 hover:shadow-lg"
                    >
                      <span className="soft grid h-[38px] w-[38px] place-items-center rounded-[11px] text-violet-300">
                        <Icon d={I.folder} className="h-[18px] w-[18px]" />
                      </span>

                      <span className="truncate text-[14px] font-bold text-ink">
                        {p.name}
                      </span>

                      <span className="line-clamp-2 flex-1 text-[12.5px] leading-normal text-mute">
                        {p.description || "No description added"}
                      </span>

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
                <div className="text-[17px] font-extrabold">
                  {activeProject.name}
                </div>
                <div className="mt-1 text-[13px] text-mute">
                  {activeProject.description || "No description added"}
                </div>
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
                <EmptyState
                  icon={I.clock}
                  title="No chats in this project yet"
                  hint="Start a new chat above to begin"
                />
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

        {/* ---------------------------------------------------------- */}
        {/* History                                                     */}
        {/* ---------------------------------------------------------- */}

        {tab === "history" && (
          <section>
            <div className={cardHeader}>
              <div className="min-w-0">
                <div className="text-[15px] font-extrabold">
                  Conversation History
                </div>
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
                <EmptyState
                  icon={I.clock}
                  title="No conversations yet"
                  hint="Start a chat in Ask AI and it will show up here"
                />
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

        {/* ---------------------------------------------------------- */}
        {/* Modals                                                      */}
        {/* ---------------------------------------------------------- */}

        <Modal
          open={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
        >
          <span className="soft mb-4 grid h-14 w-14 place-items-center rounded-2xl text-violet-300">
            <Icon d={I.folder} className="h-6 w-6" />
          </span>

          <h4 className="mb-1.5 text-lg font-extrabold">
            New project
          </h4>

          <p className="mb-[18px] text-sm leading-normal text-mute">
            Group chats about the same topic together, ILLIA keeps this context in mind across every chat inside it.
          </p>

          <label
            htmlFor="np-name"
            className="mb-2 block text-xs font-extrabold text-faint"
          >
            Name
          </label>

          <input
            id="np-name"
            autoFocus
            maxLength={60}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && createProject()
            }
            placeholder="e.g. Ramadan Campaign"
            className={`${fieldCls} mb-4`}
          />

          <label
            htmlFor="np-desc"
            className="mb-2 block text-xs font-extrabold text-faint"
          >
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
            <button
              type="button"
              onClick={() => setNewProjectOpen(false)}
              className={`${btnSecondary} flex-1`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createProject}
              disabled={creatingProject}
              className={`${btnPrimary} flex-1`}
            >
              {creatingProject ? "Creating..." : "Create Project"}
            </button>
          </div>
        </Modal>

        <Modal
          open={deleteProjectOpen}
          onClose={() => setDeleteProjectOpen(false)}
        >
          <div className="text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
              <Icon d={I.trash} className="h-6 w-6" />
            </span>

            <h4 className="mb-2 text-lg font-extrabold">
              Delete this project?
            </h4>

            <p className="mb-[22px] break-words text-sm leading-normal text-mute">
              Every chat inside{" "}
              <strong>
                {activeProject?.name || "this project"}
              </strong>{" "}
              will be permanently deleted too. This can't be undone.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteProjectOpen(false)}
                className={`${btnSecondary} flex-1`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteProject}
                disabled={deletingProject}
                className={`${btnDanger} flex-1`}
              >
                {deletingProject ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={onboardOpen}
          onClose={() => closeOnboarding(true)}
        >
          <span className="grad mb-4 grid h-[52px] w-[52px] place-items-center rounded-2xl text-white">
            <Icon d={I.spark} className="h-6 w-6" />
          </span>

          <h4 className="mb-2 text-[19px] font-extrabold">
            {ONBOARDING[onboardIndex][0]}
          </h4>

          <p className="min-h-[110px] text-sm leading-relaxed text-mute">
            {ONBOARDING[onboardIndex][1]}
          </p>

          <div className="my-5 flex gap-[7px]">
            {ONBOARDING.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Step ${i + 1}`}
                onClick={() => setOnboardIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === onboardIndex
                    ? "w-[22px] bg-vio"
                    : "w-2 bg-line"
                }`}
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
              onClick={() =>
                setOnboardIndex((i) => Math.max(0, i - 1))
              }
              className={`${btnSecondary} flex-1 ${
                onboardIndex === 0 ? "invisible" : ""
              }`}
            >
              Back
            </button>

            <button
              type="button"
              onClick={() =>
                lastStep
                  ? closeOnboarding(true)
                  : setOnboardIndex((i) => i + 1)
              }
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
