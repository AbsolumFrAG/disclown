import { UserInfo } from "shared/schema/chat";
import { useState, useEffect } from "react";
import { Avatar } from "ui/components/avatar";

// Définition du type TypingData pour stocker les données de saisie
type TypingData = {
  user: UserInfo;
  timestamp: Date;
};

export function useTypingStatus() {
  // État local pour stocker les données de saisie
  const [typing, setTyping] = useState<TypingData[]>([]);

  useEffect(() => {
    // Utilisation d'une minuterie pour supprimer les saisies après 5 secondes d'inactivité
    const timer = setInterval(() => {
      const last = new Date(Date.now());
      last.setSeconds(last.getSeconds() - 5);

      // Filtrer les saisies plus anciennes que 5 secondes
      setTyping((prev) => prev.filter((data) => data.timestamp >= last));
    }, 5000);

    // Nettoyer la minuterie lorsque le composant est démonté
    return () => {
      clearInterval(timer);
    };
  }, []);

  return {
    typing,
    add: (user: UserInfo) => {
      const data: TypingData = {
        user,
        timestamp: new Date(Date.now()),
      };

      // Ajouter une nouvelle saisie uniquement si l'utilisateur n'est pas déjà dans la liste
      setTyping((prev) =>
        prev.some((u) => u.user.id === data.user.id) ? prev : [...prev, data]
      );
    },
  };
}

export function TypingIndicator({ typing }: { typing: TypingData[] }) {
  if (typing.length === 0) return <></>;

  return (
    <div className="flex flex-row gap-1 items-center">
      {typing.map((data) => (
        <Avatar
          key={data.user.id}
          src={data.user.image}
          fallback={data.user.name}
          size="small"
        />
      ))}
      <p className="text-sm text-foreground">est en train d&apos;écrire...</p>
    </div>
  );
}
