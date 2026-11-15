"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { TeamMember } from "@/lib/team";

type CrewDetailsProps = {
  member: TeamMember | null;
  index: number;
  total: number;
  side: "left" | "center" | "right";
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

function AnimatedWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <span className="crew-animated-words" aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: "0.35em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.025, duration: 0.22 }}
        >
          {word}{index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export default function CrewDetails({ member, index, total, side, onPrevious, onNext, onClose }: CrewDetailsProps) {
  return (
    <AnimatePresence mode="wait">
      {member ? (
        <motion.aside
          key={member.id}
          className={`crew-details crew-details--${side}`}
          aria-label={`${member.name} details`}
          initial={{ opacity: 0, x: side === "right" ? 24 : side === "left" ? -24 : 0, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          <div className="crew-details-top">
            <span className="crew-details-count">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <button type="button" className="crew-details-close" aria-label="Close team member details" onClick={onClose}><X size={16} /></button>
          </div>
          <h3><AnimatedWords text={member.name} /></h3>
          <span className="crew-role-chip">{member.role}</span>
          <p className="crew-details-bio"><AnimatedWords text={member.bio} /></p>
          <div className="crew-contribution">
            <span>WHAT THEY BUILT IN SAR-PULSE</span>
            <p>{member.contribution}</p>
          </div>
          <div className="crew-skills" aria-label="Skills">
            {member.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <div className="crew-details-bottom">
            <div className="crew-member-progress" role="progressbar" aria-label="Team member selection" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
              <span style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
            <div className="crew-details-nav">
              <span>{String(index + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}</span>
              <div>
                <button type="button" aria-label="Previous team member" onClick={onPrevious}><ArrowLeft size={15} /></button>
                <button type="button" aria-label="Next team member" onClick={onNext}><ArrowRight size={15} /></button>
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
