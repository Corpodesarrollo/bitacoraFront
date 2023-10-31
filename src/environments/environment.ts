export const environment = {
  production: false,
  URL_WEB_: "http://localhost:4200",
  URL_WEB: "https://pruebas-sed.linktic.com/apoyo-ui",
  URL_DEV: "https://web-laf.s3-website-us-east-1.amazonaws.com",
  URL_API: "https://pruebas-sed.linktic.com/apoyo-api/api",
  URL_API_PERSONAL: "https://pruebas-sed.linktic.com/personal/api",
  URL_API_REPORTE: "https://pruebas-sed.linktic.com/reportes-api/api",
  URL_ESTUDIANTES: "https://pruebas-sed.linktic.com/#/students",
  URL_BITACORAS: "http://20.237.244.76:8080",
  URL_POLITICA_DATOS: 'https://www.educacionbogota.edu.co/portal_institucional/sites/default/files/inline-files/Politica_Tratamiento_Datos_Personales_SED.pdf',
  URL_APOYO_ESCOLAR: "https://pruebas-sed.linktic.com/apoyo_escolar/",
  CONTENT_TYPE: 'application/json',
  CONTENT_TYPE_PDF: 'application/pdf',
  VERSION: '5.12.0',
  msalConfig: {
    auth: {
        clientId: 'cb166727-5a4e-4e76-8e9b-4eaefcaddc23',
        authority: 'https://login.microsoftonline.com/organizations'
    }
  },
  apiConfig: {
      scopes: ['user.read'],
      uri: 'https://graph.microsoft.com/v1.0/me'
  },
  formatos_imagen_validos: [
    'image/bmp',
    'image/jpg',
    'image/png',
  ],
  tamano_imagen: 1048576,
  es_desarrollo: false
};
