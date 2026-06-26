import type { SVGProps } from "react";

export function YouTubeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M22.5 6.8a3 3 0 0 0-2.1-2.1C18.5 4.2 12 4.2 12 4.2s-6.5 0-8.4.5a3 3 0 0 0-2.1 2.1C1 8.7 1 12 1 12s0 3.3.5 5.2a3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.2.5-5.2s0-3.3-.5-5.2Z"
        fill="currentColor"
      />
      <path d="M9.8 15.4 15.5 12 9.8 8.6v6.8Z" fill="#ffffff" />
    </svg>
  );
}

export function DiscordLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M19.2 5.3A17.3 17.3 0 0 0 15 4l-.5 1.1a15 15 0 0 0-5 0L9 4a17.3 17.3 0 0 0-4.2 1.3C2.2 9.1 1.5 12.8 1.8 16.4a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.1-.5-1.6-.8l.4-.3c3.1 1.4 7.1 1.4 10.2 0l.4.3c-.5.3-1 .6-1.6.8L17 19a17 17 0 0 0 5.2-2.6c.4-4.2-.7-7.9-3-11.1Z"
        fill="currentColor"
      />
      <path d="M8.8 13.3c.7 0 1.2-.6 1.2-1.3s-.5-1.3-1.2-1.3-1.2.6-1.2 1.3.5 1.3 1.2 1.3ZM15.2 13.3c.7 0 1.2-.6 1.2-1.3s-.5-1.3-1.2-1.3S14 11.3 14 12s.5 1.3 1.2 1.3Z" fill="#ffffff" />
    </svg>
  );
}
