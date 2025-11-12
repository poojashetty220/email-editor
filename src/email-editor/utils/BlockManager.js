import { BLOCK_TYPES } from '../core/constants.js';

// Block manager for handling email blocks
class BlockManager {
  constructor() {
    this.blocks = new Map();
  }

  registerBlock(type, blockConfig) {
    this.blocks.set(type, blockConfig);
  }

  getBlock(type) {
    return this.blocks.get(type);
  }

  getAllBlocks() {
    return Array.from(this.blocks.values());
  }

  getBlockTypes() {
    return Array.from(this.blocks.keys());
  }

  createBlockData(type, data = {}) {
    console.log('Requesting block type:', type);
    console.log('Available block types:', Array.from(this.blocks.keys()));
    const block = this.getBlock(type);
    if (!block) {
      throw new Error(`Block type "${type}" not found`);
    }

    return {
      id: this.generateUniqueId(),
      type,
      data: {
        ...block.defaultData,
        ...data
      },
      attributes: {
        ...block.defaultAttributes,
        ...data.attributes
      },
      children: data.children || []
    };
  }

  generateUniqueId() {
    return 'block_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }
}

// Create singleton instance
export const blockManager = new BlockManager();

// Register basic blocks
blockManager.registerBlock(BLOCK_TYPES.PAGE, {
  name: 'Page',
  defaultData: {},
  defaultAttributes: {
    'background-color': '#ffffff',
    width: '600px',
    'font-family': 'Arial, sans-serif',
    'font-size': '14px',
    color: '#000000'
  }
});

blockManager.registerBlock(BLOCK_TYPES.SECTION, {
  name: 'Section',
  defaultData: {},
  defaultAttributes: {
    'background-color': '#ffffff',
    padding: '20px 0px'
  }
});

blockManager.registerBlock(BLOCK_TYPES.COLUMN, {
  name: 'Column',
  defaultData: {},
  defaultAttributes: {
    width: '100%',
    'column-count': '2',
    direction: 'horizontal',
    spacing: '16px'
  }
});

blockManager.registerBlock(BLOCK_TYPES.TEXT, {
  name: 'Text',
  defaultData: {
    value: {
      content: 'This is sample text'
    }
  },
  defaultAttributes: {
    'font-size': '13px',
    'line-height': '22px',
    color: '#000000'
  }
});

blockManager.registerBlock(BLOCK_TYPES.IMAGE, {
  name: 'Image',
  defaultData: {
    value: {
      src: 'https://placehold.co/600x200'
    }
  },
  defaultAttributes: {
    width: '100%'
  }
});

blockManager.registerBlock(BLOCK_TYPES.BUTTON, {
  name: 'Button',
  defaultData: {
    value: {
      content: 'Button'
    }
  },
  defaultAttributes: {
    'background-color': '#414141',
    color: '#ffffff',
    'border-radius': '3px',
    padding: '10px 25px'
  }
});

blockManager.registerBlock(BLOCK_TYPES.DIVIDER, {
  name: 'Divider',
  defaultData: {},
  defaultAttributes: {
    'border-color': '#cccccc',
    padding: '10px 0'
  }
});

blockManager.registerBlock(BLOCK_TYPES.SPACER, {
  name: 'Spacer',
  defaultData: {},
  defaultAttributes: {
    height: '20px'
  }
});

export default blockManager;