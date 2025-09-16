
export function validVar(username: string, password: string) {
  if (!username || !username.trim() || !password || !password.trim()) {
    return "Por favor, preenha todos os campos!";
  }
};

export function validUsername(username: string) {
  const usernameRegex = /^[a-zA-Z0-9_.-]+$/;

  if (username && !usernameRegex.test(username)) {
    return "Username inválido. Use apenas letras, números, underline, hífem ou ponto!";
  }
};

export function validPassword(password: string) {
  if (password.length < 6) {
    return "Sua senha tem que ter pelo menos 6 caracteres!";
  }
};
