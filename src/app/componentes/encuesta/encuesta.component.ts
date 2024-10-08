import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Encuesta} from "../../models/encuesta";
import {EncuestaService} from "../../services/encuesta.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.less'
})
export class EncuestaComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private encuestaService: EncuestaService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ]+$'),
        Validators.required
      ]),
      apellido: new FormControl("", [
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ]+$'),
        Validators.required
      ]),
      edad: new FormControl("", [
        Validators.min(18),
        Validators.max(99),
        Validators.required
      ]),
      telefono: new FormControl("", [
        Validators.pattern('^[0-9]{10}$'),
        Validators.required
      ]),
      alumnoRegular: new FormControl("", [
        Validators.required
      ]),
      lenguajes: new FormGroup({
        c: new FormControl(false),
        csharp: new FormControl(false),
        php: new FormControl(false),
        js: new FormControl(false),
        python: new FormControl(false),
      }),                                                          // checkboxes
      feedback: new FormControl("", Validators.required)           // textbox
    });
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }

  get telefono() {
    return this.form.get('telefono');
  }

  get alumnoRegular() {
    return this.form.get('alumnoRegular');
  }

  get lenguajes() {
    return this.form.get('lenguajes') as FormGroup;
  }

  get feedback() {
    return this.form.get('feedback');
  }

  enviarForm(): void {
    console.log(this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
      const encuestaData = new Encuesta(
        this.form.value.nombre,
        this.form.value.apellido,
        this.form.value.edad,
        this.form.value.telefono,
        this.form.value.alumnoRegular,
        this.form.value.lenguajes,
        this.form.value.feedback
      );

      this.encuestaService.guardarEncuesta(encuestaData)
        .then((): void => {
          console.log('Encuesta guardada exitosamente.');
          this.showSuccessAlert('Encuesta guardada exitosamente.').then(() => {
            this.form.reset();
          });
        })
        .catch(error => {
          console.error('Error al guardar la encuesta:', error);
          this.showErrorAlert('Error al guardar la encuesta: ' + error).then(() => {

          });
        });
    }
  }

  /**
   * Muestra mensaje de exito
   * @param message
   * @private
   */
  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Encuesta enviada!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  /**
   * Muestra mensaje de error
   * @param message
   * @private
   */
  private showErrorAlert(message: string) {
    return Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }
}
