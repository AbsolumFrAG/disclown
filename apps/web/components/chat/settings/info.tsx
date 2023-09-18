// Importation des dépendances et des composants nécessaires
import { ImagePicker } from "@/components/input/ImagePicker"; // Composant pour choisir une image
import { input } from "ui/components/input"; // Composant d'entrée de texte
import { Avatar } from "ui/components/avatar"; // Composant d'avatar
import { Button } from "ui/components/button"; // Composant de bouton
import { groupIcon } from "shared/media/format"; // Icône de groupe
import { useUpdateGroupInfoMutation } from "@/utils/hooks/mutations/update-group-info"; // Mutation pour mettre à jour les informations du groupe
import { Group } from "db/schema"; // Schéma de données pour un groupe
import { Serialize } from "shared/types"; // Type pour la sérialisation des données
import { useState } from "react"; // Hook React pour gérer l'état
import { Controller, useForm } from "react-hook-form"; // Hook React pour gérer les formulaires
import { zodResolver } from "@hookform/resolvers/zod"; // Résolveur pour le schéma Zod
import { z } from "zod"; // Bibliothèque Zod pour la validation de schémas
import { updateGroupSchema } from "shared/schema/group"; // Schéma de mise à jour des groupes
import { UniqueNameInput } from "@/components/input/UniqueNameInput"; // Composant pour un nom unique

// Composant Info pour afficher les informations d'un groupe
export default function Info({
  group,
  isAdmin,
}: {
  group: Group; // Données du groupe
  isAdmin: boolean; // Indique si l'utilisateur est un administrateur
}) {
  const [edit, setEdit] = useState(false); // État pour activer/désactiver le mode édition

  // Si le mode édition est activé, affiche le composant EditGroupPanel, sinon affiche les informations du groupe
  if (edit) return <EditGroupPanel group={group} onCancel={() => setEdit(false)} />;

  return (
    <div className="flex flex-col">
      <div className="h-auto aspect-[3/1] xl:rounded-lg bg-brand-500 dark:bg-brand-400 -mx-4" />
      <div className="flex flex-col gap-3 -mt-[4rem]">
        <div className="w-full flex flex-row justify-between items-end">
          <Avatar
            size="xlarge"
            className="border-4 border-background"
            src={groupIcon.url([group.id], group.icon_hash)} // Affiche l'avatar du groupe
            fallback={group.name} // Affiche le nom du groupe en cas d'absence d'avatar
          />
          {isAdmin && (
            <div className="flex flex-row gap-3">
              <Button color="primary" onClick={() => setEdit(true)}>
                Modifier les informations
              </Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          {group.unique_name != null && (
            <p className="text-sm text-muted-foreground">
              @{group.unique_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Schéma pour valider les données du formulaire de mise à jour du groupe
const schema = updateGroupSchema
  .omit({ groupId: true, icon_hash: true })
  .extend({
    icon: z.string().optional(),
  });

// Composant EditGroupPanel pour éditer les informations d'un groupe
function EditGroupPanel({
  group,
  onCancel,
}: {
  group: Serialize<Group>; // Données du groupe
  onCancel: () => void; // Fonction pour annuler l'édition
}) {
  const mutation = useUpdateGroupInfoMutation(); // Mutation pour mettre à jour les informations du groupe
  const { register, handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema), // Utilisation du résolveur Zod pour valider le formulaire
    defaultValues: {
      unique_name: group.unique_name,
      name: group.name,
      icon: undefined,
    },
  });

  // Fonction pour sauvegarder les modifications du groupe
  const onSave = handleSubmit((values) => {
    mutation.mutate(
      { groupId: group.id, ...values },
      {
        onSuccess: onCancel, // En cas de succès, annule l'édition
      }
    );
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={onSave}>
      <Controller
        name="icon"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <ImagePicker
            input={{ id: "icon", ...field }}
            value={value ?? groupIcon.url([group.id], group.icon_hash)} // Affiche l'image actuelle ou l'image sélectionnée
            onChange={onChange} // Gère le changement de l'image
            previewClassName="w-[150px] h-[150px] max-w-full"
          />
        )}
      />

      <fieldset>
        <label htmlFor="name" className="font-medium text-foreground text-sm">
          Nom
        </label>
        <input id="name" className={input()} {...register("name")} />
      </fieldset>
      <fieldset>
        <label
          htmlFor="unique_name"
          className="font-medium text-foreground text-sm"
        >
          Nom unique
        </label>
        <p className="text-sm text-muted-foreground">
          Les gens peuvent trouver un groupe par son nom unique
        </p>
        <UniqueNameInput
          root={{ className: "mt-3" }}
          input={{
            id: "unique_name",
            placeholder: control._defaultValues.unique_name,
            ...register("unique_name"),
          }}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Uniquement des lettres minuscules, des chiffres et des underscores
        </p>
      </fieldset>

      <div className="flex flex-row gap-3">
        <Button type="submit" color="primary" isLoading={mutation.isLoading}>
          Sauvegarder les modifications
        </Button>
        <Button disabled={mutation.isLoading} onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
