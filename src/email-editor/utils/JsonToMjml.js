import { BLOCK_TYPES } from '../core/constants.js';

// Convert email JSON structure to MJML
export function JsonToMjml(emailData) {
  if (!emailData) return '';

  const renderBlock = (block) => {
    const { type, attributes = {}, data = {}, children = [] } = block;
    
    // Convert attributes to MJML format
    const attributeString = Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    switch (type) {
      case BLOCK_TYPES.PAGE:
        return `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body ${attributeString}>
    ${children.map(renderBlock).join('\n    ')}
  </mj-body>
</mjml>`;

      case BLOCK_TYPES.SECTION:
        return `<mj-section ${attributeString}>
      ${children.map(renderBlock).join('\n      ')}
    </mj-section>`;

      case BLOCK_TYPES.COLUMN:
        return `<mj-column ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-column>`;

      case BLOCK_TYPES.TEXT:
        return `<mj-text ${attributeString}>${data.value?.content || ''}</mj-text>`;

      case BLOCK_TYPES.IMAGE:
        return `<mj-image ${attributeString} src="${data.value?.src || ''}" alt="${data.value?.alt || ''}" />`;

      case BLOCK_TYPES.BUTTON:
        return `<mj-button ${attributeString} href="${data.value?.href || '#'}">${data.value?.content || 'Button'}</mj-button>`;

      case BLOCK_TYPES.DIVIDER:
        return `<mj-divider ${attributeString} />`;

      case BLOCK_TYPES.SPACER:
        return `<mj-spacer ${attributeString} />`;

      case BLOCK_TYPES.HERO:
        return `<mj-hero ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-hero>`;

      case BLOCK_TYPES.WRAPPER:
        return `<mj-wrapper ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-wrapper>`;

      case BLOCK_TYPES.GROUP:
        return `<mj-group ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-group>`;

      case BLOCK_TYPES.NAVBAR:
        return `<mj-navbar ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-navbar>`;

      case BLOCK_TYPES.SOCIAL:
        return `<mj-social ${attributeString}>
        ${children.map(renderBlock).join('\n        ')}
      </mj-social>`;

      case BLOCK_TYPES.RAW:
        return `<mj-raw>${data.value?.content || ''}</mj-raw>`;

      default:
        return `<!-- Unknown block type: ${type} -->`;
    }
  };

  return renderBlock(emailData);
}

// Convert email JSON structure to HTML
export function JsonToHtml(emailData) {
  if (!emailData) return '';

  const renderBlock = (block) => {
    const { type, attributes = {}, data = {}, children = [] } = block;
    
    // Convert attributes to CSS style
    const styleString = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    switch (type) {
      case BLOCK_TYPES.PAGE:
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email</title>
</head>
<body style="${styleString}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="${attributes.width || '600px'}" cellpadding="0" cellspacing="0" border="0">
          ${children.map(renderBlock).join('\n          ')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      case BLOCK_TYPES.SECTION:
        return `<tr>
            <td style="${styleString}">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${children.map(renderBlock).join('\n                ')}
              </table>
            </td>
          </tr>`;

      case BLOCK_TYPES.COLUMN:
        return `<tr>
                  <td style="${styleString}">
                    ${children.map(renderBlock).join('\n                    ')}
                  </td>
                </tr>`;

      case BLOCK_TYPES.TEXT:
        return `<tr>
                    <td style="${styleString}">
                      ${data.value?.content || ''}
                    </td>
                  </tr>`;

      case BLOCK_TYPES.IMAGE:
        return `<tr>
                    <td style="${styleString}">
                      <img src="${data.value?.src || ''}" alt="${data.value?.alt || ''}" style="max-width: 100%; height: auto; display: block;" />
                    </td>
                  </tr>`;

      case BLOCK_TYPES.BUTTON:
        return `<tr>
                    <td style="${styleString}; text-align: center;">
                      <a href="${data.value?.href || '#'}" style="display: inline-block; padding: 10px 25px; background-color: ${attributes['background-color'] || '#414141'}; color: ${attributes.color || '#ffffff'}; text-decoration: none; border-radius: ${attributes['border-radius'] || '3px'};">
                        ${data.value?.content || 'Button'}
                      </a>
                    </td>
                  </tr>`;

      case BLOCK_TYPES.DIVIDER:
        return `<tr>
                    <td style="${styleString}">
                      <hr style="border: none; border-top: 1px solid ${attributes['border-color'] || '#cccccc'}; margin: 10px 0;" />
                    </td>
                  </tr>`;

      case BLOCK_TYPES.SPACER:
        return `<tr>
                    <td style="height: ${attributes.height || '20px'}; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  </tr>`;

      default:
        return `<!-- Unknown block type: ${type} -->`;
    }
  };

  return renderBlock(emailData);
}

export default { JsonToMjml, JsonToHtml };