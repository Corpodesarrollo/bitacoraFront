export interface Colegio {
  perfil: {
    id: number;
    nombre: string;
    etiqueta: string;
  };
  colegio: {
    id: number;
    nombre: string;
    foto_escudo: {
      nombreArchivo: string;
      codificacion: string;
    };
    localidad: {
      id: number;
      nombre: string;
    }
  };
  sede: {
    id: number;
    nombre: string;
  };
  jornada: {
    id: number;
    nombre: string;
  };
}
