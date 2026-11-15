"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { createCrowdFigures } from "@/lib/crowd";

const CLOTHING = ["#17191c", "#3d4146", "#70757a", "#d9d8d3", "#292c30", "#8b8c8a", "#4d5054", "#b4b4b0"];

function Hair({ style }: { style: number }) {
  const paths = [
    "M-18 30 Q-20 9 -2 9 Q17 8 18 31 L14 22 Q4 14 -4 22 L-12 31Z",
    "M-18 29 Q-20 14 -12 12 Q-8 4 0 10 Q12 5 18 17 L16 30 L11 20 Q2 14 -7 21 L-13 31Z",
    "M-17 28 Q-17 11 -4 10 Q11 9 17 21 L14 25 Q4 17 -5 20 L-13 30Z",
    "M-20 31 Q-21 13 -12 10 Q-8 4 0 9 Q14 6 19 18 L21 48 Q15 42 13 29 L10 22 Q1 16 -7 22 L-13 34 L-15 49 L-20 45Z",
    "M-18 28 Q-18 13 -3 9 Q12 8 18 22 L13 23 Q5 14 -4 20 L-11 31Z",
    "M-18 30 Q-22 11 -5 8 Q12 6 18 21 L16 29 Q8 15 -2 19 L-12 30Z",
    "M-18 29 Q-18 13 -7 10 Q-3 3 5 9 Q17 9 19 23 L16 30 L13 18 Q4 14 -5 20 L-12 31Z",
    "M-19 29 Q-17 12 -9 11 Q-3 2 5 9 Q17 8 19 23 L16 31 Q6 15 -4 21 L-13 32Z",
  ];

  return <path d={paths[style]} fill="#111315" stroke="#111315" strokeWidth="1.6" strokeLinejoin="round" />;
}

function Headwear({ style }: { style: number }) {
  if (style === 0) return null;
  if (style === 1) return <path d="M-18 17 Q-15 5 0 5 Q15 5 18 18 L13 21 Q0 15 -13 21Z" fill="#202226" stroke="#08090b" strokeWidth="1.7" />;
  if (style === 2) return <path d="M-16 16 Q-17 5 0 4 Q17 5 16 16Z M-20 17 Q0 13 20 17" fill="#55595d" stroke="#08090b" strokeWidth="1.7" />;
  if (style === 3) return <path d="M-15 14 Q-16 4 0 4 Q16 4 15 14Z" fill="#bcbcb7" stroke="#08090b" strokeWidth="1.7" />;
  if (style === 4) return <path d="M-19 22 Q-19 7 -4 6 Q13 4 18 19 L14 29 L11 22 Q0 14 -11 24 L-16 39Z" fill="#383b3f" stroke="#08090b" strokeWidth="1.7" />;
  return <path d="M-22 17 Q-18 8 0 8 Q18 8 22 17 L17 20 Q0 15 -17 20Z" fill="#d2d1cb" stroke="#08090b" strokeWidth="1.7" />;
}

function CrowdPerson({ figure }: { figure: ReturnType<typeof createCrowdFigures>[number] }) {
  const clothing = CLOTHING[figure.clothing];
  const smile = figure.expression % 3 === 0;
  const mouth = smile ? "M-4 43 Q0 47 4 43" : figure.expression % 3 === 1 ? "M-3 44 L3 44" : "M-4 45 Q0 42 4 45";

  return (
    <g
      className="crowd-figure"
      data-row={figure.row}
      transform={`translate(${figure.x} ${figure.y}) scale(${figure.scale})`}
      style={{ animationDelay: `${-figure.phase}s` }}
    >
      <path d="M-34 104 Q-31 67 -18 59 L-9 54 L9 54 L19 59 Q32 68 35 104Z" fill={clothing} stroke="#090a0c" strokeWidth="2.2" />
      <path d="M-8 53 L0 63 L8 53 L6 78 L0 84 L-6 78Z" fill="#efeee8" stroke="#090a0c" strokeWidth="1.5" />
      <path d="M-7 54 L0 61 L-7 68 M7 54 L0 61 L7 68" fill="none" stroke="#303236" strokeWidth="1.3" />
      <rect x="-6" y="44" width="12" height="15" rx="4" fill="#deddd7" stroke="#090a0c" strokeWidth="1.6" />
      <ellipse cx="0" cy="31" rx="16" ry="19" fill="#f0efe8" stroke="#090a0c" strokeWidth="1.8" />
      <Hair style={figure.hair} />
      {figure.beard > 0 && figure.beard < 4 ? (
        <path d={figure.beard === 1 ? "M-11 39 Q0 48 11 39 L9 47 Q0 53 -9 47Z" : figure.beard === 2 ? "M-13 36 Q-11 49 0 53 Q11 49 13 36 L8 42 Q0 45 -8 42Z" : "M-12 39 Q0 48 12 39 L7 49 Q0 52 -7 49Z"} fill="#17191b" />
      ) : null}
      <path d="M-8 30 Q-5 28 -3 30 M3 30 Q6 28 8 30" fill="none" stroke="#17191b" strokeWidth="1.8" strokeLinecap="round" />
      <path d={mouth} fill="none" stroke="#25272a" strokeWidth="1.5" strokeLinecap="round" />
      {figure.glasses ? (
        <g fill="none" stroke="#17191b" strokeWidth="1.8">
          <rect x="-13" y="27" width="10" height="8" rx="3" />
          <rect x="3" y="27" width="10" height="8" rx="3" />
          <path d="M-3 30 L3 30 M-13 29 L-17 27 M13 29 L17 27" />
        </g>
      ) : null}
      <Headwear style={figure.headwear} />
    </g>
  );
}

function CrowdSvg() {
  const [count, setCount] = useState(120);
  const figures = useMemo(() => createCrowdFigures(count, count === 60 ? 4 : 5), [count]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const updateCount = () => setCount(query.matches ? 60 : 120);
    updateCount();
    query.addEventListener("change", updateCount);
    return () => query.removeEventListener("change", updateCount);
  }, []);

  return (
    <svg className="crew-crowd-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="crew-crowd-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--bg)" stopOpacity="0" />
          <stop offset="0.3" stopColor="var(--bg)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--bg)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {figures.map((figure) => <CrowdPerson key={figure.id} figure={figure} />)}
      <rect x="0" y="0" width="1000" height="700" fill="url(#crew-crowd-fade)" />
    </svg>
  );
}

export default memo(CrowdSvg);
