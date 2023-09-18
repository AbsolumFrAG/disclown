// Importation des modules et bibliothèques nécessaires
"use client"; // Cette ligne semble être une directive spécifique au module, le cas échéant
import * as AvatarBase from "@radix-ui/react-avatar";
import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react";
import { tv, VariantProps } from "tailwind-variants"; // Importation de dépendances liées à Tailwind CSS

// Définition des variantes et styles pour l'avatar
const avatar = tv({
    slots: {
        root: "relative inline-flex aspect-square overflow-hidden", // Styles pour la racine de l'avatar
        fallback:
            "flex h-full w-full text-center items-center justify-center bg-primary text-primary-foreground text-sm font-medium uppercase", // Styles pour le cas où l'image de l'avatar n'est pas disponible
    },
    variants: {
        size: {
            small: {
                root: "w-7 h-7", // Styles pour une taille d'avatar "small"
                fallback: "text-sm",
            },
            "2sm": {
                root: "w-[32px] h-[32px]", // Styles pour une taille d'avatar "2sm"
                fallback: "text-sm",
            },
            medium: {
                root: "w-11 h-11", // Styles pour une taille d'avatar "medium"
                fallback: "text-md",
            },
            large: {
                root: "w-24 h-24", // Styles pour une taille d'avatar "large"
                fallback: "text-lg",
            },
            xlarge: {
                root: "w-32 h-32", // Styles pour une taille d'avatar "xlarge"
                fallback: "text-xl",
            },
        },
        rounded: {
            full: {
                root: "rounded-full", // Styles pour un avatar avec des bords arrondis complets
            },
            sm: {
                root: "rounded-lg", // Styles pour un avatar avec des bords arrondis "sm"
            },
        },
    },
    defaultVariants: {
        size: "medium", // Taille d'avatar par défaut
        rounded: "full", // Bords arrondis par défaut
    },
});

// Définition des propriétés attendues par le composant Avatar
export type AvatarProps = {
    src?: string | null; // Source de l'image de l'avatar (peut être nulle)
    fallback?: string; // Texte de secours à afficher en cas d'absence d'image
    alt?: string; // Texte alternatif pour l'image de l'avatar
} & VariantProps<typeof avatar> & ComponentPropsWithoutRef<"span">;

// Définition du composant Avatar
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
    const { size, fallback, src, alt, rounded, ...rest } = props;
    const styles = avatar({ size, rounded }); // Obtenir les styles en fonction de la taille et des bords arrondis

    const fallbackText = useMemo(() => {
        const isSmall = size === "small" || size === "2sm";

        return fallback
            ?.split(/\s/)
            .map((v) => (v.length > 0 ? v.charAt(0) : ""))
            .join("")
            .slice(0, isSmall ? 1 : undefined);
    }, [fallback, size]);

    return (
        <AvatarBase.Root
            key={src}
            ref={ref}
            {...rest}
            className={styles.root({ className: rest.className })} // Appliquer les styles à la racine de l'avatar
        >
            {src != null && (
                <AvatarBase.Image
                    alt={fallback ?? alt ?? "avatar"}
                    src={src}
                    className="h-full w-full object-cover" // Styles pour l'image de l'avatar
                />
            )}
            <AvatarBase.Fallback className={styles.fallback()} delayMs={0}>
                <p>{fallbackText}</p>
            </AvatarBase.Fallback>
        </AvatarBase.Root>
    );
});

// Nom du composant pour l'identification
Avatar.displayName = "Avatar";
