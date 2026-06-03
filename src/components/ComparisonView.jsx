import { useState, useEffect, useRef, useCallback } from 'react';
import Pseudocode from './Pseudocode';

export default function ComparisonView({ algorithms, pseudocode, bigO, generateData, generateSteps, drawFn, algoKeys }) {
  const canvasARef = useRef(null);
  const canvasBRef = useRef(null);
  const timerRef = useRef(null);

  const keys = algoKeys || Object.keys(algorithms);
  const [algoA, setAlgoA] = useState(keys[0]);
  const [algoB, setAlgoB] = useState(keys[1] || keys[0]);
  const [data, setData] = useState(() => generateData());
  const [stepsA, setStepsA] = useState([]);
  const [stepsB, setStepsB] = useState([]);
  const [stepA, setStepA] = useState(0);
  const [stepB, setStepB] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visualStyle, setVisualStyle] = useState('dots');
  const doneRef = useRef(false);

  const genStepsFor = useCallback((name) => generateSteps(name, data), [data, generateSteps]);

  useEffect(() => {
    setStepsA(genStepsFor(algoA));
    setStepsB(genStepsFor(algoB));
    setStepA(0);
    setStepB(0);
    setIsPlaying(false);
  }, [algoA, algoB, genStepsFor]);

  useEffect(() => {
    const drawOne = (ref, steps, idx) => {
      const canvas = ref.current;
      if (!canvas || steps.length === 0) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawFn(ctx, rect.width, rect.height, steps[idx], visualStyle);
    };
    drawOne(canvasARef, stepsA, stepA);
    drawOne(canvasBRef, stepsB, stepB);
  }, [stepsA, stepsB, stepA, stepB, drawFn, visualStyle]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepA >= stepsA.length - 1 && stepB >= stepsB.length - 1) {
      setIsPlaying(false);
      return;
    }
    const delay = Math.max(10, 500 - speed * 4.5);
    timerRef.current = setTimeout(() => {
      setStepA(s => Math.min(s + 1, stepsA.length - 1));
      setStepB(s => Math.min(s + 1, stepsB.length - 1));
    }, delay);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepA, stepB, speed, stepsA.length, stepsB.length]);

  const handlePlayPause = () => {
    if (stepA >= stepsA.length - 1 && stepB >= stepsB.length - 1) {
      setStepA(0);
      setStepB(0);
    }
    setIsPlaying(p => !p);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepA(0);
    setStepB(0);
  };

  const handleNewData = () => {
    const d = generateData();
    setData(d);
  };

  return (
    <div className="visualizer compare-view">
      <div className="controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? '⏸ Pause' : (stepA >= stepsA.length - 1 && stepB >= stepsB.length - 1) ? '↺ Restart' : '▶ Play'}
        </button>
        <button onClick={handleReset}>⏹ Reset</button>
        <button onClick={handleNewData}>🎲 New Data</button>
        <div className="speed-control">
          <label>Speed:</label>
          <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
        <div className="style-toggle">
          <button className={`style-btn ${visualStyle === 'dots' ? 'active' : ''}`} onClick={() => setVisualStyle('dots')}>● Dots</button>
          <button className={`style-btn ${visualStyle === 'bars' ? 'active' : ''}`} onClick={() => setVisualStyle('bars')}>▬ Bars</button>
        </div>
        <span className="step-info">
          {Math.min(stepA + 1, stepsA.length)}/{stepsA.length} & {Math.min(stepB + 1, stepsB.length)}/{stepsB.length}
        </span>
      </div>
      <div className="compare-columns">
        <div className="compare-col">
          <div className="compare-header">
            <select value={algoA} onChange={e => setAlgoA(e.target.value)}>
              {keys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <canvas ref={canvasARef} className="canvas compare-canvas" />
          <Pseudocode lines={pseudocode[algoA]} currentLine={stepsA[stepA]?.codeLine ?? 0} bigO={bigO?.[algoA]} />
        </div>
        <div className="compare-col">
          <div className="compare-header">
            <select value={algoB} onChange={e => setAlgoB(e.target.value)}>
              {keys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <canvas ref={canvasBRef} className="canvas compare-canvas" />
          <Pseudocode lines={pseudocode[algoB]} currentLine={stepsB[stepB]?.codeLine ?? 0} bigO={bigO?.[algoB]} />
        </div>
      </div>
    </div>
  );
}
