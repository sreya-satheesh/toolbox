'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const sanitizedHex = hex.startsWith('#') ? hex.slice(1) : hex;
  if (!/^[0-9A-F]{6}$/i.test(sanitizedHex)) return null;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sanitizedHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export default function HexToRgbConverter() {
  const [hex, setHex] = useState('#29abe2');
  
  const rgb = useMemo(() => hexToRgb(hex), [hex]);

  return (
    <ToolContainer toolId="hex-to-rgb-converter">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex items-end gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="hex-input">HEX Color</Label>
                <Input id="hex-input" value={hex} onChange={e => setHex(e.target.value)} className="font-code text-lg" placeholder="#RRGGBB" />
            </div>
            <div
                className="w-16 h-12 rounded-md border"
                style={{ backgroundColor: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'transparent' }}
            />
        </div>
        
        <div className="text-center">
            {rgb ? (
                <>
                    <p className="text-muted-foreground">RGB Value</p>
                    <p className="text-4xl font-bold font-code tracking-wider">{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</p>
                </>
            ) : (
                <p className="text-destructive">Invalid HEX code format.</p>
            )}
        </div>
      </div>
    </ToolContainer>
  );
}
