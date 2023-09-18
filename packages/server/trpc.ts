// Importation de modules et de fonctions nécessaires
import {
    inferRouterInputs,
    inferRouterOutputs,
    initTRPC,
    TRPCError,
} from "@trpc/server";  // Importe des fonctions et des types depuis "@trpc/server"
import { createContext } from "./context";  // Importe la fonction createContext depuis "./context"
import {
    createTRPCUpstashLimiter,
    getFingerprintFromIP,
} from "./redis/ratelimit";  // Importe des fonctions liées à la limitation de taux depuis "./redis/ratelimit"
import { AppRouter } from "./routers/_app";  // Importe le routeur AppRouter depuis "./routers/_app"

// Initialise TRPC avec un context de type createContext
const t = initTRPC
    .context<Awaited<ReturnType<typeof createContext>>>()
    .create();

// Types d'exportation pour le contexte, les entrées de routeur et les sorties de routeur
export type Context = Awaited<ReturnType<typeof createContext>>;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

// Crée un limiteur de taux Upstash pour les requêtes TRPC
const rateLimiter = createTRPCUpstashLimiter({
    fingerprint: (ctx) => getFingerprintFromIP(ctx.req),  // Obtient une empreinte de l'adresse IP de la demande
    windowMs: 10 * 1000,  // Période de fenêtre en millisecondes (10 secondes)
    message: (hitInfo) =>
        `Too many requests, please try again later. ${Math.ceil(
            (hitInfo.reset - Date.now()) / 1000
        )}`,  // Message d'erreur en cas de limitation de taux
    max: 50,  // Nombre maximal de requêtes autorisées pendant la période de fenêtre
    root: t,  // Instance TRPC racine
});

// Exporte le routeur TRPC
export const router = t.router;

// Exporte la procédure TRPC en utilisant le limiteur de taux
export const procedure = t.procedure.use(rateLimiter);

// Exporte la procédure protégée TRPC qui vérifie la session utilisateur
export const protectedProcedure = t.procedure
    .use(rateLimiter)  // Utilise également le limiteur de taux
    .use(({ ctx, next }) => {
        if (ctx.session == null) {
            throw new TRPCError({ code: "UNAUTHORIZED" });  // Lance une erreur d'autorisation si la session est manquante
        }

        return next({
            ctx: {
                ...ctx,
                session: ctx.session,
            },
        });
    });
