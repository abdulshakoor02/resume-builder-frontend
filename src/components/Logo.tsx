import Link from "next/link";
import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  href?: string;
}

const sizeMap: Record<LogoSize, { resume: string; sub: string; icon: number }> = {
  sm: { resume: "text-xl", sub: "text-[10px]", icon: 24 },
  md: { resume: "text-2xl", sub: "text-xs", icon: 32 },
  lg: { resume: "text-4xl", sub: "text-sm", icon: 40 },
};

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link href={href} className="inline-flex items-center gap-2 leading-tight no-underline group">
      <Image
        src="/wethinkdigital.ico"
        alt="WeThinkDigital"
        width={s.icon}
        height={s.icon}
        className="rounded"
      />
      <div className="flex flex-col items-start">
        <span
          className={`${s.sub} tracking-[0.2em] uppercase text-ink-muted hidden sm:block font-sans`}
        >
          wethinkdigital
        </span>
        <span
          className={`${s.resume} font-display text-ink-primary transition-colors group-hover:text-accent`}
        >
          Resume
        </span>
      </div>
    </Link>
  );
}
