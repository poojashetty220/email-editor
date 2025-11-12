import React, { useState } from 'react';

const PaddingControl = ({ label = "Padding", value = "", onChange, placeholder = "20px" }) => {
  const [isDetailed, setIsDetailed] = useState(false);
  
  // Parse padding value into individual values
  const parsePadding = (paddingValue) => {
    if (!paddingValue) return { top: '', right: '', bottom: '', left: '' };
    
    const parts = paddingValue.trim().split(/\s+/);
    switch (parts.length) {
      case 1:
        return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
      case 2:
        return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
      case 3:
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
      case 4:
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
      default:
        return { top: '', right: '', bottom: '', left: '' };
    }
  };
  
  const padding = parsePadding(value);
  
  const handleDetailedChange = (side, val) => {
    const newPadding = { ...padding, [side]: val };
    const paddingString = `${newPadding.top || '0'} ${newPadding.right || '0'} ${newPadding.bottom || '0'} ${newPadding.left || '0'}`;
    onChange(paddingString.trim());
  };
  
  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label>{label}</label>
        <button
          type="button"
          onClick={() => setIsDetailed(!isDetailed)}
          style={{
            background: 'none',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          {isDetailed ? 'Simple' : 'Detailed'}
        </button>
      </div>
      
      {isDetailed ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Top</label>
            <input
              type="text"
              value={padding.top}
              onChange={(e) => handleDetailedChange('top', e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: '6px', fontSize: '12px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Right</label>
            <input
              type="text"
              value={padding.right}
              onChange={(e) => handleDetailedChange('right', e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: '6px', fontSize: '12px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Bottom</label>
            <input
              type="text"
              value={padding.bottom}
              onChange={(e) => handleDetailedChange('bottom', e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: '6px', fontSize: '12px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Left</label>
            <input
              type="text"
              value={padding.left}
              onChange={(e) => handleDetailedChange('left', e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: '6px', fontSize: '12px' }}
            />
          </div>
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default PaddingControl;