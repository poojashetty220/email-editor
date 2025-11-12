// Convert spacing string values to CSS pixel values
export const toPx = (value) => {
  if (!value || value === '') return '0px';
  if (typeof value === 'string' && value.includes('px')) return value;
  return `${value}px`;
};

// Convert spacing shorthand to individual values with px
export const parseSpacingToPx = (spacing) => {
  if (!spacing || spacing === '') return undefined;
  
  const parts = spacing.trim().split(/\s+/);
  const pxParts = parts.map(part => toPx(part));
  
  return pxParts.join(' ');
};