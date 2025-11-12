import React, { useState, useCallback, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from '../store/store.js';
import { setEmailContent, undo, redo } from '../store/emailSlice.js';
import EmailPreview from './EmailPreview.jsx';
import BlocksPanel from './BlocksPanel.jsx';
import AttributePanel from './AttributePanel.jsx';
import './EmailEditor.css';

const EmailEditorContent = ({ 
  initialContent,
  height = '100vh',
  width = '100%'
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [deviceType, setDeviceType] = useState('desktop');
  
  const handleDeviceChange = useCallback((newDeviceType) => {
    setDeviceType(newDeviceType);
  }, []);
  
  const getDeviceCategory = useCallback((device) => {
    const mobileDevices = ['iphone-se', 'iphone-xr', 'iphone-12-pro', 'iphone-14-pro-max', 'pixel-7', 'samsung-s8', 'samsung-s20-ultra', 'galaxy-fold'];
    const tabletDevices = ['ipad-mini', 'ipad-air', 'ipad-pro', 'surface-pro-7', 'surface-duo', 'nest-hub', 'nest-hub-max'];
    
    if (mobileDevices.includes(device)) return 'mobile';
    if (tabletDevices.includes(device)) return 'tablet';
    return 'desktop';
  }, []);
  const resetPanningRef = React.useRef(null);
  const dispatch = useDispatch();
  
  const deviceWidths = {
    'iphone-se': 375,
    'iphone-xr': 414,
    'iphone-12-pro': 390,
    'iphone-14-pro-max': 430,
    'pixel-7': 412,
    'samsung-s8': 360,
    'samsung-s20-ultra': 412,
    'ipad-mini': 768,
    'ipad-air': 820,
    'ipad-pro': 1024,
    'surface-pro-7': 912,
    'surface-duo': 540,
    'galaxy-fold': 280,
    'nest-hub': 1024,
    'nest-hub-max': 1280,
    'desktop': 600,
    'desktop-wide': 800
  };
  const emailContent = useSelector(state => state.email?.email?.content);
  const canUndo = useSelector(state => state.email?.history?.past?.length > 0);
  const canRedo = useSelector(state => state.email?.history?.future?.length > 0);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    if (resetPanningRef.current) {
      resetPanningRef.current();
    }
  }, []);

  // Reset panning when zoom level reaches 100%
  React.useEffect(() => {
    if (zoomLevel === 1 && resetPanningRef.current) {
      resetPanningRef.current();
    }
  }, [zoomLevel]);

  const handleUndo = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

  const generateHTML = useCallback((block) => {
    const convertAttributesToStyle = (attributes) => {
      return Object.entries(attributes || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
    };

    switch (block.type) {
      case 'page': {
        const pageStyle = convertAttributesToStyle(block.attributes);
        const childrenHTML = block.children?.map(child => generateHTML(child)).join('') || '';
        return `<div style="${pageStyle}">${childrenHTML}</div>`;
      }
      case 'section': {
        const sectionStyle = convertAttributesToStyle(block.attributes);
        const sectionChildren = block.children?.map(child => generateHTML(child)).join('') || '';
        return `<table style="width: 100%; border-collapse: collapse;"><tbody><tr><td style="${sectionStyle}">${sectionChildren}</td></tr></tbody></table>`;
      }
      case 'text': {
        const textStyle = convertAttributesToStyle(block.attributes);
        const content = block.data?.value?.content || 'Text content';
        return `<div style="${textStyle}">${content}</div>`;
      }
      case 'image': {
        const imgStyle = convertAttributesToStyle(block.attributes);
        const src = block.data?.value?.src || 'https://placehold.co/600x200';
        const alt = block.data?.value?.alt || '';
        return `<img src="${src}" alt="${alt}" style="${imgStyle}; max-width: 100%; height: auto; display: block;" />`;
      }
      case 'button': {
        const btnStyle = convertAttributesToStyle(block.attributes);
        const href = block.data?.value?.href || '#';
        const btnContent = block.data?.value?.content || 'Button';
        return `<div style="text-align: center; padding: 10px;"><a href="${href}" style="${btnStyle}; display: inline-block; padding: 10px 25px; text-decoration: none;">${btnContent}</a></div>`;
      }
      case 'divider': {
        const dividerColor = block.attributes?.['border-color'] || '#cccccc';
        return `<div style="padding: 10px 0;"><hr style="border: none; border-top: 1px solid ${dividerColor}; margin: 0;" /></div>`;
      }
      case 'spacer': {
        const height = block.attributes?.height || '20px';
        return `<div style="height: ${height}; font-size: 1px; line-height: 1px;">&nbsp;</div>`;
      }
      default:
        return `<div>Unknown block type: ${block.type}</div>`;
    }
  }, []);

  const handleExport = useCallback(() => {
    if (emailContent) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
${generateHTML(emailContent)}
</body>
</html>`;
      console.log('Exported HTML:', html);
    }
  }, [emailContent, generateHTML]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      handleZoomIn();
    } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
      e.preventDefault();
      handleZoomOut();
    } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      handleZoomReset();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && activeTab === 'preview') {
      e.preventDefault();
      // Cycle through device types
      const deviceOrder = ['iphone-se', 'iphone-xr', 'iphone-12-pro', 'iphone-14-pro-max', 'pixel-7', 'samsung-s8', 'samsung-s20-ultra', 'ipad-mini', 'ipad-air', 'ipad-pro', 'surface-pro-7', 'surface-duo', 'galaxy-fold', 'nest-hub', 'nest-hub-max', 'desktop', 'desktop-wide'];
      const currentIndex = deviceOrder.indexOf(deviceType);
      const nextIndex = (currentIndex + 1) % deviceOrder.length;
      setDeviceType(deviceOrder[nextIndex]);
    }
  }, [handleUndo, handleRedo, handleZoomIn, handleZoomOut, handleZoomReset, activeTab, deviceType]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Load from localStorage first, then fallback to initialContent
    try {
      const saved = localStorage.getItem('emailEditor_content');
      if (saved) {
        const savedEmail = JSON.parse(saved);
        dispatch(setEmailContent(savedEmail.content));
      } else if (initialContent) {
        dispatch(setEmailContent(initialContent));
      }
    } catch {
      if (initialContent) {
        dispatch(setEmailContent(initialContent));
      }
    }
  }, [initialContent, dispatch]);

  // Remove onContentChange to prevent infinite loops
  // Parent can access content via Redux store if needed

  return (
    <div className="email-editor" style={{ height, width }}>
      <div className="email-editor-header">
        <div className="email-editor-tabs">
          <button 
            className={`tab ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            Design
          </button>
          <button 
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
        
        <div className="header-controls">
          <div className="undo-redo-controls">
            <button onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">↶</button>
            <button onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">↷</button>
          </div>
          
          <div className="zoom-controls">
            <button onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>-</button>
            <span>{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} disabled={zoomLevel >= 2}>+</button>
            <button style={{width: 'fit-content', padding: '4px'}} onClick={handleZoomReset}>Reset</button>
          </div>
          
          <div className="action-buttons">
            <button style={{marginRight: '4px'}} onClick={() => window.parent?.postMessage?.({type: 'save', content: emailContent}, '*')} title="Save Email">Save</button>
            <button onClick={handleExport} title="Export HTML">Export</button>
          </div>
        </div>
      </div>
      
      <div className="email-editor-content">
        {activeTab === 'design' && (
          <>
            <div className="email-editor-sidebar">
              <BlocksPanel />
            </div>
            
            <div className="email-editor-main">
              <EmailPreview zoomLevel={zoomLevel} onResetPanning={resetPanningRef} deviceType="desktop" />
            </div>
            
            <div className="email-editor-properties">
              <AttributePanel />
            </div>
          </>
        )}
        
        {activeTab === 'preview' && (
          <div className="email-editor-preview-full">
            <div>
              <div className="device-selector">
              <select 
                className="device-dropdown"
                value={deviceType}
                onChange={(e) => handleDeviceChange(e.target.value)}
              >
                <optgroup label="Mobile">
                  <option value="iphone-se">📱 iPhone SE (375px)</option>
                  <option value="iphone-xr">📱 iPhone XR (414px)</option>
                  <option value="iphone-12-pro">📱 iPhone 12 Pro (390px)</option>
                  <option value="iphone-14-pro-max">📱 iPhone 14 Pro Max (430px)</option>
                  <option value="pixel-7">📱 Pixel 7 (412px)</option>
                  <option value="samsung-s8">📱 Samsung Galaxy S8+ (360px)</option>
                  <option value="samsung-s20-ultra">📱 Samsung Galaxy S20 Ultra (412px)</option>
                </optgroup>
                <optgroup label="Tablet">
                  <option value="ipad-mini">📱 iPad Mini (768px)</option>
                  <option value="ipad-air">📱 iPad Air (820px)</option>
                  <option value="ipad-pro">📱 iPad Pro (1024px)</option>
                  <option value="surface-pro-7">📱 Surface Pro 7 (912px)</option>
                  <option value="surface-duo">📱 Surface Duo (540px)</option>
                </optgroup>
                <optgroup label="Foldable">
                  <option value="galaxy-fold">📱 Galaxy Fold (280px)</option>
                </optgroup>
                <optgroup label="Smart Display">
                  <option value="nest-hub">🖥️ Nest Hub (1024px)</option>
                  <option value="nest-hub-max">🖥️ Nest Hub Max (1280px)</option>
                </optgroup>
                <optgroup label="Desktop">
                  <option value="desktop">🖥️ Desktop (600px)</option>
                  <option value="desktop-wide">🖥️ Wide Desktop (800px)</option>
                </optgroup>
              </select>
            </div>
            <div className="device-info">
              <span className="device-size">{deviceWidths[deviceType]}px</span>
              <span className="device-name">{deviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              <span className="device-shortcut" title="Press Ctrl/Cmd + D to cycle through devices">⌨️</span>
            </div>
            </div>
            <div className={`preview-container device-${deviceType}`}>
              <div className={`device-frame ${getDeviceCategory(deviceType)}`}>
                <div 
                  className={`device-screen ${getDeviceCategory(deviceType)}`}
                  style={{
                    width: `${deviceWidths[deviceType]}px`,
                    height: getDeviceCategory(deviceType) === 'mobile' ? '667px' : 
                           getDeviceCategory(deviceType) === 'tablet' ? '1024px' : '600px'
                  }}
                >
                  <EmailPreview 
                    readonly={true}
                    zoomLevel={zoomLevel}
                    onResetPanning={resetPanningRef}
                    deviceType={deviceType}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmailEditor = (props) => {
  return (
    <Provider store={store}>
      <EmailEditorContent {...props} />
    </Provider>
  );
};

export default EmailEditor;