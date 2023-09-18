import { trpc } from "@/utils/trpc";
import { MessageType } from "@/utils/types";
import { MutableRefObject } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "ui/components/button";
import { textArea } from "ui/components/textarea";

// Props attendues par le composant Edit
type EditProps = {
  inputRef: MutableRefObject<HTMLTextAreaElement | null>; // Référence au champ de texte
  onCancel: () => void; // Fonction pour annuler la modification
  message: MessageType; // Objet représentant le message à éditer
};

export default function Edit({ message, inputRef, onCancel }: EditProps) {
  // Utilisation de trpc pour la mutation de mise à jour du message
  const editMutation = trpc.chat.update.useMutation({
    onSuccess: () => {
      onCancel(); // Appelé lorsque la mise à jour réussit pour annuler l'édition
    },
  });

  // Utilisation de react-hook-form pour gérer le formulaire de modification
  const { control, handleSubmit } = useForm<{ content: string }>({
    defaultValues: {
      content: message.content, // Valeur initiale du champ de texte
    },
  });

  // Fonction appelée lorsque le formulaire est soumis
  const onSave = handleSubmit((v) => {
    editMutation.mutate({
      channelId: message.channel_id, // ID du canal du message
      messageId: message.id, // ID du message à mettre à jour
      content: v.content, // Nouveau contenu du message
    });
  });

  return (
    <form onSubmit={onSave}>
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <textarea
            id="edit-message"
            placeholder="Modifier le message"
            autoComplete="off"
            rows={Math.min(20, field.value.split("\n").length)}
            wrap="virtual"
            className={textArea({
              color: "long",
              className: "resize-none min-h-[80px] h-auto max-h-[50vh]",
            })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                return onSave(); // Appuyer sur Entrée pour enregistrer les modifications
              }

              if (e.key === "Escape") {
                e.preventDefault();
                return onCancel(); // Appuyer sur Echap pour quitter sans enregistrer
              }
            }}
            {...field}
            ref={(e) => {
              field.ref(e);
              inputRef.current = e; // Met à jour la référence au champ de texte
            }}
          />
        )}
      />
      <label
        htmlFor="edit-message"
        className="text-xs text-accent-800 dark:text-accent-600"
      >
        Appuyez sur Entrée pour enregistrer • Echap pour quitter
      </label>

      <div className="flex flex-row gap-3 mt-3">
        <Button color="primary" isLoading={editMutation.isLoading}>
          Sauvegarder les modifications
        </Button>
        <Button
          type="button"
          color="secondary"
          onClick={onCancel}
          className="dark:bg-dark-700"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
