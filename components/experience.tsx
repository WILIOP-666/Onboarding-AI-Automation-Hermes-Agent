"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  ExternalLink,
  FileCode2,
  Flag,
  Gauge,
  Github,
  GraduationCap,
  Keyboard,
  Lightbulb,
  ListChecks,
  Menu,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Trophy,
} from "lucide-react";
import {
  completeMission,
  initialProgress,
  levelForXp,
  missionIds,
  parseProgress,
  STORAGE_KEY,
  type MissionId,
  type Progress,
} from "@/lib/progress";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/presentation", label: "Presentation" },
  { href: "/learn", label: "Learn the basics" },
  { href: "/hermes", label: "Hermes setup" },
  { href: "/playground", label: "Your playground" },
  { href: "/missions", label: "Missions" },
  { href: "/cheatsheet", label: "Cheat sheet" },
  { href: "/instructor", label: "Instructor guide" },
];

const missions: {
  id: MissionId;
  number: string;
  title: string;
  short: string;
  objective: string;
  scenario: string;
  time: string;
  xp: number;
  difficulty: string;
  task: string;
  constraints: string[];
  verify: string;
  hints: string[];
  lesson: string;
}[] = [
  {
    id: "01-code-detective",
    number: "01",
    title: "Code Detective",
    short: "Explore before you edit",
    objective: "Build a map of an unfamiliar codebase without changing a file.",
    scenario:
      "You have just joined a team with a service you have never seen. A teammate asks you to explain how a request moves through it before anyone proposes a fix.",
    time: "10 min",
    xp: 100,
    difficulty: "Warm-up",
    task: "Do not modify anything. Explore this repository and explain its purpose, architecture, entry point, important modules, primary data flow, validation boundaries, and potential technical risks. Reference the relevant files in your explanation.",
    constraints: [
      "Inspect the repository before editing.",
      "Cite paths and symbols as evidence.",
      "Separate observed facts from assumptions.",
    ],
    verify:
      "Can a teammate use your map to find the entry point and trace one important data path?",
    hints: [
      "Start from package scripts and the framework entry point.",
      "Trace one real request through its handler, domain logic, and persistence boundary.",
      "Ask Hermes to cite exact paths and distinguish confirmed facts from guesses.",
    ],
    lesson: "Good agents inspect before they edit.",
  },
  {
    id: "02-bug-hunter",
    number: "02",
    title: "Bug Hunter",
    short: "Reproduce, trace, then fix",
    objective:
      "Find the root cause of duplicate registrations caused by email casing.",
    scenario:
      "Support reports that john@example.com, John@Example.com, and JOHN@example.com can create separate accounts.",
    time: "15 min",
    xp: 100,
    difficulty: "Guided",
    task: "Investigate why registration permits duplicate accounts when email casing differs. Reproduce the issue, trace input normalization through validation and persistence, identify the root cause, implement the smallest safe fix, add regression coverage, and run the relevant tests.",
    constraints: [
      "Preserve existing registration behavior.",
      "Normalize identity consistently at the domain boundary.",
      "Do not rewrite unrelated modules or bypass validation.",
    ],
    verify:
      "A regression test proves casing variants represent one identity, and the focused test suite passes.",
    hints: [
      "Compare the normalization used by the uniqueness check with the value that gets stored.",
      "Check whether trimming and lowercasing happen in one canonical place.",
      "Add a test for multiple case variants before changing the implementation.",
    ],
    lesson:
      "A useful fix starts with a reproduced failure and ends with a regression test.",
  },
  {
    id: "03-safe-refactor",
    number: "03",
    title: "Safe Refactor",
    short: "Improve structure; keep behavior",
    objective:
      "Reduce complexity while preserving externally visible behavior.",
    scenario:
      "A working service has grown difficult to change. Tests cover the contract, but the implementation mixes validation, mapping, and side effects.",
    time: "15 min",
    xp: 100,
    difficulty: "Guided",
    task: "Refactor the target service for clarity without changing externally observable behavior. First list the invariants and the behavior covered by tests. Then make one small structural change at a time, run tests, and review the final diff.",
    constraints: [
      "Keep public inputs, outputs, and error behavior stable.",
      "Do not change tests merely to make the refactor pass.",
      "Avoid broad formatting or unrelated rewrites.",
    ],
    verify:
      "Existing contract tests pass unchanged, and the diff contains only the intended structural changes.",
    hints: [
      "Write down inputs, outputs, ordering, and error cases as invariants.",
      "Extract a pure decision step before moving side effects.",
      "Use the unchanged tests as a behavior boundary; review the diff after each small move.",
    ],
    lesson:
      "Refactor means changing the structure while the behavior stays put.",
  },
  {
    id: "04-agent-workflow",
    number: "04",
    title: "Agent Workflow",
    short: "Make repeated work safe",
    objective:
      "Prevent duplicate records when a form is submitted more than once.",
    scenario:
      "A user double-clicks Submit after a slow response. Two records appear even though the form only looked like one action.",
    time: "15 min",
    xp: 100,
    difficulty: "Open-ended",
    task: "Investigate duplicate records caused by repeated form submissions. Trace the request and state transitions, decide where idempotency belongs, implement a scoped fix, and add regression tests for repeated requests and normal submissions.",
    constraints: [
      "Do not assume disabling the button is sufficient protection.",
      "Keep valid repeated operations distinguishable from accidental retries.",
      "Keep the solution proportional to this application.",
    ],
    verify:
      "Repeated equivalent submissions have one intended effect; distinct valid submissions still work.",
    hints: [
      "Follow the same logical operation across browser, route, and persistence layers.",
      "Look for a stable operation key or an existing uniqueness boundary.",
      "Test a duplicate retry and a separate legitimate operation side by side.",
    ],
    lesson:
      "Investigate the whole operation; the visible symptom may sit far from the root cause.",
  },
  {
    id: "final-mission",
    number: "05",
    title: "Location Cascade",
    short: "Your final production-safety mission",
    objective:
      "Resolve inconsistent Country → State → City combinations in a profile update flow.",
    scenario:
      "Users report that profile updates sometimes save the wrong country, state, and city. The report may describe a symptom rather than the root cause.",
    time: "20 min",
    xp: 200,
    difficulty: "Capstone",
    task: "Investigate and resolve the profile location cascade bug. Reproduce the issue, inspect the UI and domain validation, identify the root cause, implement a production-safe fix, add regression coverage, and report what you verified.",
    constraints: [
      "Changing country must invalidate an incompatible state and city.",
      "Changing state must invalidate an incompatible city.",
      "Protect against stale asynchronous results replacing a newer selection.",
      "Keep UI and domain validation aligned.",
    ],
    verify:
      "Tests cover country and state changes, invalid retained selections, and out-of-order async responses where relevant.",
    hints: [
      "Draw the dependency chain and list every transition that can make child selections stale.",
      "Check both client state updates and the server/domain acceptance boundary.",
      "Use a controllable delayed response in a test to expose stale-result races.",
    ],
    lesson:
      "The report points to a symptom. Your evidence should lead to the root cause.",
  },
];

const slides = [
  {
    title: "AI is no longer just chat.",
    kicker: "01 / A new kind of teammate",
    body: "A chatbot returns an answer. An agent can work toward a goal: inspect context, plan steps, use tools, take action, and verify what happened.",
    visual: [
      "HUMAN  →  PROMPT  →  ANSWER",
      "HUMAN  →  GOAL  →  UNDERSTAND  →  PLAN  →  TOOLS  →  ACT  →  TEST  →  VERIFY",
    ],
    note: "Open with one familiar task that involves more than generating text.",
  },
  {
    title: "Automation is a chain of responsibility.",
    kicker: "02 / AI automation",
    body: "Good automation connects a trigger to useful context, bounded tool use, an observable action, and validation before anyone trusts the output.",
    visual: [
      "TRIGGER",
      "↓  CONTEXT",
      "↓  AGENT + TOOLS",
      "↓  ACTION",
      "↓  VALIDATION",
      "↓  USEFUL OUTPUT",
    ],
    note: "Ask where a human checkpoint belongs for a risky action.",
  },
  {
    title: "Meet Hermes Agent.",
    kicker: "03 / A local engineering agent",
    body: "Hermes works in a repository on the participant’s own computer. It can inspect files, use approved tools and terminal commands, change code, and run checks under a task’s constraints.",
    visual: [
      "YOUR COMPUTER",
      "repository  ·  editor  ·  terminal  ·  Git",
      "Hermes reads → plans → edits → verifies",
      "You review the diff and choose what ships",
    ],
    note: "Make the local execution boundary explicit: the learning site never runs Hermes.",
  },
  {
    title: "Chat can advise. An agent can act.",
    kicker: "04 / What changes",
    body: "Both can reason about a question. Repository access and tools let an agent test its understanding against real files and create a reviewable change.",
    visual: [
      "CHAT  ·  Advice from the prompt",
      "AGENT  ·  Repository context + tools + actions",
      "HUMAN  ·  Scope, judgment, and approval",
    ],
    note: "Avoid suggesting that tool access makes an agent automatically correct.",
  },
  {
    title: "“Fix this” leaves too much unsaid.",
    kicker: "05 / From prompt to task",
    body: "State the objective, context, boundaries, and evidence for success. Ask the agent to inspect first and report how it verified the change.",
    visual: [
      "CONTEXT + OBJECTIVE + CONSTRAINTS",
      "+ SUCCESS CRITERIA + VERIFICATION",
      "= A REVIEWABLE ENGINEERING TASK",
    ],
    note: "Compare a vague prompt with one that names reproduction, scope, and tests.",
  },
  {
    title: "Autonomy has levels.",
    kicker: "06 / Choose the right delegation",
    body: "Start with answers, then allow reading, editing, testing, and wider investigation as the task and safeguards justify it. Today’s target is independent investigation with human review.",
    visual: [
      "0  Answers",
      "1  Writes code",
      "2  Reads repository",
      "3  Modifies and tests",
      "4  Investigates independently  ← SESSION TARGET",
      "5  Runs a complete workflow",
    ],
    note: "Autonomy is a task setting, not a badge. Match it to impact and reversibility.",
  },
  {
    title: "The golden workflow keeps you in control.",
    kicker: "07 / Repeatable engineering",
    body: "A disciplined sequence gives the agent room to work while keeping every important decision visible to the engineer.",
    visual: [
      "INSPECT → UNDERSTAND → PLAN",
      "→ IMPLEMENT → TEST → AUDIT → VERIFY",
    ],
    note: "Have participants repeat the sequence before the first mission.",
  },
  {
    title: "Never trust generated work on sight.",
    kicker: "08 / Evidence is the handoff",
    body: "Review the diff, tests, assumptions, edge cases, security boundaries, and scope. A confident summary is not verification.",
    visual: [
      "DIFF  ·  Is this the change we asked for?",
      "TESTS  ·  What behavior is actually covered?",
      "SCOPE  ·  What changed that should not have?",
      "JUDGMENT  ·  What still needs a human?",
    ],
    note: "End with the idea that the engineer owns the outcome.",
  },
];

const agenda = [
  [
    "00:00",
    "00:10",
    "Opening",
    "Why AI agents matter",
    "Set expectations and ask where repetitive engineering work creates drag.",
  ],
  [
    "00:10",
    "00:25",
    "AI Automation 101",
    "Prompt → Context → Reasoning → Tools → Action → Verification",
    "Separate a chatbot answer from a tool-using workflow.",
  ],
  [
    "00:25",
    "00:40",
    "Hermes Agent",
    "Tools, files, terminal, Git, skills, memory",
    "Show the local working directory and how to inspect a diff.",
  ],
  [
    "00:40",
    "00:55",
    "Live Demo",
    "Repository → Bug → Root Cause → Fix → Test",
    "Narrate investigation and verification, not just code generation.",
  ],
  [
    "00:55",
    "01:05",
    "Setup / Short Break",
    "Install, open a repository, reset attention",
    "Help participants confirm their working directory and leave time for setup.",
  ],
  [
    "01:05",
    "01:30",
    "Hands-on Playground",
    "Four guided missions",
    "Move around the room; ask for evidence and a test result.",
  ],
  [
    "01:30",
    "01:50",
    "Final Mission",
    "Location cascade capstone",
    "Give less guidance; coach investigation rather than supplying a fix.",
  ],
  [
    "01:50",
    "02:00",
    "Review + Q&A",
    "Workflow recap and next steps",
    "Ask what they will inspect before delegating their next engineering task.",
  ],
];

const serverProgress = initialProgress();
let cachedRaw: string | null | undefined;
let cachedProgress = serverProgress;
function getProgressSnapshot(): Progress {
  if (typeof window === "undefined") return serverProgress;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedProgress;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedProgress = parseProgress(raw);
  }
  return cachedProgress;
}
function subscribeProgress(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener("training-progress-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("training-progress-change", onChange);
  };
}
function saveProgress(progress: Progress): void {
  cachedProgress = progress;
  cachedRaw = JSON.stringify(progress);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // Keep the current session usable when browser storage is disabled or full.
  }
  window.dispatchEvent(new Event("training-progress-change"));
}
function useProgress() {
  const state = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    () => serverProgress,
  );
  const update = useCallback(
    (fn: (current: Progress) => Progress) =>
      saveProgress(fn(getProgressSnapshot())),
    [],
  );
  return { state, update };
}

function Button({
  children,
  href,
  onClick,
  kind = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  kind?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
}) {
  const cls = `button button-${kind}`;
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function CopyBlock({
  text,
  title = "Copy task",
}: {
  text: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.className = "copy-fallback";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      setCopied(ok);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }
  return (
    <button className="copy-button" onClick={copy} aria-live="polite">
      {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
      {copied ? "Copied" : title}
    </button>
  );
}

function Shell({
  children,
  state,
  percent,
  name,
}: {
  children: React.ReactNode;
  state: Progress;
  percent: number;
  name: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const level = levelForXp(state.xp);
  return (
    <div className="app-frame">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Terminal size={18} />
          </span>
          <span>
            FIELDNOTES <small>AI AGENT PLAYGROUND</small>
          </span>
        </Link>
        <div className="side-label">YOUR WORKSPACE</div>
        <div className="learner-card">
          <div className="avatar">{(name.trim()[0] || "Y").toUpperCase()}</div>
          <div className="learner-copy">
            <strong>{name.trim() || "Your name"}</strong>
            <span>
              Level {level.level} · {level.title}
            </span>
          </div>
          <Gauge size={16} />
        </div>
        <nav aria-label="Main navigation" className="main-nav">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link ${active ? "nav-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav-dot" />
                {item.label}
                {item.href === "/playground" && (
                  <span className="nav-count">
                    {state.completed.length}/{missionIds.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="session-mini">
            <div className="mini-top">
              <span>SESSION PROGRESS</span>
              <strong>{percent}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${percent}%` }} />
            </div>
            <small>2 hour onboarding · self paced</small>
          </div>
          <a
            className="external-link"
            href="https://github.com/WILIOP-666/Onboarding-AI-Automation-Hermes-Agent"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} /> Training repository <ArrowUpRight size={13} />
          </a>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <button
            className="menu-toggle"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            <span>TRAINING /</span>
            <strong>
              {nav.find((n) => n.href === pathname)?.label.toUpperCase() ||
                "MISSION"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="live-dot" /> LOCAL PROGRESS{" "}
            <span className="top-divider" />{" "}
            <span className="top-xp">
              <Sparkles size={14} />
              {state.xp} XP
            </span>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {children}
        </main>
        <footer className="footer">
          <span>
            FIELDNOTES <span className="footer-muted">· LEARN BY DOING</span>
          </span>
          <span>
            Your code stays on your computer. Progress is stored in this
            browser.
          </span>
        </footer>
      </div>
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <div className="intro-action">{action}</div>}
    </div>
  );
}

function Overview({
  name,
  setName,
  state,
}: {
  name: string;
  setName: (n: string) => void;
  state: Progress;
}) {
  const lvl = levelForXp(state.xp);
  return (
    <>
      <section className="hero-panel">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" />A HANDS-ON ENGINEERING SESSION{" "}
            <span className="pill-live">
              <span className="live-dot" /> READY
            </span>
          </div>
          <h1>
            From prompt
            <br />
            to <span>production.</span>
          </h1>
          <p className="hero-sub">
            Learn to work with Hermes Agent like an AI-native software engineer.
            Inspect with intent, build with care, verify every change.
          </p>
          <div className="hero-actions">
            <Button href="/playground">
              <Play size={15} fill="currentColor" /> Start training
            </Button>
            <Button href="/presentation" kind="secondary">
              <ArrowUpRight size={16} /> Presentation mode
            </Button>
          </div>
          <div className="hero-meta">
            <span>
              <Clock3 size={15} /> 2 hours
            </span>
            <i />
            <span>
              <Gauge size={15} /> Beginner friendly
            </span>
            <i />
            <span>
              <ListChecks size={15} /> 5 missions
            </span>
          </div>
          <div className="hero-prereq">
            <CheckCircle2 size={13} /> Bring a laptop with Git. No previous
            agent experience needed.
          </div>
        </div>
        <figure className="hero-art">
          <Image
            className="hero-photo"
            src="/images/creative-workspace.jpg"
            alt="Laptop, notebook, brushes, and colored pencils on a wooden creative workspace"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 45vw"
          />
          <figcaption className="photo-credit">
            Photo by{" "}
            <a
              href="https://unsplash.com/photos/a-desk-with-a-laptop-and-pencils-on-it-T8TxcGtUW2I"
              target="_blank"
              rel="noreferrer"
            >
              Olya P · Unsplash
            </a>
          </figcaption>
          <div className="terminal-window">
            <div className="terminal-head">
              <span />
              <span />
              <span />
              <small>hermes · local session</small>
            </div>
            <div className="terminal-body">
              <div className="terminal-prompt">
                $ <b>inspect</b> --repo ./project
              </div>
              <div className="terminal-muted">
                Mapping entry points and data flow…
              </div>
              <div className="terminal-prompt">
                $ <b>test</b> --focused
              </div>
              <div className="terminal-success">✓ 18 checks passed</div>
              <div className="terminal-cursor">_</div>
            </div>
          </div>
          <div className="art-tag">
            <span className="live-dot" /> HUMAN REVIEW INCLUDED
          </div>
        </figure>
      </section>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">
            <Clock3 size={18} />
          </span>
          <div>
            <strong>
              120 <small>min</small>
            </strong>
            <span>Facilitated session</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <GraduationCap size={18} />
          </span>
          <div>
            <strong>
              50<small>%</small>
            </strong>
            <span>Hands-on practice</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Flag size={18} />
          </span>
          <div>
            <strong>05</strong>
            <span>Engineering missions</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Trophy size={18} />
          </span>
          <div>
            <strong>Level {lvl.level}</strong>
            <span>
              {lvl.title} · {state.xp} XP
            </span>
          </div>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            THE LEARNING PATH
          </div>
          <h2>Build your agent instincts.</h2>
        </div>
        <Link href="/missions" className="text-link">
          All missions <ArrowRight size={15} />
        </Link>
      </div>
      <div className="path-grid">
        {[
          {
            n: "01",
            title: "Understand the shift",
            text: "How agents move from answers to observable action.",
            href: "/learn",
            type: "FOUNDATION",
          },
          {
            n: "02",
            title: "Meet Hermes",
            text: "Set up a local working session and keep the loop safe.",
            href: "/hermes",
            type: "TOOLKIT",
          },
          {
            n: "03",
            title: "Put it into practice",
            text: "Five real engineering challenges, one repeatable workflow.",
            href: "/missions",
            type: "HANDS-ON",
          },
        ].map((x, i) => (
          <Link className="path-card" href={x.href} key={x.n}>
            <div className="path-card-top">
              <span className="path-number">{x.n}</span>
              <span className="card-arrow">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <span className="card-kicker">{x.type}</span>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
            <div className="path-card-foot">
              <span>
                {i === 2
                  ? `${state.completed.length}/5 complete`
                  : "EXPLORE MODULE"}
              </span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
      <div className="lower-grid">
        <section className="panel setup-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                YOUR SESSION
              </div>
              <h2>A good session starts here.</h2>
            </div>
            <BookOpen size={19} />
          </div>
          <div className="name-field">
            <label htmlFor="participant-name">What should we call you?</label>
            <input
              id="participant-name"
              value={name}
              maxLength={32}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
            />
            <small>Saved in this browser only. No account needed.</small>
          </div>
          <div className="session-bars">
            <div>
              <span>Learn</span>
              <b>20%</b>
              <div className="progress-track">
                <span style={{ width: "20%" }} />
              </div>
            </div>
            <div>
              <span>Watch</span>
              <b>30%</b>
              <div className="progress-track">
                <span style={{ width: "30%" }} />
              </div>
            </div>
            <div>
              <span>Build</span>
              <b>50%</b>
              <div className="progress-track">
                <span style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        </section>
        <section className="quote-panel">
          <div className="quote-mark">“</div>
          <blockquote>
            The goal isn’t to trust the agent more. It’s to get better evidence,
            faster.
          </blockquote>
          <div className="quote-by">
            <span className="quote-rule" /> THE ENGINEERING LOOP
          </div>
          <div className="workflow-strip">
            INSPECT <span>→</span> UNDERSTAND <span>→</span> VERIFY
          </div>
        </section>
      </div>
      <section className="overview-agenda">
        <div className="overview-agenda-head">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              THE 120-MINUTE SESSION
            </div>
            <h2>Learn it, watch it, work it.</h2>
          </div>
          <Link href="/presentation" className="text-link">
            Open the slides <ArrowRight size={15} />
          </Link>
        </div>
        <div className="overview-agenda-grid">
          {agenda.map((item, index) => (
            <div className="overview-agenda-item" key={item[0]}>
              <span>
                {item[0]}–{item[1]}
              </span>
              <b>{item[2]}</b>
              <small>{index === 5 ? "50% HANDS-ON" : item[3]}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ProgressDashboard({
  state,
  name,
  onNameChange,
}: {
  state: Progress;
  name: string;
  onNameChange: (n: string) => void;
}) {
  const level = levelForXp(state.xp);
  const percent = Math.round(
    (state.completed.length / missionIds.length) * 100,
  );
  return (
    <>
      <PageIntro
        eyebrow="YOUR TRAINING DESK"
        title="The playground."
        subtitle="Small, real engineering challenges. One repeatable workflow. Evidence at every step."
        action={
          <Button
            href={
              state.completed.length === missionIds.length
                ? "/completion"
                : "/missions"
            }
          >
            {state.completed.length === missionIds.length ? (
              <Trophy size={16} />
            ) : (
              <ListChecks size={16} />
            )}{" "}
            {state.completed.length === missionIds.length
              ? "View completion"
              : "Browse missions"}
          </Button>
        }
      />
      <section className="dashboard-panel">
        <div className="dashboard-top">
          <div>
            <span className="card-kicker">PARTICIPANT</span>
            <label className="name-inline">
              <input
                aria-label="Participant name"
                value={name}
                onChange={(e) => onNameChange(e.target.value.slice(0, 32))}
                placeholder="Your name"
                maxLength={32}
              />
              <span>EDIT</span>
            </label>
          </div>
          <div className="dashboard-xp">
            <Sparkles size={18} />
            <div>
              <strong>{state.xp} XP</strong>
              <span>
                Level {level.level} · {level.title}
              </span>
            </div>
          </div>
        </div>
        <div className="dashboard-progress">
          <div className="progress-label">
            <strong>
              {state.completed.length} <span>/ 5 missions complete</span>
            </strong>
            <span>{percent}%</span>
          </div>
          <div className="progress-track progress-large">
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="progress-caption">
            <span>YOUR SESSION PROGRESS</span>
            <span>
              Estimated time remaining ·{" "}
              {Math.max(0, 120 - state.completed.length * 18)} min
            </span>
          </div>
        </div>
      </section>
      <div className="mission-list-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            MISSION SEQUENCE
          </div>
          <h2>Every level leaves a trace.</h2>
        </div>
        <div className="difficulty-legend">
          <span className="live-dot" /> READY TO EXPLORE
        </div>
      </div>
      <div className="mission-list">
        {missions.map((m) => {
          const done = state.completed.includes(m.id);
          return (
            <Link
              href={
                m.id === "final-mission"
                  ? "/final-mission"
                  : `/missions/${m.id}`
              }
              className={`mission-row ${done ? "mission-done" : ""}`}
              key={m.id}
            >
              <span className="mission-index">
                {done ? <Check size={17} /> : m.number}
              </span>
              <div className="mission-main">
                <div>
                  <h3>{m.title}</h3>
                  <span>{m.short}</span>
                </div>
                <span className="mission-objective">{m.objective}</span>
              </div>
              <div className="mission-side">
                <span className="difficulty-tag">{m.difficulty}</span>
                <span className="mission-time">
                  <Clock3 size={14} />
                  {m.time}
                </span>
                <span className="mission-points">
                  {done ? "DONE" : `+${m.xp} XP`}
                </span>
                <ChevronRight size={17} />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="dashboard-note">
        <Lightbulb size={17} />
        <span>
          Use the same habit on every mission:{" "}
          <b>
            inspect → understand → plan → implement → test → audit → verify.
          </b>
        </span>
      </div>
    </>
  );
}

function Presentation({
  state,
  update,
}: {
  state: Progress;
  update: (f: (s: Progress) => Progress) => void;
}) {
  const [notes, setNotes] = useState(false);
  const slide = slides[state.slide] || slides[0];
  const move = useCallback(
    (delta: number) =>
      update((s) => ({
        ...s,
        slide: Math.min(slides.length - 1, Math.max(0, s.slide + delta)),
      })),
    [update],
  );
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches("input, textarea, select, button, a, [role='button']"))
      ) {
        return;
      }
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        move(1);
      }
      if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        move(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);
  return (
    <div className="presentation-page">
      <PageIntro
        eyebrow="PRESENTATION MODE · 8 SLIDES"
        title="The agent briefing."
        subtitle="A projection-friendly introduction. Use ← and → to move through the session."
        action={
          <Button href="/instructor" kind="quiet">
            <GraduationCap size={16} /> Speaker guide
          </Button>
        }
      />
      <section className="slide-frame">
        <div className="slide-topline">
          <span>{slide.kicker}</span>
          <span>
            AI AGENT PLAYGROUND <i /> {String(state.slide + 1).padStart(2, "0")}{" "}
            / 08
          </span>
        </div>
        <div className="slide-content">
          <div className="slide-copy">
            <h2>{slide.title}</h2>
            <p>{slide.body}</p>
          </div>
          <div className={`slide-visual slide-visual-${state.slide}`}>
            {state.slide === 2 && (
              <figure className="slide-cli-preview">
                <Image
                  src="/images/hermes-cli-preview.svg"
                  alt="Official stylized preview of the Hermes CLI terminal interface"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <figcaption>
                  <Image
                    src="/images/hermes-agent-logo.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>Stylized CLI preview · </span>
                  <a
                    href="https://hermes-agent.nousresearch.com/docs/user-guide/cli/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hermes docs
                  </a>
                </figcaption>
              </figure>
            )}
            {state.slide === 6 ? (
              <div className="workflow-diagram">
                <span className="workflow-diagram-label">THE GOLDEN LOOP</span>
                <ol>
                  {[
                    "Inspect",
                    "Understand",
                    "Plan",
                    "Implement",
                    "Test",
                    "Audit",
                    "Verify",
                  ].map((step, i) => (
                    <li key={step}>
                      <span className="workflow-step-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              slide.visual.map((line, i) => (
                <div
                  className={i === 0 ? "visual-primary" : "visual-line"}
                  key={line}
                >
                  <span className="visual-node" />
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="slide-bottom">
          <button className="speaker-toggle" onClick={() => setNotes(!notes)}>
            <Lightbulb size={15} />
            {notes ? "Hide facilitator cue" : "Facilitator cue"}
            <ChevronDown size={14} />
          </button>
          <div className="slide-controls">
            <span className="slide-progress-label">
              {String(state.slide + 1).padStart(2, "0")} <i /> 08
            </span>
            <button
              className="slide-control"
              onClick={() => move(-1)}
              disabled={state.slide === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="slide-control slide-next"
              onClick={() => move(1)}
              disabled={state.slide === slides.length - 1}
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        {notes && (
          <div className="speaker-note">
            <b>FACILITATOR CUE</b>
            <span>{slide.note}</span>
          </div>
        )}
        <div className="slide-progress-track">
          <span
            style={{ width: `${((state.slide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </section>
      <div className="agenda-mini">
        <span>SESSION FLOW</span>
        {agenda.slice(0, 4).map((a) => (
          <div key={a[0]}>
            <b>{a[0]}</b>
            <span>{a[2]}</span>
          </div>
        ))}
        <Link href="/instructor">
          View full 2-hour agenda <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function Learn() {
  return (
    <>
      <PageIntro
        eyebrow="THE PRACTICAL FOUNDATIONS"
        title="From answer to action."
        subtitle="AI automation works when context, tools, and validation connect to a clear human goal."
      />
      <div className="learn-hero panel">
        <div>
          <span className="card-kicker">THE AUTOMATION LOOP</span>
          <h2>Every step should leave evidence.</h2>
          <p>
            An agent is useful when it can inspect the real environment, take a
            bounded action, and show what happened. Verification closes the
            loop.
          </p>
        </div>
        <div className="automation-flow">
          {[
            "TRIGGER",
            "CONTEXT",
            "AGENT",
            "TOOLS",
            "ACTION",
            "VALIDATION",
            "OUTPUT",
          ].map((x, i) => (
            <div key={x}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{x}</b>
              {i < 6 && <ArrowRight size={14} />}
            </div>
          ))}
        </div>
      </div>
      <div className="comparison-grid">
        <section className="comparison-card">
          <div className="card-kicker">TRADITIONAL CHAT</div>
          <h3>An answer from the prompt.</h3>
          <div className="flow-stack">
            <span>Human</span>
            <b>↓</b>
            <span>Prompt</span>
            <b>↓</b>
            <span>Answer</span>
          </div>
          <p>
            Helpful for explanation and ideas. It only knows the context you
            provide.
          </p>
        </section>
        <section className="comparison-card comparison-agent">
          <div className="card-kicker">TOOL-USING AGENT</div>
          <h3>A goal pursued in a real workspace.</h3>
          <div className="flow-stack">
            <span>Human goal</span>
            <b>↓</b>
            <span>Understand + plan</span>
            <b>↓</b>
            <span>Tools → action → test</span>
          </div>
          <p>
            Can inspect repository context and make reviewable changes. Its
            results still need human judgment.
          </p>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />A TASK THAT CAN BE REVIEWED
          </div>
          <h2>Give the work a frame.</h2>
        </div>
      </div>
      <div className="task-anatomy">
        {[
          ["01", "CONTEXT", "Where should the agent look?"],
          ["02", "OBJECTIVE", "What outcome matters?"],
          ["03", "CONSTRAINTS", "What must remain true?"],
          ["04", "SUCCESS", "What will prove it worked?"],
          ["05", "VERIFICATION", "Which checks should run?"],
        ].map((x) => (
          <div className="anatomy-item" key={x[0]}>
            <span>{x[0]}</span>
            <b>{x[1]}</b>
            <small>{x[2]}</small>
          </div>
        ))}
      </div>
      <section className="prompt-example">
        <div className="prompt-head">
          <div>
            <span className="card-kicker">TASK BUILDER · EXAMPLE</span>
            <h3>Resolve duplicate user registration.</h3>
          </div>
          <CopyBlock
            text={
              "Inspect the implementation before making changes.\n\nObjective:\nResolve duplicate user registration.\n\nRequirements:\n- reproduce the issue\n- identify the root cause\n- preserve existing behavior\n- handle casing correctly\n- add regression coverage\n- run all relevant tests\n\nConstraints:\n- do not rewrite unrelated modules\n- do not remove tests\n- do not bypass validation\n\nAt completion report root cause, files changed, implementation, tests, and remaining risks."
            }
          />
        </div>
        <pre>
          <code>{`Inspect the implementation before making changes.\n\nObjective:\nResolve duplicate user registration.\n\nRequirements:\n- reproduce the issue\n- identify the root cause\n- preserve existing behavior\n- handle casing correctly\n- add regression coverage\n- run all relevant tests\n\nConstraints:\n- do not rewrite unrelated modules\n- do not remove tests\n- do not bypass validation\n\nAt completion report root cause, files changed, implementation, tests, and remaining risks.`}</code>
        </pre>
      </section>
      <div className="lesson-callout">
        <CircleHelp size={19} />
        <div>
          <b>Agent autonomy is a dial.</b>
          <span>
            Start with reading. Add editing and test execution when scope,
            reversibility, and review make it appropriate. Today’s target is
            independent investigation with human review.
          </span>
        </div>
      </div>
      <Button href="/hermes">
        Meet Hermes Agent <ArrowRight size={15} />
      </Button>
    </>
  );
}

function HermesGuide() {
  const troubleshooting = [
    [
      "Command not found",
      "Confirm Hermes is installed, restart the terminal, and check the documented executable name.",
    ],
    [
      "Wrong working directory",
      "Pause and print the current path. Navigate to the repository root before giving the task.",
    ],
    [
      "Dependency install failed",
      "Read the first package-manager error, confirm the expected runtime, then retry the project’s documented install command.",
    ],
    [
      "Tests fail",
      "Keep the failing output. Separate a pre-existing failure from a regression before editing more code.",
    ],
    [
      "Agent changed too much",
      "Stop. Inspect the diff, narrow the scope, and restore only unrelated edits you can identify confidently.",
    ],
    [
      "Agent misunderstood",
      "Restate the objective, constraints, and success criteria; ask it to summarize the plan before continuing.",
    ],
    [
      "Git tree already dirty",
      "Inspect status and diff first. Preserve existing work and avoid reset or clean commands.",
    ],
  ];
  return (
    <>
      <PageIntro
        eyebrow="LOCAL AGENT · HUMAN REVIEW"
        title="Meet Hermes."
        subtitle="A practical guide for running an engineering agent inside your own working environment."
        action={
          <Button href="/playground">
            <Terminal size={16} /> Open playground
          </Button>
        }
      />
      <section className="hermes-banner">
        <div className="hermes-badge">
          <Terminal size={22} />
        </div>
        <div>
          <span className="card-kicker">THE EXECUTION BOUNDARY</span>
          <h2>Hermes runs on your computer.</h2>
          <p>
            This site teaches and tracks learning. Your repository, terminal,
            editor, Git history, and Hermes session stay on your device. Review
            each proposed change before it ships.
          </p>
        </div>
        <div className="local-chip">
          <span className="live-dot" /> LOCAL FIRST
        </div>
      </section>
      <section className="hermes-install panel">
        <div>
          <span className="card-kicker">SET UP YOUR LOCAL AGENT</span>
          <h2>Install, choose a provider, then open your repo.</h2>
          <p>
            For Windows and macOS, the Hermes Desktop installer is the
            recommended start. For command-line installation, use the official
            installer for your OS and follow your team’s provider and
            tool-access guidance.
          </p>
          <a
            className="text-link"
            href="https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md"
            target="_blank"
            rel="noreferrer"
          >
            Official installation guide <ExternalLink size={14} />
          </a>
        </div>
        <div className="hermes-install-commands">
          <div className="install-command">
            <div>
              <span>WINDOWS · POWERSHELL</span>
              <CopyBlock
                title="Copy command"
                text="iex (irm https://hermes-agent.nousresearch.com/install.ps1)"
              />
            </div>
            <code>
              iex (irm https://hermes-agent.nousresearch.com/install.ps1)
            </code>
          </div>
          <div className="install-command">
            <div>
              <span>LINUX · MACOS · WSL2</span>
              <CopyBlock
                title="Copy command"
                text="curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"
              />
            </div>
            <code>
              curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
            </code>
          </div>
          <div className="install-command install-command-next">
            <div>
              <span>FIRST SESSION</span>
              <CopyBlock title="Copy setup" text="hermes setup\nhermes --tui" />
            </div>
            <code>
              hermes setup
              <br />
              hermes --tui
            </code>
          </div>
          <p>
            Run <code>hermes setup</code> once to configure provider access,
            then launch Hermes from your project’s root folder. The session
            inherits its working directory.
          </p>
        </div>
      </section>
      <div className="hermes-source-note">
        <Lightbulb size={15} />
        <span>
          Hermes CLI commands and installation options change over time. Use the
          linked official guide for current requirements. Never paste API keys
          or access tokens into a prompt.
        </span>
        <a
          href="https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/cli.md"
          target="_blank"
          rel="noreferrer"
        >
          CLI guide <ExternalLink size={13} />
        </a>
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />A SIMPLE WORKING LOOP
          </div>
          <h2>Start small. Keep the evidence.</h2>
        </div>
      </div>
      <div className="hermes-steps">
        {[
          [
            "01",
            "Open the repository",
            "Start the terminal at the project root. Check the branch and working tree before you begin.",
          ],
          [
            "02",
            "Set a bounded task",
            "Give the agent context, an objective, constraints, success criteria, and a verification step.",
          ],
          [
            "03",
            "Inspect and recover",
            "Ask what it plans to change. If direction is wrong, stop, inspect the diff, restate scope, then continue from known-good state.",
          ],
          [
            "04",
            "Review before shipping",
            "Read the diff, run tests, check edge cases, and decide whether the change meets the task.",
          ],
        ].map((x) => (
          <div className="hermes-step" key={x[0]}>
            <span>{x[0]}</span>
            <div>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="hermes-topics">
        <div>
          <span className="card-kicker">THE WORKSPACE</span>
          <h3>What Hermes can work with</h3>
          <ul>
            <li>Repository files and project structure</li>
            <li>Terminal commands in the local environment</li>
            <li>Git status, branches, commits, and diffs</li>
            <li>Configured tools and reusable skills</li>
            <li>Task context and memory, when enabled</li>
          </ul>
        </div>
        <div className="hermes-topics-note">
          <Lightbulb size={18} />
          <b>Skills and memory are aids, not authority.</b>
          <p>
            Confirm what instructions are active. Keep secrets out of prompts
            and make each run’s scope explicit.
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            WHEN SOMETHING GOES SIDEWAYS
          </div>
          <h2>Recover with a smaller step.</h2>
        </div>
      </div>
      <div className="trouble-grid">
        {troubleshooting.map((x, i) => (
          <div className="trouble-card" key={x[0]}>
            <span>0{i + 1}</span>
            <div>
              <h3>{x[0]}</h3>
              <p>{x[1]}</p>
            </div>
          </div>
        ))}
      </div>
      <section className="prompt-example">
        <div className="prompt-head">
          <div>
            <span className="card-kicker">A REUSABLE STARTER</span>
            <h3>Begin with inspection.</h3>
          </div>
          <CopyBlock
            title="Copy starter"
            text="Inspect this repository before changing anything. Summarize the architecture, entry points, data flow, and relevant tests. Then explain your proposed plan and the files you expect to touch. Wait for me to confirm the plan before editing."
          />
        </div>
        <pre>
          <code>{`Inspect this repository before changing anything.\nSummarize the architecture, entry points, data flow,\nand relevant tests. Then explain your proposed plan\nand the files you expect to touch. Wait for me to\nconfirm the plan before editing.`}</code>
        </pre>
      </section>
    </>
  );
}

function MissionsPage({ state }: { state: Progress }) {
  return (
    <>
      <PageIntro
        eyebrow="YOUR HANDS-ON CURRICULUM"
        title="Five missions. One better habit."
        subtitle="Each challenge builds on the last. Inspect, investigate, make a scoped change, and bring back evidence."
      />
      <div className="mission-feature-grid">
        {missions.map((m, i) => (
          <Link
            href={
              m.id === "final-mission" ? "/final-mission" : `/missions/${m.id}`
            }
            className={`mission-feature ${i === 4 ? "mission-feature-final" : ""}`}
            key={m.id}
          >
            <div className="feature-head">
              <span>MISSION {m.number}</span>
              <span className="feature-xp">
                {state.completed.includes(m.id) ? (
                  <>
                    <Check size={14} /> COMPLETE
                  </>
                ) : (
                  `+${m.xp} XP`
                )}
              </span>
            </div>
            <h2>{m.title}</h2>
            <p>{m.objective}</p>
            <div className="feature-bottom">
              <span>
                <Clock3 size={14} />
                {m.time}
              </span>
              <span>{m.difficulty}</span>
              <ArrowUpRight size={17} />
            </div>
          </Link>
        ))}
      </div>
      <div className="safety-banner">
        <CheckCircle2 size={20} />
        <div>
          <b>Practice in a separate workspace.</b>
          <span>
            Labs are small, local TypeScript projects. They do not execute on
            this site or on Vercel.
          </span>
        </div>
        <Link href="/missions/01-code-detective">
          Start with mission 01 <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}

function MissionDetail({
  mission,
  state,
  update,
  complete,
}: {
  mission: (typeof missions)[number];
  state: Progress;
  update: (f: (s: Progress) => Progress) => void;
  complete: (id: MissionId) => void;
}) {
  const completed = state.completed.includes(mission.id);
  const hintCount = Number(
    state.hints
      .find((value) => value.startsWith(`${mission.id}:`))
      ?.split(":")
      .at(-1) || 0,
  );
  return (
    <>
      <div className="mission-breadcrumb">
        <Link href="/missions">MISSIONS</Link>
        <ChevronRight size={13} />
        <span>
          {mission.number} / {mission.title.toUpperCase()}
        </span>
      </div>
      <PageIntro
        eyebrow={`MISSION ${mission.number} · ${mission.difficulty.toUpperCase()}`}
        title={mission.title}
        subtitle={mission.short}
        action={
          <span className="mission-meta-pill">
            <Clock3 size={14} />
            {mission.time}
            <i />+{mission.xp} XP
          </span>
        }
      />
      <div className="mission-detail-grid">
        <article className="mission-brief">
          <div className="brief-section">
            <span className="card-kicker">THE OBJECTIVE</span>
            <h2>{mission.objective}</h2>
            <p>{mission.scenario}</p>
          </div>
          <div className="brief-section">
            <div className="brief-title">
              <span className="card-kicker">YOUR TASK</span>
              <CopyBlock title="Copy task" text={mission.task} />
            </div>
            <div className="task-box">
              <div className="task-box-tag">
                <Terminal size={14} /> HERMES TASK
              </div>
              <p>{mission.task}</p>
            </div>
          </div>
          <div className="brief-section">
            <span className="card-kicker">KEEP THESE INVARIANTS</span>
            <ul className="constraint-list">
              {mission.constraints.map((c) => (
                <li key={c}>
                  <Check size={15} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="brief-section">
            <div className="hint-head">
              <div>
                <span className="card-kicker">PROGRESSIVE HINTS</span>
                <p>
                  {hintCount
                    ? `${hintCount} of ${mission.hints.length} hints revealed`
                    : "Try a first investigation before you open a hint."}
                </p>
              </div>
              <Button
                kind="secondary"
                onClick={() =>
                  update((s) => {
                    const key = `${mission.id}:`;
                    const current = Number(
                      s.hints
                        .find((value) => value.startsWith(key))
                        ?.split(":")
                        .at(-1) || 0,
                    );
                    const next = Math.min(mission.hints.length, current + 1);
                    return {
                      ...s,
                      hints: [
                        ...s.hints.filter((value) => !value.startsWith(key)),
                        `${mission.id}:${next}`,
                      ],
                    };
                  })
                }
                disabled={hintCount >= mission.hints.length}
              >
                <Lightbulb size={15} />
                {hintCount >= mission.hints.length
                  ? "All hints revealed"
                  : "Reveal a hint"}
              </Button>
            </div>
            {hintCount > 0 && (
              <div className="hint-stack">
                {mission.hints
                  .slice(0, Math.min(mission.hints.length, hintCount))
                  .map((h, i) => (
                    <div key={h}>
                      <span>HINT 0{i + 1}</span>
                      <p>{h}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="brief-section verification-box">
            <CheckCircle2 size={19} />
            <div>
              <span className="card-kicker">VERIFICATION</span>
              <p>{mission.verify}</p>
            </div>
          </div>
          <div className="brief-section lab-links">
            <div>
              <FileCode2 size={17} />
              <div>
                <b>Run the local lab</b>
                <span>
                  Use <code>labs/{mission.id}</code> · README has setup and test
                  commands.
                </span>
              </div>
            </div>
            <a
              href={`https://github.com/WILIOP-666/Onboarding-AI-Automation-Hermes-Agent/tree/main/labs/${mission.id}`}
              target="_blank"
              rel="noreferrer"
            >
              View lab files <ExternalLink size={14} />
            </a>
          </div>
          <div className="mission-complete-bar">
            {completed ? (
              <>
                <div className="complete-stamp">
                  <CheckCircle2 size={18} />
                  <span>
                    <b>MISSION COMPLETE</b>
                    <small>
                      {mission.lesson} · +{mission.xp} XP earned
                    </small>
                  </span>
                </div>
                <Button href="/playground">
                  Continue <ArrowRight size={15} />
                </Button>
              </>
            ) : (
              <>
                <div className="complete-stamp">
                  <Flag size={18} />
                  <span>
                    <b>Finished your investigation?</b>
                    <small>{mission.lesson}</small>
                  </span>
                </div>
                <Button onClick={() => complete(mission.id)}>
                  <Check size={15} /> Mark complete · +{mission.xp} XP
                </Button>
              </>
            )}
          </div>
        </article>
        <aside className="mission-sidebar">
          <div className="mission-side-card">
            <span className="card-kicker">THE GOLDEN WORKFLOW</span>
            {[
              "Inspect",
              "Understand",
              "Plan",
              "Implement",
              "Test",
              "Audit",
              "Verify",
            ].map((x, i) => (
              <div className="workflow-step" key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {x}
                {i < 6 && <i />}
              </div>
            ))}
          </div>
          <div className="mission-side-card side-git">
            <Github size={18} />
            <h3>Keep your workspace safe.</h3>
            <p>
              Check <code>git status</code> before you start. Review your diff
              before you finish. Preserve work that was already there.
            </p>
          </div>
          <div className="mission-side-card">
            <span className="card-kicker">LEARNING OBJECTIVE</span>
            <p>{mission.objective}</p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Cheatsheet() {
  const blocks = [
    [
      "01",
      "EXPLORE",
      "Inspect this repository before changing anything. Explain the architecture, entry points, major modules, data flow, and potential risks.",
    ],
    [
      "02",
      "DEBUG",
      "Reproduce the issue first. Trace the relevant execution path. Identify the root cause before implementing a fix.",
    ],
    [
      "03",
      "IMPLEMENT",
      "Implement the smallest production-safe change that satisfies the requirements without unrelated rewrites.",
    ],
    [
      "04",
      "VERIFY",
      "Run relevant tests. Review the diff. Check edge cases and regressions. Report remaining risks.",
    ],
  ];
  return (
    <>
      <PageIntro
        eyebrow="TAKE THIS INTO YOUR NEXT REPO"
        title="The pocket playbook."
        subtitle="Reusable prompts and recovery moves for real engineering work. Copy a starting point, then add the context only you know."
      />
      <div className="cheat-grid">
        {blocks.map((x) => (
          <article className="cheat-card" key={x[0]}>
            <div className="cheat-card-top">
              <span>{x[0]} / FIELD NOTE</span>
              <CopyBlock title="Copy prompt" text={x[2]} />
            </div>
            <h2>{x[1]}</h2>
            <p>{x[2]}</p>
          </article>
        ))}
      </div>
      <section className="recovery-card">
        <div className="recovery-icon">
          <RotateCcw size={18} />
        </div>
        <div>
          <span className="card-kicker">WHEN HERMES GOES OFF TRACK</span>
          <h2>Pause the work. Re-establish what’s true.</h2>
          <div className="recovery-steps">
            {[
              "Stop",
              "Inspect the diff",
              "Restate the objective",
              "Narrow scope",
              "Restore only known-incorrect edits",
              "Continue from verified state",
            ].map((x, i) => (
              <span key={x}>
                <b>0{i + 1}</b>
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="lesson-callout">
        <Lightbulb size={19} />
        <div>
          <b>One more useful prompt</b>
          <span>
            Before concluding, ask: “What did you change, what checks did you
            run, what did they prove, and what remains uncertain?”
          </span>
        </div>
      </div>
    </>
  );
}

function Instructor({
  state,
  update,
}: {
  state: Progress;
  update: (f: (s: Progress) => Progress) => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (confirm && !dialog.open) dialog.showModal();
    if (!confirm && dialog.open) dialog.close();
  }, [confirm]);
  function reset() {
    update(() => initialProgress());
    setConfirm(false);
  }
  return (
    <>
      <PageIntro
        eyebrow="FACILITATOR DESK · 120 MINUTES"
        title="Run the room, not the slides."
        subtitle="A two-hour facilitation map with live-demo cues, expected outcomes, and a safe way to reset the demo. Mark the segment you’re facilitating now."
        action={
          <Button href="/presentation" kind="secondary">
            <Play size={15} /> Open presentation
          </Button>
        }
      />
      <section className="instructor-callout">
        <GraduationCap size={20} />
        <div>
          <b>The teaching target: better engineering judgment.</b>
          <span>
            By the end, interns should be able to inspect an unfamiliar
            repository, delegate an investigation, review generated changes, and
            verify behavior with tests.
          </span>
        </div>
        <div className="shortcut-chip">
          <Keyboard size={14} /> ← → slides
        </div>
      </section>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            THE TWO-HOUR RUN OF SHOW
          </div>
          <h2>Protect the hands-on time.</h2>
        </div>
      </div>
      <div className="timeline">
        {agenda.map((a, i) => (
          <div className="timeline-row" key={a[0]}>
            <div className="timeline-time">
              <b>{a[0]}</b>
              <span>TO</span>
              <b>{a[1]}</b>
            </div>
            <div
              className={`timeline-pin ${i === state.currentSegment ? "timeline-pin-active" : ""}`}
            >
              <span />
            </div>
            <div className="timeline-content">
              <div>
                <span className="card-kicker">SEGMENT 0{i + 1}</span>
                <h3>{a[2]}</h3>
                <p>{a[3]}</p>
              </div>
              <div className="facilitator-tip">
                <Lightbulb size={15} />
                {a[4]}
              </div>
              <button
                type="button"
                className="segment-select"
                aria-label={`Set ${a[2]} as current segment`}
                aria-pressed={state.currentSegment === i}
                onClick={() =>
                  update((current) => ({ ...current, currentSegment: i }))
                }
              >
                {state.currentSegment === i
                  ? "CURRENT SEGMENT"
                  : "MARK CURRENT"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            LIVE DEMO · 15 MINUTES
          </div>
          <h2>Show your working, not magic.</h2>
        </div>
      </div>
      <div className="demo-steps">
        {[
          [
            "01",
            "Pick a small repo",
            "Name the task and show the clean starting state.",
          ],
          [
            "02",
            "Ask for inspection",
            "Have Hermes explain the path and propose a bounded plan.",
          ],
          [
            "03",
            "Reproduce a bug",
            "Observe the failing behavior before editing.",
          ],
          [
            "04",
            "Fix + verify",
            "Make the smallest change, run the focused test, inspect the diff.",
          ],
        ].map((x) => (
          <div key={x[0]}>
            <span>{x[0]}</span>
            <b>{x[1]}</b>
            <p>{x[2]}</p>
          </div>
        ))}
      </div>
      <div className="instructor-lower">
        <section className="panel">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            EXPECTED LEARNING OUTCOMES
          </div>
          <ul className="outcome-list">
            {[
              "Describe how an agent differs from chat.",
              "Write a task with context, scope, and verification.",
              "Investigate before implementing.",
              "Review a diff and interpret a test result.",
              "Identify when a human decision is required.",
            ].map((x) => (
              <li key={x}>
                <Check size={15} />
                {x}
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            COMMON PARTICIPANT TRAPS
          </div>
          <ul className="trap-list">
            {[
              "“Fix everything” prompts",
              "Accepting the first generated solution",
              "Skipping reproduction or tests",
              "Allowing unrelated refactors",
              "Treating symptoms as root causes",
            ].map((x) => (
              <li key={x}>
                <span>!</span>
                {x}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="reset-panel">
        <div>
          <span className="card-kicker">DEMO SETTINGS</span>
          <h3>Reset local training progress</h3>
          <p>
            Clears the participant name, mission completions, XP, slide
            position, current session segment, and revealed hints in this
            browser.
          </p>
        </div>
        <Button kind="secondary" onClick={() => setConfirm(true)}>
          <RotateCcw size={15} /> Reset progress
        </Button>
      </section>
      <dialog
        ref={dialogRef}
        className="confirm-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setConfirm(false);
        }}
      >
        <span className="card-kicker">RESET TRAINING</span>
        <h2>Clear this browser’s progress?</h2>
        <p>
          This clears the participant name, mission completions, XP, slide
          position, current session segment, and revealed hints.
        </p>
        <div className="confirm-actions">
          <Button kind="secondary" onClick={() => setConfirm(false)}>
            Keep progress
          </Button>
          <Button onClick={reset}>Yes, reset</Button>
        </div>
      </dialog>
    </>
  );
}

function Completion({ state, reset }: { state: Progress; reset: () => void }) {
  const all = state.completed.length === missionIds.length;
  const level = levelForXp(state.xp);
  const [confirm, setConfirm] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (confirm && !dialog.open) dialog.showModal();
    if (!confirm && dialog.open) dialog.close();
  }, [confirm]);
  return (
    <div className="completion-page">
      <div className="completion-orbit">
        <div className="completion-center">
          <Trophy size={34} />
        </div>
      </div>
      <div className="eyebrow">
        <span className="eyebrow-line" />
        {all ? "FIELDNOTES · COMPLETED" : "FIELDNOTES · IN PROGRESS"}
      </div>
      <h1>
        {all ? "AI Agent Playground complete." : "Your next level starts here."}
      </h1>
      <p>
        {all
          ? "You completed the onboarding. Take the workflow into your next repository and keep the evidence close."
          : "Work through all five missions to finish your training and build a repeatable engineering loop."}
      </p>
      <div className="completion-summary">
        <div>
          <span className="card-kicker">MISSIONS</span>
          <b>
            {state.completed.length}
            <small> / 5</small>
          </b>
        </div>
        <div>
          <span className="card-kicker">EXPERIENCE</span>
          <b>
            {state.xp}
            <small> XP</small>
          </b>
        </div>
        <div>
          <span className="card-kicker">AGENT LEVEL</span>
          <b>
            {level.level}
            <small> · {level.title}</small>
          </b>
        </div>
      </div>
      <div className="completion-skills">
        {[
          "Explore unfamiliar repositories",
          "Delegate investigation with clear scope",
          "Review AI-generated changes",
          "Use tests as verification",
          "Keep humans accountable for outcomes",
        ].map((x) => (
          <span key={x}>
            <Check size={15} />
            {x}
          </span>
        ))}
      </div>
      <div className="hero-actions">
        <Button href={all ? "/cheatsheet" : "/missions"}>
          {all ? "Open the field guide" : "Continue missions"}{" "}
          <ArrowRight size={15} />
        </Button>
        <button className="text-button" onClick={() => setConfirm(true)}>
          <RotateCcw size={14} /> Restart training
        </button>
      </div>
      <div className="completion-footer">
        YOUR CODE STAYS LOCAL <i /> YOUR JUDGMENT SHIPS THE CHANGE
      </div>
      <dialog
        ref={dialogRef}
        className="confirm-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setConfirm(false);
        }}
      >
        <span className="card-kicker">RESTART TRAINING</span>
        <h2>Clear your progress and start again?</h2>
        <p>
          This clears the participant name, mission completions, XP, slide
          position, current session segment, and revealed hints.
        </p>
        <div className="confirm-actions">
          <Button kind="secondary" onClick={() => setConfirm(false)}>
            Keep progress
          </Button>
          <Button
            onClick={() => {
              reset();
              setConfirm(false);
            }}
          >
            Yes, restart
          </Button>
        </div>
      </dialog>
    </div>
  );
}

export default function Experience() {
  const pathname = usePathname();
  const { state, update } = useProgress();
  const setName = (value: string) => {
    const safe = value.slice(0, 32);
    update((s) => ({ ...s, name: safe }));
  };
  const complete = (id: MissionId) => update((s) => completeMission(s, id));
  const reset = () => {
    update(() => initialProgress());
  };
  const percent = useMemo(
    () => Math.round((state.completed.length / missionIds.length) * 100),
    [state.completed.length],
  );
  const match = missions.find(
    (m) => pathname === `/missions/${m.id}` || pathname === `/${m.id}`,
  );
  const content =
    pathname === "/presentation" ? (
      <Presentation state={state} update={update} />
    ) : pathname === "/learn" ? (
      <Learn />
    ) : pathname === "/hermes" ? (
      <HermesGuide />
    ) : pathname === "/playground" ? (
      <ProgressDashboard
        state={state}
        name={state.name}
        onNameChange={setName}
      />
    ) : pathname === "/missions" ? (
      <MissionsPage state={state} />
    ) : match ? (
      <MissionDetail
        mission={match}
        state={state}
        update={update}
        complete={complete}
      />
    ) : pathname === "/final-mission" ? (
      <MissionDetail
        mission={missions[4]}
        state={state}
        update={update}
        complete={complete}
      />
    ) : pathname === "/cheatsheet" ? (
      <Cheatsheet />
    ) : pathname === "/instructor" ? (
      <Instructor state={state} update={update} />
    ) : pathname === "/completion" ? (
      <Completion state={state} reset={reset} />
    ) : pathname === "/" || !pathname ? (
      <Overview name={state.name} setName={setName} state={state} />
    ) : (
      <Overview name={state.name} setName={setName} state={state} />
    );
  return (
    <Shell state={state} percent={percent} name={state.name}>
      {content}
    </Shell>
  );
}
