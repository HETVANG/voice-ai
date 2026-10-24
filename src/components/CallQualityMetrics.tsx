import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Signal, AlertCircle, RefreshCw } from 'lucide-react';

interface CallQualityMetricsProps {
  isPlaying: boolean;
  isCallSevered: boolean;
  callerCarrier?: string;
}

export const CallQualityMetrics: React.FC<CallQualityMetricsProps> = ({
  isPlaying,
  isCallSevered,
  callerCarrier = 'SIP Virtual Trunk'
}) => {
  // Real-time telecom QoS telemetry state
  const [latencyMs, setLatencyMs] = useState(48);
  const [jitterMs, setJitterMs] = useState(3.2);
  const [packetLossPercent, setPacketLossPercent] = useState(0.12);
  const [mosScore, setMosScore] = useState(4.35); // Mean Opinion Score (1.0 to 5.0)
  const [packetsReceived, setPacketsReceived] = useState(1420);
  const [bitrateKbps, setBitrateKbps] = useState(64.2);

  // Dynamic fluctuation during live call streaming
  useEffect(() => {
    if (isCallSevered) {
      setLatencyMs(0);
      setJitterMs(0);
      setPacketLossPercent(100);
      setMosScore(1.0);
      setBitrateKbps(0);
      return;
    }

    if (!isPlaying) {
      // Idle state
      setLatencyMs(42);
      setJitterMs(2.8);
      setPacketLossPercent(0.08);
      setMosScore(4.4);
      setBitrateKbps(64.0);
      return;
    }

    const interval = setInterval(() => {
      // Realistic RTP jitter & latency delta
      setLatencyMs((prev) => {
        const delta = (Math.random() - 0.48) * 8;
        return Math.max(32, Math.min(180, Math.round(prev + delta)));
      });

      setJitterMs((prev) => {
        const delta = (Math.random() - 0.49) * 0.8;
        return Math.max(1.5, Math.min(18.5, parseFloat((prev + delta).toFixed(1))));
      });

      setPacketLossPercent((prev) => {
        const delta = (Math.random() - 0.52) * 0.05;
        return Math.max(0.02, Math.min(2.8, parseFloat((prev + delta).toFixed(2))));
      });

      setPacketsReceived((prev) => prev + Math.floor(18 + Math.random() * 8));

      setBitrateKbps((prev) => {
        const delta = (Math.random() - 0.5) * 1.2;
        return parseFloat((64 + delta).toFixed(1));
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, isCallSevered]);

  // Derive MOS score based on latency & loss
  useEffect(() => {
    if (isCallSevered) return;
    const computed = 4.5 - (latencyMs / 300) - (packetLossPercent * 0.4) - (jitterMs / 40);
    setMosScore(Math.max(2.1, Math.min(4.5, parseFloat(computed.toFixed(2)))));
  }, [latencyMs, packetLossPercent, jitterMs, isCallSevered]);

  const getHealthStatus = () => {
    if (isCallSevered) {
      return { text: 'Disconnected', color: 'text-rose-400', level: 'offline' };
    }
    if (packetLossPercent > 1.5 || latencyMs > 140) {
      return { text: 'Degraded Trunk', color: 'text-amber-400', level: 'warn' };
    }
    return { text: 'Optimal QoS', color: 'text-emerald-400', level: 'good' };
  };

  const health = getHealthStatus();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Call Quality & RTP Telecom QoS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-medium ${health.color}`}>
            {health.text}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] font-mono text-slate-400">
            Codec: G.711u / 20ms ptime
          </span>
        </div>
      </div>

      {/* Primary 3-Metric Strip: Latency, Jitter, Packet Loss */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Latency */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Round-Trip Latency</span>
            <Signal className="w-3 h-3 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {isCallSevered ? '—' : latencyMs}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {latencyMs < 60 ? 'Bypass route: Low delay' : 'Inter-circle route: Moderate'}
          </div>
        </div>

        {/* Jitter */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Buffer Jitter</span>
            <Wifi className="w-3 h-3 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {isCallSevered ? '—' : jitterMs}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Variance: ±0.4ms window
          </div>
        </div>

        {/* Packet Loss */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>RTP Packet Loss</span>
            <AlertCircle className="w-3 h-3 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-lg font-bold font-mono tabular-nums ${
                packetLossPercent > 1.0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {isCallSevered ? '100' : packetLossPercent}
            </span>
            <span className="text-xs font-mono text-slate-400">%</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {packetLossPercent < 0.5 ? 'Zero audible clipping' : 'Minor packet concealment'}
          </div>
        </div>
      </div>

      {/* Secondary Telecom Stream Specs */}
      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-400">VoIP Trunk:</span>
          <span className="font-mono text-slate-200 truncate max-w-[110px]" title={callerCarrier}>
            {callerCarrier}
          </span>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-400">Bitrate:</span>
          <span className="font-mono text-slate-200 tabular-nums">
            {isCallSevered ? '0' : bitrateKbps} kbps
          </span>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-400">MOS Score:</span>
          <span
            className={`font-mono font-semibold tabular-nums ${
              mosScore >= 4.0 ? 'text-emerald-400' : mosScore >= 3.0 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {isCallSevered ? '1.0' : mosScore} / 5.0
          </span>
        </div>
      </div>
    </div>
  );
};
