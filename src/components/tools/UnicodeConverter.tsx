'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function UnicodeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const toUnicode = () => {
    if (!input) return;
    try {
      const unicodeString = Array.from(input)
        .map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
        .join('');
      setOutput(unicodeString);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not convert to Unicode.' });
    }
  };
  
  const fromUnicode = () => {
    if (!input) return;
    try {
      const textString = input.replace(/\\u[\dA-F]{4}/gi, 
        (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      );
      setOutput(textString);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid Unicode sequence.' });
    }
  };

  return (
    <ToolContainer toolId="unicode-converter">
        <Textarea
          placeholder="Enter text or Unicode sequences..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-full min-h-[200px] resize-y font-code"
        />
        <Textarea
          placeholder="Output..."
          value={output}
          readOnly
          className="flex-1 h-full min-h-[200px] resize-y font-code bg-muted/50"
        />
      <div className="flex flex-wrap gap-2">
        <Button onClick={toUnicode}>Text to Unicode</Button>
        <Button onClick={fromUnicode}>Unicode to Text</Button>
      </div>
    </ToolContainer>
  );
}
