
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageFormatConverter() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    setOriginalFile(file);
    setConvertedImage(null);
  };

  const handleConvert = () => {
    if (!originalFile) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image file to convert.',
      });
      return;
    }

    setIsConverting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsConverting(false);
          return;
        }
        
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL(targetFormat);
        setConvertedImage(dataUrl);
        setIsConverting(false);
      };
      img.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Image Load Error',
          description: 'There was an error loading the image.',
        });
        setIsConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'There was an error reading the file.',
      });
      setIsConverting(false);
    };
    reader.readAsDataURL(originalFile);
  };

  return (
    <ToolContainer toolId="image-converter">
       <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            <ImageInput onImageChange={handleImageChange} />
            <Select value={targetFormat} onValueChange={(value: ImageFormat) => setTargetFormat(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select target format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleConvert} disabled={!originalFile || isConverting}>
              {isConverting ? 'Converting...' : 'Convert Image'}
            </Button>
        </div>
        <div className="w-full md:w-2/3">
          <Card className="h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-4">
              {convertedImage ? (
                <>
                  <img src={convertedImage} alt="Converted" className="max-w-full max-h-96 rounded-md object-contain" />
                  <a href={convertedImage} download={`converted.${targetFormat.split('/')[1]}`} className="w-full max-w-xs">
                      <Button variant="secondary" className="w-full">Download</Button>
                  </a>
                </>
              ) : (
                  <p className="text-muted-foreground text-center">Your converted image will appear here.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
