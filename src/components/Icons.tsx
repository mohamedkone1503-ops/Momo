type P = { className?: string };
const base = (className = "h-5 w-5") => ({ className, "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" });

export const InstagramIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
);
export const SnapchatIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3c3 0 5 2.2 5 5v2.5l1.8.6c.5.2.5.8 0 1l-1.9.7c.6 1.6 1.8 2.7 3.1 3.2-.5.6-1.6.9-2.6 1-.2.6-.3 1.1-.5 1.4-1-.2-2-.1-2.8.4-.7.4-1.3.9-2.1.9s-1.4-.5-2.1-.9c-.8-.5-1.8-.6-2.8-.4-.2-.3-.3-.8-.5-1.4-1-.1-2.1-.4-2.6-1 1.3-.5 2.5-1.6 3.1-3.2l-1.9-.7c-.5-.2-.5-.8 0-1L7 10.5V8c0-2.8 2-5 5-5z" /></svg>
);
export const TikTokIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.4 2.6 2.2 4.4 5 4.6" /></svg>
);
export const PinIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const PhoneIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const ClockIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const MetroIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l-2-4M15 21l2-4" /><circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" /></svg>
);
export const CombIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M3 8h18v3H3zM5 11v7M8 11v7M11 11v7M14 11v7M17 11v7M20 11v5" /></svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
);
export const HeartIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z" /></svg>
);
export const CalendarIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const Star = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" /></svg>
);

export const highlightIcons = { comb: CombIcon, shield: ShieldIcon, heart: HeartIcon };
