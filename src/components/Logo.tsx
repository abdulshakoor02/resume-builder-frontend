import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  href?: string;
}

const sizeMap: Record<LogoSize, { resume: string; sub: string }> = {
  sm: { resume: "text-xl", sub: "text-[10px]" },
  md: { resume: "text-2xl", sub: "text-xs" },
  lg: { resume: "text-4xl", sub: "text-sm" },
};

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link href={href} className="inline-flex flex-col items-start leading-tight no-underline group">
      <span
        className={`${s.sub} tracking-[0.2em] uppercase text-ink-muted hidden sm:block font-sans`}
      >
        wethinkdigital
      </span>
      <span
        className={`${s.resume} font-display text-ink-primary transition-colors group-hover:text-accent`}
      >
        <span className="text-accent">◆</span> Resume
      </span>
    </Link>
  );
}
