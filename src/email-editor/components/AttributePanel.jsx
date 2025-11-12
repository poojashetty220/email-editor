import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBlock, updateBodyAttributes, clearCanvas } from '../store/emailSlice.js';
import { PaddingControl, MarginControl } from './SpacingControl.jsx';
import TextFormatControl from './TextFormatControl.jsx';
import BorderRadiusControl from './BorderRadiusControl.jsx';
import './AttributePanel.css';

const AttributePanel = () => {
  const dispatch = useDispatch();
  const selectedBlockId = useSelector(state => state.email?.selectedBlockId);
  const emailContent = useSelector(state => state.email?.email?.content);

  // Find selected block with proper recursive search
  const selectedBlock = selectedBlockId ? findBlockById(emailContent, selectedBlockId) : null;

  function findBlockById(container, targetId) {
    if (!container) return null;
    
    // Check current block
    const currentId = container.id || `${container.type}-0`;
    if (currentId === targetId) return container;
    
    // Search in children
    if (container.children) {
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];
        const childId = child.id || `${child.type}-${i}`;
        
        if (childId === targetId) return child;
        
        const found = findBlockById(child, targetId);
        if (found) return found;
      }
    }
    
    return null;
  }

  const handleAttributeChange = (key, value) => {
    if (!selectedBlockId || !selectedBlock) return;
    
    console.log('Updating attribute:', key, 'with value:', value);
    dispatch(updateBlock({
      blockId: selectedBlockId,
      updates: {
        attributes: {
          ...selectedBlock.attributes,
          [key]: value
        }
      }
    }));
  };

  const handleDataChange = (key, value) => {
    if (!selectedBlockId || !selectedBlock) return;
    
    console.log('Updating data:', key, 'with value:', value);
    dispatch(updateBlock({
      blockId: selectedBlockId,
      updates: {
        data: {
          ...selectedBlock.data,
          value: {
            ...selectedBlock.data?.value,
            [key]: value
          }
        }
      }
    }));
  };

  console.log('Selected block ID:', selectedBlockId);
  console.log('Selected block:', selectedBlock);
  console.log('Email content:', emailContent);

  const handleBodyAttributeChange = (key, value) => {
    dispatch(updateBodyAttributes({
      attributes: {
        [key]: value
      }
    }));
  };

  const handleClearCanvas = () => {
    if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
      dispatch(clearCanvas());
    }
  };

  if (!selectedBlock) {
    const bodyAttributes = emailContent?.attributes || {};
    
    return (
      <div className="attribute-panel">
        <div className="attribute-panel-header">
          <h3>Body Configuration</h3>
          <p>Email canvas settings</p>
        </div>
        <div className="attribute-panel-content">
          <div className="form-group">
            <label>Background Color</label>
            <input
              type="color"
              value={bodyAttributes['background-color'] || '#ffffff'}
              onChange={(e) => handleBodyAttributeChange('background-color', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Text Color</label>
            <input
              type="color"
              value={bodyAttributes.color || '#000000'}
              onChange={(e) => handleBodyAttributeChange('color', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Font Family</label>
            <select
              value={bodyAttributes['font-family'] || 'Arial, sans-serif'}
              onChange={(e) => handleBodyAttributeChange('font-family', e.target.value)}
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
            <label>Font Size</label>
            <input
              type="text"
              value={bodyAttributes['font-size'] || '14px'}
              onChange={(e) => handleBodyAttributeChange('font-size', e.target.value)}
              placeholder="14px"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Canvas Width</label>
              <input
                type="text"
                value={bodyAttributes.width || '595px'}
                onChange={(e) => handleBodyAttributeChange('width', e.target.value)}
                placeholder="595px"
              />
            </div>
            <div className="form-group">
              <label>Canvas Height</label>
              <input
                type="text"
                value={bodyAttributes.height || 'auto'}
                onChange={(e) => handleBodyAttributeChange('height', e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
          <PaddingControl
            value={bodyAttributes.padding || ''}
            onChange={(value) => handleBodyAttributeChange('padding', value)}
          />
          <MarginControl
            value={bodyAttributes.margin || ''}
            onChange={(value) => handleBodyAttributeChange('margin', value)}
          />
          <BorderRadiusControl
            value={bodyAttributes['border-radius'] || ''}
            onChange={(value) => handleBodyAttributeChange('border-radius', value)}
          />
          <div className="form-group" style={{ marginTop: '30px', borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
            <button
              onClick={handleClearCanvas}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff7875'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
            >
              Clear Canvas
            </button>
          </div>
          {selectedBlockId && (
            <p style={{ color: '#999', fontSize: '12px', textAlign: 'center' }}>
              Block ID: {selectedBlockId} (not found)
            </p>
          )}
        </div>
      </div>
    );
  }

  const renderAttributeFields = () => {
    const { type, attributes = {}, data = {} } = selectedBlock;

    switch (type) {
      case 'text':
        return (
          <>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={data.value?.content || ''}
                onChange={(e) => handleDataChange('content', e.target.value)}
                rows={4}
                placeholder="Enter your text content..."
              />
            </div>
            <TextFormatControl
              attributes={attributes}
              onChange={handleAttributeChange}
            />
            <div className="form-row">
              <div className="form-group">
                <label>Font Size</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={attributes['font-size']?.replace('px', '') || '14'}
                    onChange={(e) => handleAttributeChange('font-size', `${e.target.value}px`)}
                    placeholder="14"
                    style={{ flex: 1 }}
                  />
                  <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>px</span>
                </div>
              </div>
              <div className="form-group">
                <label>Text Align</label>
                <select
                  value={attributes['text-align'] || 'left'}
                  onChange={(e) => handleAttributeChange('text-align', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Text Color</label>
                <input
                  type="color"
                  value={attributes.color || '#000000'}
                  onChange={(e) => handleAttributeChange('color', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Line Height</label>
                <input
                  type="text"
                  value={attributes['line-height'] || '1.5'}
                  onChange={(e) => handleAttributeChange('line-height', e.target.value)}
                  placeholder="1.5"
                />
              </div>
            </div>
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
            <BorderRadiusControl
              value={attributes['border-radius'] || ''}
              onChange={(value) => handleAttributeChange('border-radius', value)}
            />
          </>
        );

      case 'image':
        return (
          <>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={data.value?.src || ''}
                onChange={(e) => handleDataChange('src', e.target.value)}
                placeholder="https://placehold.co/600x200"
              />
            </div>
            <div className="form-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={data.value?.alt || ''}
                onChange={(e) => handleDataChange('alt', e.target.value)}
                placeholder="Image description"
              />
            </div>
            <div className="form-group">
              <label>Width</label>
              <input
                type="text"
                value={attributes.width || ''}
                onChange={(e) => handleAttributeChange('width', e.target.value)}
                placeholder="100%"
              />
            </div>
            <div className="form-group">
              <label>Alignment</label>
              <select
                value={attributes['text-align'] || 'left'}
                onChange={(e) => handleAttributeChange('text-align', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="form-group">
              <label>Container Background</label>
              <input
                type="color"
                value={attributes['container-background'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('container-background', e.target.value)}
              />
            </div>
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
            <BorderRadiusControl
              value={attributes['border-radius'] || ''}
              onChange={(value) => handleAttributeChange('border-radius', value)}
            />
          </>
        );

      case 'column':
        return (
          <>
            <div className="form-group">
              <label>Column Count</label>
              <select
                value={attributes['column-count'] || '2'}
                onChange={(e) => handleAttributeChange('column-count', e.target.value)}
              >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
            <div className="form-group">
              <label>Direction</label>
              <select
                value={attributes.direction || 'horizontal'}
                onChange={(e) => handleAttributeChange('direction', e.target.value)}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Spacing</label>
              <input
                type="text"
                value={attributes.spacing || '16px'}
                onChange={(e) => handleAttributeChange('spacing', e.target.value)}
                placeholder="16px"
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
            <BorderRadiusControl
              value={attributes['border-radius'] || ''}
              onChange={(value) => handleAttributeChange('border-radius', value)}
            />
          </>
        );

      case 'button':
        return (
          <>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={data.value?.content || ''}
                onChange={(e) => handleDataChange('content', e.target.value)}
                placeholder="Click here"
              />
            </div>
            <div className="form-group">
              <label>Link URL</label>
              <input
                type="url"
                value={data.value?.href || ''}
                onChange={(e) => handleDataChange('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Button Background</label>
                <input
                  type="color"
                  value={attributes['background-color'] ? attributes['background-color'] : '#1890ff'}
                  onChange={(e) => handleAttributeChange('background-color', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Text Color</label>
                <input
                  type="color"
                  value={attributes.color ? attributes.color : '#ffffff'}
                  onChange={(e) => handleAttributeChange('color', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <BorderRadiusControl
                  value={attributes['border-radius'] || ''}
                  onChange={(value) => handleAttributeChange('border-radius', value)}
                />
              </div>
              <div className="form-group">
                <label>Font Size</label>
                <input
                  type="text"
                  value={attributes['font-size'] || ''}
                  onChange={(e) => handleAttributeChange('font-size', e.target.value)}
                  placeholder="14px"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Container Background</label>
              <input
                type="color"
                value={attributes['container-background'] ? attributes['container-background'] : '#ffffff'}
                onChange={(e) => handleAttributeChange('container-background', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Alignment</label>
              <select
                value={attributes['text-align'] || 'center'}
                onChange={(e) => handleAttributeChange('text-align', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <TextFormatControl
              attributes={attributes}
              onChange={handleAttributeChange}
            />
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
          </>
        );

      case 'divider':
        return (
          <>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={attributes['border-color'] || '#cccccc'}
                onChange={(e) => handleAttributeChange('border-color', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Border Width</label>
                <input
                  type="text"
                  value={attributes['border-width'] || ''}
                  onChange={(e) => handleAttributeChange('border-width', e.target.value)}
                  placeholder="1px"
                />
              </div>
              <div className="form-group">
                <label>Border Style</label>
                <select
                  value={attributes['border-style'] || 'solid'}
                  onChange={(e) => handleAttributeChange('border-style', e.target.value)}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
          </>
        );

      case 'spacer':
        return (
          <>
            <div className="form-group">
              <label>Height</label>
              <input
                type="text"
                value={attributes.height || ''}
                onChange={(e) => handleAttributeChange('height', e.target.value)}
                placeholder="20px"
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={attributes['background-color'] || '#ffffff'}
                onChange={(e) => handleAttributeChange('background-color', e.target.value)}
              />
            </div>
            <PaddingControl
              value={attributes.padding || ''}
              onChange={(value) => handleAttributeChange('padding', value)}
            />
            <MarginControl
              value={attributes.margin || ''}
              onChange={(value) => handleAttributeChange('margin', value)}
            />
            <BorderRadiusControl
              value={attributes['border-radius'] || ''}
              onChange={(value) => handleAttributeChange('border-radius', value)}
            />
            <div className="form-row">
              <div className="form-group">
                <label>Width</label>
                <input
                  type="text"
                  value={attributes.width || ''}
                  onChange={(e) => handleAttributeChange('width', e.target.value)}
                  placeholder="100%"
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="text"
                  value={attributes.height || ''}
                  onChange={(e) => handleAttributeChange('height', e.target.value)}
                  placeholder="auto"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="attribute-panel">
      <div className="attribute-panel-header">
        <h3>Properties</h3>
        <p>Editing: {selectedBlock.type}</p>
      </div>
      
      <div className="attribute-panel-content">
        {renderAttributeFields()}
      </div>


    </div>
  );
};

export default AttributePanel;