export function VersionHistory({ versions, currentIndex, onSwitch }) {
  if (!versions || versions.length === 0) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="version-history">
      <div className="version-history-title">
        🕐 历史版本（最近5条）
      </div>
      <div className="version-list">
        {versions.map((version, index) => (
          <button
            key={version.id || index}
            className={`version-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onSwitch(index)}
          >
            <span className="version-number">
              {index === currentIndex ? '●' : '○'}
            </span>
            <span className="version-time">
              {formatTime(version.timestamp)}
            </span>
            <span className="version-label">
              {index === versions.length - 1 ? '最新' : `版本 ${index + 1}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default VersionHistory;