import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BLOCK_TYPES } from '../core/constants.js';
import { setSelectedBlock, setHoveredBlock, addBlock, deleteBlock, updateBlock, moveBlock } from '../store/emailSlice.js';
import blockManager from '../utils/BlockManager.js';
import ColumnResizeHandle from './ColumnResizeHandle.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import { parseSpacingToPx } from '../utils/styleUtils.js';

// Separate component for button editing with cursor position management
const ButtonBlock = ({ block, blockId, blockProps, isSelected, readonly, dispatch, bodyAttributes }) => {
  const isButtonSelected = isSelected && !readonly;
  const buttonRef = React.useRef(null);
  const cursorPositionRef = React.useRef(null);
  
  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    if (!buttonRef.current || !isButtonSelected) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(buttonRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorPositionRef.current = preCaretRange.toString().length;
    }
  }, [isButtonSelected]);
  
  // Restore cursor position
  const restoreCursorPosition = useCallback(() => {
    if (!buttonRef.current || !isButtonSelected || cursorPositionRef.current === null) return;
    
    const element = buttonRef.current;
    const position = cursorPositionRef.current;
    
    let charIndex = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while ((node = walker.nextNode())) {
      const nextCharIndex = charIndex + node.textContent.length;
      if (position <= nextCharIndex) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(node, position - charIndex);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      charIndex = nextCharIndex;
    }
  }, [isButtonSelected]);
  
  const handleInput = useCallback((e) => {
    if (isButtonSelected) {
      saveCursorPosition();
      
      dispatch(updateBlock({
        blockId: blockId,
        updates: {
          data: {
            ...block.data,
            value: {
              ...block.data?.value,
              content: e.target.textContent
            }
          }
        }
      }));
      
      // Restore cursor position after React re-render
      setTimeout(restoreCursorPosition, 0);
    }
  }, [isButtonSelected, blockId, block.data, dispatch, saveCursorPosition, restoreCursorPosition]);
  
  const containerStyle = {
    ...blockProps.style, 
    textAlign: block.attributes?.['text-align'] || 'center',
    backgroundColor: block.attributes?.['container-background'] || 'transparent'
  };
  
  const containerPadding = parseSpacingToPx(block.attributes?.padding);
  const containerMargin = parseSpacingToPx(block.attributes?.margin);
  
  if (containerPadding) containerStyle.padding = containerPadding;
  if (containerMargin) containerStyle.margin = containerMargin;
  
  return (
    <div {...blockProps} style={containerStyle}>
      <a 
        ref={buttonRef}
        href={block.data?.value?.href || '#'}
        contentEditable={isButtonSelected}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onClick={(e) => {
          if (isButtonSelected) {
            e.preventDefault();
          }
        }}
        style={{
          display: 'inline-block',
          padding: '10px 25px',
          backgroundColor: block.attributes?.['background-color'] || '#414141',
          color: block.attributes?.color || '#ffffff',
          textDecoration: block.attributes?.['text-decoration'] || 'none',
          borderRadius: block.attributes?.['border-radius'] || '3px',
          fontSize: block.attributes?.['font-size'] || bodyAttributes?.['font-size'] || '14px',
          fontFamily: block.attributes?.['font-family'] || bodyAttributes?.['font-family'] || 'Arial, sans-serif',
          fontWeight: block.attributes?.['font-weight'] || 'normal',
          fontStyle: block.attributes?.['font-style'] || 'normal',
          outline: isButtonSelected ? '2px solid #1890ff' : 'none',
          cursor: isButtonSelected ? 'text' : 'pointer'
        }}
      >
        {block.data?.value?.content || 'Button'}
      </a>
    </div>
  );
};

// Text editor with inline editing like button
const TextBlock = ({ block, blockId, blockProps, isSelected, readonly, dispatch, bodyAttributes }) => {
  const content = block.data?.value?.content || '';
  const isTextSelected = isSelected && !readonly;
  const textRef = React.useRef(null);
  const cursorPositionRef = React.useRef(null);
  
  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    if (!textRef.current || !isTextSelected) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(textRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorPositionRef.current = preCaretRange.toString().length;
    }
  }, [isTextSelected]);
  
  // Restore cursor position
  const restoreCursorPosition = useCallback(() => {
    if (!textRef.current || !isTextSelected || cursorPositionRef.current === null) return;
    
    const element = textRef.current;
    const position = cursorPositionRef.current;
    
    let charIndex = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while ((node = walker.nextNode())) {
      const nextCharIndex = charIndex + node.textContent.length;
      if (position <= nextCharIndex) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(node, position - charIndex);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      charIndex = nextCharIndex;
    }
  }, [isTextSelected]);
  
  const handleInput = useCallback((e) => {
    if (isTextSelected) {
      saveCursorPosition();
      
      dispatch(updateBlock({
        blockId: blockId,
        updates: {
          data: {
            ...block.data,
            value: {
              ...block.data?.value,
              content: e.target.innerHTML
            }
          }
        }
      }));
      
      // Restore cursor position after React re-render
      setTimeout(restoreCursorPosition, 0);
    }
  }, [isTextSelected, blockId, block.data, dispatch, saveCursorPosition, restoreCursorPosition]);
  

  
  const baseStyle = {
    ...blockProps.style,
    minHeight: '40px',
    background: block.attributes?.['background-color'] || 'transparent',
    borderRadius: block.attributes?.['border-radius'] || '0px',
    fontSize: block.attributes?.['font-size'] || bodyAttributes?.['font-size'] || '14px',
    lineHeight: block.attributes?.['line-height'] || '1.5',
    fontWeight: block.attributes?.['font-weight'] || 'normal',
    fontStyle: block.attributes?.['font-style'] || 'normal',
    textDecoration: block.attributes?.['text-decoration'] || 'none',
    textAlign: block.attributes?.['text-align'] || 'left',
    color: block.attributes?.color || bodyAttributes?.color || '#000000',
    fontFamily: block.attributes?.['font-family'] || bodyAttributes?.['font-family'] || 'Arial, sans-serif'
  };
  
  const textPadding = parseSpacingToPx(block.attributes?.padding);
  const textMargin = parseSpacingToPx(block.attributes?.margin);
  
  if (textPadding) baseStyle.padding = textPadding;
  if (textMargin) baseStyle.margin = textMargin;
  
  return (
    <div 
      ref={textRef}
      {...blockProps}
      contentEditable={isTextSelected}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      style={{
        ...baseStyle,
        outline: isTextSelected ? '2px solid #1890ff' : 'none',
        cursor: isTextSelected ? 'text' : (readonly ? 'default' : 'pointer'),
        color: content ? baseStyle.color : '#999'
      }}
      dangerouslySetInnerHTML={{ __html: content || 'Enter text...' }}
    />
  );
};

const EmailPreview = ({ readonly = false, zoomLevel = 1, onResetPanning, deviceType = 'desktop' }) => {
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
  const dispatch = useDispatch();
  const selectedBlockId = useSelector(state => state.email?.selectedBlockId);
  const hoveredBlockId = useSelector(state => state.email?.hoveredBlockId);
  const emailContent = useSelector(state => state.email?.email?.content);
  const [dragOverInfo, setDragOverInfo] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [, setDraggedBlockId] = React.useState(null);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });

  // Reset panning when requested
  React.useEffect(() => {
    if (onResetPanning) {
      const resetPan = () => setPanOffset({ x: 0, y: 0 });
      onResetPanning.current = resetPan;
    }
  }, [onResetPanning]);
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
  const previewRef = React.useRef(null);



  const handleBlockClick = useCallback((blockId, event) => {
    if (readonly) return;
    event.stopPropagation();
    dispatch(setSelectedBlock(blockId));
  }, [dispatch, readonly]);

  const handleCanvasClick = useCallback((event) => {
    if (readonly) return;
    // Only deselect if clicking on the canvas itself, not on blocks or editing elements
    if (event.target === event.currentTarget && !isPanning && !event.target.closest('[contenteditable="true"]')) {
      dispatch(setSelectedBlock(null));
    }
  }, [dispatch, readonly, isPanning]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0 && (e.ctrlKey || e.metaKey || zoomLevel !== 1)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  }, [panOffset, zoomLevel]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      e.preventDefault();
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);



  const handleKeyDown = useCallback((e) => {
    if (readonly) return;
    
    // Delete selected block with Delete key
    if (e.key === 'Delete' && selectedBlockId) {
      e.preventDefault();
      dispatch(deleteBlock({ blockId: selectedBlockId }));
    }
    
    // Duplicate selected block with Ctrl+D
    if (e.key === 'd' && (e.ctrlKey || e.metaKey) && selectedBlockId) {
      e.preventDefault();
      const selectedBlock = findBlockById(emailContent, selectedBlockId);
      if (selectedBlock) {
        const duplicatedBlock = JSON.parse(JSON.stringify(selectedBlock));
        duplicatedBlock.id = `${duplicatedBlock.type}-${Date.now()}`;
        const parentId = findBlockParent(emailContent, selectedBlockId);
        const currentIndex = findBlockIndex(emailContent, selectedBlockId);
        dispatch(addBlock({ 
          block: duplicatedBlock,
          parentId: parentId,
          index: currentIndex + 1
        }));
      }
    }
    
    // Escape to deselect
    if (e.key === 'Escape') {
      dispatch(setSelectedBlock(null));
    }
  }, [dispatch, readonly, selectedBlockId, emailContent]);

  useEffect(() => {
    if (!readonly) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleKeyDown, handleMouseMove, handleMouseUp, readonly]);

  useEffect(() => {
    if (!readonly) {
      const handleGlobalDragStart = () => setIsDragging(true);
      const handleGlobalDragEnd = () => {
        setIsDragging(false);
        setDragOverInfo(null);
      };
      
      document.addEventListener('dragstart', handleGlobalDragStart);
      document.addEventListener('dragend', handleGlobalDragEnd);
      document.addEventListener('drop', handleGlobalDragEnd);
      
      return () => {
        document.removeEventListener('dragstart', handleGlobalDragStart);
        document.removeEventListener('dragend', handleGlobalDragEnd);
        document.removeEventListener('drop', handleGlobalDragEnd);
      };
    }
  }, [readonly]);

  const handleBlockHover = useCallback((blockId) => {
    if (readonly) return;
    dispatch(setHoveredBlock(blockId));
  }, [dispatch, readonly]);

  const findBlockParent = useCallback((container, targetBlockId, parentId = null) => {
    if (container.children) {
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];
        const childId = child.id || `${child.type}-${i}`;
        
        if (childId === targetBlockId) {
          return parentId;
        }
        
        const found = findBlockParent(child, targetBlockId, childId);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }, []);

  const findBlockIndex = useCallback((container, targetBlockId) => {
    if (container.children) {
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];
        const childId = child.id || `${child.type}-${i}`;
        
        if (childId === targetBlockId) {
          return i;
        }
        
        const found = findBlockIndex(child, targetBlockId);
        if (found !== -1) {
          return found;
        }
      }
    }
    return -1;
  }, []);

  const findBlockById = useCallback((container, targetBlockId) => {
    if (container.children) {
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];
        const childId = child.id || `${child.type}-${i}`;
        
        if (childId === targetBlockId) {
          return child;
        }
        
        const found = findBlockById(child, targetBlockId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  const handleDropZoneDrop = useCallback((e, dropParentId, insertIndex) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drop event triggered');
    console.log('Global variable value:', window.currentDragBlockType);
    console.log('Current email content:', emailContent);
    
    // Try to get drag data from global variable first
    let dragData = window.currentDragBlockType;
    
    // If not available, try to parse from dataTransfer
    if (!dragData) {
      dragData = e.dataTransfer.getData('text/plain');
      console.log('Drag data from dataTransfer:', dragData);
    }
    
    console.log('Final drag data:', dragData);
    
    if (dragData) {
      if (dragData.startsWith('move:')) {
        // Moving existing block
        const blockId = dragData.replace('move:', '');
        console.log('Moving block:', blockId, 'to parent:', dropParentId, 'at index:', insertIndex);
        
        // Prevent moving a block into itself or its descendants
        if (blockId === dropParentId) {
          console.log('Cannot move block into itself, skipping move');
        } else {
          // Only move if it's actually changing position
          const currentParent = findBlockParent(emailContent, blockId);
          const currentIndex = findBlockIndex(emailContent, blockId);
          console.log('Current parent:', currentParent, 'Current index:', currentIndex);
          
          // For same parent moves, adjust target index if moving down
          let adjustedIndex = insertIndex;
          if (currentParent === dropParentId && currentIndex < insertIndex) {
            adjustedIndex = insertIndex - 1;
          }
          
          if (currentParent !== dropParentId || currentIndex !== adjustedIndex) {
            dispatch(moveBlock({
              blockId: blockId,
              targetParentId: dropParentId,
              targetIndex: adjustedIndex
            }));
            // Clear selection since block ID will change after move
            dispatch(setSelectedBlock(null));
            console.log('Block moved successfully');
          } else {
            console.log('Block is already in the target position, skipping move');
          }
        }
      } else if (dragData.startsWith('block:')) {
        // Creating new block
        const blockType = dragData.replace('block:', '');
        if (Object.values(BLOCK_TYPES).includes(blockType)) {
          try {
            const blockData = blockManager.createBlockData(blockType);
            console.log('Created block data:', blockData);
            dispatch(addBlock({ 
              block: blockData,
              parentId: dropParentId,
              index: insertIndex
            }));
          } catch (error) {
            console.error('Error creating block:', error);
          }
        }
      } else if (Object.values(BLOCK_TYPES).includes(dragData)) {
        // Direct block type (from sidebar)
        try {
          const blockData = blockManager.createBlockData(dragData);
          console.log('Created block data:', blockData);
          dispatch(addBlock({ 
            block: blockData,
            parentId: dropParentId,
            index: insertIndex
          }));
        } catch (error) {
          console.error('Error creating block:', error);
        }
      }
    }
    
    // Clear the global variables and drag state immediately
    window.currentDragBlockType = null;
    setDraggedBlockId(null);
    setDragOverInfo(null);
    setIsDragging(false);
  }, [dispatch, readonly]);

  const handleDropZoneDragOver = useCallback((e, parentId, insertIndex) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo({ parentId, insertIndex });
  }, [readonly]);

  const handleDropZoneDragLeave = useCallback((e) => {
    if (readonly) return;
    // Only clear if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverInfo(null);
    }
  }, [readonly]);

  const renderDropZone = (parentId, insertIndex) => {
    if (readonly) return null;
    const isActive = dragOverInfo?.parentId === parentId && dragOverInfo?.insertIndex === insertIndex;
    
    return (
      <div
        key={`dropzone-${parentId || 'root'}-${insertIndex}`}
        className="drop-zone"
        onDrop={(e) => handleDropZoneDrop(e, parentId, insertIndex)}
        onDragOver={(e) => handleDropZoneDragOver(e, parentId, insertIndex)}
        onDragLeave={handleDropZoneDragLeave}
        style={{
          height: isActive ? '40px' : (isDragging ? '20px' : '4px'),
          margin: '2px 0',
          backgroundColor: isActive ? 'rgba(24, 144, 255, 0.3)' : (isDragging ? 'rgba(24, 144, 255, 0.1)' : 'transparent'),
          border: isActive ? '2px solid #1890ff' : (isDragging ? '1px dashed #1890ff' : '1px dashed transparent'),
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#1890ff',
          fontWeight: '500',
          opacity: isDragging ? 1 : 0,
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {isActive && 'Drop block here'}
        {isDragging && !isActive && '+'}
      </div>
    );
  };



  const handleBlockDragStart = useCallback((e, blockType, blockId) => {
    if (readonly) return;
    e.stopPropagation(); // Prevent bubbling to parent blocks
    console.log('Block drag start for existing block:', blockId);
    setDraggedBlockId(blockId);
    window.currentDragBlockType = `move:${blockId}`;
    e.dataTransfer.setData('text/plain', `move:${blockId}`);
  }, [readonly]);

  // eslint-disable-next-line no-unused-vars
  const renderBlock = (block, index = 0, parentId = null) => {
    const blockId = block.id || `${block.type}-${index}`;
    const isSelected = selectedBlockId === blockId;
    const isHovered = hoveredBlockId === blockId;

    const { key: blockKey, ...blockProps } = {
      key: blockId,
      className: `email-block ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`,
      draggable: !readonly,
      onClick: (e) => {
        e.stopPropagation();
        handleBlockClick(blockId, e);
      },
      onMouseEnter: () => handleBlockHover(blockId),
      onMouseLeave: () => handleBlockHover(null),
      onDragStart: (e) => handleBlockDragStart(e, block.type, blockId),
      style: {
        ...convertAttributesToStyle(block.attributes || {}),
        position: 'relative',
        cursor: readonly ? 'default' : 'move'
      }
    };

    switch (block.type) {
      case BLOCK_TYPES.PAGE:
        const pageHeight = emailContent?.attributes?.height;
        return (
          <div key={blockKey} {...blockProps} style={{ 
            ...blockProps.style, 
            width: `${deviceWidths[deviceType]}px`, 
            minHeight: pageHeight && pageHeight !== 'auto' ? pageHeight : 'auto',
            height: pageHeight && pageHeight !== 'auto' ? pageHeight : 'auto'
          }}>
            {renderDropZone(blockId, 0)}
            {block.children?.map((child, idx) => (
              <React.Fragment key={`${blockId}-child-${idx}`}>
                {renderBlock(child, idx, blockId)}
                {renderDropZone(blockId, idx + 1)}
              </React.Fragment>
            ))}
          </div>
        );

      case BLOCK_TYPES.SECTION: {
        const sectionPadding = parseSpacingToPx(block.attributes?.padding) || '20px 0';
        const sectionMargin = parseSpacingToPx(block.attributes?.margin);
        
        const sectionStyle = { ...blockProps.style };
        if (sectionMargin) sectionStyle.margin = sectionMargin;
        
        return (
          <div key={blockKey} {...blockProps} style={sectionStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: sectionPadding }}>
                    {renderDropZone(blockId, 0)}
                    {block.children?.map((child, idx) => (
                      <React.Fragment key={`${blockId}-child-${idx}`}>
                        {renderBlock(child, idx, blockId)}
                        {renderDropZone(blockId, idx + 1)}
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      case BLOCK_TYPES.COLUMN: {
        const columnCount = parseInt(block.attributes?.['column-count'] || '2');
        const direction = block.attributes?.direction || 'horizontal';
        
        // Force vertical layout on mobile devices for better readability
        const isMobile = ['iphone-se', 'iphone-xr', 'iphone-12-pro', 'iphone-14-pro-max', 'pixel-7', 'samsung-s8', 'samsung-s20-ultra', 'galaxy-fold'].includes(deviceType);
        const effectiveDirection = isMobile ? 'vertical' : direction;
        
        const containerStyle = {
          ...blockProps.style,
          minHeight: '100px',
          border: '1px dashed #ddd',
          display: 'flex',
          flexDirection: effectiveDirection === 'vertical' ? 'column' : 'row',
          width: '100%',
          boxSizing: 'border-box',
          gap: '0px',
          transition: 'flex-direction 0.3s ease'
        };
        
        const columnPadding = parseSpacingToPx(block.attributes?.padding) || '8px';
        const columnMargin = parseSpacingToPx(block.attributes?.margin);
        
        containerStyle.padding = columnPadding;
        if (columnMargin) containerStyle.margin = columnMargin;
        
        const defaultColumnWidth = 100 / columnCount;
        const columnStyle = {
          minHeight: '100px',
          border: '1px dashed #ccc',
          borderRadius: '4px',
          padding: '0px',
          boxSizing: 'border-box',
          position: 'relative'
        };
        
        // Group children into columns
        const columns = [];
        for (let i = 0; i < columnCount; i++) {
          columns.push([]);
        }
        
        block.children?.forEach((child, idx) => {
          const columnIndex = idx % columnCount;
          columns[columnIndex].push(child);
        });
        
        const handleColumnResize = (colIdx, delta) => {
          if (effectiveDirection === 'vertical') {
            const currentHeightAttr = block.attributes?.[`column-${colIdx}-height`];
            const nextHeightAttr = block.attributes?.[`column-${colIdx + 1}-height`];
            
            const currentHeight = currentHeightAttr ? parseFloat(currentHeightAttr.replace('px', '')) : 100;
            const nextHeight = nextHeightAttr ? parseFloat(nextHeightAttr.replace('px', '')) : 100;
            
            const newCurrentHeight = currentHeight + delta;
            const newNextHeight = nextHeight - delta;
            
            // Check if either column would exceed limits - if so, don't resize at all
            if (newCurrentHeight < 50 || newCurrentHeight > 300 || newNextHeight < 50 || newNextHeight > 300) {
              return; // Stop resizing completely
            }
            
            dispatch(updateBlock({
              blockId: blockId,
              updates: {
                attributes: {
                  ...block.attributes,
                  [`column-${colIdx}-height`]: `${newCurrentHeight}px`,
                  [`column-${colIdx + 1}-height`]: `${newNextHeight}px`
                }
              }
            }));
          } else {
            const currentWidthAttr = block.attributes?.[`column-${colIdx}-width`];
            const nextWidthAttr = block.attributes?.[`column-${colIdx + 1}-width`];
            
            const currentWidth = currentWidthAttr ? parseFloat(currentWidthAttr.replace('%', '')) : defaultColumnWidth;
            const nextWidth = nextWidthAttr ? parseFloat(nextWidthAttr.replace('%', '')) : defaultColumnWidth;
            
            const newCurrentWidth = currentWidth + delta;
            const newNextWidth = nextWidth - delta;
            
            // Check if either column would exceed limits - if so, don't resize at all
            if (newCurrentWidth < 15 || newCurrentWidth > 85 || newNextWidth < 15 || newNextWidth > 85) {
              return; // Stop resizing completely
            }
            
            dispatch(updateBlock({
              blockId: blockId,
              updates: {
                attributes: {
                  ...block.attributes,
                  [`column-${colIdx}-width`]: `${newCurrentWidth}%`,
                  [`column-${colIdx + 1}-width`]: `${newNextWidth}%`
                }
              }
            }));
          }
        };
        
        return (
          <div key={blockKey} {...blockProps} style={containerStyle}>
            {columns.map((columnChildren, colIdx) => {
              const columnWidthKey = `column-${colIdx}-width`;
              const columnHeightKey = `column-${colIdx}-height`;
              const customWidth = block.attributes?.[columnWidthKey];
              const customHeight = block.attributes?.[columnHeightKey];
              
              return (
                <React.Fragment key={`${blockId}-col-${colIdx}`}>
                  <div 
                    style={{
                      ...columnStyle,
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      width: effectiveDirection === 'vertical' ? '100%' : (customWidth || `${defaultColumnWidth}%`),
                      minWidth: isMobile ? '100%' : '60px',
                      height: effectiveDirection === 'vertical' ? (customHeight || '100px') : '100px',
                      flex: effectiveDirection === 'vertical' ? 'none' : (customWidth ? '0 0 auto' : '1'),
                      position: 'relative',
                      transition: 'width 0.3s ease, height 0.3s ease'
                    }}
                  >
                    {renderDropZone(blockId, 0)}
                    {columnChildren.map((child, childIdx) => {
                      const actualIndex = colIdx + (childIdx * columnCount);
                      return (
                        <React.Fragment key={`${blockId}-child-${actualIndex}`}>
                          {renderBlock(child, actualIndex, blockId)}
                          {renderDropZone(blockId, actualIndex + 1)}
                        </React.Fragment>
                      );
                    })}
                    {columnChildren.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                        Drop blocks here
                      </div>
                    )}
                    {isSelected && !readonly && colIdx < columnCount - 1 && effectiveDirection === 'horizontal' && (
                      <ColumnResizeHandle
                        direction={effectiveDirection}
                        onResize={(delta) => handleColumnResize(colIdx, delta)}
                      />
                    )}
                  </div>
                  {isSelected && !readonly && colIdx < columnCount - 1 && effectiveDirection === 'vertical' && (
                    <div style={{ position: 'relative', height: '4px', width: '100%', backgroundColor: 'transparent' }}>
                      <ColumnResizeHandle
                        direction={effectiveDirection}
                        onResize={(delta) => handleColumnResize(colIdx, delta)}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      }

      case BLOCK_TYPES.TEXT: {
        // Adjust text size for mobile devices
        const isMobile = deviceType.includes('mobile');
        const adjustedBlockProps = {
          ...blockProps,
          style: {
            ...blockProps.style,
            fontSize: isMobile && blockProps.style.fontSize ? 
              `${Math.max(12, parseInt(blockProps.style.fontSize) * 0.9)}px` : 
              blockProps.style.fontSize,
            lineHeight: isMobile ? '1.4' : blockProps.style.lineHeight,
            padding: isMobile ? '8px' : blockProps.style.padding
          }
        };
        
        return (
          <TextBlock 
            block={block}
            blockId={blockId}
            blockProps={adjustedBlockProps}
            isSelected={isSelected}
            readonly={readonly}
            dispatch={dispatch}
            bodyAttributes={emailContent?.attributes}
          />
        );
      }

      case BLOCK_TYPES.IMAGE: {
        const isImageSelected = isSelected && !readonly;
        const isMobile = deviceType.includes('mobile');
        
        const imageContainerStyle = {
          ...blockProps.style, 
          position: 'relative',
          textAlign: block.attributes?.['text-align'] || 'left'
        };
        
        const imagePadding = parseSpacingToPx(block.attributes?.padding);
        const imageMargin = parseSpacingToPx(block.attributes?.margin);
        
        if (imagePadding) {
          imageContainerStyle.padding = imagePadding;
        } else if (isMobile) {
          imageContainerStyle.padding = '4px';
        }
        if (imageMargin) imageContainerStyle.margin = imageMargin;
        
        return (
          <div key={blockKey} {...blockProps} style={imageContainerStyle}>
            <img 
              src={block.data?.value?.src || 'https://placehold.co/600x200'}
              alt={block.data?.value?.alt || ''}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                display: block.attributes?.['text-align'] === 'center' || block.attributes?.['text-align'] === 'right' ? 'inline-block' : 'block',
                outline: isImageSelected ? '2px solid #1890ff' : 'none',
                borderRadius: isMobile ? '4px' : '0'
              }}
            />
            {isImageSelected && (
              <div style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: '#1890ff',
                color: 'white',
                padding: '2px 6px',
                fontSize: isMobile ? '10px' : '12px',
                borderRadius: '3px'
              }}>
                Edit in Properties Panel
              </div>
            )}
          </div>
        );
      }

      case BLOCK_TYPES.BUTTON: {
        const isMobile = deviceType.includes('mobile');
        const adjustedBlockProps = {
          ...blockProps,
          style: {
            ...blockProps.style,
            padding: isMobile ? '8px' : blockProps.style.padding
          }
        };
        
        return (
          <ButtonBlock 
            block={block}
            blockId={blockId}
            blockProps={adjustedBlockProps}
            isSelected={isSelected}
            readonly={readonly}
            dispatch={dispatch}
            bodyAttributes={emailContent?.attributes}
          />
        );
      }

      case BLOCK_TYPES.DIVIDER:
        return (
          <div key={blockKey} {...blockProps} style={{ ...blockProps.style, padding: '10px 0' }}>
            <hr style={{
              border: 'none',
              borderTop: `1px solid ${block.attributes?.['border-color'] || '#cccccc'}`,
              margin: 0
            }} />
          </div>
        );

      case BLOCK_TYPES.SPACER:
        return (
          <div 
            key={blockKey}
            {...blockProps} 
            style={{ 
              ...blockProps.style, 
              height: block.attributes?.height || '20px',
              fontSize: '1px',
              lineHeight: '1px'
            }}
          >
            &nbsp;
          </div>
        );

      default:
        return (
          <div key={blockKey} {...blockProps}>
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Unknown block type: {block.type}
            </div>
          </div>
        );
    }
  };

  const convertAttributesToStyle = (attributes) => {
    const style = {};
    
    Object.entries(attributes).forEach(([key, value]) => {
      // Skip column width/height attributes as they're handled separately
      if (key.startsWith('column-') && (key.includes('-width') || key.includes('-height'))) {
        return;
      }
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      style[camelKey] = value;
    });

    return style;
  };

  const handleDrop = useCallback((e) => {
    if (readonly) return;
    e.preventDefault();
    
    console.log('Main drop event triggered');
    console.log('DataTransfer types:', e.dataTransfer.types);
    
    const dragData = e.dataTransfer.getData('text/plain');
    console.log('Drag data:', dragData);
    
    let blockType = null;
    if (dragData && dragData.startsWith('block:')) {
      blockType = dragData.replace('block:', '');
    }
    
    console.log('Parsed block type:', blockType);
    
    if (blockType && Object.values(BLOCK_TYPES).includes(blockType)) {
      try {
        const blockData = blockManager.createBlockData(blockType);
        console.log('Created block data:', blockData);
        dispatch(addBlock({ 
          block: blockData,
          parentId: null,
          index: -1
        }));
      } catch (error) {
        console.error('Error creating block:', error);
      }
    } else {
      console.log('Invalid block type detected:', blockType);
    }
    setDragOverInfo(null);
    setIsDragging(false);
  }, [dispatch, readonly]);

  const handleDragOver = useCallback((e) => {
    if (readonly) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  }, [readonly]);

  const handleDragLeave = useCallback((e) => {
    if (readonly) return;
    // Only hide drop zones if we're leaving the entire preview area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
      setDragOverInfo(null);
    }
  }, [readonly]);

  return (
    <div 
      ref={previewRef}
      className="email-preview"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      style={{
        cursor: isPanning ? 'grabbing' : (zoomLevel !== 1 ? 'grab' : 'default')
      }}
    >
      <div 
        className="email-preview-content"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.2s ease, width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          width: `${Math.min(parseInt(emailContent?.attributes?.width) || deviceWidths[deviceType], deviceWidths[deviceType])}px`,
          maxWidth: 'calc(100% - 40px)',
          backgroundColor: emailContent?.attributes?.['background-color'] || '#ffffff',
          color: emailContent?.attributes?.color || '#000000',
          fontFamily: emailContent?.attributes?.['font-family'] || 'Arial, sans-serif',
          fontSize: emailContent?.attributes?.['font-size'] || '14px',
          ...(parseSpacingToPx(emailContent?.attributes?.padding) && { padding: 0 }),
          ...(parseSpacingToPx(emailContent?.attributes?.margin) && { margin: parseSpacingToPx(emailContent?.attributes?.margin) }),
          borderRadius: emailContent?.attributes?.['border-radius'] || '0px',
          minHeight: readonly ? 'auto' : (emailContent?.attributes?.height === 'auto' || !emailContent?.attributes?.height ? '400px' : emailContent?.attributes?.height),
          height: 'auto',
          boxSizing: 'border-box',
          overflow: 'hidden',
          wordWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      >
        {emailContent && emailContent.children && emailContent.children.length > 0 ? (
          <div>
            {renderDropZone(null, 0)}
            {emailContent.children.map((child, idx) => (
              <React.Fragment key={`root-child-${idx}`}>
                {renderBlock(child, idx)}
                {renderDropZone(null, idx + 1)}
              </React.Fragment>
            ))}
          </div>
        ) : (
          !readonly ? (
            <div 
              style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#999',
                minHeight: '300px',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Drag blocks from the sidebar to start building your email
            </div>
          ) : null
        )}
      </div>
      
      <style>{`
        .email-preview {
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        
        .email-block {
          transition: all 0.2s ease;
          position: relative;
        }
        
        .email-block:hover:not(.selected) {
          outline: 2px dashed #1890ff;
          outline-offset: -2px;
        }
        
        .email-block.selected {
          outline: 2px solid #1890ff;
          outline-offset: -2px;
        }
        
        .email-block [contenteditable="true"] {
          min-height: 20px;
        }
        
        .email-block [contenteditable="true"]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default EmailPreview;