import React, { useMemo } from 'react';

const AnimatedBackground: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      dur: `${6 + Math.random() * 10}s`,
      delay: `${Math.random() * 8}s`,
      size: `${2 + Math.random() * 4}px`,
      op: 0.3 + Math.random() * 0.5,
    })),
  []);

  const orbs = useMemo(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      dur: `${8 + Math.random() * 6}s`,
      delay: `${Math.random() * 5}s`,
      size: `${60 + Math.random() * 80}px`,
    })),
  []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .animated-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .ab-particle {
          position: absolute;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(100,200,255,0.4) 60%, transparent 100%);
          border-radius: 50%;
          animation: abFloatUp linear infinite;
          filter: blur(0.5px);
        }
        @keyframes abFloatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
        .ab-glow-orb {
          position: absolute;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(147,51,234,0.08) 50%, transparent 70%);
          border-radius: 50%;
          animation: abPulse ease-in-out infinite alternate;
          filter: blur(20px);
        }
        @keyframes abPulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.3; }
          50% { transform: scale(1.3) translate(10px, -10px); opacity: 0.6; }
          100% { transform: scale(0.9) translate(-10px, 10px); opacity: 0.2; }
        }
      ` }} />
      <div className="animated-bg">
        {particles.map((p, i) => (
          <div
            key={i}
            className="ab-particle"
            style={{
              left: p.left,
              animationDuration: p.dur,
              animationDelay: p.delay,
              width: p.size,
              height: p.size,
              opacity: p.op,
            }}
          />
        ))}
        {orbs.map((o, i) => (
          <div
            key={`orb-${i}`}
            className="ab-glow-orb"
            style={{
              left: o.left,
              top: o.top,
              animationDuration: o.dur,
              animationDelay: o.delay,
              width: o.size,
              height: o.size,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;