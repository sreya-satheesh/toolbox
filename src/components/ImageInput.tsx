
'use client';

import { useRef, useState, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type ImageInputProps = {
  onImageChange: (file: File) => void;
};

export function ImageInput({ onImageChange }: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please select an image file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
        ${isDragging ? 'border-primary bg-primary/10' : 'border-muted'}
      `}
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
        className="hidden"
        accept="image/*"
      />
      {preview ? (
        <>
          <Image src={preview} alt="Image preview" width={200} height={200} className="mx-auto max-h-48 w-auto rounded-md object-contain" />
          <Button variant="link" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Change Image
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Upload className="size-8" />
          <p>Drag & drop an image here</p>
          <p className="text-xs">or</p>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
