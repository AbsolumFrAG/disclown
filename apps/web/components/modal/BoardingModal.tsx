// Import des modules et composants nécessaires
import { MessageCircleIcon } from "lucide-react";
import { SimpleDialog } from "ui/components/dialog";
import { useMounted } from "ui/hooks/use-mounted";
import { useState } from "react";
import { Button } from "ui/components/button";
import { useSession } from "next-auth/react";

// Composant BoardingModal
export default function BoardingModal({
  onCreateGroup,
}: {
  onCreateGroup: () => void;
}) {
  // Utilisation de l'état local pour gérer l'ouverture du modal
  const [open, setOpen] = useState(true);
  const { status, data } = useSession(); // Utilisation du hook useSession pour obtenir les informations de session de l'utilisateur
  const mounted = useMounted(); // Utilisation du hook useMounted pour vérifier si le composant est monté

  // Si le composant n'est pas monté ou si l'utilisateur n'est pas authentifié, retournez un élément vide
  if (!mounted || status !== "authenticated") return <></>;

  return (
    // Utilisation du composant SimpleDialog pour créer un modal
    <SimpleDialog
      title="Bienvenue !"
      description="Commencez à discuter sur Disclown !"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="p-3 py-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 mt-4">
        <p className="text-white m-auto w-fit">
          {/* Icône de message */}
          <MessageCircleIcon className="inline w-11 h-11" />
          {/* Nom de l'utilisateur */}
          <span className="ml-2 text-xl font-bold">{data.user.name}</span>
        </p>
      </div>
      <div className="flex flex-row gap-3 mt-4">
        {/* Bouton pour créer un groupe */}
        <Button color="primary" onClick={onCreateGroup}>
          Créer un groupe
        </Button>

        {/* Bouton pour explorer */}
        <Button color="secondary" onClick={() => setOpen(false)}>
          Explorer
        </Button>
      </div>
    </SimpleDialog>
  );
}
