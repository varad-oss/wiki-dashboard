// src/components/WikiText.js
import React from 'react';

const WikiText = ({ text }) => {
  if (!text) {
    return null;
  }

  // Function to clean Wikipedia markup
  const cleanWikiMarkup = (text) => {
    return text
      // Remove bold markup '''text''' -> text (but keep the text bold)
      .replace(/'''([^']+)'''/g, '<strong>$1</strong>')
      // Remove italic markup ''text'' -> text (but keep the text italic)  
      .replace(/''([^']+)''/g, '<em>$1</em>')
      // Remove internal links [[Link|Text]] -> Text or [[Link]] -> Link
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      // Remove external links [http://example.com Text] -> Text
      .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1')
      // Remove simple external links [http://example.com] -> (remove entirely)
      .replace(/\[https?:\/\/[^\s\]]+\]/g, '')
      // Remove file/image references
      .replace(/\[\[File:[^\]]+\]\]/gi, '')
      .replace(/\[\[Image:[^\]]+\]\]/gi, '')
      // Remove citations and references like [1], [citation needed], etc.
      .replace(/\[(\d+|citation needed|when\?|by whom\?|according to whom\?)\]/gi, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Split text into paragraphs and headings, but handle them better
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const parts = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if it's a heading
    if (line.match(/^=+\s*.+\s*=+$/)) {
      const headingText = line.replace(/=+/g, '').trim();
      if (headingText) {
        parts.push({ type: 'heading', content: headingText });
      }
    } else {
      // It's regular text - clean the markup
      const cleanedText = cleanWikiMarkup(line);
      if (cleanedText) {
        parts.push({ type: 'paragraph', content: cleanedText });
      }
    }
  }

  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === 'heading') {
          return (
            <h3 key={index} className="text-xl font-bold text-slate-100 mt-6 mb-2">
              {part.content}
            </h3>
          );
        } else {
          return (
            <p 
              key={index} 
              className="text-slate-300 leading-relaxed text-base mb-4"
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          );
        }
      })}
    </div>
  );
};

export default WikiText;