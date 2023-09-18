// Importation des dépendances et composants nécessaires.
import { useProfile } from "@/utils/hooks/use-profile"; // Hook pour obtenir le profil utilisateur
import * as MessageItem from "./atom"; // Composants atomiques personnalisés
import * as ContextMenu from "ui/components/context-menu"; // Composant de menu contextuel
import { useMemo } from "react"; // Hook React pour la mémoïzation des calculs
import { MessagePlaceholder } from "@/utils/stores/chat"; // Placeholder pour les messages en cours d'envoi
import { UploadingAttachmentItem } from "../AttachmentItem"; // Composant pour les pièces jointes en cours d'envoi
import { XIcon } from "lucide-react"; // Icône de la bibliothèque Lucide

// Composant LocalMessageItem pour afficher un message en cours d'envoi localement.
export function LocalMessageItem({
  item,
  onDelete,
}: {
  item: MessagePlaceholder; // Placeholder du message en cours d'envoi
  onDelete: () => void; // Fonction de suppression du message
}) {
  const timestamp = useMemo(() => new Date(Date.now()), []); // Crée un objet de date pour l'horodatage actuel
  const { profile } = useProfile(); // Obtient le profil utilisateur à partir du hook useProfile

  return (
    // Rendu du message en cours d'envoi dans un conteneur MessageItem.Root
    <MessageItem.Root>
      <MessageItem.Content
        user={profile} // Utilise le profil de l'utilisateur actuel comme l'auteur du message
        timestamp={timestamp} // Utilise l'horodatage actuel
        className="opacity-50" // Applique une classe CSS pour réduire l'opacité
      >
        <MessageItem.Text>{item.data.content}</MessageItem.Text> {/* Affiche le contenu du message en cours d'envoi */}
        {item.data.attachment != null && (
          // Si une pièce jointe est en cours d'envoi, affiche UploadingAttachmentItem
          <UploadingAttachmentItem file={item.data.attachment} />
        )}
        {item.error != null && <p className="text-red-400">{item.error}</p>} {/* Si une erreur est survenue, affiche un message d'erreur en rouge */}
      </MessageItem.Content>
      <ContextMenu.Content>
        <ContextMenu.Item
          icon={<XIcon className="w-4 h-4" />} // Icône de suppression (X)
          shortcut="⌘+D" // Raccourci clavier pour la suppression
          color="danger" // Couleur de l'élément du menu en rouge (danger)
          onClick={onDelete} // Gère la suppression en appelant la fonction onDelete
        >
          Supprimer {/* Libellé de l'option de suppression */}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </MessageItem.Root>
  );
}
