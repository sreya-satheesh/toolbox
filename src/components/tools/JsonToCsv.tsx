'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function jsonToCsv(jsonString: string): string {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format.');
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Input must be a non-empty array of objects.');
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.map(header => `"${header}"`).join(','));

  // Add data rows
  for (const row of data) {
    if (typeof row !== 'object' || row === null) continue;
    const values = headers.map(header => {
      const value = row[header as keyof typeof row] ?? '';
      const stringValue = String(value);
      // Escape double quotes by doubling them
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}


export default function JsonToCsv() {
  const [input, setInput] = useState(JSON.stringify([
    { "name": "Alice", "age": "30", "city": "New York" },
    { "name": "Bob", "age": "25", "city": "Los Angeles" },
    { "name": "Charlie", "age": "35", "city": "Chicago" }
  ], null, 2));
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
        const csvOutput = jsonToCsv(input);
        setOutput(csvOutput);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: error.message || 'Failed to convert JSON to CSV.',
        });
        setOutput('');
    }
  };

  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="json-to-csv">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your JSON data here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="CSV output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to CSV</Button>
      </div>
    </ToolContainer>
  );
}
