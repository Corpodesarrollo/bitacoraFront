export interface Politica {
  id: number,
  contenido: string,
  fecha: Date,
  estado: boolean,
  tipoPolitica: string,
  version: number
}

export interface ApiResponse {
  code: number;
  message: string;
  data: Politica[];
}
