
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const escapeChars: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

const escapeRegex = new RegExp(`[${Object.keys(escapeChars).join('')}]`, 'g');

export default function StringEscaper() {
  const [input, setInput] = useState('<script>alert("XSS")</script>');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEscape = () => {
    if (!input) {
      setOutput('');
      return;
    }
    try {
      const escaped = input.replace(escapeRegex, (s) => escapeChars[s]);
      setOutput(escaped);
    } catch(e) {
       toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not escape the string.',
        });
    }
  };
  
  useState(() => {
    handleEscape();
  });

  return (
    <ToolContainer toolId="string-escaper">
       <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Enter string to escape..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Escaped output..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleEscape}>Escape String</Button>
      </div>
    </ToolContainer>
  );
}
