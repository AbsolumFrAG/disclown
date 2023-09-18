// Importe la directive "use client" - cela peut être spécifique à un environnement ou à un framework particulier, et elle n'est pas standard en JavaScript ou React.
"use client";

// Importe React et les composants de l'interface de tabulation depuis "@radix-ui/react-tabs".
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Importe une fonction utilitaire "cn" depuis "../utils/cn".
import { cn } from "../utils/cn";

// Alias pour le composant "Root" de l'interface de tabulation.
const Tabs = TabsPrimitive.Root;

// Définit le composant "TabsList" en utilisant "forwardRef" pour gérer les références aux éléments DOM.
const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            // Applique des classes CSS pour le style du composant de liste des onglets.
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Définit le composant "TabsTrigger" en utilisant "forwardRef" pour gérer les références aux éléments DOM.
const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            // Applique des classes CSS pour le style du composant de déclenchement des onglets.
            "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Définit le composant "TabsContent" en utilisant "forwardRef" pour gérer les références aux éléments DOM.
const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            // Applique des classes CSS pour le style du contenu des onglets.
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Exporte les composants personnalisés pour être utilisés ailleurs dans l'application.
export { Tabs, TabsList, TabsTrigger, TabsContent };
