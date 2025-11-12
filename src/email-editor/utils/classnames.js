// Utility function for combining class names
export function classnames(...args) {
  return args
    .filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}