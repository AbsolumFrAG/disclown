import { Avatar } from "ui/components/avatar";
import { Button } from "ui/components/button";
import { UserInfo } from "shared/schema/chat";
import { trpc } from "@/utils/trpc";
import { Serialize } from "shared/types";
import { Member } from "db/schema";
import { useSession } from "next-auth/react";
import { UserProfileModal } from "@/components/modal/UserProfileModal";
import { DialogTrigger } from "ui/components/dialog";

export default function Members({
  group,
  isAdmin,
}: {
  group: number;
  isAdmin: boolean;
}) {
  // Obtenir l'état de la session de l'utilisateur
  const { status, data } = useSession();
  
  // Effectuer une requête pour obtenir la liste des membres du groupe
  const query = trpc.group.member.get.useQuery(
    { groupId: group },
    { enabled: status === "authenticated" }
  );

  return (
    <div className="flex flex-col gap-3">
      {query.isLoading ? (
        // Si la requête est en cours, afficher un indicateur de chargement
        <Skeleton />
      ) : (
        // Si les données de la requête sont disponibles, afficher les membres
        query.data?.map((member) => (
          <MemberItem
            key={member.user_id}
            member={member}
            canKick={isAdmin && member.user_id !== data?.user.id}
          />
        ))
      )}
    </div>
  );
}

// Composant de l'indicateur de chargement
function Skeleton() {
  return (
    <>
      <div className="h-[44px] rounded-md bg-muted/50" />
      <div className="h-[44px] rounded-md bg-muted/50" />
      <div className="h-[44px] rounded-md bg-muted/50" />
    </>
  );
}

function MemberItem({
  member,
  canKick,
}: {
  member: Serialize<Member & { user: UserInfo }>;
  canKick: boolean;
}) {
  const utils = trpc.useContext();

  // Mutation pour exclure un membre du groupe
  const kick = trpc.group.member.kick.useMutation({
    onSuccess(_, { groupId, userId }) {
      utils.group.member.get.setData({ groupId }, (prev) =>
        prev?.filter((member) => member.user_id !== userId)
      );
    },
  });

  return (
    // Composant de profil d'utilisateur accessible en cliquant sur le nom d'utilisateur
    <UserProfileModal userId={member.user_id}>
      <div className="flex flex-row items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-accent">
        {/* Avatar de l'utilisateur */}
        <DialogTrigger className="flex flex-row items-center">
          <Avatar
            alt="avatar"
            size="2sm"
            src={member.user.image}
            fallback={member.user.name}
          />
        </DialogTrigger>

        {/* Nom de l'utilisateur (cliquable pour ouvrir le profil) */}
        <DialogTrigger asChild>
          <p className="cursor-pointer font-medium">{member.user.name}</p>
        </DialogTrigger>
        
        {/* Bouton "Kick" pour exclure le membre (visible pour les administrateurs) */}
        {canKick && (
          <Button
            color="danger"
            className="ml-auto"
            isLoading={kick.isLoading}
            onClick={() =>
              kick.mutate({
                groupId: member.group_id,
                userId: member.user_id,
              })
            }
          >
            Kick
          </Button>
        )}
      </div>
    </UserProfileModal>
  );
}
