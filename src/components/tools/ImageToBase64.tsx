
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ImageToBase64() {
  const [base64String, setBase64String] = useState('');
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    if (!file) {
      setBase64String('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64String(e.target?.result as string);
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Error',
            description: 'Could not read the selected file.',
        });
    }
    reader.readAsDataURL(file);
  };
  
  const handleCopy = () => {
    if(!base64String) {
        toast({
            variant: 'destructive',
            title: 'Nothing to copy',
            description: 'Please upload an image first.',
        });
        return;
    };
    navigator.clipboard.writeText(base64String);
    toast({
        title: 'Copied to Clipboard',
        description: 'The Base64 string has been copied.',
    });
  }

  return (
    <ToolContainer toolId="image-to-base64">
       <div className="grid md:grid-cols-2 gap-4 flex-1">
          <ImageInput onImageChange={handleImageChange} />
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Base64 output will appear here..."
              value={base64String}
              readOnly
              className="h-full min-h-[300px] resize-none font-code bg-muted/50"
            />
             <Button onClick={handleCopy} disabled={!base64String}>Copy to Clipboard</Button>
          </div>
      </div>
    </ToolContainer>
  );
}
