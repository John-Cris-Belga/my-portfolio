"use client";
import { useEffect, useRef, useState } from "react";

const coderData = {
  name: "Chris Belga",
  role: "Web Developer; HubSpot Admin",
  seniority: "Mid-Level",
  location: "Philippines",
  educations: ['BS in Mechanical Engineering', 'Full Stack Web Development'],
  languages: ['Filipino', 'English'],
  links: [
    {
      key: 'email',
      label: 'inquiry@chrisbelga.dev',
      href: 'mailto:inquiry@chrisbelga.dev',
      download: false
    },
    {
      key: 'github',
      label: 'github.com/John-Cris-Belga',
      href: 'https://github.com/John-Cris-Belga',
      download: false
    },
    {
      key: 'linkedin',
      label: 'linkedin.com/in/chris-b-730791112',
      href: 'https://www.linkedin.com/in/chris-b-730791112/',
      download: false
    },
    {
      key: 'resume',
      label: 'download cv',
      href: '/C.V - Belga, Chris.pdf',
      download: true
    },
  ]
};

const PUNCT = "text-gray-400";
const KEY = "text-white";
const STRING = "text-green-400";

const propRow = (label, value) => [
  { text: `${label}: `, cls: KEY },
  { text: "'", cls: PUNCT },
  { text: value, cls: STRING },
  { text: "',", cls: PUNCT },
];

const arrayRow = (label, values) => [
  { text: `${label}: `, cls: KEY },
  { text: "[", cls: PUNCT },
  ...values.flatMap((value, i) => [
    { text: "'", cls: PUNCT },
    { text: value, cls: STRING },
    { text: i < values.length - 1 ? "', " : "'", cls: PUNCT },
  ]),
  { text: "],", cls: PUNCT },
];

const ROWS = [
  {
    indent: "",
    segments: [
      { text: "const ", cls: "text-pink-400" },
      { text: "developer", cls: "text-violet-400" },
      { text: " = ", cls: "text-pink-500" },
      { text: "{", cls: PUNCT },
    ],
  },
  { indent: "pl-4 md:pl-6", segments: propRow("name", coderData.name) },
  { indent: "pl-4 md:pl-6", segments: propRow("role", coderData.role) },
  { indent: "pl-4 md:pl-6", segments: propRow("seniority", coderData.seniority) },
  { indent: "pl-4 md:pl-6", segments: arrayRow("education", coderData.educations) },
  { indent: "pl-4 md:pl-6", segments: propRow("location", coderData.location) },
  { indent: "pl-4 md:pl-6", segments: arrayRow("languages", coderData.languages) },
  {
    indent: "pl-4 md:pl-6",
    segments: [
      { text: "links: ", cls: KEY },
      { text: "{", cls: PUNCT },
    ],
  },
  ...coderData.links.map((link, i, arr) => ({
    indent: "pl-8 md:pl-12",
    segments: [
      { text: `${link.key}: `, cls: KEY },
      { text: "'", cls: PUNCT },
      {
        text: link.label,
        cls: "text-cyan-400",
        href: link.href,
        download: link.download,
      },
      { text: i < arr.length - 1 ? "'," : "'", cls: PUNCT },
    ],
  })),
  { indent: "pl-4 md:pl-6", segments: [{ text: "}", cls: PUNCT }] },
  { indent: "", segments: [{ text: "};", cls: PUNCT }] },
];

const rowLength = (row) => row.segments.reduce((sum, s) => sum + s.text.length, 0);

const TYPING_SPEED = 22;
const ROW_DELAY = 140;
const INITIAL_DELAY = 500;

function TypedRow({ row, chars, complete }) {
  let remaining = chars;
  const nodes = [];
  for (let i = 0; i < row.segments.length && remaining > 0; i++) {
    const seg = row.segments[i];
    const text = seg.text.slice(0, remaining);
    remaining -= text.length;
    // Links only become clickable once their row has finished typing.
    if (seg.href && complete) {
      nodes.push(
        <a
          key={i}
          href={seg.href}
          className={`cursor-target ${seg.cls} hover:underline`}
          {...(seg.download
            ? { download: true }
            : seg.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
        >
          {text}
        </a>,
      );
    } else {
      nodes.push(
        <span key={i} className={seg.cls}>
          {text}
        </span>,
      );
    }
  }
  return nodes;
}

const LineNumber = ({ n, className }) => (
  <span
    className={`hidden md:block w-[2ch] shrink-0 mr-4 text-right text-gray-500 opacity-70 select-none ${className}`}
  >
    {n}
  </span>
);

const Cursor = ({ blink }) => (
  <span
    className={`ml-0.5 inline-block h-[1em] w-[0.5em] bg-neutral-300 align-middle ${blink ? "animate-cursor-blink" : ""}`}
  />
);

const CoderProfileCard = () => {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [rowIndex, setRowIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setRowIndex(ROWS.length - 1);
          setPhase("done");
          return;
        }
        setTimeout(() => setPhase("typing"), INITIAL_DELAY);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (charIndex < rowLength(ROWS[rowIndex])) {
      const t = setTimeout(
        () => setCharIndex((c) => c + 1),
        TYPING_SPEED + Math.random() * 20,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (rowIndex < ROWS.length - 1) {
        setRowIndex((r) => r + 1);
        setCharIndex(0);
      } else {
        setPhase("done");
      }
    }, ROW_DELAY);
    return () => clearTimeout(t);
  }, [phase, rowIndex, charIndex]);

  const typing = phase === "typing";
  const done = phase === "done";

  return (
    <div
      ref={containerRef}
      className="w-full bg-linear-to-r from-black/30 to-[#0a0d37]/30 border-[#1b2c68a0] relative rounded-lg border shadow-lg overflow-hidden"
    >
      <div className="flex flex-row">
        <div className="h-0.5 w-full bg-linear-to-r from-transparent via-pink-500 to-violet-600"></div>
        <div className="h-0.5 w-full bg-linear-to-r from-violet-600 to-transparent"></div>
      </div>

      <div className="px-4 lg:px-8 py-4 md:py-5 flex justify-between items-center bg-black/40">
        <div className="flex flex-row space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-orange-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono">engineer.js</div>
      </div>

      <div className="overflow-hidden border-t-2 border-indigo-900 px-4 lg:px-8 py-4 lg:py-8 relative">
        {/* Radial gradients instead of blur filters: same glow, no per-frame filter repaint while typing. */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_60%)]"></div>
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 bg-[radial-gradient(circle,rgba(219,39,119,0.1)_0%,transparent_60%)]"></div>

        {/* Invisible full copy reserves the final height (and shows the line numbers) so the card doesn't grow while typing. */}
        <div className="relative w-full min-w-0 font-mono text-xs sm:text-sm lg:text-base">
          <code aria-hidden="true" className="invisible block">
            {ROWS.map((row, i) => (
              <div key={i} className="flex leading-relaxed">
                <LineNumber n={i + 1} className="visible" />
                <div className={`min-w-0 flex-1 break-words ${row.indent}`}>
                  <TypedRow row={row} chars={rowLength(row)} complete={false} />
                </div>
              </div>
            ))}
          </code>
          <code className="absolute inset-0 block">
            {ROWS.map((row, i) => {
              if (i > rowIndex || phase === "idle") return null;
              const complete = i < rowIndex || done;
              return (
                <div key={i} className="flex leading-relaxed">
                  <LineNumber n={i + 1} className="invisible" />
                  <div className={`min-w-0 flex-1 break-words ${row.indent}`}>
                    <TypedRow
                      row={row}
                      chars={complete ? rowLength(row) : charIndex}
                      complete={complete}
                    />
                    {typing && i === rowIndex && <Cursor />}
                    {done && i === ROWS.length - 1 && <Cursor blink />}
                  </div>
                </div>
              );
            })}
          </code>
        </div>
      </div>

      {/* Equal side columns keep the middle item centered while the Ln/Col text changes width. */}
      <div className="px-4 lg:px-8 pb-4 mt-4 border-t border-gray-800 pt-3 text-xs text-gray-500 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="justify-self-start">UTF-8</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          Available for projects
        </span>
        <span className="justify-self-end whitespace-nowrap tabular-nums">
          Ln {Math.min(rowIndex + 1, ROWS.length)}, Col {typing ? charIndex + 1 : rowLength(ROWS[rowIndex]) + 1}
        </span>
      </div>
    </div>
  );
};

export default CoderProfileCard;
