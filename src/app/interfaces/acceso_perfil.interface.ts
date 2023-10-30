import { ColegioPerfil } from "./colegio_perfil.interface";
import { Dependencia } from "./dependencia.interface";
import { Jornada } from "./jornada.interface";
import { Localidad } from "./localidad.interface";
import { Perfil } from "./perfil.interface";
import { Sede } from "./sede.interface";

export interface AccesoPerfil {
  perfil: Perfil,
  colegio?: ColegioPerfil,
  dependencia?: Dependencia,
  jornada?: Jornada,
  localidad?: Localidad,
  sede?: Sede
}
