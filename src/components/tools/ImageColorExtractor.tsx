
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Card, CardContent } from '@/components/ui/card';

type RgbColor = { r: number; g: number; b: number; };

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase();
}

// A more robust color quantization algorithm: Median Cut
function getPalette(pixels: Uint8ClampedArray, colorCount = 8): string[] {
    const pixelArray: RgbColor[] = [];
    // Sample a portion of pixels for performance
    const sampleRate = Math.max(1, Math.floor(pixels.length / 4 / 20000)); 
    for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
        if (pixels[i+3] >= 128) { // Only consider non-transparent pixels
            pixelArray.push({ r: pixels[i], g: pixels[i+1], b: pixels[i+2] });
        }
    }

    if (pixelArray.length === 0) return [];

    const getRange = (pixels: RgbColor[], component: 'r' | 'g' | 'b') => {
        const values = pixels.map(p => p[component]);
        return Math.max(...values) - Math.min(...values);
    };

    // Start with a single bucket containing all pixels
    let buckets: RgbColor[][] = [pixelArray];

    while (buckets.length < colorCount) {
        // Find the bucket with the greatest color range
        let bucketToSplitIndex = -1;
        let maxRange = -1;
        
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].length === 0) continue;
            const rRange = getRange(buckets[i], 'r');
            const gRange = getRange(buckets[i], 'g');
            const bRange = getRange(buckets[i], 'b');
            const currentMaxRange = Math.max(rRange, gRange, bRange);
            if (currentMaxRange > maxRange) {
                maxRange = currentMaxRange;
                bucketToSplitIndex = i;
            }
        }
        
        if (bucketToSplitIndex === -1) break; // No more buckets to split

        const bucketToSplit = buckets[bucketToSplitIndex];
        const rRange = getRange(bucketToSplit, 'r');
        const gRange = getRange(bucketToSplit, 'g');
        const bRange = getRange(bucketToSplit, 'b');

        // Determine which color component has the widest range
        const splitComponent = rRange >= gRange && rRange >= bRange ? 'r' : (gRange >= bRange ? 'g' : 'b');

        // Sort the bucket by the chosen component
        bucketToSplit.sort((a, b) => a[splitComponent] - b[splitComponent]);

        // Split the bucket at the median
        const medianIndex = Math.floor(bucketToSplit.length / 2);
        
        const newBucket1 = bucketToSplit.slice(0, medianIndex);
        const newBucket2 = bucketToSplit.slice(medianIndex);

        // Replace the original bucket with the two new ones
        buckets.splice(bucketToSplitIndex, 1, newBucket1, newBucket2);
    }

    // Average the colors in each bucket to get the final palette
    const palette = buckets.map(bucket => {
        if (bucket.length === 0) return null;
        const total = bucket.reduce((acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }), { r: 0, g: 0, b: 0 });
        const avg = {
            r: Math.round(total.r / bucket.length),
            g: Math.round(total.g / bucket.length),
            b: Math.round(total.b / bucket.length),
        };
        return rgbToHex(avg.r, avg.g, avg.b);
    });

    return palette.filter((c): c is string => c !== null);
}


export default function ImageColorExtractor() {
  const [palette, setPalette] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    if (!file) return;
    setPalette([]);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not process image.' });
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const extractedPalette = getPalette(imageData.data, 8);
          
        setPalette(extractedPalette);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load image.' });
      }
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({ title: 'Copied!', description: `Color ${color} copied to clipboard.`});
  }

  return (
    <ToolContainer toolId="image-color-extractor">
       <div className="grid md:grid-cols-2 gap-4">
        <ImageInput onImageChange={handleImageChange} />
        <Card>
            <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Extracted Colors</h3>
                {isProcessing && <p className="text-muted-foreground">Extracting colors...</p>}
                {!isProcessing && palette.length === 0 && <p className="text-muted-foreground">Upload an image to see its color palette.</p>}
                {palette.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {palette.map((color, index) => (
                            <div key={`${color}-${index}`} className="flex flex-col items-center gap-2" onClick={() => handleCopy(color)}>
                                <div className="w-full h-16 rounded-md border" style={{backgroundColor: color}}/>
                                <p className="font-code text-sm cursor-pointer">{color}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
       </div>
    </ToolContainer>
  );
}
