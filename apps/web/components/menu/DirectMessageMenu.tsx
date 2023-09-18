// Import des modules et composants nécessaires
import { ReactNode } from "react";
import * as ContextMenu from "ui/components/context-menu";
import { XIcon } from "lucide-react";
import { trpc } from "@/utils/trpc";

// Composant DirectMessageContextMenu
export function DirectMessageContextMenu({
  children,
  channelId,
}: {
  children: ReactNode;
  channelId: string;
}) {
  // Utilisation du hook useMutation pour la suppression d'un message direct
  const deleteMutation = trpc.dm.close.useMutation();

  // Fonction appelée lors de la fermeture d'un message direct
  const onClose = () => {
    // Appel de la mutation pour fermer le message direct en spécifiant le channelId
    deleteMutation.mutate({
      channelId,
    });
  };

  return (
    // Utilisation du composant ContextMenu pour créer un menu contextuel
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {/* Élément du menu contextuel pour la fermeture du message direct */}
        <ContextMenu.Item
          color="danger"
          icon={<XIcon className="w-4 h-4" />}
          onClick={onClose}
        >
          Fermer
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
