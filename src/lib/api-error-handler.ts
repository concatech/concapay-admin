export function handleApiError(response: Response): never {
  if (response.status === 401 || response.status === 403) {
    // Token inválido ou expirado
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('csrf_token');
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }
  
  if (response.status === 404) {
    throw new Error('Recurso não encontrado');
  }
  
  if (response.status >= 500) {
    throw new Error('Erro no servidor. Tente novamente mais tarde.');
  }
  
  throw new Error(`Erro na requisição: ${response.statusText}`);
}

