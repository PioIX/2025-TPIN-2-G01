// types.ts
export type RootStackParamList = {
  Home: undefined;
  Result: { email: string; password: string };
};

// tipos de datos para el form de login 
export interface formData {
  Email: string,
  Contraseña: string
}

// tipos de datos para el hook para hacer fetch
export interface FetchOptions {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetchData: (options: FetchOptions) => Promise<T | void>;
}

export interface fetchResponse {
  mensaje: string,
  key: string,
  rango: string
}

export interface AuthContextType {
  token: string | null;
  rango: string | null;
  login: (token: string, rango: string) => Promise<void>;
  logout: () => Promise<void>;
}
export type NavBarProps = {
  props: string[]; 
};

export interface QrCodeProps {
  value: string
  size: number
  color: string
  backroundColor: string
  logo?: {uri:string}
  logoSize?: number
  logoBackgroundColor?: string
}