import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-paginador',
	templateUrl: './paginador.component.html',
	styleUrls: ['./paginador.component.scss']
})
export class PaginadorComponent {
	@Input() contadorPagina: number = 1; // Número de páginas
	@Input() paginaActual: number = 1; // Número de página actual
	paginaSiguiente: number = this.paginaActual + 1;// Número de página siguiente;
	@Output() cambioPagina: EventEmitter<number> = new EventEmitter<number>(); // Notifica cuando se cambia de página
	@Input() showPreviousButton: boolean = true;
	@Input() showNextButton: boolean = true;
	@Input() totalRegistros: number = 0;

	registrosPorPagina = 10;  // Registros por página

	onPageChange(pagina: number) {
		this.paginaActual = pagina;
		this.cambioPagina.emit(pagina);
	};

	/* Método contador de páginas */
	get rangoPagina() {
		return (this.paginaActual - 1) * this.registrosPorPagina + 1;
	}

	/* Método página anterior*/
	anterior() {
		if (this.paginaActual > 1) {
			this.paginaActual--;
			this.cambioPagina.emit(this.paginaActual);
		};
	};

	/* Método siguiente página */
	siguiente() {
		if (this.paginaActual < this.contadorPagina) {
			this.paginaActual++;
			this.cambioPagina.emit(this.paginaActual);
			this.paginaSiguiente = this.paginaActual++;
		};
	};

	/* Método para contar páginas */
	get contadorPaginas() {
		const primerRegistro = (this.paginaActual - 1) * this.registrosPorPagina + 1;
		const ultimoRegistro = Math.min(this.paginaActual * this.registrosPorPagina, this.totalRegistros);
		return Array(ultimoRegistro - primerRegistro + 1).fill(0).map((x, i) => i + primerRegistro);
	};

	/* Método para primera página*/
	primeraPagina() {
		this.paginaActual = 1;
		this.cambioPagina.emit(this.paginaActual);
	};

	/* Método para última página*/
	ultimaPagina() {
		this.paginaActual = this.contadorPagina;
		this.cambioPagina.emit(this.paginaActual);
	};
}
