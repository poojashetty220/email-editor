import React, { useState, useCallback } from 'react';

const ColumnResizeHandle = ({ direction = 'horizontal', onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [lastPos, setLastPos] = useState(0);
  const isVertical = direction === 'vertical';

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const pos = isVertical ? e.clientY : e.clientX;
    setStartPos(pos);
    setLastPos(pos);
  }, [isVertical]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const currentPos = isVertical ? e.clientY : e.clientX;
    const delta = currentPos - lastPos;
    if (Math.abs(delta) > 5) {
      // Use same sensitivity for both directions
      const adjustedDelta = isVertical ? delta * 0.5 : delta * 0.2;
      onResize(adjustedDelta);
      setLastPos(currentPos);
    }
  }, [isResizing, lastPos, onResize, isVertical]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const getBackgroundColor = () => {
    if (isResizing) return '#1890ff';
    if (isHovered) return 'rgba(24, 144, 255, 0.6)';
    return isVertical ? 'rgba(24, 144, 255, 0.2)' : 'transparent';
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        ...(isVertical ? {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          height: '100%',
          cursor: 'ns-resize',
          borderRadius: '2px'
        } : {
          right: '-2px',
          top: '0',
          bottom: '0',
          width: '4px',
          cursor: 'ew-resize',
          borderRadius: '2px'
        }),
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.2s ease',
        zIndex: 10,
        opacity: 1
      }}
    >
      {isVertical && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '2px',
          backgroundColor: isHovered || isResizing ? '#fff' : 'rgba(24, 144, 255, 0.8)',
          borderRadius: '1px',
          transition: 'background-color 0.2s ease'
        }} />
      )}
      {!isVertical && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '20px',
          backgroundColor: isHovered || isResizing ? '#1890ff' : 'rgba(24, 144, 255, 0.6)',
          borderRadius: '1px',
          transition: 'background-color 0.2s ease'
        }} />
      )}
    </div>
  );
};

export default ColumnResizeHandle;