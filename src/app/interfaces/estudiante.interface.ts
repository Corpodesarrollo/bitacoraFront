import { ListaEstudiante } from "./lista_estudiante.interface";

export interface Estudiante {
  tipo_documento: ListaEstudiante;
  numero_documento: number;
  codigo_estudiante: number;
  nombre: string;
  colegio: ListaEstudiante;
  sede: ListaEstudiante;
  jornada: ListaEstudiante;
  metodologia: ListaEstudiante;
  grado: ListaEstudiante;
  grupo: ListaEstudiante;
  periodos: ListaEstudiante;
}
