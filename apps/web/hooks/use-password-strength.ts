import { useMemo } from "react";

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const requirements = [
      { regex: /.{8,}/, text: "Mínimo 8 caracteres" },
      { regex: /[0-9]/, text: "Mínimo 1 número" },
      { regex: /[a-z]/, text: "Mínimo 1 letra minúscula" },
      { regex: /[A-Z]/, text: "Mínimo 1 letra maiúscula" },
    ];

    const strength = requirements.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }));

    const strengthScore = strength.filter((req) => req.met).length;

    const getStrengthColor = () => {
      if (strengthScore === 0) return "bg-border";
      if (strengthScore <= 1) return "bg-red-500";
      if (strengthScore <= 2) return "bg-orange-500";
      if (strengthScore === 3) return "bg-amber-500";
      return "bg-emerald-500";
    };

    const getStrengthText = () => {
      if (strengthScore === 0) return "Digite uma senha";
      if (strengthScore <= 2) return "Senha fraca";
      if (strengthScore === 3) return "Senha média";
      return "Senha forte";
    };

    return {
      strength,
      strengthScore,
      getStrengthColor,
      getStrengthText,
      requirements,
    };
  }, [password]);
}
