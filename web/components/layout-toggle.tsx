"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";

interface LayoutToggleProps {
  className?: string;
}

export function LayoutToggle({ className }: LayoutToggleProps) {
  const { layout, setLayout } = useLayout();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant={layout === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => setLayout("grid")}
        className="h-8 w-8"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => setLayout("list")}
        className="h-8 w-8"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
