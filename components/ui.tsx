import type { AnchorHTMLAttributes, ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

export function Container({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "center"
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold uppercase leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-[#c8d1f3]">{text}</p>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const styles =
    variant === "primary"
      ? "premium-shine bg-gradient-to-r from-[#4382DF] via-[#5a95f0] to-[#4382DF] bg-[length:180%_100%] text-white shadow-[0_0_30px_rgba(67,130,223,0.45)] hover:bg-[position:100%_0] hover:shadow-[0_0_46px_rgba(67,130,223,0.62)]"
      : "border border-white/20 bg-white/8 text-white hover:border-[#4382DF]/80 hover:bg-[#4382DF]/18 hover:shadow-[0_0_32px_rgba(67,130,223,0.22)]";

  return (
    <a
      href={href}
      {...props}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-bold uppercase transition duration-300 hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

export function IconCard({
  icon: Icon,
  title,
  children,
  className = ""
}: {
  icon: ComponentType<LucideProps>;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`glass premium-shine group rounded-lg p-6 transition duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[#4382DF]/65 hover:shadow-[0_28px_90px_rgba(67,130,223,0.24)] ${className}`}>
      <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-[#4382DF]/18 text-[#7cb0ff] transition duration-300 group-hover:scale-110 group-hover:bg-[#4382DF] group-hover:text-white group-hover:shadow-[0_0_26px_rgba(67,130,223,0.5)]">
        <Icon aria-hidden="true" size={24} />
      </div>
      <h3 className="text-xl font-bold uppercase text-white">{title}</h3>
      <div className="mt-3 text-base leading-7 text-[#c8d1f3]">{children}</div>
    </article>
  );
}
