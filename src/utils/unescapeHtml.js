/**
 * Return the text with unescaped characters
 * @param {text} The text to unescape
 * @returns unescaped text
 */
const unescapeHtml = (text) => {
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
};


export { unescapeHtml};
