import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TOOLS_MAP } from '@/lib/tools';

type ToolContainerProps = {
  toolId: string;
  children: ReactNode;
};

export function ToolContainer({ toolId, children }: ToolContainerProps) {
  const tool = TOOLS_MAP.get(toolId);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  return (
    <div className="h-full p-2 sm:p-4 lg:p-6">
      <Card className="h-full flex flex-col shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg shrink-0">
                <tool.icon className="size-6" />
            </div>
            <div className="flex-1 space-y-2">
                <CardTitle className="font-headline text-2xl">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
            {children}
        </CardContent>
      </Card>
    </div>
  );
}
