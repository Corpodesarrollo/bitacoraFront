import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-miga-pan',
  templateUrl: './miga-pan.component.html',
  styleUrls: ['./miga-pan.component.scss']
})
export class MigaPanComponent {

  private router = inject(Router);
  rutas: any[] = [];

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.actualizarMigaPan();
    });
  }

  actualizarMigaPan() {
    const urlSegments = this.router.url
      .split('/')
      .filter((ruta) => ruta !== '');

    this.rutas = urlSegments.map((ruta, index) => {
      const url = `/${urlSegments.slice(0, index + 1).join('/')}`;
      return {
        etiqueta: this.obtenerEtiqueta(ruta),
        url: url,
      };
    }).filter((ruta) => ruta.etiqueta !== '' && ruta.etiqueta !== null);
  }

  obtenerEtiqueta(ruta: string): string {

    const RUTAS:any = {
      'home': 'Sistema de Apoyo Escolar',
      'mensajes': 'Mensajes',
      'cambiar-contrasenia': 'Cambiar contraseña',
      'gestion-administrativa': 'Gestión administrativa',
      'enviar-mensajes': 'Enviar Mensajes',
      'consulta-bitacoras': 'Bitácora',
      'manuales-sistema': 'Manuales del sistema',
      'subir-manual': 'Subir manual',
      'hojas-de-vida': 'Hojas de vida',
      'personal': 'Personal',
      'politicas-datos-uso': 'Política de datos y de uso',
      'politicas-uso': 'Políticas de uso'
    }

    const etiqueta = RUTAS[ruta] || ''
    return etiqueta;
  }
}
