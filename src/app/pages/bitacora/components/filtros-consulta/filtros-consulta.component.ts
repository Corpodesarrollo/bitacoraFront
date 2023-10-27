import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtros-consulta',
  templateUrl: './filtros-consulta.component.html',
  styleUrls: ['./filtros-consulta.component.scss'],
})
export class FiltrosConsultaComponent implements OnInit {
  public minDate: NgbDate;
  public maxDate: NgbDate;
  public mostrarFiltrosAvanzados: boolean = false;

  public filtrosFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef
  ) {
    this.filtrosFormGroup = this.formBuilder.group({
      fechaDesde: ['', [Validators.required]],
      fechaHasta: ['', [Validators.required]],
      usuario: [null, [Validators.required]],
      colegio: [null, [Validators.required]],
      sede: [null, [Validators.required]],
      jornada: [null, [Validators.required]],
      tipoLog: [null, [Validators.required]],
    });
  }

  public ngOnInit() {
    this.filtrosFormGroup.get('fechaDesde').valueChanges.subscribe((value) => {
      this.minDate = new NgbDate(value.year, value.month, value.day);
    });
    this.filtrosFormGroup.get('fechaHasta').valueChanges.subscribe((value) => {
      this.maxDate = new NgbDate(value.year, value.month, value.day);
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
