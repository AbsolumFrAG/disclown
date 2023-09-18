// Importation des modules et bibliothèques nécessaires
import * as Base from "@radix-ui/react-popover"; // Importation de composants de popover à partir de Radix UI
import { ReactNode } from "react"; // Importation de ReactNode pour représenter des éléments JSX
import { tv } from "tailwind-variants"; // Importation de la fonction tv de Tailwind CSS Variants

// Définition des styles pour le composant popover
export const popover = tv({
    slots: {
        content: [
            // Styles pour le contenu du popover
            "rounded-lg p-4 bg-light-50 flex flex-col gap-3 z-10 animate-zoom-in shadow-brand-300/10 shadow-xl",
            "dark:shadow-none dark:bg-dark-950", // Styles pour le mode sombre
            "focus:outline-none", // Styles pour gérer la mise au point
        ],
        arrow: ["fill-light-50", "dark:fill-dark-950"], // Styles pour la flèche du popover
    },
});

// Définition du composant Popover
export function Popover({
    trigger,
    children,
}: {
    trigger: ReactNode;
    children: ReactNode;
}) {
    const styles = popover(); // Application des styles définis pour le popover

    return (
        <Base.Root>
            <Base.Anchor>
                <Base.Trigger asChild>{trigger}</Base.Trigger>
            </Base.Anchor>

            <Base.Portal>
                <Base.Content className={styles.content()}>
                    <Base.Arrow className={styles.arrow()} />
                    {children}
                </Base.Content>
            </Base.Portal>
        </Base.Root>
    );
}
