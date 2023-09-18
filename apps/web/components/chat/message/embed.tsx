import clsx from "clsx";
import { useState } from "react";
import { SmartImage } from "ui/components/smart-image";
import type { Embed } from "db/schema";

// Composant Embed qui affiche les informations intégrées
export function Embed({ embed }: { embed: Embed }) {
  // État pour gérer le chargement de l'image
  const [state, setState] = useState<"loading" | "loaded">("loading");
  
  // Vérifie si l'incorporation contient uniquement une image
  const imageOnly = !embed.title && !embed.description && embed.image != null;
  const image = embed.image;

  return (
    <div
      className={clsx(
        "bg-card text-card-foreground overflow-hidden mt-3 border-l-primary rounded-lg",
        !imageOnly && "p-2 border-l-2"
      )}
    >
      {/* Affiche le titre de l'incorporation en tant que lien s'il existe */}
      {embed.title && (
        <a
          href={embed.url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-sm"
        >
          {embed.title}
        </a>
      )}
      
      {/* Affiche la description de l'incorporation s'il existe */}
      {embed.description && (
        <p className="text-muted-foreground text-xs">{embed.description}</p>
      )}
      
      {/* Affiche l'image de l'incorporation s'il existe */}
      {image != null && (
        <SmartImage
          state={state}
          width={image.width}
          height={image.height}
          maxWidth={400}
          maxHeight={200}
        >
          <img
            alt="image"
            src={image.url}
            onLoad={() => setState("loaded")} // Met à jour l'état lorsque l'image est chargée
            className="w-full h-full"
          />
        </SmartImage>
      )}
    </div>
  );
}
