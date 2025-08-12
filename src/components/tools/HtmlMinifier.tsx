'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function cssMinify(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around symbols
    .replace(/;}/g, '}')              // Remove semicolons before braces
    .trim();
}

export default function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleMinify = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let minified = input;

    // Minify CSS inside <style> tags
    minified = minified.replace(/<style.*?>([\s\S]*?)<\/style>/gi, (match, styleContent) => {
        return `<style>${cssMinify(styleContent)}</style>`;
    });

    // Remove HTML comments
    minified = minified.replace(/<!--[\s\S]*?-->/g, '');

    // Collapse whitespace and newlines
    minified = minified
      .replace(/\r?\n|\r/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s\s+/g, ' ')
      .trim();

    setOutput(minified);
  };

  return (
    <ToolContainer toolId="html-minifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your HTML code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Minified HTML will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90">Minify HTML</Button>
      </div>
    </ToolContainer>
  );
}
