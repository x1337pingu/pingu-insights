'use client'

import React from 'react'

/**
 * Subtle animated background with floating gradient orbs and a faint grid.
 * Inspired by Pingu Remotion video backgrounds (copper-listing, week-in-markets).
 * Pure CSS animations - no JS frame loop needed.
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Faint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(144, 81, 244, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(144, 81, 244, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orb 1 - top left, slow drift */}
      <div
        className="absolute rounded-full"
        style={{
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(144, 81, 244, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'drift1 25s ease-in-out infinite',
        }}
      />

      {/* Gradient orb 2 - bottom right, counter drift */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(ellipse, rgba(87, 31, 131, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'drift2 30s ease-in-out infinite',
        }}
      />

      {/* Gradient orb 3 - center, slow pulse */}
      <div
        className="absolute rounded-full"
        style={{
          top: '40%',
          left: '30%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(144, 81, 244, 0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'drift3 35s ease-in-out infinite',
        }}
      />

      {/* Subtle horizontal accent line */}
      <svg
        className="absolute top-1/3 left-0 w-full opacity-[0.04]"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        style={{ animation: 'waveDrift 20s ease-in-out infinite' }}
      >
        <path
          d="M0 100 Q 480 40 960 100 T 1920 100"
          fill="none"
          stroke="rgba(144, 81, 244, 0.8)"
          strokeWidth="1.5"
        />
        <path
          d="M0 120 Q 480 160 960 120 T 1920 120"
          fill="none"
          stroke="rgba(144, 81, 244, 0.4)"
          strokeWidth="1"
        />
      </svg>

      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, 20px); }
          50% { transform: translate(-10px, 40px); }
          75% { transform: translate(20px, -10px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-25px, -15px); }
          50% { transform: translate(15px, -30px); }
          75% { transform: translate(-20px, 10px); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -25px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        @keyframes waveDrift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }
      `}</style>
    </div>
  )
}
