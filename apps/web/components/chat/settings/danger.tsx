// Importation des dépendances et composants nécessaires.
import { AlertDialog } from "ui/components/alert-dialog"; // Composant pour une boîte de dialogue d'alerte
import { Button } from "ui/components/button"; // Composant de bouton
import { showErrorToast } from "@/utils/stores/page"; // Fonction pour afficher un toast d'erreur
import { trpc } from "@/utils/trpc"; // Utilitaire de requêtes RPC
import { useRouter } from "next/router"; // Hook pour obtenir l'objet de route
import { useState } from "react"; // Hook React pour gérer l'état

// Composant Danger pour gérer des actions dangereuses dans un groupe.
export default function Danger({ group }: { group: number }) {
  return (
    <div className="flex flex-col gap-3">
      <LeaveGroup group={group} /> {/* Composant LeaveGroup pour quitter le groupe */}
      <div className="mt-3">
        <h3 className="text-foreground font-medium text-base">
          Supprimer le groupe {/* Titre pour supprimer le groupe */}
        </h3>
        <p className="text-sm text-muted-foreground">{`Cette action est irréversible et ne peut être annulée`}</p>
        <DeleteGroupButton group={group} /> {/* Composant DeleteGroupButton pour supprimer le groupe */}
      </div>
    </div>
  );
}

// Composant LeaveGroup pour quitter le groupe.
export function LeaveGroup({ group }: { group: number }) {
  const router = useRouter(); // Obtenir l'objet de route
  const mutation = trpc.group.leave.useMutation({
    onSuccess: () => {
      return router.push("/home"); // Redirige vers la page d'accueil après avoir quitté le groupe
    },
    onError: (error) => {
      showErrorToast({
        title: "Impossible de quitter le groupe",
        description: error.message,
      }); // Affiche un toast d'erreur en cas d'échec pour quitter le groupe
    },
  });

  return (
    <div>
      <h3 className="text-base font-medium text-foreground">Quitter le groupe</h3>
      <p className="text-sm text-muted-foreground">{`Vous pouvez toujours rejoindre le groupe après l'avoir quitté`}</p>
      <Button
        color="danger" // Bouton de couleur rouge pour quitter le groupe
        isLoading={mutation.isLoading} // Affiche un indicateur de chargement pendant l'exécution de la mutation
        onClick={() => mutation.mutate({ groupId: group })} // Déclenche la mutation pour quitter le groupe
        className="mt-3"
      >
        Quitter
      </Button>
    </div>
  );
}

// Composant DeleteGroupButton pour supprimer le groupe avec une boîte de dialogue de confirmation.
function DeleteGroupButton({ group }: { group: number }) {
  const [open, setOpen] = useState(false); // État pour ouvrir ou fermer la boîte de dialogue de confirmation
  const deleteMutation = trpc.group.delete.useMutation({
    onSuccess() {
      setOpen(false); // Ferme la boîte de dialogue après avoir supprimé le groupe avec succès
    },
  });

  return (
    <AlertDialog
      open={open} // Ouvre ou ferme la boîte de dialogue de confirmation
      onOpenChange={setOpen} // Gère le changement d'état de la boîte de dialogue
      title="Etes-vous sûr ?" // Titre de la boîte de dialogue de confirmation
      description="Cela supprimera le groupe, ainsi que tous ses messages" // Description de la boîte de dialogue
      action={
        <Button
          color="danger" // Bouton de couleur rouge pour confirmer la suppression
          isLoading={deleteMutation.isLoading} // Affiche un indicateur de chargement pendant l'exécution de la suppression
          onClick={(e) => {
            deleteMutation.mutate({ groupId: group }); // Déclenche la suppression du groupe
            e.preventDefault();
          }}
        >
          Supprimer le groupe
        </Button>
      }
    >
      <Button color="danger" className="w-fit mt-3">
        Supprimer
      </Button>
    </AlertDialog>
  );
}
