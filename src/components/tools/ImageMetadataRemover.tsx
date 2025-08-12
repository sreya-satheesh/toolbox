
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageMetadataRemover() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    setOriginalFile(file);
    setProcessedImage(null);
  };
  
  const handleRemoveMetadata = () => {
     if (!originalFile) {
        toast({
            variant: 'destructive',
            title: 'No Image Selected',
            description: 'Please select an image file to remove its metadata.',
        });
        return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if(!ctx) {
                setIsProcessing(false);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not process the image.' });
                return;
            }

            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL(originalFile.type);
            setProcessedImage(dataUrl);
            setIsProcessing(false);
            toast({ title: 'Metadata Removed', description: 'The new image is ready for download.'});
        };
        img.onerror = () => {
            setIsProcessing(false);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load the image.' });
        }
        img.src = e.target?.result as string;
    };
    reader.onerror = () => {
        setIsProcessing(false);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not read the file.' });
    };

    reader.readAsDataURL(originalFile);
  };

  return (
    <ToolContainer toolId="image-metadata-remover">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageInput onImageChange={handleImageChange} />
          <Button onClick={handleRemoveMetadata} disabled={!originalFile || isProcessing}>
            {isProcessing ? 'Processing...' : 'Remove Metadata'}
          </Button>
        </div>
        <div className="w-full md:w-2/3">
           <Card className="h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-4">
              {processedImage ? (
                <>
                    <img src={processedImage} alt="Metadata removed" className="max-w-full max-h-96 rounded-md object-contain" />
                    <a href={processedImage} download={`metadata-removed-${originalFile?.name}`} className="w-full max-w-xs">
                        <Button variant="secondary" className="w-full">Download</Button>
                    </a>
                </>
              ) : (
                <p className="text-muted-foreground text-center">The image with metadata removed will appear here.</p>
              )}
            </CardContent>
           </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
