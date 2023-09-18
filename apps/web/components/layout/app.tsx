import Sidebar from "@/components/layout/Sidebar"; // Importe le composant Sidebar.
import Head from "next/head"; // Importe le composant Head de Next.js.
import React, { ComponentProps } from "react"; // Importe React et ComponentProps.
import { ReactNode } from "react"; // Importe ReactNode.
import { trpc } from "@/utils/trpc"; // Importe la fonction trpc pour les requêtes.
import { Spinner } from "ui/components/spinner"; // Importe le composant Spinner.

// Composant AppLayout pour la mise en page de l'application.
export function AppLayout({
  children,
  root,
}: {
  children: ReactNode;
  root?: Omit<ComponentProps<"div">, "className">;
}) {
  return (
    <>
      <Head>
        <title>Disclown Beta</title>
        <meta name="description" content="Une application de chat simple" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid grid-cols-1 md:grid-cols-[20rem_auto] min-h-screen">
        {/* Composant Sidebar pour la barre latérale de l'application. */}
        <Sidebar />
        {/* Contenu principal de l'application. */}
        <div {...root} className="flex flex-col">
          {children}
        </div>
      </main>
    </>
  );
}

// Composant Content pour le contenu principal de l'application.
export function Content({ children }: { children: ReactNode }) {
  const groupQuery = trpc.group.all.useQuery(undefined, {
    enabled: false,
  });
  const dmQuery = trpc.dm.channels.useQuery(undefined, {
    enabled: false,
  });

  if (groupQuery.isLoading || dmQuery.isLoading) {
    // Affiche un spinner en cours de chargement des données.
    return (
      <div className="m-auto">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl w-full mx-auto flex flex-col flex-1 pt-2 p-4">
      {children}
    </div>
  );
}
