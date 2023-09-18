// Import des modules et composants nécessaires
import React from "react";
import { SimpleDialog } from "ui/components/dialog";
import { createGroupSchema } from "shared/schema/group";
import { updateGroupInfo } from "@/utils/hooks/mutations/update-group-info";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { ImagePicker } from "../input/ImagePicker";
import { Button } from "ui/components/button";
import { input } from "ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

// Composant CreateGroupModal
export default function CreateGroupModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    // Utilisation du composant SimpleDialog pour créer un modal de création de groupe
    <SimpleDialog
      title="Créer un groupe"
      description="Donnez à votre groupe de discussion un beau nom et une belle icône"
      open={open}
      onOpenChange={setOpen}
    >
      {/* Contenu du modal */}
      <Content onClose={() => setOpen(false)} />
    </SimpleDialog>
  );
}

// Schéma de validation pour la création de groupe
const schema = createGroupSchema.extend({
  icon: z.string().optional(),
});

// Composant Content pour le contenu du modal
function Content({ onClose }: { onClose: () => void }) {
  // Utilisation du hook useForm pour gérer le formulaire
  const { register, control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      icon: undefined,
      name: "",
    },
  });

  // Utilisation du hook useCreateMutation pour gérer la mutation de création de groupe
  const mutation = useCreateMutation(onClose);

  // Fonction de soumission du formulaire
  const onSubmit = handleSubmit((input) => mutation.mutate(input));

  return (
    // Formulaire de création de groupe
    <form className="mt-8 space-y-2" onSubmit={onSubmit}>
      <fieldset>
        <label htmlFor="icon" className="sr-only">
          Icône
        </label>
        <Controller
          control={control}
          name="icon"
          render={({ field: { value, onChange, ...field } }) => (
            // Composant ImagePicker pour choisir une icône
            <ImagePicker
              input={{ id: "icon", ...field }}
              value={value ?? null}
              onChange={onChange}
              previewClassName="mx-auto w-[120px] aspect-square flex flex-col gap-3 items-center"
            />
          )}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nom
          <span className="text-red-400 mx-1 text-base">*</span>
        </label>
        <input
          id="name"
          placeholder="Mon groupe"
          autoComplete="off"
          className={input()}
          aria-required
          {...register("name")}
        />
      </fieldset>
      <div className="mt-4 flex justify-end">
        <Button type="submit" color="primary" isLoading={mutation.isLoading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

// Hook personnalisé pour gérer la mutation de création de groupe
function useCreateMutation(onClose: () => void) {
  const utils = trpc.useContext();

  return useMutation(
    async ({ name, icon }: z.infer<typeof schema>) => {
      const data = await utils.client.group.create.mutate({ name });

      if (icon != null) {
        return await updateGroupInfo(utils, {
          groupId: data.id,
          icon,
        });
      }

      return data;
    },
    {
      onSuccess() {
        onClose();
      },
    }
  );
}
