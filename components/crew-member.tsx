"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { TeamMember } from "@/lib/team";

type CrewMemberProps = {
  member: TeamMember;
  index: number;
  x: number;
  active: boolean;
  fullColor: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

export default function CrewMember({
  member,
  index,
  x,
  active,
  fullColor,
  reducedMotion,
  onActivate,
  onFocus,
  onKeyDown,
}: CrewMemberProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = member.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <motion.button
      type="button"
      className={`crew-person${active ? " is-active" : ""}${fullColor ? " is-color" : ""}`}
      style={{ "--crew-x": `${x}%` } as CSSProperties}
      aria-pressed={active}
      aria-label={`${member.name}, ${member.role}`}
      onClick={onActivate}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      animate={reducedMotion ? { y: 0, scale: 1 } : { y: active ? -24 : 0, scale: active ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      <span className="crew-person-halo" aria-hidden="true" />
      <span className="crew-photo-window">
        {photoFailed ? (
          <span className="crew-photo-fallback" role="img" aria-label={`Add a portrait for ${member.name}`}>
            <span>{initials}</span>
            <small>Add photo</small>
          </span>
        ) : (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.role} on the SAR-Pulse team`}
            fill
            unoptimized
            sizes="(max-width: 639px) 64vw, (max-width: 1023px) 18vw, 16vw"
            style={{ objectPosition: member.photoPosition }}
            onError={() => {
              setPhotoFailed(true);
              if (process.env.NODE_ENV !== "production") {
                console.warn(`[SAR-Pulse] Add a real team photo at ${member.photo}`);
              }
            }}
          />
        )}
        <span className="crew-photo-shade" aria-hidden="true" />
        <span className="crew-person-index" aria-hidden="true">0{index + 1}</span>
      </span>
      <span className="crew-person-copy">
        <span className="crew-person-name">{member.name}</span>
        <span className="crew-person-role">{member.role}</span>
      </span>
    </motion.button>
  );
}
