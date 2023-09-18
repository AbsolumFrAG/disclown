// Importations de modules nécessaires
import { Serialize } from "shared/types";  // Importe un type Serialize
import { z, ZodType } from "zod";  // Importe des fonctionnalités de validation de données de Zod
import { Types } from "ably";  // Importe des fonctionnalités de la bibliothèque Ably
import { ChannelAndClient } from "../hooks";  // Importe un type ChannelAndClient personnalisé
import { DependencyList } from "react";  // Importe le type DependencyList de React
import { AblyMessageCallback } from "@ably-labs/react-hooks";  // Importe un type AblyMessageCallback personnalisé

// Définition d'un type pour les paramètres de connexion
type ConnectParams = {
    enabled?: boolean;  // Le paramètre enabled est optionnel et de type booléen
};

// Définition d'un type EventMessage générique
type EventMessage<T> = Omit<Types.Message, "data"> & {
    data: Serialize<T>;  // Le champ data est de type Serialize<T>
};

// Définition d'un type générique ChannelMessage
type ChannelMessage<
    Events extends EventsRecord<unknown, boolean>,
    E extends keyof Events = keyof Events
> = E extends keyof Events
    ? Omit<EventMessage<InferEventData<Events[E]>>, "name"> & {
          name: E;  // Le champ name est le nom de l'événement
      }
    : never;

// Définition d'un type générique InferEventData
type InferEventData<E> = E extends Event<unknown, infer T, boolean> ? T : never;

// Définition d'un type EventsRecord générique
export type EventsRecord<Args, Realtime extends boolean> = Record<
    string,
    Event<Args, any, Realtime>
>;

// Définition d'un type EventBuilderRecord
export type EventBuilderRecord = Record<string, EventBuilder<any>>;

// Définition d'un type générique Event
export type Event<Args, T, Realtime extends boolean> = Realtime extends true
    ? {
          parse(raw: Types.Message): T;  // Méthode pour analyser un message
          publish(args: Args, data: T): Promise<void>;  // Méthode pour publier des données
          useChannel(
              args: Args,
              params: ConnectParams,
              callback: (msg: EventMessage<T>) => void
          ): ChannelAndClient;  // Méthode pour utiliser un canal
      }
    : {
          parse(raw: Types.Message): T;  // Méthode pour analyser un message
          publish(args: Args, data: T): Promise<void>;  // Méthode pour publier des données
      };

// Définition d'un type générique Channel
export type Channel<
    Args,
    Events extends EventsRecord<Args, Realtime>,
    Realtime extends boolean
> = (Realtime extends true
    ? {
          useChannel(
              args: Args,
              params: ConnectParams,
              callback: (msg: ChannelMessage<Events>) => void
          ): ChannelAndClient;  // Méthode pour utiliser un canal en temps réel

          useCallback(
              callback: (msg: ChannelMessage<Events>) => void,
              dependencies: DependencyList
          ): AblyMessageCallback;  // Méthode pour utiliser un rappel avec des dépendances
          channelName(args: Args): string;  // Méthode pour obtenir le nom du canal
          get(args: Args): Types.RealtimeChannelPromise;  // Méthode pour obtenir un canal Ably en temps réel
      }
    : {
          channelName(args: Args): string;  // Méthode pour obtenir le nom du canal
          get(args: Args): Types.ChannelPromise;  // Méthode pour obtenir un canal Ably
      }) &
    Events;

// Définition d'un type ChannelBuilder générique
export type ChannelBuilder<Args, Events extends EventBuilderRecord> = {
    data: (args: Args) => string[];  // Méthode pour obtenir des données
    events: Events;  // Événements associés au canal
};

// Définition d'un type générique EventBuilder
export type EventBuilder<T> = {
    parse(raw: Types.Message): T;  // Méthode pour analyser un message d'événement
};

// Définition d'un type Schema pour une structure de canaux et d'événements
export type Schema = Record<string, ChannelBuilder<any, EventBuilderRecord>>;

// Définition d'un type SchemaToCaller générique pour mapper un schéma à un appelant
export type SchemaToCaller<S extends Schema, Realtime extends boolean> = {
    [K in keyof S]: S[K] extends ChannelBuilder<infer Args, infer Events>
        ? Channel<
              Args,
              {
                  [J in keyof Events]: Events[J] extends EventBuilder<infer T>
                      ? Event<Args, T, Realtime>
                      : never;
              },
              Realtime
          >
        : never;
};

// Fonction pour créer un objet ChannelBuilder
function channel<Args, Events extends EventBuilderRecord>(
    data: (args: Args) => string[],
    events: Events
): ChannelBuilder<Args, Events> {
    return {
        data,  // La méthode data est définie dans l'objet retourné
        events,  // Les événements sont définis dans l'objet retourné
    };
}

// Fonction pour créer un objet EventBuilder
function event<T extends ZodType>(schema: T): EventBuilder<z.infer<T>> {
    return {
        parse(raw) {
            return schema.parse(raw.data);  // Utilise le schéma pour analyser les données du message
        },
    };
}

// Exportation d'un objet contenant les fonctions channel et event
export const a = { channel, event };
