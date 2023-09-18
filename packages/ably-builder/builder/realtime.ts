// Importation du module useCallback de React
import { useCallback } from "react";
import type { Types } from "ably";  // Importe le type Types d'Ably
import type {
    Event,
    Channel,
    EventsRecord,
    ChannelBuilder,
    EventBuilderRecord,
    Schema,
    SchemaToCaller,
} from ".";  // Importe des types depuis un module non spécifié
import { useChannel } from "../hooks";  // Importe la fonction useChannel depuis le module "../hooks"

// Fonction pour créer un objet SchemaToCaller pour la messagerie en temps réel
export function realtime<S extends Schema>(
    ably: Types.RealtimePromise,  // Promesse Ably pour la messagerie en temps réel
    schema: S  // Schéma de canaux et d'événements
): SchemaToCaller<S, true> {
    // Utilisation de Object.entries pour itérer sur les canaux du schéma
    const caller = Object.entries(schema).map(([k, channel]) => {
        return [k, buildRealtimeChannel(ably, channel, k)];  // Appelle la fonction pour construire un canal en temps réel
    });

    // Utilisation de Object.fromEntries pour construire un objet à partir du tableau
    return Object.fromEntries(caller);
}

// Fonction pour construire un canal en temps réel
function buildRealtimeChannel(
    ably: Types.RealtimePromise,  // Promesse Ably pour la messagerie en temps réel
    channel: ChannelBuilder<unknown, EventBuilderRecord>,  // Canal à construire
    channel_name: string  // Nom du canal
): Channel<unknown, EventsRecord<unknown, true>, true> {
    // Utilisation de Object.entries pour itérer sur les événements du canal
    const events = Object.entries(channel.events).map(([event_name, event]) => {
        // Crée un objet Event pour l'événement actuel
        const e: Event<unknown, unknown, true> = {
            parse: event.parse,  // Utilise la méthode parse de l'événement
            publish(args, data) {
                return c.get(args).publish(event_name, data);  // Publie des données pour l'événement
            },
            useChannel(args, params, callback) {
                const channel = c.channelName(args);

                return useChannel(
                    {
                        channelName: channel,
                        events: [event_name],
                        ...params,
                    },
                    useCallback(
                        (raw) => {
                            return callback({
                                ...raw,
                                data: this.parse(raw) as never,
                            });
                        },
                        [callback]
                    )
                );
            },
        };

        return [event_name, e];  // Retourne l'événement construit
    });

    // Crée un objet Channel pour le canal actuel
    const c: Channel<unknown, EventsRecord<unknown, true>, true> = {
        channelName(args) {
            return [channel_name, ...channel.data(args)].join(":");  // Génère le nom du canal
        },
        get(args) {
            return ably.channels.get(this.channelName(args));  // Obtient le canal Ably en temps réel
        },
        useChannel(args, params, callback) {
            return useChannel(
                {
                    channelName: this.channelName(args),
                    ...params,
                },
                this.useCallback(callback, [callback])
            );
        },
        useCallback(callback, deps) {
            return useCallback((raw) => {
                const event = channel.events[raw.name];

                if (event == null) {
                    console.error(`Unkown event: ${raw.name}`);
                    return;
                }

                return callback({
                    ...raw,
                    name: raw.name,
                    data: event.parse(raw) as never,
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, deps);
        },
        ...Object.fromEntries(events),  // Ajoute les événements au canal
    };

    return c;  // Retourne le canal construit
}
