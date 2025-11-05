import { Float } from "react-native/Libraries/Types/CodegenTypes";

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

export interface LoginFetchResponse {
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
  onPress: () => void;
  styleView?: {}
  stylePresable?: {}
  styleText?: {}
};


// export type ProfesorData = {
//   apellido:string
//   contraseña:string
//   correo_electronico:string
//   id_profesor: number
//   nombre: string
// }

export interface Cursos {
  id_curso: number
  año: number
  division: string
  carrera:string
}

export interface CursosProfe extends Array<Cursos> { }

export type Rol = {
  message: object
}

// export interface Alumno {
//   id_alumno: number;
//   id_curso: number;
//   nombre: string;
//   apellido: string;
// }

export interface AlumnosResponse {
  message: Alumno[];
}

export type RolMessage = {
  message: {
    id_profesor: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    contraseña: string;
  }
}

export interface Alumno {
  apellido: string;
  nombre: string;
}

export interface Asistencia {
  message: string
}


export interface QrCodeProps {
  value: string
  size: number
  color: string
  backgroundColor: string
  logo?: {uri:string}
  logoSize?: number
  logoBackgroundColor?: string
}

export interface User {
  apellido?: string;
  contraseña?: string;
  correo_electronico?: string;
  id_alumno?: number;
  id_curso?: number;
  img_alumno?: string;
  nombre?: string;
}

export interface ButtonProps {
  label: string;
  onPress?: () => void;
};

export interface Option {
  label: string;
  value: string;
}

export interface Admins {
  id : number
  nombre : string
  apellido : string
  Rango: "O" | "P"
  email: `${string}@${string}.${string}`; 
  contraseña: string
}
export interface Estudiantes {
  id : number 
  id_curso : number 
  nombre : string
  apellido : string
  imagen: null|string
  email: `${string}@${string}.${string}`; 
  contraseña: string
}
export interface Profesores {
  id : number 
  nombre : string
  apellido : string
  email: `${string}@${string}.${string}`; 
  contraseña: string
}