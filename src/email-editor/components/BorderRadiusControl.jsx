import React, { useState } from 'react';

const BorderRadiusControl = ({ value = "", onChange }) => {
  const [isDetailed, setIsDetailed] = useState(false);
  
  const parseBorderRadius = (radiusValue) => {
    if (!radiusValue) return { topLeft: '', topRight: '', bottomRight: '', bottomLeft: '' };
    
    // Remove px and parse
    const cleanValue = radiusValue.replace(/px/g, '').trim();
    const parts = cleanValue.split(/\s+/).filter(p => p);
    
    switch (parts.length) {
      case 1:
        return { topLeft: parts[0], topRight: parts[0], bottomRight: parts[0], bottomLeft: parts[0] };
      case 2:
        return { topLeft: parts[0], topRight: parts[1], bottomRight: parts[0], bottomLeft: parts[1] };
      case 3:
        return { topLeft: parts[0], topRight: parts[1], bottomRight: parts[2], bottomLeft: parts[1] };
      case 4:
        return { topLeft: parts[0], topRight: parts[1], bottomRight: parts[2], bottomLeft: parts[3] };
      default:
        return { topLeft: '', topRight: '', bottomRight: '', bottomLeft: '' };
    }
  };
  
  const radius = parseBorderRadius(value);
  
  const handleDetailedChange = (corner, val) => {
    // Only allow numbers and empty string
    if (val === '' || /^\d*$/.test(val)) {
      const newRadius = { ...radius, [corner]: val };
      if (newRadius.topLeft === '' && newRadius.topRight === '' && newRadius.bottomRight === '' && newRadius.bottomLeft === '') {
        onChange('');
      } else {
        const radiusString = `${newRadius.topLeft || '0'}px ${newRadius.topRight || '0'}px ${newRadius.bottomRight || '0'}px ${newRadius.bottomLeft || '0'}px`;
        onChange(radiusString.trim());
      }
    }
  };
  
  const handleSimpleChange = (val) => {
    // Only allow numbers and empty string
    if (val === '' || /^\d*$/.test(val)) {
      onChange(val ? `${val}px` : '');
    }
  };
  
  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label>Border Radius</label>
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
            <label style={{ fontSize: '11px', color: '#666' }}>Top Left</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={radius.topLeft}
                onChange={(e) => handleDetailedChange('topLeft', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Top Right</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={radius.topRight}
                onChange={(e) => handleDetailedChange('topRight', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Bottom Left</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={radius.bottomLeft}
                onChange={(e) => handleDetailedChange('bottomLeft', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Bottom Right</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={radius.bottomRight}
                onChange={(e) => handleDetailedChange('bottomRight', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleSimpleChange(e.target.value)}
            placeholder="0"
            style={{ flex: 1 }}
          />
          <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>px</span>
        </div>
      )}
    </div>
  );
};

export default BorderRadiusControl;