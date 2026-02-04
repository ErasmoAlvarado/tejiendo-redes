// Tipos que mapean EXACTAMENTE las tablas MySQL del sistema

export interface Responsable {
  cedula_responsable: string;
  nombre_responsable: string;
  apellido_responsable: string;
  direccion_responsable: string;
  telefono_responsable: string;
  correo_responsable: string;
  cargo: string;
}

export interface Tejedor {
  cedula_tejedor: string;
  nombre_tejedor: string;
  apellido_tejedor: string;
  fecha_nacimiento: string;
  direccion_tejedor: string;
  telefono_tejedor: string;
  correo_tejedor: string;
  profesion_tejedor: string;
  fecha_ingreso: string;
  tipo_voluntario: string;
  // Campos extra para la app (autenticación/estado)
  usuario?: string;
  rol?: 'ADMIN' | 'REGISTRO' | 'MEDICO' | 'FARMACIA' | 'LECTOR';
  activo?: boolean;
}

export interface Especialidad {
  codigo_especialidad: string;
  nombre_especialidad: string;
  descripcion: string;
}

export interface Enfermedad {
  codigo_enfermedad: string;
  nombre_enfermedad: string;
  tipo_patologia: string;
  descripcion?: string;
}

export interface Comunidad {
  codigo_comunidad: string;
  nombre_comunidad: string;
  tipo_comunidad: string; // Ej. Urbana, Rural, Indígena, Base de Misiones
  estado: string;
  municipio: string;
  direccion: string;
  ubicacion_fisica: string;
  cedula_responsable: string;
  cantidad_habitantes: number;
  cantidad_familias: number;
  telefono_comunidad: string;
  // Relaciones
  responsable?: Responsable;
}

export interface Organismo {
  codigo_organismo: string;
  cedula_tejedor: string;
  nombre_organismo: string;
  pais_organismo: string;
  estado_organismo: string;
  municipio_organismo: string;
  direccion_organismo: string;
  ubicacion_fisica: string;
  correo_organismo: string;
  telefono_organismo: string;
  // Relaciones
  tejedor?: Tejedor;
}

export interface Paciente {
  cedula_paciente: string;
  codigo_comunidad: string;
  nombre_paciente: string;
  apellido_paciente: string;
  sexo: 'M' | 'F';
  fecha_nacimiento: string;
  direccion_paciente: string;
  telefono_paciente: string;
  correo_paciente: string;
  nota?: string;
  // Relaciones
  comunidad?: Comunidad;
}

export interface Antecedente {
  codigo_antecedente: string;
  cedula_paciente: string;
  peso: number;
  talla: number;
  temperatura: number;
  FC: string;
  TA: string;
  enfermedades_previas: string;
  alergias: string;
  enfermedades_familia: string;
  // Relaciones
  paciente?: Paciente;
}

export interface Medicamento {
  codigo_medicamento: string;
  nombre_medicamento: string;
  presentacion: string;
  descripcion: string;
  existence: number;
}

export interface Abordaje {
  codigo_abordaje: string;
  fecha_abordaje: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion: string;
  // Campo extra para UI
  estado?: 'Planificado' | 'En Curso' | 'Finalizado';
}

export interface AbordajeComunidad {
  codigo_abordaje: string;
  codigo_comunidad: string;
  observaciones?: string;
  // Relaciones
  abordaje?: Abordaje;
  comunidad?: Comunidad;
}

export interface Medico {
  cedula_tejedor: string;
  codigo_especialidad: string;
  matricula_colegio_medico: string;
  matricula_sanidad: string;
  // Relaciones
  tejedor?: Tejedor;
  especialidad?: Especialidad;
}

export interface Consulta {
  codigo_consulta: string;
  codigo_abordaje: string;
  cedula_paciente: string;
  cedula_medico: string;
  motivo_consulta: string;
  diagnostico_texto: string;
  recomendaciones: string;
  tratamiento: string;
  // Relaciones
  abordaje?: Abordaje;
  paciente?: Paciente;
  medico?: Medico;
}

export interface ConsultaEnfermedad {
  codigo_consulta: string;
  codigo_enfermedad: string;
  observacion_especifica?: string;
  // Relaciones
  consulta?: Consulta;
  enfermedad?: Enfermedad;
}

export interface MedicamentoPaciente {
  codigo_medicamento: string;
  cedula_paciente: string;
  fecha_entrega: string;
  cantidad_entregada: number;
  cedula_tejedor: string;
  // Relaciones
  medicamento?: Medicamento;
  paciente?: Paciente;
  tejedor?: Tejedor;
}

export interface TejedorAbordaje {
  codigo_abordaje: string;
  cedula_tejedor: string;
  rol_en_abordaje?: string;
  // Relaciones
  abordaje?: Abordaje;
  tejedor?: Tejedor;
}

// Tipos auxiliares para reportes y estadísticas

export interface KPI {
  label: string;
  value: number;
  change?: number;
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ReporteAbordaje {
  abordaje: Abordaje;
  comunidades: Comunidad[];
  total_consultas: number;
  pacientes_unicos: number;
}

export interface ReporteComunidad {
  comunidad: Comunidad;
  pacientes_registrados: number;
  abordajes_realizados: number;
  total_consultas: number;
}

export interface ReportePaciente {
  paciente: Paciente;
  edad: number;
  total_consultas: number;
  ultima_consulta?: string;
}

export interface ReporteMorbilidad {
  tipo_morbilidad: string;
  cantidad: number;
  porcentaje: number;
}

export interface ReporteMedicamento {
  medicamento: Medicamento;
  total_entregado: number;
  entregas_realizadas: number;
}

// Catálogo de morbilidad (configurable - sin tabla nueva)
export const CATALOGO_MORBILIDAD = [
  'Respiratoria',
  'Gastrointestinal',
  'Dermatológica',
  'Hipertensión Arterial',
  'Diabetes',
  'Cardiovascular',
  'Neurológica',
  'Musculoesquelética',
  'Oftalmológica',
  'Odontológica',
  'Salud Mental',
  'Ginecológica',
  'Pediátrica',
  'Geriátrica',
  'Otros',
];

// Grupos etarios para estadísticas
export const GRUPOS_ETARIOS = [
  { label: '0-5 años', min: 0, max: 5 },
  { label: '6-12 años', min: 6, max: 12 },
  { label: '13-17 años', min: 13, max: 17 },
  { label: '18-35 años', min: 18, max: 35 },
  { label: '36-59 años', min: 36, max: 59 },
  { label: '60+ años', min: 60, max: 150 },
];

export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export function getGrupoEtario(edad: number): string {
  const grupo = GRUPOS_ETARIOS.find(g => edad >= g.min && edad <= g.max);
  return grupo?.label || 'Sin grupo';
}

// Generador de códigos con prefijo (simula lógica transaccional)
export function generarCodigo(prefijo: string, ultimoNumero: number): string {
  const numero = (ultimoNumero + 1).toString().padStart(3, '0');
  return `${prefijo}-${numero}`;
}
