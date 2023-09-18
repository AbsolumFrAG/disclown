// Importation de modules nécessaires depuis "tailwind-variants"
import { tv, VariantProps } from "tailwind-variants";

// Création d'une configuration de style pour le Spinner en utilisant "tv" (tailwind-variants)
const spinner = tv({
    slots: {
        // Définition des emplacements (slots) du Spinner : "container" et "status"
        container: "flex justify-center items-center", // Styles pour le conteneur du Spinner
        status: [
            // Styles pour l'élément de chargement animé (status)
            "align-[-0.125rem] border-l-accent-900 animate-spin inline-block rounded-full",
            "dark:border-l-accent-50", // Styles spécifiques pour le mode sombre (dark)
        ],
    },
    variants: {
        // Définition des variantes de taille pour le Spinner : "small", "medium", "large"
        size: {
            small: {
                status: "w-4 h-4 border-2", // Styles pour la taille "small"
            },
            medium: {
                status: "w-7 h-7 border-2", // Styles pour la taille "medium"
            },
            large: {
                status: "w-10 h-10 border-[3px]", // Styles pour la taille "large"
            },
        },
    },
    defaultVariants: {
        size: "small", // Taille par défaut du Spinner
    },
});

// Définition du composant Spinner
export function Spinner({
    size, // Taille du Spinner (small, medium, large)
    className, // Classe CSS supplémentaire facultative
}: VariantProps<typeof spinner> & { className?: string }) {
    // Extraction des styles du Spinner en fonction de la taille et de la classe CSS
    const { container, status } = spinner({ size, className });

    return (
        <div className={container()}>
            <div className={status()} role="status" /> {/* Élément de chargement animé */}
        </div>
    );
}
