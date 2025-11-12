import React from 'react';
import { useDispatch } from 'react-redux';
import { BLOCK_TYPES } from '../core/constants.js';
import { addBlock } from '../store/emailSlice.js';
import blockManager from '../utils/BlockManager.js';
import './BlocksPanel.css';

const BlocksPanel = () => {
  const dispatch = useDispatch();

  const handleAddBlock = (blockType) => {
    const blockData = blockManager.createBlockData(blockType);
    dispatch(addBlock({ 
      block: blockData,
      parentId: null,
      index: -1
    }));
  };

  const blockItems = [
    {
      type: BLOCK_TYPES.SECTION,
      name: 'Section',
      icon: '📄',
      description: 'Container for other blocks'
    },
    {
      type: BLOCK_TYPES.TEXT,
      name: 'Text',
      icon: '📝',
      description: 'Add text content'
    },
    {
      type: BLOCK_TYPES.IMAGE,
      name: 'Image',
      icon: '🖼️',
      description: 'Add images'
    },
    {
      type: BLOCK_TYPES.BUTTON,
      name: 'Button',
      icon: '🔘',
      description: 'Call-to-action button'
    },
    {
      type: BLOCK_TYPES.DIVIDER,
      name: 'Divider',
      icon: '➖',
      description: 'Horizontal line separator'
    },
    {
      type: BLOCK_TYPES.SPACER,
      name: 'Spacer',
      icon: '⬜',
      description: 'Add vertical spacing'
    },
    {
      type: BLOCK_TYPES.COLUMN,
      name: 'Column',
      icon: '📋',
      description: 'Column container'
    }
  ];

  return (
    <div className="blocks-panel">
      <div className="blocks-panel-header">
        <h3>Blocks</h3>
        <p>Drag blocks to add them to your email</p>
      </div>
      
      <div className="blocks-list">
        {blockItems.map((item) => (
          <div
            key={item.type}
            className="block-item"
            onClick={() => handleAddBlock(item.type)}
            draggable="true"
            onDragStart={(e) => {
              console.log('Drag start for block type:', item.type);
              e.dataTransfer.effectAllowed = 'copy';
              // Store in global variable
              window.currentDragBlockType = item.type;
              // Prevent default URL drag behavior
              e.dataTransfer.setData('text/plain', `block:${item.type}`);
              e.dataTransfer.setData('text/uri-list', '');
              console.log('Data set in drag start:', item.type);
            }}
            onMouseDown={(e) => {
              // Ensure draggable is enabled
              e.currentTarget.draggable = true;
            }}
          >
            <div className="block-item-icon">{item.icon}</div>
            <div className="block-item-content">
              <div className="block-item-name">{item.name}</div>
              <div className="block-item-description">{item.description}</div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default BlocksPanel;