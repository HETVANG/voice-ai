import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  activeSpeaker: 'scammer' | 'citizen' | 'shield_ai' | null;
  riskScore: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  activeSpeaker,
  riskScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Center baseline
      const midY = height / 2;

      // Draw subtle background grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      const numBars = 54;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);

        // Amplitude computation based on speaker and play state
        let amplitude = 4;
        if (isPlaying) {
          const sinFactor = Math.sin((i * 0.25) + phase);
          const cosFactor = Math.cos((i * 0.15) - (phase * 1.2));
          const noise = (Math.random() - 0.5) * 6;

          if (activeSpeaker === 'scammer') {
            amplitude = Math.abs(sinFactor * 22) + Math.abs(cosFactor * 12) + noise + 8;
            if (riskScore > 70) amplitude *= 1.35;
          } else if (activeSpeaker === 'citizen') {
            amplitude = Math.abs(cosFactor * 16) + Math.abs(sinFactor * 8) + noise + 4;
          } else if (activeSpeaker === 'shield_ai') {
            amplitude = Math.abs(sinFactor * 28) + 12;
          } else {
            amplitude = 6 + (Math.sin(i * 0.4 + phase) * 4);
          }
        }

        const barHeight = Math.min(height - 8, Math.max(3, amplitude));
        const yTop = midY - (barHeight / 2);

        // Color determination
        if (activeSpeaker === 'shield_ai') {
          ctx.fillStyle = '#10B981'; // Emerald AI Whisper
        } else if (activeSpeaker === 'scammer') {
          ctx.fillStyle = riskScore > 75 ? '#EF4444' : riskScore > 45 ? '#F59E0B' : '#64748B';
        } else if (activeSpeaker === 'citizen') {
          ctx.fillStyle = '#38BDF8'; // Cyan
        } else {
          ctx.fillStyle = '#334155'; // Idle Slate
        }

        ctx.fillRect(x, yTop, barWidth, barHeight);
      }

      phase += 0.08;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeSpeaker, riskScore]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-300">Live Dual-Stream Telemetry</span>
          <span className="text-slate-500">·</span>
          <span>Sample Rate: 16 kHz G.711</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            Inbound Caller (CLI)
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
            Target Citizen
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Shield Whisper Channel
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={64}
        className="w-full h-16 rounded bg-slate-950/70"
      />
    </div>
  );
};
