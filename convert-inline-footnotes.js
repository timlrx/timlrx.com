import { visit } from 'unist-util-visit';

function convertInlineFootnotes() {
    return (tree) => {
        let footnoteCount = 1;
        const footnotes = [];
        const existingFootnotes = new Set();

        // Collect existing footnote definitions and references
        visit(tree, 'footnoteDefinition', (node) => {
            const footnoteId = parseInt(node.identifier, 10);
            if (!isNaN(footnoteId)) {
                existingFootnotes.add(footnoteId);
                footnoteCount = Math.max(footnoteCount, footnoteId + 1);
            }
        });

        visit(tree, 'footnoteReference', (node) => {
            const footnoteId = parseInt(node.identifier, 10);
            if (!isNaN(footnoteId)) {
                existingFootnotes.add(footnoteId);
                footnoteCount = Math.max(footnoteCount, footnoteId + 1);
            }
        });

        // Process inline footnotes
        visit(tree, 'text', (node, index, parent) => {
            const inlineFootnoteRegex = /\^\[(.+?)\]/g;
            let match;
            let lastIndex = 0;
            const newChildren = [];

            while ((match = inlineFootnoteRegex.exec(node.value)) !== null) {
                const footnoteText = match[1];
                let footnoteId = footnoteCount;

                // Find the next available footnote ID
                while (existingFootnotes.has(footnoteId)) {
                    footnoteId++;
                }
                existingFootnotes.add(footnoteId);
                footnoteCount = footnoteId + 1;

                // Add text before the footnote
                if (match.index > lastIndex) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex, match.index),
                    });
                }

                // Add the footnote reference
                newChildren.push({
                    type: 'footnoteReference',
                    identifier: String(footnoteId),
                    label: String(footnoteId),
                });

                // Collect the footnote definition
                footnotes.push({
                    type: 'footnoteDefinition',
                    identifier: String(footnoteId),
                    label: String(footnoteId),
                    children: [{
                        type: 'paragraph',
                        children: [{
                            type: 'text',
                            value: footnoteText,
                        }],
                    }],
                });

                lastIndex = inlineFootnoteRegex.lastIndex;
            }

            // Add remaining text after the last footnote
            if (lastIndex < node.value.length) {
                newChildren.push({
                    type: 'text',
                    value: node.value.slice(lastIndex),
                });
            }

            if (newChildren.length > 0) {
                parent.children.splice(index, 1, ...newChildren);
            }
        });

        // Append the collected footnotes at the end of the document
        if (footnotes.length > 0) {
            tree.children.push(...footnotes);
        }
    };
}

export default convertInlineFootnotes;
