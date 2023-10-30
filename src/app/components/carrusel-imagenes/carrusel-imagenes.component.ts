import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carrusel-imagenes',
  templateUrl: './carrusel-imagenes.component.html',
  styleUrls: ['./carrusel-imagenes.component.scss']
})
export class CarruselImagenesComponent {

  slides: any[] = []; /* Imagenes Slides */

  ngOnInit(){
    this.cargarImagenes()
  }

  cargarImagenes() {
    const numeroImagenes = 59; // Imagenes en carpeta
    const ruta = "assets/img/slides_acceso_perfil/";
    for (let i = 1; i <= numeroImagenes; i++) {
      const url = ruta + 'img-' + i + '.jpg';
      this.slides.push({ url });
    }
  }
}
