import { site } from "@/data/site";
import { InstagramIcon, SnapchatIcon, TikTokIcon } from "./Icons";

const items = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.snapchat, label: "Snapchat", Icon: SnapchatIcon },
  { href: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export function Social({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} sur ${label}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-line text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
