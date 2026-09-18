/** Senha forte mínima para register/change — zero custo, validação local. */
const MIN_LENGTH = 10;

export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < MIN_LENGTH) {
    return `Senha com no mínimo ${MIN_LENGTH} caracteres.`;
  }
  if (!/[a-z]/.test(password)) {
    return "Senha deve incluir ao menos uma letra minúscula.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Senha deve incluir ao menos uma letra maiúscula.";
  }
  if (!/[0-9]/.test(password)) {
    return "Senha deve incluir ao menos um número.";
  }
  return null;
}

export const PASSWORD_POLICY_HINT =
  "Mínimo 10 caracteres, com maiúscula, minúscula e número.";
