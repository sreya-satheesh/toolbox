
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TOOLS_LIST, TOOL_CATEGORIES } from '@/lib/tools';
import { Wrench } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function SidebarNav() {
  const searchParams = useSearchParams();
  const activeToolId = searchParams.get('tool');

  const groupedTools = TOOLS_LIST.reduce((acc, tool) => {
    (acc[tool.category] = acc[tool.category] || []).push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS_LIST>);

  return (
    <>
      <SidebarHeader className="hidden md:flex border-b border-sidebar-border">
        <div className="flex h-14 items-center justify-between px-4">
           <Link href="/" className="flex items-center gap-2" aria-label="Toolbox Home">
            <Wrench className="size-7 text-primary" />
            <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Toolbox
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SidebarTrigger className="group-data-[collapsible=icon]:-translate-x-1" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groupedTools).map(([categoryId, tools]) => {
          const category = TOOL_CATEGORIES[categoryId as keyof typeof TOOL_CATEGORIES];
          return (
            <SidebarGroup key={categoryId}>
              <SidebarGroupLabel className="flex items-center gap-2">
                <category.icon className="size-4" />
                {category.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tools.map((tool) => (
                    <SidebarMenuItem key={tool.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeToolId === tool.id}
                        className="w-full justify-start"
                        tooltip={tool.name}
                      >
                        <Link href={`/?tool=${tool.id}`}>
                          <tool.icon className="size-4" />
                          <span>{tool.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </>
  );
}
