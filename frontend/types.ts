// types.ts
export type RootStackParamList = {
  Home: undefined;
  Result: { email: string; password: string };
};

export interface formData {
  Email: string,
  Contraseña: string
}