
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function csvToJson(csv: string) {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('CSV must have a header and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: { [key: string]: string } = {};
    const currentline = lines[i].split(',');

    if(currentline.length !== headers.length){
        throw new Error(`Row ${i+1} has a different number of columns than the header.`);
    }

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j].trim();
    }
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}


export default function CsvToJson() {
  const [input, setInput] = useState('name,age,city\nAlice,30,New York\nBob,25,Los Angeles');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some CSV data to convert.',
        });
        return;
    }
    
    try {
        const jsonOutput = csvToJson(input);
        setOutput(jsonOutput);
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: error.message || 'Failed to convert CSV to JSON.',
        });
        setOutput('');
    }
  };
  
  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="csv-to-json">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2">
            <label htmlFor="csv-input" className="text-sm font-medium">CSV Input</label>
            <Textarea
              id="csv-input"
              placeholder="Paste your CSV data here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-full min-h-[300px] resize-none font-code"
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="json-output" className="text-sm font-medium">JSON Output</label>
            <Textarea
              id="json-output"
              placeholder="JSON output will appear here..."
              value={output}
              readOnly
              className="h-full min-h-[300px] resize-none font-code bg-muted/50"
            />
        </div>
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to JSON</Button>
      </div>
    </ToolContainer>
  );
}
