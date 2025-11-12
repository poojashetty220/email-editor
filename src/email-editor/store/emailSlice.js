/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const initialEmail = {
  subject: '',
  content: {
    type: 'page',
    data: {
      value: {}
    },
    attributes: {
      'background-color': '#ffffff',
      width: '595px',
      height: '842px',
      'font-family': 'Arial, sans-serif',
      'font-size': '14px',
      color: '#000000'
    },
    children: []
  }
};

// Load from localStorage if available
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('emailEditor_content');
    return saved ? JSON.parse(saved) : initialEmail;
  } catch {
    return initialEmail;
  }
};

const storedEmail = loadFromStorage();

const initialState = {
  email: storedEmail,
  selectedBlockId: null,
  hoveredBlockId: null,
  history: {
    past: [],
    present: {
      email: storedEmail,
      selectedBlockId: null
    },
    future: []
  }
};

const saveToHistory = (state) => {
  const currentState = {
    email: JSON.parse(JSON.stringify(state.email)),
    selectedBlockId: state.selectedBlockId
  };
  
  // Always save to history for actions (don't skip based on comparison)
  if (state.history.present) {
    state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
    if (state.history.past.length > 50) {
      state.history.past.shift(); // Keep only last 50 states
    }
  }
  
  state.history.present = currentState;
  state.history.future = []; // Clear future when new action is performed
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmailContent: (state, action) => {
      state.email.content = action.payload;
    },
    setSelectedBlock: (state, action) => {
      state.selectedBlockId = action.payload;
    },
    setHoveredBlock: (state, action) => {
      state.hoveredBlockId = action.payload;
    },
    addBlock: (state, action) => {
      saveToHistory(state);
      const { parentId, block, index } = action.payload;
      
      const insertBlock = (container, targetParentId, blockToAdd, insertIndex) => {
        if (!targetParentId) {
          // Insert at root level
          if (insertIndex >= 0 && insertIndex <= container.children.length) {
            container.children.splice(insertIndex, 0, blockToAdd);
          } else {
            container.children.push(blockToAdd);
          }
          return true;
        }
        
        // Find the parent container
        if (container.children) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const childId = child.id || `${child.type}-${i}`;
            
            if (childId === targetParentId) {
              if (!child.children) child.children = [];
              if (insertIndex >= 0 && insertIndex <= child.children.length) {
                child.children.splice(insertIndex, 0, blockToAdd);
              } else {
                child.children.push(blockToAdd);
              }
              return true;
            }
            
            // Recursively search in nested children
            if (insertBlock(child, targetParentId, blockToAdd, insertIndex)) {
              return true;
            }
          }
        }
        return false;
      };
      
      insertBlock(state.email.content, parentId, block, index);
      localStorage.setItem('emailEditor_content', JSON.stringify(state.email));
    },
    updateBlock: (state, action) => {
      saveToHistory(state);
      const { blockId, updates } = action.payload;
      
      const updateBlockRecursive = (container, targetBlockId) => {
        if (container.children) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const childId = child.id || `${child.type}-${i}`;
            
            if (childId === targetBlockId) {
              // Update the block
              if (updates.data) {
                child.data = { ...child.data, ...updates.data };
              }
              if (updates.attributes) {
                child.attributes = { ...child.attributes, ...updates.attributes };
              }
              return true;
            }
            
            if (updateBlockRecursive(child, targetBlockId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      updateBlockRecursive(state.email.content, blockId);
      localStorage.setItem('emailEditor_content', JSON.stringify(state.email));
    },
    deleteBlock: (state, action) => {
      saveToHistory(state);
      const { blockId } = action.payload;
      
      const deleteBlockRecursive = (container, targetBlockId) => {
        if (container.children) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const childId = child.id || `${child.type}-${i}`;
            
            if (childId === targetBlockId) {
              container.children.splice(i, 1);
              return true;
            }
            
            if (deleteBlockRecursive(child, targetBlockId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      deleteBlockRecursive(state.email.content, blockId);
      // Clear selection after deletion
      state.selectedBlockId = null;
      localStorage.setItem('emailEditor_content', JSON.stringify(state.email));
    },
    moveBlock: (state, action) => {
      saveToHistory(state);
      const { blockId, targetParentId, targetIndex } = action.payload;
      
      // First, find and remove the block
      let blockToMove = null;
      const findAndRemoveBlock = (container, targetBlockId) => {
        if (container.children) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const childId = child.id || `${child.type}-${i}`;
            
            if (childId === targetBlockId) {
              blockToMove = container.children.splice(i, 1)[0];
              return true;
            }
            
            if (findAndRemoveBlock(child, targetBlockId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      // Then, insert it at the new location
      const insertBlock = (container, parentId, blockToAdd, insertIndex) => {
        if (!parentId) {
          // Insert at root level
          if (insertIndex >= 0 && insertIndex <= container.children.length) {
            container.children.splice(insertIndex, 0, blockToAdd);
          } else {
            container.children.push(blockToAdd);
          }
          return true;
        }
        
        // Find the parent container
        if (container.children) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const childId = child.id || `${child.type}-${i}`;
            
            if (childId === parentId) {
              if (!child.children) child.children = [];
              if (insertIndex >= 0 && insertIndex <= child.children.length) {
                child.children.splice(insertIndex, 0, blockToAdd);
              } else {
                child.children.push(blockToAdd);
              }
              return true;
            }
            
            if (insertBlock(child, parentId, blockToAdd, insertIndex)) {
              return true;
            }
          }
        }
        return false;
      };
      
      if (findAndRemoveBlock(state.email.content, blockId) && blockToMove) {
        insertBlock(state.email.content, targetParentId, blockToMove, targetIndex);
      }
      localStorage.setItem('emailEditor_content', JSON.stringify(state.email));
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past.pop();
        state.history.future.unshift(state.history.present);
        state.history.present = previous;
        state.email = previous.email;
        state.selectedBlockId = previous.selectedBlockId;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future.shift();
        state.history.past.push(state.history.present);
        state.history.present = next;
        state.email = next.email;
        state.selectedBlockId = next.selectedBlockId;
      }
    },
    updateBodyAttributes: (state, action) => {
      saveToHistory(state);
      const { attributes } = action.payload;
      state.email.content.attributes = {
        ...state.email.content.attributes,
        ...attributes
      };
      // Save to localStorage
      localStorage.setItem('emailEditor_content', JSON.stringify(state.email));
    },
    clearCanvas: (state) => {
      saveToHistory(state);
      state.email = initialEmail;
      state.selectedBlockId = null;
      // Clear localStorage
      localStorage.removeItem('emailEditor_content');
    }
  }
});

export const { setEmailContent, setSelectedBlock, setHoveredBlock, addBlock, updateBlock, deleteBlock, moveBlock, undo, redo, updateBodyAttributes, clearCanvas } = emailSlice.actions;
export default emailSlice.reducer;