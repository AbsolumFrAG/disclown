// Importation du type Types d'Ably et des types de modules locaux
import type { Types } from "ably";
import type {
    Channel,
    ChannelBuilder,
    EventBuilderRecord,
    EventsRecord,
    Event,
    Schema,
    SchemaToCaller,
} from ".";  // Importe des types depuis un module non spécifié

// Fonction pour construire un canal REST
function buildRestChannel(
    ably: Types.RestPromise,  // Promesse Ably pour la messagerie REST
    channel: ChannelBuilder<unknown, EventBuilderRecord>,  // Canal à construire
    channel_name: string  // Nom du canal
): Channel<unknown, EventsRecord<unknown, false>, false> {
    // Utilisation de Object.entries pour itérer sur les événements du canal
    const events = Object.entries(channel.events).map(([event_name, event]) => {
        // Crée un objet Event pour l'événement actuel
        const e: Event<unknown, unknown, false> = {
            parse: event.parse,  // Utilise la méthode parse de l'événement
            publish(args, data) {
                const channel = c.get(args);

                return channel.publish(event_name, data);  // Publie des données pour l'événement
            },
        };

        return [event_name, e];  // Retourne l'événement construit
    });

    // Crée un objet Channel pour le canal actuel
    const c: Channel<unknown, EventsRecord<unknown, false>, false> = {
        channelName(args) {
            return [channel_name, ...channel.data(args)].join(":");  // Génère le nom du canal
        },
        get(args) {
            return ably.channels.get(this.channelName(args));  // Obtient le canal Ably REST
        },
        ...Object.fromEntries(events),  // Ajoute les événements au canal
    };

    return c;  // Retourne le canal construit
}

// Fonction pour créer un objet SchemaToCaller pour la messagerie REST
export function rest<S extends Schema>(
    ably: Types.RestPromise,  // Promesse Ably pour la messagerie REST
    schema: S  // Schéma de canaux et d'événements
): SchemaToCaller<S, false> {
    // Utilisation de Object.entries pour itérer sur les canaux du schéma
    const caller = Object.entries(schema).map(([k, channel]) => {
        return [k, buildRestChannel(ably, channel, k)];  // Appelle la fonction pour construire un canal REST
    });

    // Utilisation de Object.fromEntries pour construire un objet à partir du tableau
    return Object.fromEntries(caller);
}
