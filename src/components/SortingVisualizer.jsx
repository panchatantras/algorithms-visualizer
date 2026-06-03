import { useState, useEffect, useRef, useCallback } from 'react';
import { sortingAlgorithms, sortingPseudocode, sortingBigO, generateRandomArray } from '../algorithms/sorting';
import Pseudocode from './Pseudocode';

const ARRAY_SIZE = 30;

export default function SortingVisualizer({ compareMode }) {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const [algorithmName, setAlgorithmName] = useState('Bubble Sort');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visualStyle, setVisualStyle] = useState('dots');
  const [array, setArray] = useState(() => generateRandomArray(ARRAY_SIZE));

  const generateSteps = useCallback((algoName, arr) => {
    const genFn = sortingAlgorithms[algoName];
    const s = genFn(arr);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    generateSteps(algorithmName, array);
  }, [algorithmName, array, generateSteps]);

  const resetArray = () => {
    const newArr = generateRandomArray(ARRAY_SIZE);
    setArray(newArr);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawSorting(ctx, rect.width, rect.height, steps[currentStep], visualStyle);
  }, [steps, currentStep, visualStyle]);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return;
    const delay = Math.max(10, 500 - speed * 4.5);
    timerRef.current = setTimeout(() => {
      setCurrentStep(c => c + 1);
    }, delay);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, speed, steps.length]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsPlaying(p => !p);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentCodeLine = steps[currentStep]?.codeLine ?? 0;

  return (
    <div className="visualizer">
      <div className="controls">
        <select value={algorithmName} onChange={e => setAlgorithmName(e.target.value)}>
          {Object.keys(sortingAlgorithms).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {!compareMode && (
          <>
            <button onClick={handlePlayPause}>
              {isPlaying ? '⏸ Pause' : currentStep >= steps.length - 1 ? '↺ Restart' : '▶ Play'}
            </button>
            <button onClick={handleReset}>⏹ Reset</button>
            <button onClick={resetArray}>🎲 New Array</button>
            <div className="speed-control">
              <label>Speed:</label>
              <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
            </div>
            <div className="style-toggle">
              <button className={`style-btn ${visualStyle === 'dots' ? 'active' : ''}`} onClick={() => setVisualStyle('dots')}>● Dots</button>
              <button className={`style-btn ${visualStyle === 'bars' ? 'active' : ''}`} onClick={() => setVisualStyle('bars')}>▬ Bars</button>
            </div>
          </>
        )}
        <span className="step-info">Step {Math.min(currentStep + 1, steps.length)} / {steps.length}</span>
      </div>
      <div className="viz-body">
        <canvas ref={canvasRef} className="canvas" />
        <Pseudocode lines={sortingPseudocode[algorithmName]} currentLine={currentCodeLine} bigO={sortingBigO[algorithmName]} />
      </div>
    </div>
  );
}

export function drawSorting(ctx, w, h, step, style = 'dots') {
  ctx.clearRect(0, 0, w, h);
  const { array, comparing, sorted } = step;
  const n = array.length;
  if (n === 0) return;
  const maxVal = Math.max(...array);
  const pad = { top: 20, right: 20, bottom: 20, left: 20 };
  const dw = w - pad.left - pad.right;
  const dh = h - pad.top - pad.bottom;

  const color = (i) => {
    if (sorted.includes(i)) return '#4CAF50';
    if (comparing.includes(i)) return '#FF5722';
    return '#64B5F6';
  };

  array.forEach((val, i) => {
    if (style === 'bars') {
      const barW = Math.max(2, dw / n - 1);
      const barH = (val / maxVal) * dh;
      const x = pad.left + (i / n) * dw;
      const y = pad.top + dh - barH;
      ctx.fillStyle = color(i);
      ctx.fillRect(x, y, barW, barH);
    } else {
      const x = pad.left + (i / (n - 1)) * dw;
      const y = pad.top + dh - (val / maxVal) * dh;
      const r = Math.max(3, Math.min(7, dw / (n * 2)));
      ctx.fillStyle = color(i);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
