
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function Base64ToImage() {
  const [base64String, setBase64String] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleProcess = () => {
    setError('');
    setImageSrc('');
    if (!base64String) {
      toast({
        variant: 'destructive',
        title: 'Input Empty',
        description: 'Please paste a Base64 string.',
      });
      return;
    }

    try {
      // Basic validation
      if (!base64String.startsWith('data:image/')) {
        throw new Error('Invalid Base64 image string. It must start with "data:image/".');
      }
      atob(base64String.split(',')[1]); // Check if it's valid base64
      setImageSrc(base64String);
    } catch (err: any) {
      setError('Invalid Base64 string. Please check the input.');
      toast({
        variant: 'destructive',
        title: 'Conversion Error',
        description: err.message || 'Could not decode the Base64 string.',
      });
    }
  };

  return (
    <ToolContainer toolId="base64-to-image">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Paste Base64 string here..."
              value={base64String}
              onChange={(e) => setBase64String(e.target.value)}
              className="h-full min-h-[300px] resize-none font-code"
            />
            <Button onClick={handleProcess}>Convert to Image</Button>
        </div>
        <div className="flex items-center justify-center border-2 border-dashed border-muted rounded-lg p-4">
            {imageSrc && !error && (
                 <img src={imageSrc} alt="Converted from Base64" className="max-w-full max-h-96 rounded-md object-contain" />
            )}
             {!imageSrc && !error && (
                 <p className="text-muted-foreground">Image preview will appear here.</p>
            )}
            {error && <p className="text-destructive">{error}</p>}
        </div>
      </div>
    </ToolContainer>
  );
}
