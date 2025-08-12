'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import showdown from 'showdown';

const converter = new showdown.Converter();

export default function MarkdownToHtml() {
  const [input, setInput] = useState(
`# Welcome to My Page

This is a **bold** statement and this is *italic* text.

- Item 1
- Item 2
- Item 3

[Click here](https://example.com) to visit example.com.`
  );
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some Markdown to convert.',
        });
        return;
    }
    
    try {
      const html = converter.makeHtml(input);
      setOutput(html);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Conversion Error',
        description: 'Failed to convert Markdown to HTML.',
      });
    }
  };
  
  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="markdown-to-html">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your Markdown here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="HTML output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to HTML</Button>
      </div>
    </ToolContainer>
  );
}
