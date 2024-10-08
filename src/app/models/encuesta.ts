import {Lenguajes} from "../interfaces/lenguajes";

export class Encuesta {
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  alumnoRegular: 'yes' | 'no';
  lenguajes: Lenguajes;
  feedback: string;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    telefono: string,
    alumnoRegular: 'yes' | 'no',
    lenguajes: Lenguajes,
    feedback: string
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.telefono = telefono;
    this.alumnoRegular = alumnoRegular;
    this.lenguajes = lenguajes;
    this.feedback = feedback;
  }
}


