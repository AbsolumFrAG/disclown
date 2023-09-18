import { input } from "ui/components/input";
import { Button, IconButton } from "ui/components/button";
import { trpc } from "@/utils/trpc";
import { useCopyText } from "ui/hooks/use-copy-text";
import { Group, GroupInvite } from "db/schema";
import { CheckIcon, CopyIcon, LinkIcon, TrashIcon } from "lucide-react";
import { Serialize } from "shared/types";
import { useSession } from "next-auth/react";
import { Switch } from "ui/components/switch";

export default function Invite({ group }: { group: Group }) {
  const { status } = useSession();
  const utils = trpc.useContext();

  // Requête pour obtenir les invitations du groupe (uniquement pour les utilisateurs authentifiés)
  const invitesQuery = trpc.group.invite.get.useQuery(
    {
      groupId: group.id,
    },
    { enabled: status === "authenticated" }
  );

  // Mutation pour mettre à jour les paramètres du groupe
  const updateMutation = trpc.group.update.useMutation({
    onSuccess: (data, { groupId }) => {
      return utils.group.info.setData({ groupId }, data);
    },
  });

  // Mutation pour créer de nouvelles invitations privées
  const createMutation = trpc.group.invite.create.useMutation({
    onSuccess: (data, { groupId }) => {
      return utils.group.invite.get.setData({ groupId }, (prev) =>
        prev != null ? [...prev, data] : prev
      );
    },
  });

  // Fonction pour définir si le groupe est public ou privé
  const onSetPublic = (v: boolean) => {
    updateMutation.mutate({
      groupId: group.id,
      public: v,
    });
  };

  // Données des invitations du groupe
  const invites = invitesQuery.data;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-3 justify-between">
        <label htmlFor="public">
          <h3 className="text-base font-medium text-foreground">Public</h3>
          <p className="text-sm text-muted-foreground">
            Tout le monde peut rejoindre votre groupe avec une URL
            d&apos;invitation
          </p>
        </label>
        {/* Interrupteur pour définir si le groupe est public */}
        <Switch
          id="public"
          checked={group.public}
          onCheckedChange={onSetPublic}
          disabled={updateMutation.isLoading}
        />
      </div>
      {/* Si le groupe est public, afficher l'invitation publique */}
      {group.public && <PublicInviteItem unique_name={group.unique_name} />}
      <div className="mt-3">
        <h3 className="font-medium text-base text-foreground">Privé</h3>
        <p className="text-sm text-muted-foreground">
          Les personnes disposant du code d&apos;invitation peuvent rejoindre votre
          groupe
        </p>
        {/* Afficher les invitations privées existantes */}
        {invites?.map((invite) => (
          <PrivateInviteItem key={invite.code} invite={invite} />
        ))}
        <div className="flex flex-row gap-3 mt-3">
          {/* Bouton pour créer une nouvelle invitation privée */}
          <Button
            color="primary"
            isLoading={createMutation.isLoading}
            onClick={() =>
              createMutation.mutate({
                groupId: group.id,
              })
            }
          >
            Nouvelle invitation
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher l'invitation publique
function PublicInviteItem({ unique_name }: { unique_name: string }) {
  const copy = useCopyText();
  const url = getInviteUrl(`@${unique_name}`);

  return (
    <div className="flex flex-row gap-3">
      {/* Champ de texte en lecture seule pour l'URL d'invitation publique */}
      <input readOnly className={input({ className: "px-4" })} value={url} />
      {/* Bouton pour copier l'URL d'invitation publique */}
      <Button aria-label="copier" size="small" onClick={() => copy.copy(url)}>
        {copy.isShow ? (
          <CheckIcon className="w-3" />
        ) : (
          <CopyIcon className="w-3" />
        )}
      </Button>
    </div>
  );
}

// Composant pour afficher chaque invitation privée existante
function PrivateInviteItem({ invite }: { invite: Serialize<GroupInvite> }) {
  const copy = useCopyText();
  const copyLink = useCopyText();

  const utils = trpc.useContext();

  // Mutation pour supprimer une invitation privée
  const deleteMutation = trpc.group.invite.delete.useMutation({
    onSuccess: (_, { groupId, code }) => {
      utils.group.invite.get.setData({ groupId }, (prev) =>
        prev?.filter((invite) => invite.code !== code)
      );
    },
  });

  return (
    <div className="flex flex-row gap-3 mt-3">
      {/* Champ de texte en lecture seule pour le code d'invitation privée */}
      <input
        readOnly
        className={input({ className: "px-4" })}
        value={invite.code}
      />
      {/* Bouton pour copier le code d'invitation privée */}
      <Button
        aria-label="copier"
        size="small"
        onClick={() => copy.copy(invite.code)}
      >
        {copy.isShow ? (
          <CheckIcon className="w-3" />
        ) : (
          <CopyIcon className="w-3" />
        )}
      </Button>
      {/* Bouton pour copier le lien d'invitation privée */}
      <Button
        aria-label="copier le lien"
        size="small"
        onClick={() => copyLink.copy(getInviteUrl(invite.code))}
      >
        {copyLink.isShow ? (
          <CheckIcon className="w-3" />
        ) : (
          <LinkIcon className="w-3" />
        )}
      </Button>
      {/* Bouton pour supprimer l'invitation privée */}
      <IconButton
        aria-label="delete"
        color="danger"
        size="small"
        isLoading={deleteMutation.isLoading}
        onClick={() =>
          deleteMutation.mutate({
            groupId: invite.group_id,
            code: invite.code,
          })
        }
      >
        <TrashIcon className="w-3" />
      </IconButton>
    </div>
  );
}

// Fonction utilitaire pour générer l'URL d'invitation
function getInviteUrl(code: string) {
  return `https://disclown.vercel.app/invite/${code}`;
}
