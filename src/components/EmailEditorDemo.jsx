import React, { useState } from 'react';
import EmailEditor from '../email-editor/index.js';

const EmailEditorDemo = () => {
  const [emailContent, setEmailContent] = useState({
    type: 'page',
    data: {
      value: {}
    },
    attributes: {
      'background-color': '#ffffff',
      width: '600px',
      'font-family': 'Arial, sans-serif',
      'font-size': '14px',
      color: '#000000'
    },
    children: []
  });

  const handleContentChange = (newContent) => {
    setEmailContent(newContent);
    console.log('Email content updated:', newContent);
  };

  const handleSave = () => {
    // Save to your backend
    console.log('Saving email:', emailContent);
    alert('Email saved! (Check console)');
  };

  // Listen for save messages from EmailEditor
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'save') {
        handleSave();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <EmailEditor
        initialContent={emailContent}
        onContentChange={handleContentChange}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default EmailEditorDemo;