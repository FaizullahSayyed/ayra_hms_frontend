import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { statistics } from "../data/hospital";
import Reveal from "../components/Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reduceMotion) {
      setCount(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, reduceMotion]);

  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
}

export default function StatisticsSection() {
  return (
    <section className="statistics-section" id="statistics">
      <div className="container stats-inner">
        <Reveal className="stats-intro">
          <span className="eyebrow">A little about us</span>
          <h2>Care that makes<br /><span>a difference.</span></h2>
          <p>Every number represents a person, a family, and a moment of care we're proud to be part of.</p>
        </Reveal>
        <div className="stats-grid">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={index * 0.07}>
                <article className="stat-card">
                  <span className="stat-icon"><Icon aria-hidden="true" /></span>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <span className="stat-label">{stat.label}</span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
