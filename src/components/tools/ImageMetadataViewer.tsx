
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { useToast } from '@/hooks/use-toast';
import { ImageInput } from '@/components/ImageInput';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as EXIF from 'exif-js';

type Metadata = { [key: string]: any };

export default function ImageMetadataViewer() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (file: File) => {
    if (!file) {
      setMetadata(null);
      setError(null);
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setMetadata(null);

    EXIF.getData(file as any, function(this: any) {
        const allMetaData = EXIF.getAllTags(this);
        if (Object.keys(allMetaData).length > 0) {
            setMetadata(allMetaData);
        } else {
            setError('No EXIF metadata found in this image.');
            toast({
                variant: 'destructive',
                title: 'No Metadata Found',
                description: 'We could not find any EXIF metadata in the selected image.',
            });
        }
        setIsProcessing(false);
    });
  };

  return (
    <ToolContainer toolId="image-metadata-viewer">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageInput onImageChange={handleImageChange} />
        </div>
        <div className="w-full md:w-2/3">
           <Card className="h-full">
            <CardContent className="p-4">
                {isProcessing && <p>Reading metadata...</p>}
                {error && <p className="text-destructive">{error}</p>}
                {metadata ? (
                    <div className="max-h-[500px] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tag</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(metadata).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-medium">{key}</TableCell>
                                        <TableCell>{String(value)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : !isProcessing && !error && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center">Upload an image to view its EXIF metadata.</p>
                    </div>
                )}
            </CardContent>
           </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
