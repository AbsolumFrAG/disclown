import { usePageStore } from "@/utils/stores/page"; // Importe la fonction usePageStore pour gérer l'état de la page.
import { SidebarOpen } from "lucide-react"; // Importe l'icône SidebarOpen de Lucide.
import { ReactNode } from "react"; // Importe ReactNode.
import { BreadcrumbItemType, Breadcrumbs } from "./Breadcrumbs"; // Importe le composant Breadcrumbs et le type BreadcrumbItemType.

// Composant Navbar pour la barre de navigation.
export function Navbar({
  children,
  breadcrumb,
}: {
  breadcrumb: BreadcrumbItemType[];
  children?: ReactNode;
}) {
  const [setSidebarOpen] = usePageStore((v) => [v.setSidebarOpen]);

  //backdrop filter will break the `fixed` position in children elements
  return (
    <div className="sticky top-0 z-10 bg-background/50 before:backdrop-blur-lg before:absolute before:inset-0 before:-z-[1] before:w-full">
      <div className="flex flex-row gap-2 max-w-screen-2xl px-4 py-2 mx-auto min-h-[52px]">
        {/* Bouton pour ouvrir la barre latérale sur les écrans mobiles. */}
        <button className="mr-2 md:hidden" onClick={() => setSidebarOpen(true)}>
          <SidebarOpen className="w-6 h-6" />
        </button>
        {/* Affiche les miettes de pain à l'aide du composant Breadcrumbs. */}
        <Breadcrumbs items={breadcrumb} />
        <div className="ml-auto" />
        <div className="flex flex-row gap-2 items-center">{children}</div>
      </div>
    </div>
  );
}
