
import React from 'react';
import { EvaluationMetrics } from '../types';

interface EvaluationMetricsDisplayProps {
  metrics: EvaluationMetrics;
}

const getMetricStyle = (s: number) => {
    if (s >= 8) return { color: '#22d3ee', label: 'Excellent' }; // cyan-400
    if (s >= 6) return { color: '#facc15', label: 'Good' };      // yellow-400
    if (s >= 4) return { color: '#fb923c', label: 'Fair' };      // orange-400
    return { color: '#f87171', label: 'Needs Improvement' };     // red-400
};

const RadialMetric: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const sqSize = 120;
  const strokeWidth = 10;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const circumference = 2 * Math.PI * radius;
  const scorePercentage = Math.max(0, Math.min(100, (score || 0) * 10));
  const dashOffset = circumference * (1 - scorePercentage / 100);

  const style = getMetricStyle(score || 0);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className="stroke-slate-700"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          fill="none"
        />
        <circle
          className="transition-all duration-1000 ease-out"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          stroke={style.color}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
        <text
          className="font-bold text-2xl"
          fill={style.color}
          x="50%"
          y="50%"
          dy=".1em"
          textAnchor="middle">
          {score?.toFixed(1) || 'N/A'}
        </text>
        <text
          className="text-xs font-medium text-slate-400"
          x="50%"
          y="50%"
          dy="1.6em"
          textAnchor="middle">
          {style.label}
        </text>
      </svg>
      <p className="text-slate-300 text-sm font-medium mt-2">{label}</p>
    </div>
  );
};

const BarChart: React.FC<{ metrics: EvaluationMetrics }> = ({ metrics }) => {
    const data = [
        { label: "Fluency", value: metrics.fluency },
        { label: "Accuracy", value: metrics.accuracy },
        { label: "Grammar", value: metrics.grammar_correctness },
        { label: "Tone", value: metrics.tone_appropriateness },
    ];
    const maxValue = 10;
    const chartHeight = 150;

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Metric Comparison</h3>
            <div className="flex justify-around items-end h-[200px] bg-slate-900/50 p-4 rounded-lg">
                {data.map(item => {
                    const barHeight = (item.value / maxValue) * chartHeight;
                    const style = getMetricStyle(item.value);
                    return (
                        <div key={item.label} className="flex flex-col items-center w-1/4">
                            <div
                                className="w-10 rounded-t-md transition-all duration-1000 ease-out"
                                style={{
                                    height: `${barHeight}px`,
                                    backgroundColor: style.color,
                                    animation: `grow 1s ease-out forwards`
                                }}
                            ></div>
                            <p className="text-xs text-slate-400 mt-2 text-center">{item.label}</p>
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes grow {
                    0% { transform: scaleY(0); transform-origin: bottom; }
                    100% { transform: scaleY(1); transform-origin: bottom; }
                }
            `}</style>
        </div>
    );
};

const RadarChart: React.FC<{ metrics: EvaluationMetrics }> = ({ metrics }) => {
    const size = 250;
    const center = size / 2;
    const radius = size * 0.4;
    const data = [
        metrics.fluency,
        metrics.accuracy,
        metrics.grammar_correctness,
        metrics.tone_appropriateness
    ];
    const labels = ["Fluency", "Accuracy", "Grammar", "Tone"];
    const angleSlice = (Math.PI * 2) / data.length;

    const getPoint = (value: number, index: number) => {
        const angle = angleSlice * index - Math.PI / 2;
        const x = center + (radius * value / 10) * Math.cos(angle);
        const y = center + (radius * value / 10) * Math.sin(angle);
        return `${x},${y}`;
    };

    const points = data.map(getPoint).join(' ');

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Quality Profile</h3>
            <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto">
                {/* Grid lines */}
                {[...Array(5)].map((_, i) => (
                    <polygon
                        key={i}
                        points={[...Array(data.length)].map((_, j) => getPoint(10 - i * 2, j)).join(' ')}
                        fill="none"
                        stroke="rgba(100, 116, 139, 0.3)"
                    />
                ))}
                {/* Axes lines */}
                {[...Array(data.length)].map((_, i) => (
                     <line key={i} x1={center} y1={center} x2={parseFloat(getPoint(10, i).split(',')[0])} y2={parseFloat(getPoint(10, i).split(',')[1])} stroke="rgba(100, 116, 139, 0.3)" />
                ))}
                {/* Data polygon */}
                <polygon
                    points={points}
                    fill="rgba(34, 211, 238, 0.4)"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    style={{
                        animation: `radiate 1s ease-out forwards`,
                        transformOrigin: `${center}px ${center}px`
                    }}
                />
                 {/* Labels */}
                {labels.map((label, i) => {
                    const angle = angleSlice * i - Math.PI / 2;
                    const x = center + (radius * 1.2) * Math.cos(angle);
                    const y = center + (radius * 1.2) * Math.sin(angle);
                    return <text key={label} x={x} y={y} fill="#94a3b8" fontSize="12" textAnchor="middle" dy="0.3em">{label}</text>
                })}
            </svg>
            <style>{`
                @keyframes radiate {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

const EvaluationMetricsDisplay: React.FC<EvaluationMetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-lg animate-fade-in h-full">
      <h2 className="text-xl font-bold text-cyan-400 mb-6 text-center">Translation Evaluation</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RadialMetric label="Fluency" score={metrics.fluency} />
        <RadialMetric label="Accuracy" score={metrics.accuracy} />
        <RadialMetric label="Grammar" score={metrics.grammar_correctness} />
        <RadialMetric label="Tone" score={metrics.tone_appropriateness} />
      </div>
      
      <hr className="border-slate-700 my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <BarChart metrics={metrics} />
        <RadarChart metrics={metrics} />
      </div>
    </div>
  );
};

export default EvaluationMetricsDisplay;
