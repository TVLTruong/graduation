"use client";

import { motion } from "framer-motion";

type InviteCardProps = {
  id?: string;
  icon?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

// Shared shell so every section has the same padding, radius, heading and entrance
export default function InviteCard({ id, icon, title, className = "", children }: InviteCardProps) {
  return (
    <motion.section
      id={id}
      className={`glass-card bg-white/95 rounded-[24px] p-6 sm:p-8 scroll-mt-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <h2 className="font-heading text-2xl font-bold text-[var(--sky-blue-deep)] mb-5 flex items-center gap-2">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}

// Smaller heading for a sub-part inside a card
export function InviteCardSubheading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-lg font-bold text-[var(--sky-blue-deep)] mb-4 flex items-center gap-2">
      <span aria-hidden>{icon}</span>
      {children}
    </h3>
  );
}
