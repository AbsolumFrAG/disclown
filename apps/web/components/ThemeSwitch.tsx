// Import des modules et composants nécessaires
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectProps,
  SelectTrigger,
  SelectValue,
} from "ui/components/select";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useMemo } from "react";
import { useMounted } from "ui/hooks/use-mounted";

// Définition des propriétés du composant ThemeSwitch
export type ThemeSwitchProps = Omit<SelectProps, "value" | "onValueChanged"> & {
  id?: string;
};

// Composant principal ThemeSwitch
export function ThemeSwitch({ id, ...props }: ThemeSwitchProps) {
  // Utilisation du hook useTheme pour accéder aux informations sur le thème
  const { theme, themes, setTheme } = useTheme();
  
  // Création d'une liste d'options à partir des thèmes disponibles
  const options = useMemo(() => themes.map(getInfo), [themes]);
  
  // Utilisation du hook useMounted pour vérifier si le composant est monté
  const mounted = useMounted();

  // Si le composant n'est pas monté, on ne rend rien
  if (!mounted) return <></>;

  return (
    // Utilisation du composant Select pour afficher le sélecteur de thème
    <Select value={theme} onValueChange={(v) => setTheme(v)} {...props}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {/* Affichage des options de thème */}
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <div className="flex flex-row items-center">
              <div className="mr-2">{item.icon}</div>
              <p>{item.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Fonction getInfo pour obtenir des informations sur chaque thème
function getInfo(theme: string) {
  switch (theme) {
    case "light":
      return {
        name: "Clair",
        icon: <SunIcon className="w-4" />,
        value: theme,
      };
    case "dark":
      return {
        name: "Sombre",
        icon: <MoonIcon className="w-4" />,
        value: theme,
      };
    case "system":
      return {
        name: "Système",
        icon: <MonitorIcon className="w-4" />,
        value: theme,
      };
    default:
      return { name: theme, icon: undefined, value: theme };
  }
}
