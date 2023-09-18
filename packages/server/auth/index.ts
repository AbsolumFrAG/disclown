// Importations de modules et de types nécessaires
import { DefaultSession, AuthOptions } from "next-auth";  // Importe des types et des options d'authentification depuis "next-auth"
import GithubProvider from "next-auth/providers/github";  // Importe le fournisseur d'authentification GitHub
import { DefaultJWT } from "next-auth/jwt";  // Importe le type de jeton JWT par défaut
import { authAdapter } from "./nextauth-adapter";  // Importe un adaptateur d'authentification personnalisé

// Étend le module "next-auth" pour personnaliser la structure de la session
declare module "next-auth" {
    interface Session extends Omit<DefaultSession, "user"> {
        user: {
            id: string;
            name: string;
            email?: string | null;
            image?: string | null;
        };
    }
}

// Étend le module "next-auth/jwt" pour ajouter un champ "uid" au jeton JWT
declare module "next-auth/jwt" {
    interface JWT extends Record<string, string>, DefaultJWT {
        uid: string;
    }
}

// Options de configuration d'authentification
export const authOptions: AuthOptions = {
    adapter: authAdapter,  // Utilise un adaptateur d'authentification personnalisé
    providers: [
        GithubProvider({  // Fournisseur d'authentification GitHub
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/auth/signin",  // Page de connexion personnalisée
        newUser: "/home?modal=new",  // Page de création de nouvel utilisateur personnalisée
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session.user != null) {
                session.user.id = token.uid;  // Associe l'ID utilisateur du jeton JWT à la session
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user != null) {
                token.uid = user.id;  // Associe l'ID utilisateur à un champ "uid" dans le jeton JWT
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",  // Utilise la stratégie JWT pour la gestion des sessions
    },
};
