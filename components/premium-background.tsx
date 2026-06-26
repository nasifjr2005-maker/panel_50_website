"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "8%", top: "18%", delay: 0, duration: 14 },
  { left: "18%", top: "72%", delay: 1.4, duration: 17 },
  { left: "34%", top: "28%", delay: 0.8, duration: 15 },
  { left: "52%", top: "82%", delay: 2.1, duration: 18 },
  { left: "68%", top: "20%", delay: 1.1, duration: 16 },
  { left: "83%", top: "62%", delay: 2.8, duration: 19 },
  { left: "93%", top: "36%", delay: 1.9, duration: 15 }
];

export function PremiumBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="premium-bg" aria-hidden="true">
      <div className="premium-bg__mesh" />
      <div className="premium-bg__beam premium-bg__beam--one" />
      <div className="premium-bg__beam premium-bg__beam--two" />
      <div className="premium-bg__grid" />
      {!reduceMotion ? (
        <div className="premium-bg__particles">
          {particles.map((particle) => (
            <motion.span
              key={`${particle.left}-${particle.top}`}
              style={{ left: particle.left, top: particle.top }}
              animate={{ y: [-12, 16, -12], opacity: [0.25, 0.85, 0.25], scale: [0.85, 1.18, 0.85] }}
              transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
