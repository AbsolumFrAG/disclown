import { useProfile } from "@/utils/hooks/use-profile"; // Importe la fonction useProfile pour obtenir le profil de l'utilisateur.
import { ChevronRightIcon } from "lucide-react"; // Importe l'icône ChevronRight.
import Link from "next/link"; // Importe le composant Link de Next.js pour les liens.
import { Fragment, ReactNode } from "react"; // Importe Fragment et ReactNode de React.
import { Avatar } from "ui/components/avatar"; // Importe le composant Avatar.
import { useRouter } from "next/router"; // Importe le hook useRouter de Next.js pour accéder à l'objet router.

// Type pour les éléments de miettes de pain.
export type BreadcrumbItemType = {
  text: string | ReactNode;
  href: string;
};

// Composant Breadcrumbs pour afficher la liste de miettes de pain.
export function Breadcrumbs({ items }: { items: BreadcrumbItemType[] }) {
  const { profile } = useProfile(); // Obtient le profil de l'utilisateur à l'aide de useProfile.
  const query = useRouter().query; // Obtient les paramètres de requête de l'URL à l'aide de useRouter.

  return (
    <div className="flex flex-row gap-1 items-center">
      <Link
        href="/home"
        className="flex flex-row gap-1 items-center max-sm:hidden"
      >
        {/* Lien vers la page d'accueil avec l'avatar de l'utilisateur. */}
        <Avatar
          src={profile?.image}
          fallback={profile?.name ?? undefined}
          size="small"
        />
        <Separator /> {/* Appelle le composant Separator pour afficher le séparateur. */}
      </Link>
      {items.map((item, i) => (
        <Fragment key={item.href}>
          {i !== 0 && <Separator />} {/* Affiche le séparateur sauf pour le premier élément. */}
          <Link
            href={{ pathname: item.href, query }}
            className="font-semibold text-base"
          >
            {item.text}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

// Composant Separator pour afficher le séparateur entre les miettes de pain.
function Separator() {
  return <ChevronRightIcon className="h-5 w-5 text-accent-800" />;
}
