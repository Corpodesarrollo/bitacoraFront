import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-inico',
  templateUrl: './inico.component.html',
  styleUrls: ['./inico.component.scss']
})
export class InicioComponent implements OnInit {

  /* Perfiles Administrador */
  perfilAdmin = false

  parametrosFiltros:any = {
    "bandera":"0",
    "perfilId":""
  }

  usuario: any;
  primerosMensajes: any[] = [];
  mensajeCargando: string = '';
  cantidadMensajes: number = 0;

  paginaActual: number = 1; // Página actual
  tamanoPagina: number = 10; // Tamaño de página

  idUsuario:any;
  perfilUsuario: any;
  infoColegio : any;
  usuarioLogueado: any;


  estudiantes = [
    { id: 1, grupo: "8°", jornada: "Mañana", nombre: "Samuel", apellidos: "Henao Ureña" },
    { id: 2, grupo: "9°", jornada: "Tarde", nombre: "Sofía", apellidos: "Gómez Ríos" },
    { id: 3, grupo: "7°", jornada: "Mañana", nombre: "Mateo", apellidos: "López Torres" },
    { id: 4, grupo: "10°", jornada: "Mañana", nombre: "Valentina", apellidos: "Ramírez Sánchez" },
    { id: 5, grupo: "6°", jornada: "Tarde", nombre: "Alejandro", apellidos: "Pérez González" },
    { id: 6, grupo: "11°", jornada: "Mañana", nombre: "Camila", apellidos: "Rodríguez Vargas" },
    { id: 7, grupo: "9°", jornada: "Tarde", nombre: "Juan", apellidos: "Torres Gómez" },
    { id: 8, grupo: "8°", jornada: "Mañana", nombre: "Mariana", apellidos: "Vargas Ramírez" },
    { id: 9, grupo: "7°", jornada: "Mañana", nombre: "Diego", apellidos: "González López" },
    { id: 10, grupo: "10°", jornada: "Tarde", nombre: "Isabella", apellidos: "Sánchez Henao" },
    { id: 11, grupo: "8°", jornada: "Mañana", nombre: "Andrés", apellidos: "Hernández Muñoz" },
    { id: 12, grupo: "9°", jornada: "Tarde", nombre: "Valeria", apellidos: "Rojas Castro" },
    { id: 13, grupo: "7°", jornada: "Mañana", nombre: "Gabriel", apellidos: "Díaz Ruiz" },
    { id: 14, grupo: "10°", jornada: "Mañana", nombre: "Lucía", apellidos: "Gutiérrez Silva" },
    { id: 15, grupo: "6°", jornada: "Tarde", nombre: "José", apellidos: "Molina López" },
    { id: 16, grupo: "11°", jornada: "Mañana", nombre: "María", apellidos: "Castro Soto" },
    { id: 17, grupo: "9°", jornada: "Tarde", nombre: "Daniel", apellidos: "Hernández Ramírez" },
    { id: 18, grupo: "8°", jornada: "Mañana", nombre: "Daniela", apellidos: "Muñoz Castro" },
    { id: 19, grupo: "7°", jornada: "Mañana", nombre: "Carlos", apellidos: "López Sánchez" },
    { id: 20, grupo: "10°", jornada: "Tarde", nombre: "Laura", apellidos: "González Torres" },
    { id: 21, grupo: "8°", jornada: "Mañana", nombre: "Sebastián", apellidos: "Vargas Gómez" },
    { id: 22, grupo: "9°", jornada: "Tarde", nombre: "Isabel", apellidos: "Ramírez Silva" },
    { id: 23, grupo: "7°", jornada: "Mañana", nombre: "Javier", apellidos: "Torres Rojas" },
    { id: 24, grupo: "10°", jornada: "Mañana", nombre: "Ana", apellidos: "Sánchez Gutiérrez" },
    { id: 25, grupo: "6°", jornada: "Tarde", nombre: "Pedro", apellidos: "López Molina" },
    { id: 26, grupo: "11°", jornada: "Mañana", nombre: "Carolina", apellidos: "Castro Díaz" },
    { id: 27, grupo: "9°", jornada: "Tarde", nombre: "Julio", apellidos: "Hernández Vargas" },
    { id: 28, grupo: "8°", jornada: "Mañana", nombre: "Paola", apellidos: "Muñoz Ramírez" },
    { id: 29, grupo: "7°", jornada: "Mañana", nombre: "Manuel", apellidos: "López Soto" },
    { id: 30, grupo: "10°", jornada: "Tarde", nombre: "Fernanda", apellidos: "González Castro" }
  ];

  colegios = [
    { id: 1, nombre: "COLEGIO ALVARO GOMEZ HURTADO (IED)", estudiantes: 100 },
    { id: 2, nombre: "COLEGIO JUAN PABLO II (IED)", estudiantes: 150 },
    { id: 3, nombre: "COLEGIO SANTA MARIA DEL MONTE (IED)", estudiantes: 200 },
    { id: 4, nombre: "COLEGIO SIMON BOLIVAR (IED)", estudiantes: 180 },
    { id: 5, nombre: "COLEGIO SAN FRANCISCO (IED)", estudiantes: 120 },
    { id: 6, nombre: "COLEGIO NUEVO CAMPOALEGRE (IED)", estudiantes: 90 },
    { id: 7, nombre: "COLEGIO SANTA ISABEL (IED)", estudiantes: 220 },
    { id: 8, nombre: "COLEGIO JUAN XXIII (IED)", estudiantes: 170 },
    { id: 9, nombre: "COLEGIO ANTONIO NARIÑO (IED)", estudiantes: 110 },
    { id: 10, nombre: "COLEGIO NUEVO TEUSAQUILLO (IED)", estudiantes: 140 },
    { id: 11, nombre: "COLEGIO GABRIEL BETANCOURT MEJIA (IED)", estudiantes: 190 },
    { id: 12, nombre: "COLEGIO CAMPO DAVID (IED)", estudiantes: 130 },
    { id: 13, nombre: "COLEGIO EL BOSQUE (IED)", estudiantes: 160 },
    { id: 14, nombre: "COLEGIO LAS MARGARITAS (IED)", estudiantes: 240 },
    { id: 15, nombre: "COLEGIO LOS ANGELES (IED)", estudiantes: 200 },
    { id: 16, nombre: "COLEGIO SAN LUCAS (IED)", estudiantes: 170 },
    { id: 17, nombre: "COLEGIO PEDRO HERRERA (IED)", estudiantes: 150 },
    { id: 18, nombre: "COLEGIO SIMON RODRIGUEZ (IED)", estudiantes: 210 },
    { id: 19, nombre: "COLEGIO ALBERTO SANTOS (IED)", estudiantes: 180 },
    { id: 20, nombre: "COLEGIO MARIA CANO (IED)", estudiantes: 130 }
  ];

  totalItems: number = this.estudiantes.length;
  totalItemsAdm: number = this.colegios.length;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private mensajesService: MensajesService) {
    this.usuario = this.usuarioService.obtenerUsuario();
    this.idUsuario = this.usuario.id;
    this.infoColegio = this.usuarioService.obtenerPerfilUsuario();
    this.usuarioLogueado = this.usuarioService.obtenerUsuario();
    this.cargarListas();
  }

  ngOnInit() {
    let datosUsuario  = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.parametrosFiltros.perfilId =  datosUsuario.perfil.idPerfil;
    this.perfilUsuario = this.infoColegio.perfil.rol_usuario;
    if(this.perfilUsuario === 'adminsec'){
      this.perfilAdmin = true;
    }
  };

  cargarListas(){

    let datosUsuario  = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    //console.log("EStados del usuario: ", datosUsuario);
    this.parametrosFiltros.usuarioId = this.usuarioLogueado.id;
    this.parametrosFiltros.localidadId = datosUsuario.localidad.idLocalidad;
    this.parametrosFiltros.colegioId = datosUsuario.colegio.idColegio;
    this.parametrosFiltros.perfilId = datosUsuario.perfil.idPerfil;
    this.parametrosFiltros.perfilLoginId = datosUsuario.perfil.idPerfil;
    this.parametrosFiltros.jornadaId = datosUsuario.jornada.idJornada;
    this.parametrosFiltros.sedeId = datosUsuario.sede.idSede;

    this.mensajesService.obtenerMensajes(this.parametrosFiltros).subscribe((resp:any)=>{
      if(resp.data){
        this.primerosMensajes = resp.data;
        this.cantidadMensajes = resp.data.length;
      }
      //console.log(this.primerosMensajes)
    })
  }

  verMensajes() {
    this.router.navigateByUrl("/home/mensajes");
  };

  onPageChange(pagina: number) {
    this.paginaActual = pagina;
  };

  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.tamanoPagina);
  };


  get totalPaginasAdm(): number {
    return Math.ceil(this.totalItemsAdm / this.tamanoPagina);
  };

  get estudiantesMostrar() {
    const indexInicio = (this.paginaActual - 1) * this.tamanoPagina;
    const indexFinal = indexInicio + this.tamanoPagina;
    return this.estudiantes.slice(indexInicio, indexFinal);
  };

  get colegiosMostrar() {
    const indexInicio = (this.paginaActual - 1) * this.tamanoPagina;
    const indexFinal = indexInicio + this.tamanoPagina;
    return this.colegios.slice(indexInicio, indexFinal);
  };
}




