// PostCSS plugin: decode HTML entities inside CSS url() values.
// Tailwind v4 HTML-encodes chars found in JSX source (&#x27; for ', &amp; for &),
// which makes webpack's css-loader misparse them as module paths (./&).
module.exports = () => ({
  postcssPlugin: 'decode-url-entities',
  Declaration(decl) {
    if (decl.value && decl.value.includes('&#')) {
      decl.value = decl.value
        .replace(/&#x27;/gi, "'")
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"');
    }
  },
});
module.exports.postcss = true;
