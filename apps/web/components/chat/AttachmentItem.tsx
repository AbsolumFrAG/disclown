import Link from "next/link";
import { AttachmentType } from "shared/schema/chat";
import { useState } from "react";
import { SmartImage } from "ui/components/smart-image";
import Image from "next/image";

// Composant pour les pièces jointes en cours de téléchargement
export function UploadingAttachmentItem({ file }: { file: File }) {
  return (
    <div className="p-3 rounded-lg bg-light-100 dark:bg-dark-700 flex flex-col mt-3">
      <p className="text-foreground text-base font-medium">{file.name}</p>
      <p className="text-sm text-muted-foreground">En cours d&apos;upload...</p>
    </div>
  );
}

// Préfixe de l'URL Cloudinary pour les images
const cloudinary_prefix = "https://res.cloudinary.com/disclown/image/upload/";

// Composant pour afficher une pièce jointe
export function AttachmentItem({ attachment }: { attachment: AttachmentType }) {
  // Vérifier si la pièce jointe est une image et peut être affichée
  if (
    attachment.type === "image" &&
    attachment.width != null &&
    attachment.height != null &&
    attachment.url.startsWith(cloudinary_prefix)
  ) {
    return <AttachmentImage attachment={attachment} />;
  }

  // Afficher la pièce jointe sous forme de lien s'il ne s'agit pas d'une image
  return (
    <div className="p-3 rounded-lg bg-light-100 dark:bg-dark-700 mt-3">
      <Link
        target="_blank"
        href={attachment.url}
        className="text-base font-medium text-foreground"
      >
        {attachment.name}
      </Link>
      <p className="text-sm text-muted-foreground">{attachment.bytes} Bytes</p>
    </div>
  );
}

// Composant pour afficher une image en pièce jointe
function AttachmentImage({ attachment }: { attachment: AttachmentType }) {
  const [state, setState] = useState<"loading" | "loaded">("loading");
  const url = decodeURIComponent(attachment.url).slice(
    cloudinary_prefix.length
  );

  return (
    <div>
      <SmartImage
        state={state}
        width={attachment.width!!}
        height={attachment.height!!}
        maxWidth={500}
        maxHeight={400}
      >
        <Image
          alt={attachment.name}
          src={url}
          fill
          sizes={`(max-width: 500px) 90vw, 500px`}
          loader={({ src, width, quality }) => {
            const params = ["c_limit", `w_${width}`, `q_${quality || "auto"}`];

            return `${cloudinary_prefix}${params.join(",")}/${src}`;
          }}
          onLoadingComplete={() => setState("loaded")}
        />
      </SmartImage>
    </div>
  );
}
