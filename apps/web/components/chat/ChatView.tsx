import { usePageStore } from "@/utils/stores/page";
import dynamic from "next/dynamic";
import { ReactNode, createContext, useContext } from "react";
import useInfiniteScroll, {
  UseInfiniteScrollHookArgs,
} from "react-infinite-scroll-hook";
import { useViewScrollController } from "ui/hooks/use-bottom-scroll";

// Créez un contexte pour partager l'état de la vue
type ContextType = ReturnType<typeof useViewScrollController>;
const ViewContext = createContext<ContextType | undefined>(undefined);

// Chargez dynamiquement le composant UserProfileModal
const UserProfileModal = dynamic(() => import("../modal/UserProfileModal"));

export function ChatViewProvider({
  value,
  children,
}: {
  value: ContextType;
  children: ReactNode;
}) {
  // Utilisez le magasin de page pour gérer l'état du modal
  const [modal, setModal] = usePageStore((s) => [s.modal, s.setModal]);

  return (
    <ViewContext.Provider value={value}>
      {/* Affichez le modal UserProfileModal si modal.type est "user-profile" */}
      {modal?.type === "user-profile" && (
        <UserProfileModal
          userId={modal.user_id}
          open
          onOpenChange={() => setModal(undefined)}
        />
      )}
      {children}
    </ViewContext.Provider>
  );
}

export function useChatView(props: UseInfiniteScrollHookArgs) {
  const ctx = useContext(ViewContext)!!;
  const [sentryRef] = useInfiniteScroll({
    delayInMs: 100,
    rootMargin: "20px",
    ...props,
  });

  return {
    ...ctx,
    sentryRef,
  };
}
