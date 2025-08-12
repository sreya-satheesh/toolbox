'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { XMLBuilder } from 'fast-xml-parser';

function convertJsonToXml(jsonString: string): string {
  let jsonObj;
  try {
    jsonObj = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format.');
  }

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    suppressEmptyNode: true,
  });
  
  return builder.build(jsonObj);
}


export default function JsonToXml() {
  const [input, setInput] = useState(JSON.stringify({
    people: {
      person: [
        { name: 'Alice', age: 30, city: 'New York' },
        { name: 'Bob', age: 25, city: 'Los Angeles' },
      ],
    },
  }, null, 2));
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some JSON data to convert.',
        });
        return;
    }
    
    try {
        const xmlOutput = convertJsonToXml(input);
        setOutput(xmlOutput);
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: error.message || 'Failed to convert JSON to XML.',
        });
        setOutput('');
    }
  };
  
  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="json-to-xml">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your JSON data here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="XML output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to XML</Button>
      </div>
    </ToolContainer>
  );
}
