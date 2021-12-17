/***************************************************************************************
 *    Title: <title of program/source code>
 *    Author: <author(s) names>
 *    Date: <date>
 *    Code version: <code version>
 *    Availability: <where it's located, URL>
 *
 ***************************************************************************************/
const unescapeHtml = (text) => {
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
};


export { unescapeHtml};