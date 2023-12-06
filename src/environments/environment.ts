const DOMAIN = "https://apoyofab.educacionbogota.edu.co:7733";
export const environment = {
  DOMAIN: DOMAIN,
  production: false,
  URL_WEB_: "http://localhost:4200",
  URL_DEV: "https://web-laf.s3-website-us-east-1.amazonaws.com",
  URL_POLITICA_DATOS:  'https://www.educacionbogota.edu.co/portal_institucional/transparencia-politicas-lineamientos-manuales-sectoriales-institucionales',

  URL_WEB: `${DOMAIN}/apoyo-ui` ,
  URL_API: `${DOMAIN}/apoyo-api/api` ,
  URL_API_PERSONAL: `${DOMAIN}/personal/api` ,
  URL_API_REPORTE: `${DOMAIN}/reportes-api/api`,
  URL_ESTUDIANTES: `${DOMAIN}/#/students`,
  URL_BITACORAS: `${DOMAIN}/apoyo-api/api`,
  URL_APOYO_ESCOLAR: `${DOMAIN}/apoyo_escolar/`,
  URL_LOGIN_NARANJA:`${DOMAIN}/apoyo_escolar/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key={{key}}&cambio=&login={{usuario}}&password={{contrasenia}}&URLPag=${DOMAIN}/apoyo_escolar/bienvenida.do`,
  URL_CIERRE_LOGIN_NARANJA: `${DOMAIN}/apoyo_escolar/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=-1&cambio= `,

  CONTENT_TYPE: 'application/json',
  CONTENT_TYPE_PDF: 'application/pdf',
  VERSION: '1.2.20',
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
