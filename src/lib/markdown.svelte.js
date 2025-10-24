/**
 * Markdown Rendering Utility
 * Handles conversion of spell descriptions to HTML with sanitization
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Process spell description text and handle special table formatting
 * Tables in the D&D API are marked with | characters
 * 
 * @param {string[]} descriptionLines - Array of description lines
 * @returns {string} - Processed text ready for markdown conversion
 */
function processDescriptionLines(descriptionLines) {
    let processedText = "";
    let inTable = false;

    for (const line of descriptionLines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('|')) {
            // Table row - keep on same line
            processedText += trimmedLine + '\n';
            inTable = true;
        } else if (inTable) {
            // End of table - add spacing
            processedText += '\n' + line + '\n\n';
            inTable = false;
        } else {
            // Regular paragraph
            processedText += line + '\n\n';
            inTable = false;
        }
    }

    return processedText;
}

/**
 * Render spell description from markdown to HTML with sanitization
 * Handles both main description and higher level casting information
 * Uses DOMPurify to sanitize the HTML output and prevent XSS attacks
 *
 * @param {Object} spellDetails - Spell detail object
 * @param {string[]} spellDetails.desc - Main description lines
 * @param {string[]} [spellDetails.higher_level] - Higher level casting description
 * @returns {string} - Sanitized HTML string rendered from markdown
 */
export function renderSpellDescription(spellDetails) {
    if (!spellDetails) return '';

    let allText = "";

    // Process the main description
    allText += processDescriptionLines(spellDetails.desc);

    // Process higher level information if it exists
    if (spellDetails.higher_level && spellDetails.higher_level.length > 0) {
        allText += '\n\n## At Higher Levels\n\n';
        allText += processDescriptionLines(spellDetails.higher_level);
    }

    // Convert markdown to HTML
    // Convert markdown to HTML
    const rawHtml = marked(allText);

    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml);
}

