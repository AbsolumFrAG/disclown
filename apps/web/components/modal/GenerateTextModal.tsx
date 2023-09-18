// Import des modules et composants nécessaires
import { trpc } from "@/utils/trpc";
import { SimpleDialog, DialogClose } from "ui/components/dialog";
import { textArea } from "ui/components/textarea";
import { Button, button } from "ui/components/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Composant GenerateTextModal
export default function GenerateTextModal({
  setValue,
  onFocus,
  open,
  setOpen,
}: {
  setValue: (v: string) => void;
  onFocus: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    // Utilisation du composant SimpleDialog pour créer un modal de génération de texte
    <SimpleDialog
      title="Générer du texte"
      description="Écrivez un meilleur message sans réfléchir"
      open={open}
      onOpenChange={setOpen}
      contentProps={{
        onCloseAutoFocus: (e) => {
          onFocus();
          e.preventDefault();
        },
      }}
    >
      {/* Contenu du modal */}
      <Content setValue={setValue} />
    </SimpleDialog>
  );
}

// Schéma de validation pour le texte généré
const schema = z.object({
  text: z.string().trim().min(1),
});

// Composant Content pour le contenu du modal
function Content({ setValue }: { setValue: (s: string) => void }) {
  // Utilisation du hook useMutation pour gérer la mutation de génération de texte
  const mutation = trpc.chat.generateText.useMutation();

  // Utilisation du hook useForm pour gérer le formulaire
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  // Récupération du résultat de la mutation
  const result = mutation.status === "success" ? mutation.data.text : "";
  const isGenerated = result.length !== 0;

  // Fonction de génération de texte
  const onGenerate = handleSubmit(({ text }) => {
    mutation.mutate({ text });
  });

  return (
    <div className="mt-3 flex flex-col gap-3">
      {/* Champ de texte pour saisir le texte */}
      <textarea
        {...register("text", { minLength: 1 })}
        className={textArea({
          color: "long",
          className: "resize-none",
        })}
        placeholder="Discutez avec Krusty !"
      />
      {/* Affichage des erreurs de validation */}
      {mutation.isError && (
        <p className="text-sm text-destructive">{mutation.error.message}</p>
      )}
      {/* Affichage du texte généré */}
      <p
        className={textArea({
          color: "long",
          className:
            "min-h-[50px] max-h-[200px] overflow-y-auto whitespace-pre-wrap",
        })}
      >
        {isGenerated ? (
          result
        ) : (
          <span className="text-accent-600 dark:text-accent-800">Résultat</span>
        )}
      </p>
      {/* Boutons pour accepter ou générer à nouveau le texte */}
      {isGenerated ? (
        <div className="flex flex-row gap-3 justify-end">
          {/* Bouton pour accepter le résultat */}
          <DialogClose
            className={button({ color: "primary" })}
            onClick={() => setValue(result)}
          >
            Accepter le résultat
          </DialogClose>
          {/* Bouton pour générer à nouveau */}
          <button
            className={button({ color: "secondary" })}
            onClick={() => mutation.reset()}
          >
            Encore
          </button>
        </div>
      ) : (
        // Bouton pour générer le texte initial
        <Button
          color="primary"
          isLoading={mutation.isLoading}
          onClick={onGenerate}
        >
          Générer
        </Button>
      )}
    </div>
  );
}
