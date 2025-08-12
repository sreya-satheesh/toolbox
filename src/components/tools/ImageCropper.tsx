
'use client';

import { useState, useRef } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Card, CardContent } from '@/components/ui/card';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

export default function ImageCropper() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    setOriginalFile(file);
    setCroppedImageUrl('');
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(file);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  const handleCrop = async () => {
    if (!originalFile || !crop || !imgRef.current) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an image and define a crop area.',
      });
      return;
    }
    if (crop.width === 0 || crop.height === 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Crop',
        description: 'Please select a crop area.',
      });
      return;
    }

    setIsCropping(true);

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsCropping(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not process image.' });
      return;
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        setIsCropping(false);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not create cropped image.' });
        return;
      }
      const url = URL.createObjectURL(blob);
      setCroppedImageUrl(url);
      setIsCropping(false);
    }, originalFile.type);
  };
  
  const getDownloadFileName = () => {
    if (!originalFile) return 'cropped-image.jpg';
    const name = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const extension = originalFile.type.split('/')[1] || 'jpg';
    return `cropped-${name}.${extension}`;
  }

  return (
    <ToolContainer toolId="image-cropper">
       <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageInput onImageChange={handleImageChange} />
          <Button onClick={handleCrop} disabled={!originalFile || isCropping}>
            {isCropping ? 'Cropping...' : 'Crop Image'}
          </Button>
        </div>
        <div className="w-full md:w-2/3">
           <Card className="h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-4">
                  {imgSrc && (
                    <div className="max-h-[400px] overflow-auto">
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            aspect={16/9}
                        >
                            <img ref={imgRef} src={imgSrc} alt="Source" onLoad={onImageLoad} style={{maxHeight: '400px'}} />
                        </ReactCrop>
                    </div>
                  )}
                  {croppedImageUrl ? (
                    <>
                      <img src={croppedImageUrl} alt="Cropped" className="max-w-full max-h-96 rounded-md object-contain mt-4" />
                       <a href={croppedImageUrl} download={getDownloadFileName()} className="w-full max-w-xs">
                           <Button variant="secondary" className="w-full">Download</Button>
                       </a>
                    </>
                  ) : !imgSrc && (
                    <p className="text-muted-foreground text-center">Upload an image to start cropping.</p>
                  )}
                </CardContent>
            </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
