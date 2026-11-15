"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import CrowdSvg from "@/components/crowd-svg";
import CrewDetails from "@/components/crew-details";
import CrewMember from "@/components/crew-member";
import { TEAM } from "@/lib/team";

const DESKTOP_POSITIONS = [12, 31, 50, 69, 88];
const TABLET_POSITIONS = [10, 30, 50, 70, 90];

export default function CrewFooter({ light, onToggleTheme }: { light: boolean; onToggleTheme: () => void }) {
  const footerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [positions, setPositions] = useState<number[]>(DESKTOP_POSITIONS);
  const shouldReduceMotion = useReducedMotion();
  const reducedMotion = Boolean(shouldReduceMotion);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start start", "end end"] });
  const crowdY = useTransform(scrollYProgress, [0, 0.15], [130, 0]);
  const crowdOpacity = useTransform(scrollYProgress, [0, 0.15], [0.62, 1]);
  const isFinale = reducedMotion || progress >= 0.85;
  const showCredits = reducedMotion || progress >= 0.9;
  const activeMember = activeIndex === null || !detailsOpen ? null : TEAM[activeIndex];
  const detailsSide = activeIndex !== null && activeIndex >= 3 ? "left" : activeIndex === 2 ? "center" : "right";

  const syncProgress = useCallback((value: number) => {
    setProgress(value);
    if (reducedMotion) return;
    if (value >= 0.15 && value < 0.85) {
      const nextIndex = Math.min(TEAM.length - 1, Math.floor((value - 0.15) / 0.14));
      setActiveIndex(nextIndex);
      setDetailsOpen(true);
    } else {
      setActiveIndex(null);
      setDetailsOpen(false);
    }
  }, [reducedMotion]);

  useMotionValueEvent(scrollYProgress, "change", syncProgress);

  useEffect(() => {
    syncProgress(scrollYProgress.get());
  }, [scrollYProgress, syncProgress]);

  const jumpToMember = useCallback((index: number) => {
    setActiveIndex(index);
    setDetailsOpen(true);
    if (reducedMotion || !footerRef.current) return;

    const sectionTop = footerRef.current.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = Math.max(0, footerRef.current.offsetHeight - window.innerHeight);
    const segmentProgress = 0.15 + index * 0.14 + 0.07;
    window.scrollTo({ top: sectionTop + scrollDistance * segmentProgress, behavior: "smooth" });
  }, [reducedMotion]);

  const moveToMember = useCallback((index: number) => {
    jumpToMember((index + TEAM.length) % TEAM.length);
  }, [jumpToMember]);

  const handleMemberKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToMember(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToMember(index - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDetailsOpen(false);
    }
  }, [moveToMember]);

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const updatePositions = () => setPositions(tablet.matches ? TABLET_POSITIONS : DESKTOP_POSITIONS);
    updatePositions();
    tablet.addEventListener("change", updatePositions);
    return () => tablet.removeEventListener("change", updatePositions);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      footer.classList.toggle("is-visible", entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  return (
    <section
      ref={footerRef}
      className={`crew-footer${reducedMotion ? " crew-footer--reduced" : ""}`}
      id="crew"
      role="region"
      aria-label="Project team"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setDetailsOpen(false);
        }
      }}
    >
      <div className="crew-stage" style={{ "--crew-progress": progress } as CSSProperties}>
        <div className="crew-stage-glow" aria-hidden="true" />
        <motion.div className="crew-crowd-layer" style={reducedMotion ? undefined : { y: crowdY, opacity: crowdOpacity }}>
          <CrowdSvg />
        </motion.div>

        <header className="crew-stage-header">
          <div>
            <p className="crew-overline"><span className="crew-overline-dot" /> THE CREW IN THE CROWD</p>
            <h2>The people behind<br /><em>SAR-Pulse.</em></h2>
          </div>
          <p className="crew-stage-note">Five perspectives.<br />One shared curiosity.</p>
        </header>

        <motion.p
          className="crew-tagline"
          animate={{ opacity: progress < 0.15 || isFinale ? 1 : 0, y: progress < 0.15 || isFinale ? 0 : -8 }}
          transition={{ duration: 0.35 }}
        >
          {isFinale ? "One planet. Many people behind the signal." : "The people behind SAR-Pulse"}
        </motion.p>

        <div className="crew-member-row" aria-label="Select a team member">
          {TEAM.map((member, index) => (
            <CrewMember
              key={member.id}
              member={member}
              index={index}
              x={positions[index] ?? TABLET_POSITIONS[index]}
              active={activeIndex === index && detailsOpen}
              fullColor={reducedMotion || isFinale || activeIndex === index}
              reducedMotion={reducedMotion}
              onActivate={() => jumpToMember(index)}
              onFocus={() => {
                if (!reducedMotion) jumpToMember(index);
              }}
              onKeyDown={(event) => handleMemberKeyDown(event, index)}
            />
          ))}
        </div>

        <CrewDetails
          member={activeMember}
          index={activeIndex ?? 0}
          total={TEAM.length}
          side={detailsSide}
          onPrevious={() => moveToMember((activeIndex ?? 0) - 1)}
          onNext={() => moveToMember((activeIndex ?? 0) + 1)}
          onClose={closeDetails}
        />

        <motion.div
          className="crew-credits"
          aria-hidden={!showCredits}
          inert={!showCredits}
          animate={{ opacity: showCredits ? 1 : 0, y: showCredits ? 0 : 14 }}
          transition={{ duration: 0.45 }}
        >
          <p>Designed &amp; built by Team SAR-Pulse for the NASA International Space Apps Challenge.</p>
          <p className="crew-credit-sources">NASA/JPL-Caltech · ISRO · ASF DAAC · NASA GIBS · OpenStreetMap · CARTO</p>
          <div className="crew-credit-actions">
            <a href="https://nisar.jpl.nasa.gov/" target="_blank" rel="noreferrer">Data sources <ArrowUpRight size={13} /></a>
            <button type="button" onClick={onToggleTheme} aria-label={`Switch to ${light ? "dark" : "light"} theme`}>
              {light ? <Moon size={14} /> : <Sun size={14} />}
              <span>Theme</span>
            </button>
            <a href="#home">Back to top <ArrowUpRight size={13} /></a>
          </div>
        </motion.div>
      </div>

      <ul className="sr-only">
        {TEAM.map((member) => (
          <li key={member.id}>
            <strong>{member.name}</strong>, {member.role}. {member.bio} What they built in SAR-Pulse: {member.contribution} Skills: {member.skills.join(", ")}.
          </li>
        ))}
      </ul>
    </section>
  );
}
