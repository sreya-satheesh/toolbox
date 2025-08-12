'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function jsMinify(code: string) {
    return code
        // Remove single-line and multi-line comments
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
        // Remove extra spaces and newlines
        .replace(/\s+/g, ' ')
        // Remove space before/after symbols
        .replace(/\s*([=+\-*/{}();,:<>])\s*/g, '$1')
        // Remove semicolons before closing braces
        .replace(/;}/g, '}')
        // Remove braces for single-line loops/ifs
        .replace(/for\((.*?)\){\s*(.*?)\s*}/g, 'for($1)$2')
        .replace(/if\((.*?)\){\s*(.*?)\s*}/g, 'if($1)$2')
        .trim();
}

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleMinify = () => {
    const minified = jsMinify(input);
    setOutput(minified);
  };

  return (
    <ToolContainer toolId="js-minifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your JavaScript code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Minified code will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90">Minify JS</Button>
      </div>
    </ToolContainer>
  );
}
