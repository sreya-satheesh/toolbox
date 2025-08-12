
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const unescapeHtmlEntities = (text: string) => {
  if (typeof window === 'undefined') return text;
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent || '';
};

// Unescape common backslash sequences
const unescapeSequences: { [key: string]: string } = {
  '\\n': '\n',
  '\\r': '\r',
  '\\t': '\t',
  '\\b': '\b',
  '\\f': '\f',
  '\\\\': '\\',
  '\\\'': '\'',
  '\\"': '"'
};
const unescapeSequencesRegex = /(\\n|\\r|\\t|\\b|\\f|\\\\|\\\'|\\")/g;


export default function StringUnescaper() {
  const [input, setInput] = useState('She said, &quot;Hello! How&#39;s everything going?\\nAre you coming?&quot;');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleUnescape = () => {
    if (!input) {
      setOutput('');
      return;
    }
    try {
      // First, handle HTML entities more robustly
      let unescaped = unescapeHtmlEntities(input);
      
      // Then, handle backslash escape sequences
      unescaped = unescaped.replace(unescapeSequencesRegex, (s) => unescapeSequences[s]);

      setOutput(unescaped);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error Unescaping',
            description: 'Could not unescape the provided string.'
        })
    }
  };

  useState(() => {
    handleUnescape();
  });

  return (
    <ToolContainer toolId="string-unescaper">
       <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Enter escaped string..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Unescaped output..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleUnescape}>Unescape String</Button>
      </div>
    </ToolContainer>
  );
}
