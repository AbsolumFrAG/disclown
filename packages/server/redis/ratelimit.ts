// Importations de modules et de fonctions nécessaires
import { defineTRPCLimiter } from "@trpc-limiter/core";  // Importe la fonction defineTRPCLimiter depuis "@trpc-limiter/core"
import { Ratelimit } from "@upstash/ratelimit";  // Importe la classe Ratelimit depuis "@upstash/ratelimit"
import redis from "./client";  // Importe une instance Redis depuis "./client"
import { Context } from "../trpc";  // Importe le type Context depuis "../trpc"

// Crée un limiteur TRPC personnalisé en utilisant defineTRPCLimiter
export const createTRPCUpstashLimiter = defineTRPCLimiter({
    store: (opts) => {
        if (process.env.NODE_ENV === "development") return null;  // Environnement de développement : pas de limiteur

        // Crée une instance Ratelimit pour la limitation de taux avec Redis
        return new Ratelimit({
            redis,  // Utilise l'instance Redis pour le stockage
            limiter: Ratelimit.slidingWindow(opts.max, `${opts.windowMs} ms`),  // Configure le type de limite (fenêtre glissante)
        });
    },
    async isBlocked(store, fingerprint) {
        if (store == null) return null;  // Si le store est nul, aucune limite n'est appliquée
        const { success, ...rest } = await store.limit(fingerprint);  // Utilise le store pour vérifier la limitation

        return success ? null : rest;  // Retourne les détails de la limitation en cas de blocage
    },
});

// Fonction pour obtenir l'empreinte à partir de l'adresse IP de la demande
export function getFingerprintFromIP(req: Context["req"]) {
    const forwarded = req.headers["x-forwarded-for"];  // Récupère les en-têtes "x-forwarded-for"
    const ip = forwarded
        ? (typeof forwarded === "string" ? forwarded : forwarded[0])?.split(
              /, /
          )[0]  // Si "x-forwarded-for" est présent, utilise la première adresse IP
        : req.socket.remoteAddress;  // Sinon, utilise l'adresse IP du socket de la demande
    return ip || "127.0.0.1";  // Retourne l'adresse IP ou "127.0.0.1" par défaut
}
