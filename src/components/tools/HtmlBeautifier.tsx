'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function HtmlBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const beautifyCss = (css: string) => {
    return css
      .replace(/\s*({)\s*/g, ' {\n    ')
      .replace(/\s*(;)\s*/g, ';\n    ')
      .replace(/;\s*(})/g, ';\n}')
      .replace(/\s*}/g, '\n  }')
      .trim();
  };

  const handleBeautify = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let beautifiedHtml = input;

    // First, beautify the CSS inside <style> tags
    beautifiedHtml = beautifiedHtml.replace(
      /<style.*?>([\s\S]*?)<\/style>/gi,
      (match, styleContent) => {
        return `<style>\n  ${beautifyCss(styleContent)}\n</style>`;
      }
    );

    // Now, format the HTML structure
    let indentLevel = 0;
    const indentChar = '  '; // two spaces
    const formattedLines = [];
    const lines = beautifiedHtml.replace(/>\s*</g, '>\n<').split('\n');

    let inStyleTag = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      if (trimmedLine.toLowerCase() === '<style>') {
          inStyleTag = true;
          formattedLines.push(indentChar.repeat(indentLevel) + trimmedLine);
          indentLevel++;
          continue;
      }
      
      if (trimmedLine.toLowerCase() === '</style>') {
          inStyleTag = false;
          indentLevel = Math.max(0, indentLevel - 1);
          formattedLines.push(indentChar.repeat(indentLevel) + trimmedLine);
          continue;
      }

      if (inStyleTag) {
        // We already formatted style content, just indent it
        formattedLines.push(indentChar.repeat(indentLevel) + trimmedLine);
      } else {
        formattedLines.push(indentChar.repeat(indentLevel) + trimmedLine);
        // Do not indent self-closing tags or tags that close on the same line
        if (
          trimmedLine.startsWith('<') &&
          !trimmedLine.startsWith('</') &&
          !trimmedLine.endsWith('/>') &&
          !line.includes('</')
        ) {
          indentLevel++;
        }
      }
    }

    setOutput(formattedLines.join('\n'));
  };

  return (
    <ToolContainer toolId="html-beautifier">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your HTML code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Beautified HTML will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleBeautify}>Beautify HTML</Button>
      </div>
    </ToolContainer>
  );
}
