export default function Pseudocode({ lines, currentLine, bigO }) {
  if (!lines || lines.length === 0) return null;
  const line = Math.min(Math.max(0, currentLine || 0), lines.length - 1);

  return (
    <div className="pseudocode">
      {bigO && (
        <div className="bigo-info">
          <span>Time: <strong>{bigO.time}</strong></span>
          <span>Space: <strong>{bigO.space}</strong></span>
        </div>
      )}
      {lines.map((text, i) => (
        <div key={i} className={`code-line ${i === line ? 'active' : ''}`}>
          <span className="line-num">{String(i).padStart(2, ' ')}</span>
          <span className="line-text">{text}</span>
        </div>
      ))}
    </div>
  );
}
