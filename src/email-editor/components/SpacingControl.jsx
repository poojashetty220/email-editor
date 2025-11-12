import React, { useState } from 'react';

const SpacingControl = ({ label = "Padding", value = "", onChange, placeholder = "0" }) => {
  const [isDetailed, setIsDetailed] = useState(false);
  
  const parseSpacing = (spacingValue) => {
    if (!spacingValue) return { top: '', right: '', bottom: '', left: '' };
    
    // Remove px and parse
    const cleanValue = spacingValue.replace(/px/g, '').trim();
    const parts = cleanValue.split(/\s+/);
    
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
  
  const spacing = parseSpacing(value);
  
  const handleDetailedChange = (side, val) => {
    // Only allow numbers and empty string
    if (val === '' || /^\d*$/.test(val)) {
      const newSpacing = { ...spacing, [side]: val };
      if (newSpacing.top === '' && newSpacing.right === '' && newSpacing.bottom === '' && newSpacing.left === '') {
        onChange('');
      } else {
        const spacingString = `${newSpacing.top || '0'} ${newSpacing.right || '0'} ${newSpacing.bottom || '0'} ${newSpacing.left || '0'}`;
        onChange(spacingString.trim());
      }
    }
  };
  
  const handleSimpleChange = (val) => {
    // Only allow numbers and empty string
    if (val === '' || /^\d*$/.test(val)) {
      onChange(val);
    }
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={spacing.top}
                onChange={(e) => handleDetailedChange('top', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Right</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={spacing.right}
                onChange={(e) => handleDetailedChange('right', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Bottom</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={spacing.bottom}
                onChange={(e) => handleDetailedChange('bottom', e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>px</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#666' }}>Left</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={spacing.left}
                onChange={(e) => handleDetailedChange('left', e.target.value)}
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
            placeholder={placeholder}
            style={{ flex: 1 }}
          />
          <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>px</span>
        </div>
      )}
    </div>
  );
};

export const PaddingControl = (props) => <SpacingControl {...props} label="Padding" />;
export const MarginControl = (props) => <SpacingControl {...props} label="Margin" />;
export default SpacingControl;