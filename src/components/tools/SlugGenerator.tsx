'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function generateSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export default function SlugGenerator() {
  const [input, setInput] = useState('Hello World! This is a test.');
  
  const slug = useMemo(() => generateSlug(input), [input]);

  return (
    <ToolContainer toolId="slug-generator">
        <div className="flex flex-col gap-4 flex-1">
            <div className="grid gap-2">
                <Label htmlFor="input-string">Input String</Label>
                <Textarea
                    id="input-string"
                    placeholder="Enter your string here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-48 resize-y"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="output-slug">Generated Slug</Label>
                <Input
                    id="output-slug"
                    placeholder="URL-friendly slug will appear here"
                    value={slug}
                    readOnly
                    className="bg-muted/50 font-code"
                />
            </div>
        </div>
    </ToolContainer>
  );
}
