import { useRef, useEffect, useState, type ReactNode, type ElementType } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Animation variant: "up" slides up, "in" fades only, "scale" scales in */
  variant?: "up" | "in" | "scale";
  /** Delay in ms (for staggering siblings) */
  delay?: number;
  /** Viewport threshold to trigger (0-1) */
  threshold?: number;
  /** HTML element to render (default "div"). Use "tr" inside tables. */
  as?: ElementType;
}

export default function FadeIn({
  children,
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animClass =
    variant === "up"
      ? "animate-fade-in-up"
      : variant === "scale"
        ? "animate-scale-in"
        : "animate-fade-in";

  return (
    <Tag
      ref={ref}
      className={`${visible ? animClass : "opacity-0"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
