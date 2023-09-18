import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { Button } from "ui/components/button";
import { SimpleDialog } from "ui/components/dialog";
import { input } from "ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/components/tabs";
import { UniqueNameInput } from "../input/UniqueNameInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueNameSchema } from "shared/schema/group";
import { z } from "zod";

// Composant JoinGroupModal
export default function JoinGroupModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    // Utilisation du composant SimpleDialog pour créer un modal de rejoindre un groupe
    <SimpleDialog
      title="Rejoindre le groupe"
      description="Discutez avec d'autres personnes du groupe"
      open={open}
      onOpenChange={setOpen}
    >
      {/* Composant Tabs pour les onglets de sélection */}
      <Tabs defaultValue="code">
        <TabsList className="grid w-full grid-cols-2 mt-4">
          {/* Onglet pour rejoindre par code d'invitation */}
          <TabsTrigger value="code" asChild>
            <label htmlFor="code">Code d&apos;invitation</label>
          </TabsTrigger>
          {/* Onglet pour rejoindre par nom unique */}
          <TabsTrigger value="unique_name" asChild>
            <label htmlFor="code">Nom unique</label>
          </TabsTrigger>
        </TabsList>
        {/* Contenu de l'onglet "Code d'invitation" */}
        <TabsContent value="code">
          <JoinGroupByCode onClose={() => setOpen(false)} />
        </TabsContent>
        {/* Contenu de l'onglet "Nom unique" */}
        <TabsContent value="unique_name">
          <JoinGroupByName onClose={() => setOpen(false)} />
        </TabsContent>
      </Tabs>
    </SimpleDialog>
  );
}

// Composant JoinGroupByCode pour rejoindre par code d'invitation
function JoinGroupByCode({ onClose }: { onClose: () => void }) {
  // Utilisation du hook useForm pour gérer le formulaire de code d'invitation
  const { register, handleSubmit, formState, setError } = useForm<{
    code: string;
  }>({
    defaultValues: {
      code: "",
    },
  });

  // Utilisation du hook useMutation pour gérer la mutation de rejoindre par code
  const joinMutation = trpc.group.join.useMutation({
    onSuccess(data) {
      onClose();
    },
    onError(e) {
      setError("code", { message: e.message, type: "value" });
    },
  });

  // Fonction de soumission du formulaire
  const onJoin = handleSubmit(({ code }) =>
    joinMutation.mutate({
      code,
    })
  );

  return (
    <form onSubmit={onJoin}>
      <fieldset className="mt-3">
        {/* Champ de saisie du code d'invitation */}
        <input
          id="code"
          autoComplete="off"
          className={input()}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
          {...register("code", { minLength: 4 })}
        />
        {/* Affichage des erreurs de validation */}
        <p className="text-xs text-destructive">
          {formState.errors?.code?.message}
        </p>
      </fieldset>
      {/* Bouton de soumission pour rejoindre le groupe par code */}
      <Button
        type="submit"
        color="primary"
        className="mt-6 w-full"
        isLoading={joinMutation.isLoading}
      >
        Rejoindre
      </Button>
    </form>
  );
}

// Schéma de validation pour le nom unique
const schema = z.object({
  unique_name: uniqueNameSchema,
});

// Composant JoinGroupByName pour rejoindre par nom unique
function JoinGroupByName({ onClose }: { onClose: () => void }) {
  // Utilisation du hook useForm pour gérer le formulaire de nom unique
  const { register, handleSubmit, formState, setError } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      unique_name: "",
    },
  });

  // Utilisation du hook useMutation pour gérer la mutation de rejoindre par nom unique
  const joinMutation = trpc.group.joinByUniqueName.useMutation({
    onSuccess() {
      onClose();
    },
    onError(e) {
      setError("unique_name", { message: e.message, type: "value" });
    },
  });

  // Fonction de soumission du formulaire
  const onJoin = handleSubmit(({ unique_name }) =>
    joinMutation.mutate({
      uniqueName: unique_name,
    })
  );

  return (
    <form onSubmit={onJoin}>
      <fieldset className="mt-3">
        {/* Champ de saisie du nom unique */}
        <UniqueNameInput
          input={{
            id: "code",
            autoComplete: "off",
            placeholder: "mon_nom_de_groupe",
            ...register("unique_name"),
          }}
        />
        {/* Affichage des erreurs de validation */}
        <p className="text-xs text-destructive">
          {formState.errors.unique_name?.message}
        </p>
      </fieldset>
      {/* Bouton de soumission pour rejoindre le groupe par nom unique */}
      <Button
        type="submit"
        color="primary"
        className="mt-6 w-full"
        isLoading={joinMutation.isLoading}
      >
        Rejoindre
      </Button>
    </form>
  );
}
