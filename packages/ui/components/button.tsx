// Importation des modules et bibliothèques nécessaires
"use client"; // Cette ligne semble être une directive spécifique au module, le cas échéant
import { ComponentProps, forwardRef } from "react"; // Importation de React et de certaines de ses fonctionnalités
import React from "react"; // Importation de React
import { tv, type VariantProps } from "tailwind-variants"; // Importation de dépendances liées à Tailwind CSS
import { Spinner } from "./spinner"; // Importation du composant Spinner défini ailleurs

// Définition des styles pour le composant bouton
export const button = tv({
    base: [
        // Styles de base pour le bouton
        "inline-flex select-none items-center justify-center text-start",
        "focus:outline-none focus-visible:ring",
        "disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    variants: {
        color: {
            // Styles pour différentes couleurs de bouton
            primary: [
                "rounded-lg transition-colors shadow-lg shadow-brand-400/50",
                "bg-brand-500 hover:bg-brand-400 dark:bg-brand-400 text-gray-50 dark:hover:bg-brand-500 dark:shadow-none",
                "focus-visible:ring-0",
            ],
            secondary: [
                "rounded-md transition-colors shadow-lg bg-secondary shadow-brand-500/10 text-secondary-foreground hover:bg-accent dark:shadow-none",
                "focus-visible:ring-0",
            ],
            ghost: [
                "rounded-md transition-colors text-foreground hover:bg-accent",
                "focus-visible:ring-0",
            ],
            danger: [
                "rounded-md transition-colors",
                "bg-red-500 hover:bg-red-400 dark:bg-red-500 text-gray-50 dark:hover:bg-red-600",
                "focus-visible:ring-0",
            ],
        },
        size: {
            // Styles pour différentes tailles de bouton
            large: "px-6 py-3 text-base font-semibold",
            medium: "px-4 py-2 text-sm font-semibold",
            small: "px-3 py-1.5 text-sm font-semibold",
        },
    },
    defaultVariants: {
        // Variantes par défaut pour le bouton
        color: "secondary",
        size: "medium",
    },
});

// Définition des propriétés attendues par le composant Button
type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof button> & {
        isLoading?: boolean; // Une option pour afficher un indicateur de chargement
    };

// Définition du composant Button
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, color, size, isLoading, ...props }, ref) => (
        <button
            ref={ref}
            disabled={isLoading === true} // Désactive le bouton s'il est en cours de chargement
            {...props}
            className={button({ color, size, className: props.className })} // Applique les styles du bouton
        >
            {isLoading === true && (
                // Affiche un Spinner si le chargement est en cours
                <div className="mr-2 inline">
                    <Spinner size="small" />
                </div>
            )}
            {children} {/* Affiche le contenu du bouton */}
        </button>
    )
);

Button.displayName = "Button"; // Nom du composant pour l'identification

// Définition des propriétés attendues par le composant IconButton
type IconButtonProps = ComponentProps<"button"> &
    VariantProps<typeof button> & {
        isLoading?: boolean; // Une option pour afficher un indicateur de chargement
    };

// Définition du composant IconButton
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ children, isLoading, color, size, ...props }, ref) => (
        <button
            {...props}
            ref={ref}
            className={button({ color, size, className: props.className })} // Applique les styles du bouton
        >
            {isLoading === true ? (
                // Affiche un Spinner si le chargement est en cours
                <div className="inline">
                    <Spinner size="small" />
                </div>
            ) : (
                children // Affiche le contenu du bouton
            )}
        </button>
    )
);

IconButton.displayName = "IconButton"; // Nom du composant pour l'identification
