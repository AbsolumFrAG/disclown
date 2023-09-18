import { getGroupQuery } from "@/utils/variables"; // Importe la fonction getGroupQuery pour obtenir les données du groupe.
import { groupIcon } from "shared/media/format"; // Importe la fonction groupIcon pour obtenir l'icône du groupe.
import { trpc } from "@/utils/trpc"; // Importe la fonction trpc pour les requêtes.
import Router, { useRouter } from "next/router"; // Importe le module Router de Next.js pour la navigation.
import { Avatar } from "ui/components/avatar"; // Importe le composant Avatar.
import { useSession } from "next-auth/react"; // Importe le hook useSession de Next.js pour gérer la session de l'utilisateur.

// Composant BreadcrumbItem pour afficher l'élément de miettes de pain.
export function BreadcrumbItem() {
  const { status } = useSession(); // Obtient le statut de la session de l'utilisateur.
  const { groupId, isReady } = getGroupQuery(useRouter()); // Obtient les données du groupe à partir de l'URL.

  const info = trpc.group.info.useQuery(
    { groupId },
    {
      enabled: status === "authenticated" && isReady,
      staleTime: Infinity,
      onError(err) {
        if (err.data?.code === "NOT_FOUND") {
          Router.push("/");
        }
      },
    }
  );

  if (info.data == null) {
    // Affiche un espace réservé en attendant les données.
    return <div className="w-28 h-5 rounded-lg bg-muted" />;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      {/* Affiche l'avatar du groupe avec son nom. */}
      <Avatar
        size="small"
        src={groupIcon.url([info.data.id], info.data.icon_hash)}
        alt="icon"
        fallback={info.data.name}
      />
      <span>{info.data.name}</span>
    </div>
  );
}
