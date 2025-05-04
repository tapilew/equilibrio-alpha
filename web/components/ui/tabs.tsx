"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:inline-flex h-9 items-center justify-start sm:justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  )),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className,
      )}
      {...props}
    />
  )),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  )),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Lazy loading wrapper for tab content
const LazyTabsContent = React.lazy(() =>
  Promise.resolve({
    default: ({
      children,
      ...props
    }: React.ComponentProps<typeof TabsContent>) => (
      <React.Suspense
        fallback={
          <div className="mt-2 h-[200px] animate-pulse bg-muted rounded-md" />
        }
      >
        <TabsContent {...props}>{children}</TabsContent>
      </React.Suspense>
    ),
  }),
);

export { Tabs, TabsList, TabsTrigger, TabsContent, LazyTabsContent };
