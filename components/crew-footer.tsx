"use client";

"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TEAM } from "@/lib/team";

export default function CrewFooter() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pointerStart = useRef({ x: 0, scrollLeft: 0 });
  const reduceMotion = useReducedMotion();

  const centerCard = useCallback((index: number) => {
    setActiveIndex(index);
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(`[data-crew-card="${index}"]`);
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: reduceMotion ? "instant" : "smooth" });
  }, [reduceMotion]);

  return (
    <footer className="crew-footer" id="crew" aria-label="Meet the SAR-Pulse team">
      <div className="crew-footer-top">
        <div>
          <p className="crew-overline">THE PEOPLE BEHIND SAR-PULSE</p>
          <h2>Let&apos;s connect<span>.</span></h2>
        </div>
        <p className="crew-footer-note">A small team, curious about<br />a very big planet.</p>
      </div>

      <div
        ref={railRef}
        className={`crew-gallery${dragging ? " is-dragging" : ""}`}
        aria-label="Team portraits. Drag or swipe to explore."
        onPointerDown={(event) => {
          if (event.pointerType === "mouse") {
            pointerStart.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={(event) => {
          if (dragging) event.currentTarget.scrollLeft = pointerStart.current.scrollLeft - (event.clientX - pointerStart.current.x);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onScroll={(event) => {
          const rail = event.currentTarget;
          const center = rail.scrollLeft + rail.clientWidth / 2;
          let nearest = 0;
          TEAM.forEach((_, index) => {
            const card = rail.querySelector<HTMLElement>(`[data-crew-card="${index}"]`);
            if (card && Math.abs(card.offsetLeft + card.clientWidth / 2 - center) < Math.abs((rail.querySelector<HTMLElement>(`[data-crew-card="${nearest}"]`)?.offsetLeft ?? 0) - center)) nearest = index;
          });
          setActiveIndex(nearest);
        }}
      >
        <div className="crew-gallery-track">
          {TEAM.map((member, index) => (
            <motion.article
              key={member.id}
              data-crew-card={index}
              className={`crew-card${activeIndex === index ? " is-active" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.07 }}
              aria-label={`${member.name}, ${member.role}`}
            >
              <div className="crew-card-photo">
                <Image src={member.photo} alt={member.name} fill sizes="(max-width: 640px) 76vw, (max-width: 1024px) 44vw, 30vw" style={{ objectPosition: member.photoPosition }} draggable={false} />
                <span className="crew-card-index">0{index + 1} / 0{TEAM.length}</span>
              </div>
              <div className="crew-card-caption">
                <div><h3>{member.name}</h3><p>{member.role}</p></div>
                <ArrowUpRight size={17} aria-hidden="true" />
              </div>
              <p className="crew-card-bio">{member.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="crew-footer-bottom">
        <span>TEAM SAR-PULSE · NASA SPACE APPS CHALLENGE</span>
        <div className="crew-gallery-controls">
          <span><MoveHorizontal size={14} /> DRAG TO MEET THE CREW</span>
          <div>
            <button type="button" onClick={() => centerCard((activeIndex + TEAM.length - 1) % TEAM.length)} aria-label="Previous team member">←</button>
            <button type="button" onClick={() => centerCard((activeIndex + 1) % TEAM.length)} aria-label="Next team member">→</button>
          </div>
        </div>
        <a href="https://nisar.jpl.nasa.gov/" target="_blank" rel="noreferrer">EXPLORE NISAR <ArrowUpRight size={13} /></a>
      </div>
    </footer>
  );
}
