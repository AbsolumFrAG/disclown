// Importation de l'instance Redis depuis "./client"
import redis from "./client";

// Fonction pour définir la dernière lecture (last read) pour un canal et un utilisateur donnés
export function setLastRead(channel_id: string, user_id: string, value: Date) {
    return redis.set(`last_read_g_${channel_id}_u_${user_id}`, value);  // Stocke la date de la dernière lecture dans Redis
}

// Fonction asynchrone pour obtenir la dernière lecture pour un canal et un utilisateur donnés
export async function getLastRead(channel_id: string, user_id: string) {
    const value = await redis.get<string>(
        `last_read_g_${channel_id}_u_${user_id}`
    );  // Obtient la valeur stockée dans Redis

    return value == null ? null : new Date(value);  // Retourne la date de la dernière lecture (ou null si non trouvée)
}

// Fonction asynchrone pour obtenir les dernières lectures pour une liste de paires de clés canal-utilisateur
export async function getLastReads(
    keys: [channel_id: string, user_id: string][]
) {
    const mapped_keys = keys.map(
        ([channel_id, user_id]) => `last_read_g_${channel_id}_u_${user_id}`
    );  // Crée un tableau de clés Redis correspondant à chaque paire canal-utilisateur

    const values = await redis.mget<(string | null)[]>(...mapped_keys);  // Obtient les valeurs associées aux clés Redis

    return values.map((v) => (v == null ? null : new Date(v)));  // Retourne les dates de dernière lecture (ou null si non trouvées)
}
