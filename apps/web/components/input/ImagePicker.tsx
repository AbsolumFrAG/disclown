/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Button } from "ui/components/button";
import { Cropper, ReactCropperElement } from "react-cropper";
import clsx from "clsx";

export function ImagePicker({
  value,
  onChange,
  previewClassName,
  input,
}: {
  value: string | null;
  onChange: (v: string) => void;
  previewClassName?: string;
  input?: ComponentProps<"input">;
}) {
  // État local pour la sélection de l'image et la prévisualisation.
  const [selected, setSelected] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>();
  const cropperRef = useRef<ReactCropperElement>(null);

  // ID de l'élément d'entrée (input) pour l'image.
  const id = input?.id ?? "image-upload";

  // Utilise useEffect pour gérer la prévisualisation de l'image sélectionnée.
  useEffect(() => {
    if (selected != null) {
      // Crée une URL d'objet pour prévisualiser l'image.
      const url = URL.createObjectURL(selected);
      setPreview(url);

      // Revoque l'URL d'objet lorsque le composant est démonté.
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);

      return () => {};
    }
  }, [selected]);

  // Si une image est sélectionnée et en cours de prévisualisation.
  if (preview != null) {
    const onCrop = () => {
      // Obtient la partie recadrée de l'image.
      const cropped = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();

      if (cropped != null) {
        // Appelle la fonction onChange pour envoyer l'image recadrée.
        onChange(cropped);
        setSelected(null);
      }
    };

    return (
      <div className="flex flex-col gap-3">
        {/* Composant de croppage d'image avec ReactCropper. */}
        <Cropper src={preview} aspectRatio={1} guides ref={cropperRef} />
        <div className="flex flex-row gap-3">
          {/* Bouton pour recadrer l'image. */}
          <Button color="primary" type="button" onClick={onCrop}>
            Recadrer
          </Button>
          {/* Bouton pour annuler la sélection de l'image. */}
          <Button type="button" onClick={() => setSelected(null)}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  // Si aucune image n'est sélectionnée ou en cours de prévisualisation.
  return (
    <div className={previewClassName}>
      {/* Input pour sélectionner un fichier image. */}
      <input
        id={id}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const item = e.target.files?.item(0);

          if (item != null) setSelected(item);
        }}
        multiple={false}
        {...input}
      />
      {value != null ? (
        // Si une valeur d'image est fournie, affiche l'image.
        <label htmlFor={id}>
          <img
            alt="fichier sélectionné"
            src={value}
            className="w-full h-full rounded-xl cursor-pointer"
          />
        </label>
      ) : (
        // Si aucune valeur d'image n'est fournie, affiche un bouton de sélection.
        <label
          aria-label="Choisir une image"
          htmlFor={id}
          className={clsx(
            "flex flex-col gap-3 items-center justify-center p-2 w-full h-full rounded-xl cursor-pointer",
            "bg-muted/50 border text-center text-muted-foreground/70"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-accent-700 w-10 h-10"
          >
            {/* Icône de sélection d'image. */}
            <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path>
            <path d="m8 11-3 4h11l-4-6-3 4z"></path>
            <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
          </svg>
          <p className="text-xs">Sélectionner une image</p>
        </label>
      )}
    </div>
  );
}
