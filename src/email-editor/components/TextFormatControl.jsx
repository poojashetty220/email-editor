import React from 'react';

const TextFormatControl = ({ attributes, onChange }) => {
  const handleFormatChange = (key, value) => {
    onChange(key, value);
  };

  return (
    <div className="form-group">
      <label>Text Format</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => handleFormatChange('font-weight', attributes['font-weight'] === 'bold' ? 'normal' : 'bold')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            background: attributes['font-weight'] === 'bold' ? '#1890ff' : 'white',
            color: attributes['font-weight'] === 'bold' ? 'white' : '#333',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleFormatChange('font-style', attributes['font-style'] === 'italic' ? 'normal' : 'italic')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            background: attributes['font-style'] === 'italic' ? '#1890ff' : 'white',
            color: attributes['font-style'] === 'italic' ? 'white' : '#333',
            fontStyle: 'italic',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleFormatChange('text-decoration', attributes['text-decoration'] === 'underline' ? 'none' : 'underline')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            background: attributes['text-decoration'] === 'underline' ? '#1890ff' : 'white',
            color: attributes['text-decoration'] === 'underline' ? 'white' : '#333',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          U
        </button>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Font Family</label>
          <select
            value={attributes['font-family'] || 'Arial, sans-serif'}
            onChange={(e) => handleFormatChange('font-family', e.target.value)}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
          </select>
        </div>
        <div className="form-group">
          <label>Font Weight</label>
          <select
            value={attributes['font-weight'] || 'normal'}
            onChange={(e) => handleFormatChange('font-weight', e.target.value)}
          >
            <option value="100">Thin</option>
            <option value="200">Extra Light</option>
            <option value="300">Light</option>
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="bold">Bold</option>
            <option value="800">Extra Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextFormatControl;