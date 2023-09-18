import { trpc } from "@/utils/trpc"; // Importe la fonction trpc pour les requêtes.
import { useSession } from "next-auth/react"; // Importe le hook useSession de Next.js pour gérer la session de l'utilisateur.
import { useRouter } from "next/router"; // Importe le hook useRouter de Next.js pour accéder à l'objet router.
import { AppLayout, Content } from "./app"; // Importe les composants AppLayout et Content.
import { ReactNode } from "react"; // Importe ReactNode.
import { skeleton } from "ui/components/skeleton"; // Importe le composant skeleton.
import { Avatar } from "ui/components/avatar"; // Importe le composant Avatar.
import { useViewScrollController } from "ui/hooks/use-bottom-scroll"; // Importe le hook useViewScrollController pour la gestion du scroll.
import { Navbar } from "./Navbar"; // Importe le composant Navbar.
import { ChannelSendbar } from "../chat/ChannelSendbar"; // Importe le composant ChannelSendbar.
import { ChatViewProvider } from "../chat/ChatView"; // Importe le composant ChatViewProvider.

// Fonction useDirectMessageLayout pour créer la mise en page d'une conversation en mode message direct.
export function useDirectMessageLayout(children: ReactNode) {
  const router = useRouter();
  const controller = useViewScrollController();

  return (
    <AppLayout>
      {/* Barre de navigation avec un élément de miettes de pain. */}
      <Navbar
        breadcrumb={[
          {
            text: <BreadcrumbItem />,
            href: router.asPath,
          },
        ]}
      />

      <Content>
        {/* Fournit le contrôleur de scroll aux composants enfants via ChatViewProvider. */}
        <ChatViewProvider value={controller}>{children}</ChatViewProvider>
      </Content>
      {/* Barre d'envoi de messages pour le canal spécifié dans l'URL. */}
      <ChannelSendbar channelId={router.query.channel as string} />
    </AppLayout>
  );
}

// Composant BreadcrumbItem pour afficher l'élément de miettes de pain.
function BreadcrumbItem() {
  const { channel } = useRouter().query as { channel: string };
  const { status } = useSession();
  const query = trpc.dm.info.useQuery(
    { channelId: channel },
    { enabled: status === "authenticated", staleTime: Infinity }
  );

  return query.data == null ? (
    // Affiche un indicateur de chargement (squelette) en attendant les données.
    <div className={skeleton()} />
  ) : (
    // Affiche l'avatar de l'utilisateur et son nom.
    <div className="flex flex-row gap-2 items-center">
      <Avatar
        src={query.data.user.image}
        fallback={query.data.user.name}
        size="small"
      />
      <span>{query.data.user.name}</span>
    </div>
  );
}
