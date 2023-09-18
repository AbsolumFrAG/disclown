// Importe toutes les exportations du module "@radix-ui/react-switch" sous le nom "Base".
import * as Base from "@radix-ui/react-switch";

// Importe la fonction "forwardRef" de React pour gérer les références aux éléments DOM.
import { forwardRef } from "react";

// Importe la fonction "tv" du module "tailwind-variants".
import { tv } from "tailwind-variants";

// Définit les styles du commutateur en utilisant la fonction "tv".
const switchStyles = tv({
    slots: {
        root: [
            // Styles pour l'élément racine du commutateur lorsqu'il est dans différents états.
            "relative rounded-full bg-light-400 radix-state-checked:bg-brand-500",
            "dark:bg-dark-700 dark:radix-state-checked:bg-brand-400",
            "radix-disabled:opacity-50 radix-disabled:cursor-not-allowed",
        ],
        thumb: [
            // Styles pour le "pouce" du commutateur (l'élément qui glisse pour activer/désactiver).
            "block bg-white rounded-full h-full w-auto aspect-square transition-transform",
            "radix-state-unchecked:translate-x-0",
        ],
    },
    variants: {
        size: {
            md: {
                // Styles spécifiques à la variante "md" (taille moyenne).
                root: "w-14 h-7 p-1",
                thumb: "radix-state-checked:translate-x-7",
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
});

// Définit les propriétés du composant Switch en étendant les propriétés du composant de base de Radix.
export type SwitchProps = Base.SwitchProps & {};

// Définit le composant Switch en utilisant la fonction "forwardRef" pour gérer les références aux éléments DOM.
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    (props, ref) => {
        // Applique les styles du commutateur en utilisant la fonction "switchStyles".
        const styles = switchStyles();

        return (
            // Rend le composant de base du commutateur de Radix avec les styles personnalisés.
            <Base.Root
                {...props}
                ref={ref}
                className={styles.root({ className: props.className })}
            >
                <Base.Thumb className={styles.thumb()} />
            </Base.Root>
        );
    }
);

// Définit le nom d'affichage du composant Switch.
Switch.displayName = "switch";
