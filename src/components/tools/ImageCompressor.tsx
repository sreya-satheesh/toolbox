
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    setOriginalFile(file);
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);
  };

  const handleCompress = () => {
    if (!originalFile) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image file to compress.',
      });
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsCompressing(false);
            return;
        };
        ctx.drawImage(img, 0, 0);

        // Use a default quality for compression
        const quality = 0.8;
        const compressedDataUrl = canvas.toDataURL(originalFile.type, quality);
        
        const base64Data = compressedDataUrl.split(',')[1];
        const byteLength = (base64Data.length * 3) / 4 - (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0);

        // Only set the compressed image if it's smaller than the original
        if (byteLength < originalFile.size) {
            setCompressedImage(compressedDataUrl);
            setCompressedSize(byteLength);
        } else {
            // If compression doesn't help, use the original image
            setCompressedImage(e.target?.result as string);
            setCompressedSize(originalFile.size);
            toast({
                title: 'Image is already optimized',
                description: "We couldn't reduce the file size further. The original image will be used.",
            });
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Image Load Error',
            description: 'There was an error loading the image for compression.',
        });
        setIsCompressing(false);
      }
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'There was an error reading the file.',
        });
        setIsCompressing(false);
    }
    reader.readAsDataURL(originalFile);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDownloadFileName = () => {
    if (!originalFile) return 'compressed-image.jpg';
    const name = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const extension = originalFile.type.split('/')[1] || 'jpg';
    return `compressed-${name}.${extension}`;
  }

  return (
    <ToolContainer toolId="image-compressor">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageInput onImageChange={handleImageChange} />
          <Button onClick={handleCompress} disabled={!originalFile || isCompressing}>
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </Button>
        </div>
        <div className="w-full md:w-2/3">
           <Card className="h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-4">
              {compressedImage ? (
                <>
                    <div className="text-center space-y-4">
                    <img src={compressedImage} alt="Compressed" className="max-w-full max-h-80 rounded-md object-contain" />
                    <div className="flex justify-around text-sm flex-wrap gap-x-4 gap-y-2">
                        <p>Original: <span className="font-semibold">{formatSize(originalSize)}</span></p>
                        <p>Compressed: <span className="font-semibold text-primary">{formatSize(compressedSize)}</span></p>
                        {originalSize > compressedSize ? (
                        <p>Reduction: <span className="font-semibold text-green-500">{(((originalSize - compressedSize) / originalSize) * 100).toFixed(2)}%</span></p>
                        ) : (
                        <p>Reduction: <span className="font-semibold">0%</span></p>
                        )}
                    </div>
                    </div>
                    <a href={compressedImage} download={getDownloadFileName()} className="w-full max-w-xs">
                        <Button variant="secondary" className="w-full">Download</Button>
                    </a>
                </>
              ) : (
                <p className="text-muted-foreground">Compressed image will appear here.</p>
              )}
            </CardContent>
           </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
