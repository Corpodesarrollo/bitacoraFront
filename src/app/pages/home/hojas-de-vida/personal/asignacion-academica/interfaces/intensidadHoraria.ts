export interface intensidadHoraria {
    data:    intensidad[];
    message: string;
    Ok:      boolean;
    status:  number;
}

export interface intensidad {
    codAsignatura:         string;
    nombreAsignatura:      NombreAsignatura;
    codGrado:              string;
    nombreGrado:           NombreGrado;
    codJerarquico:         string;
    codGrupo:              string;
    nombreGrupo:           string;
    docenteIdentificacion: string;
    horasAsignadas:        string;
    vigencia:              string;
}

export enum NombreAsignatura {
    Biología = "BIOLOGÍA",
    CienciasNaturales = "Ciencias Naturales",
    CienciasPoliticasYEconomicas = "CIENCIAS POLITICAS Y ECONOMICAS",
    Comportamiento = "COMPORTAMIENTO",
    Cálculo = "CÁLCULO",
    EducacionArtistica = "EDUCACION ARTISTICA",
    Emprendimiento = "EMPRENDIMIENTO",
    Etica = "ETICA",
    Filosofia = "FILOSOFIA",
    Física = "FÍSICA",
    Informática = "INFORMÁTICA",
    Ingles = "INGLES",
    LenguaCastellana = "LENGUA CASTELLANA",
    Matemáticas = "MATEMÁTICAS",
    Modalidad = "MODALIDAD",
    Química = "QUÍMICA",
    RecreaciónYDeportes = "RECREACIÓN Y DEPORTES",
    Religion = "RELIGION",
    Sociales = "SOCIALES",
    Tecnología = "TECNOLOGÍA",
    Trigonometria = "TRIGONOMETRIA",
}

export enum NombreGrado {
    Cuarto = "Cuarto",
    Décimo = "Décimo",
    Noveno = "Noveno",
    Octavo = "Octavo",
    Once = "Once",
    Quinto = "Quinto",
    Segundo = "Segundo",
    Sexto = "Sexto",
    Séptimo = "Séptimo",
    Tercero = "Tercero",
}
