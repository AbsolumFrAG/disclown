// Importation des modules et bibliothèques nécessaires
import * as Base from "@radix-ui/react-alert-dialog";
import { Button } from "./button";
import { ReactNode } from "react";
import clsx from "clsx";

// Définition des propriétés attendues par le composant AlertDialog
export type AlertDialogProps = {
    title: string;
    description: string;
    action: ReactNode;
    children: ReactNode;
} & Base.AlertDialogProps;

// Définition du composant AlertDialog
export function AlertDialog({
    title,
    description,
    action,
    children,
    ...props
}: AlertDialogProps) {
    return (
        // Racine de la boîte de dialogue
        <Base.Root {...props}>
            {/* Déclencheur de la boîte de dialogue */}
            <Base.Trigger asChild>{children}</Base.Trigger>
            {/* Portail pour afficher la boîte de dialogue */}
            <Base.Portal>
                {/* Couche d'arrière-plan semi-transparente */}
                <Base.Overlay className="fixed inset-0 z-20 bg-black/50 overflow-y-auto flex">
                    {/* Contenu de la boîte de dialogue */}
                    <Base.Content
                        className={clsx(
                            "relative m-auto z-50 animate-zoom-in",
                            "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
                            "bg-light-50 dark:bg-dark-900",
                            "focus:outline-none"
                        )}
                    >
                        {/* Titre de la boîte de dialogue */}
                        <Base.Title className="text-lg font-bold text-accent-900 dark:text-accent-50">
                            {title}
                        </Base.Title>
                        {/* Description de la boîte de dialogue */}
                        <Base.Description className="mt-2 text-sm font-normal text-accent-800 dark:text-accent-600">
                            {description}
                        </Base.Description>
                        {/* Section des boutons */}
                        <div className="flex flex-row gap-3 justify-end mt-6">
                            {/* Bouton Annuler */}
                            <Base.Cancel asChild>
                                <Button color="secondary">Annuler</Button>
                            </Base.Cancel>
                            {/* Bouton d'action principal */}
                            <Base.Action asChild>{action}</Base.Action>
                        </div>
                    </Base.Content>
                </Base.Overlay>
            </Base.Portal>
        </Base.Root>
    );
}
