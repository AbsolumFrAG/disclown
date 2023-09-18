import { uploadAttachment } from "@/utils/hooks/mutations/upload-attachment";
import { useMessageStore } from "@/utils/stores/chat";
import { RouterInput, trpc } from "@/utils/trpc";
import { XIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { SendData, Sendbar } from "./Sendbar";
import { channels } from "@/utils/ably/client";
import { useSession } from "next-auth/react";
import { useTypingStatus, TypingIndicator } from "./TypingIndicator";

// Type d'entrée pour la mutation d'envoi avec pièce jointe
type SendMutationInput = Omit<RouterInput["chat"]["send"], "attachment"> & {
  attachment: SendData["attachment"];
};

export function ChannelSendbar({ channelId }: { channelId: string }) {
  const utils = trpc.useContext();
  const [info, update, add, addError] = useMessageStore((s) => [
    s.sendbar[channelId],
    s.updateSendbar,
    s.addSending,
    s.errorSending,
  ]);

  // Mutation pour indiquer que l'utilisateur tape un message
  const typeMutation = trpc.useContext().client.chat.type;

  // Mutation pour envoyer un message
  const sendMutation = useMutation(
    async ({ attachment, ...data }: SendMutationInput) => {
      await utils.client.chat.send.mutate({
        ...data,
        attachment:
          attachment != null
            ? await uploadAttachment(utils, attachment)
            : undefined,
      });
    },
    {
      onError(error, { nonce, channelId }) {
        if (nonce == null) return;

        // Gérer les erreurs lors de l'envoi du message
        addError(
          channelId,
          nonce,
          error instanceof TRPCClientError
            ? error.message
            : "Quelque chose s'est mal passé"
        );
      },
    }
  );

  // Fonction appelée lors de l'envoi d'un message
  const onSend = (data: SendData) => {
    sendMutation.mutate({
      ...data,
      channelId: channelId,
      reply: info?.reply_to?.id ?? undefined,
      nonce: add(channelId, data).nonce,
    });

    // Réinitialiser la réponse après l'envoi
    update(channelId, {
      reply_to: undefined,
    });
  };

  return (
    <Sendbar
      onSend={onSend}
      onType={() => typeMutation.mutate({ channelId: channelId })}
    >
      {/* Afficher les détails de la réponse si une réponse est en cours */}
      {info?.reply_to != null && (
        <div className="flex flex-row pt-2 px-2 text-sm text-muted-foreground">
          <p className="flex-1">
            Répondre à{" "}
            <b>{info.reply_to.author?.name ?? "Utilisateur inconnu"}</b>
          </p>
          <button
            aria-label="delete"
            onClick={() => update(channelId, { reply_to: undefined })}
          >
            <XIcon className="w-4" />
          </button>
        </div>
      )}

      {/* Afficher les indicateurs de personnes qui tapent un message */}
      <TypingUsers channelId={channelId} />
    </Sendbar>
  );
}

// Composant pour afficher les indicateurs de personnes qui tapent un message
function TypingUsers({ channelId }: { channelId: string }) {
  const { status, data: session } = useSession();
  const { typing, add } = useTypingStatus();

  // Écouter les messages de frappe pour le canal spécifié
  channels.chat.typing.useChannel(
    [channelId],
    { enabled: status === "authenticated" },
    (message) => {
      // Ignorer les messages de frappe de l'utilisateur actuel
      if (message.data.user.id === session?.user.id) return;

      // Ajouter l'utilisateur qui tape un message à la liste
      add(message.data.user);
    }
  );

  return <TypingIndicator typing={typing} />;
}
