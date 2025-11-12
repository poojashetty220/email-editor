import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBlock } from '../store/emailSlice.js';

const RichTextToolbar = ({ onCommand, isVisible, position }) => {
  if (!isVisible) return null;

  const commands = [
    { name: 'bold', icon: 'B', title: 'Bold' },
    { name: 'italic', icon: 'I', title: 'Italic' },
    { name: 'underline', icon: 'U', title: 'Underline' },
    { name: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { name: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { name: 'createLink', icon: '🔗', title: 'Link' }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top - 50,
        left: position.left,
        background: '#333',
        borderRadius: '4px',
        padding: '8px',
        display: 'flex',
        gap: '4px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      {commands.map(cmd => (
        <button
          key={cmd.name}
          onClick={() => onCommand(cmd.name)}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px',
            minWidth: '24px'
          }}
          title={cmd.title}
        >
          {cmd.icon}
        </button>
      ))}
    </div>
  );
};

const RichTextEditor = ({ block, blockId, isSelected, readonly, dispatch }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);
  const isEditing = isSelected && !readonly;

  const handleCommand = useCallback((command) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, null);
    }
    
    // Update content after command
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      dispatch(updateBlock({
        blockId,
        updates: {
          data: {
            ...block.data,
            value: {
              ...block.data?.value,
              content
            }
          }
        }
      }));
    }
  }, [blockId, block.data, dispatch]);

  const handleSelection = useCallback(() => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, [isEditing]);

  const handleInput = useCallback((e) => {
    if (isEditing) {
      const content = e.target.innerHTML;
      dispatch(updateBlock({
        blockId,
        updates: {
          data: {
            ...block.data,
            value: {
              ...block.data?.value,
              content
            }
          }
        }
      }));
    }
  }, [isEditing, blockId, block.data, dispatch]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('selectionchange', handleSelection);
      return () => document.removeEventListener('selectionchange', handleSelection);
    }
  }, [isEditing, handleSelection]);

  useEffect(() => {
    if (!isEditing) {
      setShowToolbar(false);
    }
  }, [isEditing]);

  return (
    <>
      <div
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        dangerouslySetInnerHTML={{
          __html: block.data?.value?.content || 'Text content'
        }}
        style={{
          outline: isEditing ? '2px solid #1890ff' : 'none',
          cursor: isEditing ? 'text' : 'pointer',
          minHeight: '20px',
          ...block.attributes && Object.entries(block.attributes).reduce((acc, [key, value]) => {
            const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            acc[camelKey] = value;
            return acc;
          }, {})
        }}
      />
      <RichTextToolbar
        isVisible={showToolbar}
        position={toolbarPosition}
        onCommand={handleCommand}
      />
    </>
  );
};

export default RichTextEditor;