'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

export default function HtmlToMarkdown() {
  const [input, setInput] = useState(
`<h1>Welcome to My Page</h1>
<p>This is a <b>bold</b> statement and this is <i>italic</i> text.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<p><a href="https://example.com">Click here</a> to visit example.com.</p>`
  );
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some HTML to convert.',
        });
        return;
    }
    
    try {
        const markdown = turndownService.turndown(input);
        setOutput(markdown);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: 'Failed to convert HTML to Markdown.',
        });
    }
  };
  
  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="html-to-markdown">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your HTML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Markdown output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to Markdown</Button>
      </div>
    </ToolContainer>
  );
}
