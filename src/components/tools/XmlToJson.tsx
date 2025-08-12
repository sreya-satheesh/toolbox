'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { XMLParser } from 'fast-xml-parser';

export default function XmlToJson() {
  const [input, setInput] = useState(`<people>
  <person>
    <name>Alice</name>
    <age>30</age>
    <city>New York</city>
  </person>
  <person>
    <name>Bob</name>
    <age>25</age>
    <city>Los Angeles</city>
  </person>
</people>`);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some XML data to convert.',
        });
        return;
    }
    
    try {
        const parser = new XMLParser();
        const jsonObj = parser.parse(input);
        setOutput(JSON.stringify(jsonObj, null, 2));
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Invalid XML',
            description: 'The provided string could not be parsed as XML.',
        });
        setOutput('');
    }
  };

  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="xml-to-json">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your XML data here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="JSON output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to JSON</Button>
      </div>
    </ToolContainer>
  );
}
