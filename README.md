# Disclown

Une application de chat construite avec TRPC, Tailwind CSS, Ably, Redis, Cloudinary, Drizzle ORM, Next 13.

Ce repository est un monorepo ([Turborepo](https://turbo.build/)).

![preview](./document/screen_shot.png)

## Caractéristiques

- Créer, mettre à jour, supprimer un groupe de discussion
- Envoyer, mettre à jour, supprimer un message
- Markdown (gfm, tableaux pris en charge) dans Messages
- Messages de référence
- Message Embeds (Afficher les données de Open Graph ouvert des liens dans le message)
- Envoyer des images/fichiers par message
- Message direct avec n'importe qui
- Afficher et kicker les membres du groupe
- Invitez les membres du groupe via le code d'invitation ou l'URL
- Modifier sa photo de profil
- Afficher une notification lorsqu'un nouveau message est reçu
- Rédacteur de messages alimenté par l'IA
- Chatbot IA intégré (propulsé par Inworld)
- Mode clair et sombre
- 100% Typescript

**Jouer avec :** https://disclown-web.vercel.app
<br />
**En apprendre plus :** https://disclown-web.vercel.app/info

## Jouez avec localement

Disclown est intégré à de nombreux services tiers pour prendre en charge un large éventail de fonctionnalités et fonctionner parfaitement dans un environnement serverless.

Ainsi, vous devez créer un compte pour chaque service afin de configurer correctement le projet avant de jouer avec lui localement.
Veuillez remplir toutes les variables d'environnement dans [.env.example](/.env.example).

### Upstash

Créez une base de données Redis sur leur [site Web](https://upstash.com) et obtenez `REDIS_URL`, `REDIS_TOKEN` depuis la console.

### Ably Realtime

Créez un nouveau projet sur https://ably.com, collez `ABLY API KEY` dans les variables d'environnement.

### PlanetScale

Par défaut, il utilise Drizzle ORM avec PlanetScale pour la base de données. Vous pouvez utiliser d'autres fournisseurs si vous préférez.

Créez une base de données MySQL sur leur [tableau de bord](https://planetscale.com) et obtenez votre `DATABASE_URL` et `DATABASE_PUSH_URL`.

> Note
>
> `DATABASE_PUSH_URL` est utilisé pour pousser les modifications pour lesquelles les connexions au pool sont désactivées.

### Cloudinary

Créez un nouveau projet sur https://cloudinary.com, copiez le nom du cloud, la clé et le secret API.

### Next Auth

Remplissez `NEXTAUTH_URL` et `NEXTAUTH_SECRET`, lisez leurs [docs](https://next-auth.js.org/getting-started/example) pour plus de détails.

Actuellement, seul Github OAuth est pris en charge. Suivez [ce guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) pour configurer l'application OAuth sur Github, générez un `GITHUB_ID` avec `GITHUB_SECRET`.

### Mode Developpement

Exécutez `pnpm run dev` et modifiez les fichiers pour voir les modifications.

### Build à partir de la Source

Ce projet utilise Turborepo et PNPM.

```bash
pnpm run build
```

Il devrait pouvoir être déployé sur Vercel ou sur toute autre plateforme.
