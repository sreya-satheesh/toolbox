'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function JsBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleBeautify = () => {
    // Basic beautification mock. This is a placeholder for a real library like js-beautify.
    // It adds newlines after semicolons and braces.
    const beautified = input
      .replace(/;/g, ';\n')
      .replace(/{/g, '{\n')
      .replace(/}/g, '\n}\n');
    setOutput(beautified);
  };

  return (
    <ToolContainer toolId="js-beautifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your JavaScript code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Beautified code will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleBeautify}>Beautify JS</Button>
      </div>
    </ToolContainer>
  );
}
