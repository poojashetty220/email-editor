import { BLOCK_TYPES } from '../core/constants.js';

export const basicTemplates = {
  welcome: {
    name: 'Welcome Email',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMTAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE4OTBGRiIvPgo8cmVjdCB4PSIzMCIgeT0iNjAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIGZpbGw9IiNEOUQ5RDkiLz4KPHJlY3QgeD0iMzAiIHk9IjgwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRDlEOUQ5Ii8+CjxyZWN0IHg9IjMwIiB5PSIxMDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzUyQzQxQSIvPgo8L3N2Zz4K',
    content: {
      type: BLOCK_TYPES.PAGE,
      data: { value: {} },
      attributes: {
        'background-color': '#ffffff',
        width: '600px',
        'font-family': 'Arial, sans-serif',
        'font-size': '14px',
        color: '#000000'
      },
      children: [
        {
          type: BLOCK_TYPES.SECTION,
          data: { value: {} },
          attributes: {
            'background-color': '#ffffff',
            padding: '40px 20px'
          },
          children: [
            {
              type: BLOCK_TYPES.TEXT,
              data: {
                value: {
                  content: '<h1 style="text-align: center; color: #333; margin: 0 0 20px 0;">Welcome to Our Platform!</h1>'
                }
              },
              attributes: {
                'font-size': '28px',
                'line-height': '36px',
                color: '#333333',
                'text-align': 'center'
              },
              children: []
            },
            {
              type: BLOCK_TYPES.TEXT,
              data: {
                value: {
                  content: '<p style="text-align: center; color: #666; margin: 0 0 30px 0;">Thank you for joining us! We\'re excited to have you on board and can\'t wait to show you what we have in store.</p>'
                }
              },
              attributes: {
                'font-size': '16px',
                'line-height': '24px',
                color: '#666666',
                'text-align': 'center'
              },
              children: []
            },
            {
              type: BLOCK_TYPES.BUTTON,
              data: {
                value: {
                  content: 'Get Started',
                  href: 'https://example.com/get-started'
                }
              },
              attributes: {
                'background-color': '#1890ff',
                color: '#ffffff',
                'border-radius': '6px',
                padding: '12px 30px',
                'font-size': '16px',
                'text-align': 'center'
              },
              children: []
            }
          ]
        }
      ]
    }
  }
};

export default basicTemplates;