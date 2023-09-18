// Importations de modules et de types nécessaires
import {
    AblyMessageCallback,
    assertConfiguration,
    ChannelNameAndOptions,
} from "@ably-labs/react-hooks";  // Importe des fonctions et des types depuis "@ably-labs/react-hooks"
import { useEffect } from "react";  // Importe la fonction useEffect de React
import type { Types } from "ably";  // Importe le type Types d'Ably

// Définition d'un type personnalisé ChannelAndClient
export type ChannelAndClient = [
    channel: Types.RealtimeChannelPromise,
    message: Types.RealtimePromise
];

// Définition d'un type UseChannelParam pour les paramètres de la fonction useChannel
export type UseChannelParam = ChannelNameAndOptions & {
    events?: string | string[] | Types.MessageFilter;  // Événements acceptés ou filtre de message
    enabled?: boolean;  // Indicateur d'activation/désactivation
};

/**
 * Hook personnalisé useChannel
 */
export function useChannel(
    options: UseChannelParam,  // Options pour la création du canal
    listener: AblyMessageCallback  // Fonction de rappel pour les messages
): ChannelAndClient {
    const ably = assertConfiguration();  // Vérifie la configuration Ably et obtient une instance Ably
    const channel = ably.channels.get(options.channelName, options.options);  // Obtient un canal Ably
    const enabled = options.enabled ?? true;  // Indicateur d'activation par défaut à true s'il n'est pas spécifié

    // Fonction pour s'abonner au canal lors du montage du composant
    const onMount = async () => {
        if (options.events != null) {
            await channel.subscribe(options.events as any, listener);
        } else {
            await channel.subscribe(listener);
        }
    };

    // Fonction pour se désabonner du canal lors du démontage du composant
    const onUnmount = async () => {
        channel.unsubscribe(listener);
    };

    // Utilisation de useEffect pour gérer l'abonnement et le désabonnement en fonction de l'état "enabled"
    useEffect(() => {
        if (enabled) {
            onMount();

            // Retourne une fonction de nettoyage pour se désabonner lors du démontage
            return () => {
                onUnmount();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.channelName, enabled]);

    return [channel, ably];  // Retourne le canal et l'instance Ably
}

/**
 * Hook personnalisé useChannels pour gérer plusieurs canaux
 */
export function useChannels(
    channelList: Types.RealtimeChannelPromise[],  // Liste des canaux Ably
    onEvent: AblyMessageCallback  // Fonction de rappel pour les messages
) {
    // Utilisation de useEffect pour s'abonner aux canaux lors du montage du composant
    useEffect(() => {
        for (const channel of channelList) {
            channel.subscribe(onEvent);
        }

        // Retourne une fonction de nettoyage pour se désabonner des canaux lors du démontage
        return () => {
            for (const channel of channelList) {
                channel.unsubscribe(onEvent);
            }
        };
    }, [channelList, onEvent]);
}
