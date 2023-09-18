// Importations de modules et de types nécessaires
import { z } from "zod";  // Importe des fonctionnalités de validation de données de Zod
import { a } from "ably-builder/builder";  // Importe des canaux et des événements définis dans "ably-builder/builder"
import { inferProcedureOutput } from "@trpc/server";  // Importe le type inferProcedureOutput depuis "@trpc/server"
import { AppRouter } from "../routers/_app";  // Importe le routeur AppRouter depuis "../routers/_app"
import { Group, User } from "db/schema";  // Importe les types Group et User depuis "db/schema"

// Définition d'un type ServerMessageType pour les messages du serveur
type ServerMessageType = inferProcedureOutput<
    AppRouter["chat"]["messages"]
>[number];

// Définition d'un type ServerDirectChannelEvent pour les événements de canal direct du serveur
type ServerDirectChannelEvent = inferProcedureOutput<
    AppRouter["dm"]["channels"]
>[number];

// Définition d'un type ServerGroupEvent pour les événements de groupe du serveur
type ServerGroupEvent = inferProcedureOutput<AppRouter["group"]["all"]>[number];

// Définition du schéma de canaux et d'événements
export const schema = {
    /**
     * Canal privé par utilisateur
     */
    private: a.channel(([clientId]: [clientId: string]) => [clientId], {
        // Événement pour la création de groupe
        group_created: a.event(z.custom<ServerGroupEvent>()),
        // Événement pour la suppression de groupe
        group_removed: a.event(z.custom<Pick<ServerGroupEvent, "id">>()),
        // Événement pour l'ouverture de canal direct
        open_dm: a.event(z.custom<ServerDirectChannelEvent>()),
        // Événement pour la fermeture de canal direct
        close_dm: a.event(z.custom<{ channel_id: string }>()),
    }),

    // Canal de groupe
    group: a.channel(([group]: [groupId: number]) => [`${group}`], {
        // Événement pour la mise à jour de groupe
        group_updated: a.event(z.custom<Group>()),
        // Événement pour la suppression de groupe
        group_deleted: a.event(z.custom<Pick<ServerGroupEvent, "id">>()),
    }),

    // Canal de chat
    chat: a.channel(([channel]: [channelId: string]) => [channel], {
        // Événement pour la saisie de texte
        typing: a.event(
            z.object({ user: z.custom<Pick<User, "id" | "image" | "name">>() })
        ),
        // Événement pour l'envoi de message
        message_sent: a.event(
            z.custom<ServerMessageType & { nonce?: number }>()
        ),
        // Événement pour la mise à jour de message
        message_updated: a.event(
            z.custom<
                Pick<
                    ServerMessageType,
                    "id" | "channel_id" | "content" | "embeds"
                >
            >()
        ),
        // Événement pour la suppression de message
        message_deleted: a.event(
            z.custom<Pick<ServerMessageType, "id" | "channel_id">>()
        ),
    }),
};
