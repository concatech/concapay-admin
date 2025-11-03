const API_BASE_URL = 'https://concapay-back.fly.dev/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  csrf_token?: string;
  token_type?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    is_admin: boolean;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Email ou senha inválidos');
      }
      if (response.status === 403) {
        throw new Error('Acesso negado. Você não tem permissão para acessar o painel admin.');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const data = await response.json();
    
    // A API retorna: { token, user: {...} }
    // O token vem como 'token' na resposta
    const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
    
    if (!token) {
      throw new Error('Token não recebido da API');
    }

    const authData: AuthResponse = {
      access_token: token,
      csrf_token: data.csrf_token || data.data?.csrf_token || data['x-csrf-token'] || '',
      token_type: data.token_type || 'Bearer',
      user: data.user || data.data?.user,
    };

    // Salvar tokens no localStorage de forma síncrona
    localStorage.setItem('auth_token', token);
    
    // Garantir que foi salvo
    const saved = localStorage.getItem('auth_token');
    if (!saved || saved !== token) {
      throw new Error('Erro ao salvar token no navegador');
    }
    
    // CSRF token pode não vir na resposta, vamos tentar pegar do header
    const csrfFromHeader = response.headers.get('x-csrf-token');
    if (csrfFromHeader) {
      localStorage.setItem('csrf_token', csrfFromHeader);
    } else if (authData.csrf_token) {
      localStorage.setItem('csrf_token', authData.csrf_token);
    }

    return authData;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('csrf_token');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  getCsrfToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('csrf_token');
  },
};

