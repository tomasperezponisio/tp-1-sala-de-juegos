import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

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

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      edad: new FormControl("", Validators.min(18)),
      telefono: new FormControl("", [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]{10}')
      ]),
      alumnoRegular: new FormControl("", Validators.minLength(4)), // radioButton yes / no
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

  enviarForm() {
    console.log(this.form.value);

  }

  protected readonly FormGroup = FormGroup;
}
