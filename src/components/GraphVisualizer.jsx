import { useState, useEffect, useRef, useCallback } from 'react';
import { graphAlgorithms, graphPseudocode, graphBigO, edges, nodePositions, weightedEdges, dag, dagEdges, dagNodePositions } from '../algorithms/graph';
import Pseudocode from './Pseudocode';

export default function GraphVisualizer({ compareMode }) {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const [algorithmName, setAlgorithmName] = useState('BFS (Breadth-First Search)');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [startNode, setStartNode] = useState(0);

  const generateSteps = useCallback((algoName, start) => {
    const genFn = graphAlgorithms[algoName];
    const s = genFn(start);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    generateSteps(algorithmName, startNode);
  }, [algorithmName, startNode, generateSteps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const isDijkstra = steps[currentStep]?.dist !== undefined;
    const isTopSort = steps[currentStep]?.inDegree !== undefined;
    if (isDijkstra) {
      drawDijkstra(ctx, rect.width, rect.height, steps[currentStep]);
    } else if (isTopSort) {
      drawTopoSort(ctx, rect.width, rect.height, steps[currentStep]);
    } else {
      drawBfsDfs(ctx, rect.width, rect.height, steps[currentStep]);
    }
  }, [steps, currentStep]);

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
  const isTopAlgo = algorithmName === 'Topological Sort';

  return (
    <div className="visualizer">
      <div className="controls">
        <select value={algorithmName} onChange={e => setAlgorithmName(e.target.value)}>
          {Object.keys(graphAlgorithms).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {!isTopAlgo && (
          <select value={startNode} onChange={e => setStartNode(Number(e.target.value))}>
            {Object.keys(nodePositions).map(id => (
              <option key={id} value={id}>Start: Node {id}</option>
            ))}
          </select>
        )}
        {!compareMode && (
          <>
            <button onClick={handlePlayPause}>
              {isPlaying ? '⏸ Pause' : currentStep >= steps.length - 1 ? '↺ Restart' : '▶ Play'}
            </button>
            <button onClick={handleReset}>⏹ Reset</button>
            <div className="speed-control">
              <label>Speed:</label>
              <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
            </div>
          </>
        )}
        <span className="step-info">Step {Math.min(currentStep + 1, steps.length)} / {steps.length}</span>
      </div>
      <div className="viz-body">
        <canvas ref={canvasRef} className="canvas" />
        <Pseudocode lines={graphPseudocode[algorithmName]} currentLine={currentCodeLine} bigO={graphBigO[algorithmName]} />
      </div>
    </div>
  );
}

export function getTransform(positions, w, h) {
  const xs = Object.values(positions).map(p => p.x);
  const ys = Object.values(positions).map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const gW = maxX - minX || 1, gH = maxY - minY || 1;
  const pad = 50;
  const scale = Math.min((w - pad * 2) / gW, (h - pad * 2) / gH);
  const ox = (w - gW * scale) / 2 - minX * scale;
  const oy = (h - gH * scale) / 2 - minY * scale;
  return { tx: (p) => p.x * scale + ox, ty: (p) => p.y * scale + oy, scale };
}

export function drawBfsDfs(ctx, w, h, step) {
  ctx.clearRect(0, 0, w, h);
  const { visited, current, queue, stack } = step;
  const currentList = queue || stack || [];
  const isBFS = queue !== undefined;
  const { tx, ty, scale } = getTransform(nodePositions, w, h);

  edges.forEach(([from, to]) => {
    const f = nodePositions[from], t = nodePositions[to];
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx(f), ty(f));
    ctx.lineTo(tx(t), ty(t));
    ctx.stroke();
  });

  Object.entries(nodePositions).forEach(([id, pos]) => {
    const nid = Number(id);
    const cx = tx(pos), cy = ty(pos);
    const r = Math.max(10, Math.min(22, scale * 22));
    ctx.fillStyle = nid === current ? '#FF5722' : visited?.includes(nid) ? '#4CAF50' : currentList.includes(nid) ? '#FFC107' : '#37474F';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78909C';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(10, Math.min(14, scale * 14))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nid, cx, cy);
  });

  ctx.fillStyle = '#aaa';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const label = isBFS ? 'Queue' : 'Stack';
  ctx.fillText(`${label}: [${currentList.join(', ')}]`, 8, 8);
  if (visited) ctx.fillText(`Visited: [${visited.join(', ')}]`, 8, 24);
  if (current >= 0) ctx.fillText(`Current: ${current}`, 8, 40);
}

export function drawDijkstra(ctx, w, h, step) {
  ctx.clearRect(0, 0, w, h);
  const { visited, current, dist, queue } = step;
  const { tx, ty, scale } = getTransform(nodePositions, w, h);

  weightedEdges.forEach(([from, to, weight]) => {
    const f = nodePositions[from], t = nodePositions[to];
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx(f), ty(f));
    ctx.lineTo(tx(t), ty(t));
    ctx.stroke();
    const mx = (tx(f) + tx(t)) / 2, my = (ty(f) + ty(t)) / 2;
    ctx.fillStyle = '#888';
    ctx.font = `${Math.max(10, Math.min(12, scale * 12))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(weight, mx, my - 2);
  });

  Object.entries(nodePositions).forEach(([id, pos]) => {
    const nid = Number(id);
    const cx = tx(pos), cy = ty(pos);
    const r = Math.max(10, Math.min(22, scale * 22));
    const isVisited = visited?.includes(nid);
    ctx.fillStyle = nid === current ? '#FF5722' : isVisited ? '#4CAF50' : queue?.includes(nid) ? '#FFC107' : '#37474F';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78909C';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(10, Math.min(14, scale * 14))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nid, cx, cy);

    const d = dist?.[nid];
    if (d !== undefined && d !== Infinity) {
      ctx.fillStyle = '#58a6ff';
      ctx.font = `${Math.max(9, Math.min(11, scale * 11))}px monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText(`d=${d}`, cx, cy + r + 2);
    }
  });

  ctx.fillStyle = '#aaa';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  if (current >= 0) ctx.fillText(`Current: ${current}`, 8, 8);
  if (queue) ctx.fillText(`Unvisited: [${[...queue].join(', ')}]`, 8, 24);
}

export function drawTopoSort(ctx, w, h, step) {
  ctx.clearRect(0, 0, w, h);
  const { visited, current, queue, topOrder, inDegree } = step;
  const { tx, ty, scale } = getTransform(dagNodePositions, w, h);

  dagEdges.forEach(([from, to]) => {
    const f = dagNodePositions[from], t = dagNodePositions[to];
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx(f), ty(f));
    ctx.lineTo(tx(t), ty(t));
    ctx.stroke();
  });

  Object.entries(dagNodePositions).forEach(([id, pos]) => {
    const nid = Number(id);
    const cx = tx(pos), cy = ty(pos);
    const r = Math.max(10, Math.min(22, scale * 22));
    const isVisited = visited?.includes(nid);
    ctx.fillStyle = nid === current ? '#FF5722' : isVisited ? '#4CAF50' : queue?.includes(nid) ? '#FFC107' : '#37474F';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78909C';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(10, Math.min(14, scale * 14))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nid, cx, cy);

    if (inDegree !== undefined) {
      ctx.fillStyle = '#ffa657';
      ctx.font = `${Math.max(9, Math.min(11, scale * 11))}px monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText(`in=${inDegree[nid]}`, cx, cy + r + 2);
    }
  });

  ctx.fillStyle = '#aaa';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  if (queue) ctx.fillText(`Queue: [${queue.join(', ')}]`, 8, 8);
  if (topOrder) ctx.fillText(`TopOrder: [${topOrder.join(', ')}]`, 8, 24);
  if (current >= 0) ctx.fillText(`Current: ${current}`, 8, 40);
}
