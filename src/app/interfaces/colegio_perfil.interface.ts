import { Localidad } from "./localidad.interface";

export interface ColegioPerfil {
  id: number,
  foto_escudo: File,
  localidad: Localidad,
  nombre:string
}
