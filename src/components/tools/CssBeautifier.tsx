'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CssBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleBeautify = () => {
    // Basic beautification mock. This is a placeholder for a real library.
    const beautified = input
      .replace(/\s*({)\s*/g, ' {\n\t')
      .replace(/\s*(;)\s*/g, ';\n\t')
      .replace(/\s*(})\s*/g, '\n}\n')
      .replace(/\t(?=})/g, '')
      .trim();
    setOutput(beautified);
  };

  return (
    <ToolContainer toolId="css-beautifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your CSS code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Beautified CSS will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleBeautify}>Beautify CSS</Button>
      </div>
    </ToolContainer>
  );
}
