
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageResizer() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    setOriginalFile(file);
    setResizedImage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleResize = () => {
    if (!originalFile || targetWidth <= 0 || targetHeight <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please select an image and enter valid dimensions.',
      });
      return;
    }

    setIsResizing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsResizing(false);
            return;
        };
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL(originalFile.type);
        setResizedImage(dataUrl);
        setIsResizing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(originalFile);
  };

  return (
    <ToolContainer toolId="image-resizer">
       <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            <ImageInput onImageChange={handleImageChange} />
             {originalFile && (
                <div className="space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                        Original: {originalDimensions.width} x {originalDimensions.height}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="width">Width</Label>
                            <Input id="width" type="number" value={targetWidth} onChange={e => setTargetWidth(Number(e.target.value))} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" type="number" value={targetHeight} onChange={e => setTargetHeight(Number(e.target.value))} />
                        </div>
                    </div>
                </div>
             )}
            <Button onClick={handleResize} disabled={!originalFile || isResizing}>
                {isResizing ? 'Resizing...' : 'Resize Image'}
            </Button>
        </div>
        <div className="w-full md:w-2/3">
            <Card className="h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-4">
                    {resizedImage ? (
                        <>
                            <img src={resizedImage} alt="Resized" className="max-w-full max-h-96 rounded-md object-contain" />
                             <a href={resizedImage} download={`resized-${originalFile?.name}`} className="w-full max-w-xs">
                                <Button variant="secondary" className="w-full">Download</Button>
                            </a>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-center">Your resized image will appear here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
