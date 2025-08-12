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

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleMinify = () => {
    const minified = cssMinify(input);
    setOutput(minified);
  };

  return (
    <ToolContainer toolId="css-minifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your CSS code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Minified CSS will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90">Minify CSS</Button>
      </div>
    </ToolContainer>
  );
}
