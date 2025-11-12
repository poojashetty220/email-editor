// Main entry point for the email editor
export { default as EmailEditor } from './components/EmailEditor.jsx';
export { default as EmailPreview } from './components/EmailPreview.jsx';
export { default as BlocksPanel } from './components/BlocksPanel.jsx';
export { default as AttributePanel } from './components/AttributePanel.jsx';

// Export utilities
export { default as blockManager } from './utils/BlockManager.js';
export { classnames } from './utils/classnames.js';
export { JsonToMjml, JsonToHtml } from './utils/JsonToMjml.js';

// Export templates
export { default as basicTemplates } from './templates/basic-templates.js';

// Export constants
export * from './core/constants.js';

// Default export
export { default } from './components/EmailEditor.jsx';