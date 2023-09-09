import { AlertDialog } from "ui/components/alert-dialog";
import { Button } from "ui/components/button";
import { showErrorToast } from "@/utils/stores/page";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Danger({ group }: { group: number }) {
  return (
    <div className="flex flex-col gap-3">
      <LeaveGroup group={group} />
      <div className="mt-3">
        <h3 className="text-foreground font-medium text-base">
          Supprimer le groupe
        </h3>
        <p className="text-sm text-muted-foreground">{`Cette action est irréversible et ne peut être annulée`}</p>
        <DeleteGroupButton group={group} />
      </div>
    </div>
  );
}

export function LeaveGroup({ group }: { group: number }) {
  const router = useRouter();
  const mutation = trpc.group.leave.useMutation({
    onSuccess: () => {
      return router.push("/home");
    },
    onError: (error) => {
      showErrorToast({
        title: "Impossible de quitter le groupe",
        description: error.message,
      });
    },
  });

  return (
    <div>
      <h3 className="text-base font-medium text-foreground">Quitter le groupe</h3>
      <p className="text-sm text-muted-foreground">{`Vous pouvez toujours rejoindre le groupe après l'avoir quitté`}</p>
      <Button
        color="danger"
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate({ groupId: group })}
        className="mt-3"
      >
        Quitter
      </Button>
    </div>
  );
}

function DeleteGroupButton({ group }: { group: number }) {
  const [open, setOpen] = useState(false);
  const deleteMutation = trpc.group.delete.useMutation({
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      title="Etes-vous sûr ?"
      description="Cela supprimera le groupe, ainsi que tous ses messages"
      action={
        <Button
          color="danger"
          isLoading={deleteMutation.isLoading}
          onClick={(e) => {
            deleteMutation.mutate({ groupId: group });
            e.preventDefault();
          }}
        >
          Supprimer le groupe
        </Button>
      }
    >
      <Button color="danger" className="w-fit mt-3">
        Supprimer
      </Button>
    </AlertDialog>
  );
}
