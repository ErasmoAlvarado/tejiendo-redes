// Mock Database - Simula datos de la BD MySQL
import type {
    Responsable,
    Tejedor,
    Especialidad,
    Comunidad,
    Organismo,
    Paciente,
    Antecedente,
    Medicamento,
    Abordaje,
    AbordajeComunidad,
    Medico,
    Consulta,
    MedicamentoPaciente,
    TejedorAbordaje,
} from '@/types/models';

// Datos mock - En producción, estos vendrían de MySQL
export const mockResponsables: Responsable[] = [
    {
        cedula_responsable: '12345678',
        nombre_responsable: 'María',
        apellido_responsable: 'González',
        telefono_responsable: '0424-1234567',
        correo_responsable: 'maria.gonzalez@example.com',
        direccion_responsable: 'Urbanización Los Rosales, Casa 45',
    },
    {
        cedula_responsable: '87654321',
        nombre_responsable: 'José',
        apellido_responsable: 'Pérez',
        telefono_responsable: '0412-9876543',
        correo_responsable: 'jose.perez@example.com',
        direccion_responsable: 'Sector El Valle, Calle Principal',
    },
];

export const mockTejedores: Tejedor[] = [
    {
        cedula_tejedor: '11111111',
        nombre_tejedor: 'Carlos',
        apellido_tejedor: 'Ramírez',
        telefono_tejedor: '0414-1111111',
        correo_tejedor: 'carlos.ramirez@salud.gob.ve',
        direccion_tejedor: 'Av. Principal, Edificio Salud',
        usuario: 'carlos.admin',
        rol: 'ADMIN',
        activo: true,
    },
    {
        cedula_tejedor: '22222222',
        nombre_tejedor: 'Ana',
        apellido_tejedor: 'Martínez',
        telefono_tejedor: '0424-2222222',
        correo_tejedor: 'ana.martinez@salud.gob.ve',
        direccion_tejedor: 'Calle 5, Casa 12',
        usuario: 'ana.registro',
        rol: 'REGISTRO',
        activo: true,
    },
    {
        cedula_tejedor: '33333333',
        nombre_tejedor: 'Luis',
        apellido_tejedor: 'Fernández',
        telefono_tejedor: '0412-3333333',
        correo_tejedor: 'luis.fernandez@salud.gob.ve',
        direccion_tejedor: 'Urbanización Norte, Torre A',
        usuario: 'luis.medico',
        rol: 'MEDICO',
        activo: true,
    },
    {
        cedula_tejedor: '44444444',
        nombre_tejedor: 'Rosa',
        apellido_tejedor: 'Silva',
        telefono_tejedor: '0426-4444444',
        correo_tejedor: 'rosa.silva@salud.gob.ve',
        direccion_tejedor: 'Sector Centro, Calle 8',
        usuario: 'rosa.farmacia',
        rol: 'FARMACIA',
        activo: true,
    },
];

export const mockEspecialidades: Especialidad[] = [
    {
        codigo_especialidad: 'ESP-001',
        nombre_especialidad: 'Medicina General',
        descripcion_especialidad: 'Atención médica general y preventiva',
    },
    {
        codigo_especialidad: 'ESP-002',
        nombre_especialidad: 'Pediatría',
        descripcion_especialidad: 'Especialización en salud infantil',
    },
    {
        codigo_especialidad: 'ESP-003',
        nombre_especialidad: 'Ginecología',
        descripcion_especialidad: 'Salud de la mujer',
    },
    {
        codigo_especialidad: 'ESP-004',
        nombre_especialidad: 'Odontología',
        descripcion_especialidad: 'Salud bucal',
    },
];

export const mockComunidades: Comunidad[] = [
    {
        codigo_comunidad: 'COM-001',
        nombre_comunidad: 'La Esperanza',
        estado: 'Miranda',
        municipio: 'Baruta',
        parroquia: 'El Cafetal',
        habitantes: 1500,
        cedula_responsable: '12345678',
    },
    {
        codigo_comunidad: 'COM-002',
        nombre_comunidad: 'Los Pinos',
        estado: 'Distrito Capital',
        municipio: 'Libertador',
        parroquia: 'Catedral',
        habitantes: 2300,
        cedula_responsable: '87654321',
    },
    {
        codigo_comunidad: 'COM-003',
        nombre_comunidad: 'El Progreso',
        estado: 'Miranda',
        municipio: 'Sucre',
        parroquia: 'Petare',
        habitantes: 1800,
        cedula_responsable: '12345678',
    },
];

export const mockOrganismos: Organismo[] = [
    {
        codigo_organismo: 'ORG-001',
        nombre_organismo: 'Ministerio de Salud',
        tipo_organismo: 'Gubernamental',
        telefono_organismo: '0212-5551234',
        cedula_tejedor: '11111111',
    },
    {
        codigo_organismo: 'ORG-002',
        nombre_organismo: 'Cruz Roja Venezolana',
        tipo_organismo: 'ONG',
        telefono_organismo: '0212-5555678',
        cedula_tejedor: '22222222',
    },
];

export const mockPacientes: Paciente[] = [
    {
        cedula_paciente: '26123456',
        nombre_paciente: 'Pedro',
        apellido_paciente: 'López',
        fecha_nacimiento: '1998-05-15',
        telefono_paciente: '0424-9998888',
        direccion_paciente: 'Calle 1, Casa 5',
        codigo_comunidad: 'COM-001',
        sexo: 'M',
    },
    {
        cedula_paciente: '28234567',
        nombre_paciente: 'Laura',
        apellido_paciente: 'Gutiérrez',
        fecha_nacimiento: '2000-08-22',
        telefono_paciente: '0412-7776666',
        direccion_paciente: 'Av. Principal, Edificio B, Apto 5',
        codigo_comunidad: 'COM-001',
        sexo: 'F',
    },
    {
        cedula_paciente: '15876543',
        nombre_paciente: 'Roberto',
        apellido_paciente: 'Sánchez',
        fecha_nacimiento: '1985-12-03',
        telefono_paciente: '0414-5554444',
        direccion_paciente: 'Sector Norte, Calle 12',
        codigo_comunidad: 'COM-002',
        sexo: 'M',
    },
    {
        cedula_paciente: '30456789',
        nombre_paciente: 'Carmen',
        apellido_paciente: 'Díaz',
        fecha_nacimiento: '2015-03-10',
        telefono_paciente: '0426-3332222',
        direccion_paciente: 'Urbanización Sur, Casa 8',
        codigo_comunidad: 'COM-003',
        sexo: 'F',
    },
];

export const mockAntecedentes: Antecedente[] = [
    {
        codigo_antecedente: 'ANT-001',
        cedula_paciente: '26123456',
        enfermedades: 'Asma bronquial',
        alergias: 'Penicilina',
        cirugias: 'Apendicectomía (2015)',
        medicamentos_habituales: 'Salbutamol inhalador',
        observaciones: 'Control periódico de función respiratoria',
    },
    {
        codigo_antecedente: 'ANT-002',
        cedula_paciente: '15876543',
        enfermedades: 'Hipertensión arterial, Diabetes tipo 2',
        alergias: 'Ninguna conocida',
        cirugias: 'Ninguna',
        medicamentos_habituales: 'Enalapril 10mg, Metformina 850mg',
        observaciones: 'Requiere seguimiento mensual de glicemia',
    },
];

export const mockMedicamentos: Medicamento[] = [
    {
        codigo_medicamento: 'MED-001',
        nombre_medicamento: 'Paracetamol 500mg',
        descripcion_medicamento: 'Analgésico y antipirético',
        existencia: 250,
        unidad_medida: 'Tabletas',
        lote: 'A2024001',
        fecha_vencimiento: '2025-12-31',
    },
    {
        codigo_medicamento: 'MED-002',
        nombre_medicamento: 'Ibuprofeno 400mg',
        descripcion_medicamento: 'Antiinflamatorio no esteroideo',
        existencia: 15,
        unidad_medida: 'Tabletas',
        lote: 'B2024002',
        fecha_vencimiento: '2025-10-30',
    },
    {
        codigo_medicamento: 'MED-003',
        nombre_medicamento: 'Amoxicilina 500mg',
        descripcion_medicamento: 'Antibiótico de amplio espectro',
        existencia: 180,
        unidad_medida: 'Cápsulas',
        lote: 'C2024003',
        fecha_vencimiento: '2025-09-15',
    },
    {
        codigo_medicamento: 'MED-004',
        nombre_medicamento: 'Omeprazol 20mg',
        descripcion_medicamento: 'Inhibidor de bomba de protones',
        existencia: 5,
        unidad_medida: 'Cápsulas',
        lote: 'D2024004',
        fecha_vencimiento: '2026-03-20',
    },
    {
        codigo_medicamento: 'MED-005',
        nombre_medicamento: 'Salbutamol Inhalador',
        descripcion_medicamento: 'Broncodilatador',
        existencia: 45,
        unidad_medida: 'Inhaladores',
        lote: 'E2024005',
        fecha_vencimiento: '2025-11-25',
    },
];

export const mockAbordajes: Abordaje[] = [
    {
        codigo_abordaje: 'ABD-001',
        fecha_abordaje: '2025-01-15',
        hora_inicio: '08:00',
        hora_fin: '14:00',
        descripcion_abordaje: 'Jornada de atención médica integral',
        estado: 'Finalizado',
    },
    {
        codigo_abordaje: 'ABD-002',
        fecha_abordaje: '2025-01-22',
        hora_inicio: '09:00',
        hora_fin: '15:00',
        descripcion_abordaje: 'Operativo de salud preventiva',
        estado: 'Finalizado',
    },
    {
        codigo_abordaje: 'ABD-003',
        fecha_abordaje: '2025-01-30',
        hora_inicio: '08:30',
        hora_fin: undefined,
        descripcion_abordaje: 'Campaña de vacunación y medicina general',
        estado: 'En Curso',
    },
];

export const mockAbordajeComunidades: AbordajeComunidad[] = [
    { codigo_abordaje: 'ABD-001', codigo_comunidad: 'COM-001' },
    { codigo_abordaje: 'ABD-001', codigo_comunidad: 'COM-002' },
    { codigo_abordaje: 'ABD-002', codigo_comunidad: 'COM-003' },
    { codigo_abordaje: 'ABD-003', codigo_comunidad: 'COM-001' },
];

export const mockMedicos: Medico[] = [
    {
        cedula_tejedor: '33333333',
        codigo_especialidad: 'ESP-001',
        licencia_medica: 'MPPS-12345',
    },
];

export const mockConsultas: Consulta[] = [
    {
        codigo_consulta: 'CON-001',
        codigo_abordaje: 'ABD-001',
        cedula_paciente: '26123456',
        cedula_tejedor: '33333333',
        fecha_consulta: '2025-01-15',
        motivo_consulta: 'Control de asma',
        diagnostico: 'Asma bronquial controlada',
        tratamiento: 'Continuar con salbutamol PRN',
        recomendaciones: 'Evitar exposición a irritantes respiratorios',
        diagnostico_cod: 'J45.9',
        tipo_morbilidad: 'Respiratoria',
    },
    {
        codigo_consulta: 'CON-002',
        codigo_abordaje: 'ABD-001',
        cedula_paciente: '28234567',
        cedula_tejedor: '33333333',
        fecha_consulta: '2025-01-15',
        motivo_consulta: 'Dolor abdominal',
        diagnostico: 'Gastritis aguda',
        tratamiento: 'Omeprazol 20mg cada 12h por 7 días',
        recomendaciones: 'Dieta blanda, evitar irritantes gástricos',
        diagnostico_cod: 'K29.1',
        tipo_morbilidad: 'Gastrointestinal',
    },
    {
        codigo_consulta: 'CON-003',
        codigo_abordaje: 'ABD-002',
        cedula_paciente: '15876543',
        cedula_tejedor: '33333333',
        fecha_consulta: '2025-01-22',
        motivo_consulta: 'Control de HTA y diabetes',
        diagnostico: 'Hipertensión arterial esencial, Diabetes tipo 2',
        tratamiento: 'Continuar enalapril y metformina',
        recomendaciones: 'Control mensual de presión arterial y glicemia',
        diagnostico_cod: 'I10',
        tipo_morbilidad: 'Cardiovascular',
    },
];

export const mockMedicamentosPacientes: MedicamentoPaciente[] = [
    {
        codigo_medicamento: 'MED-001',
        cedula_paciente: '26123456',
        fecha_entrega: '2025-01-15',
        cedula_tejedor: '44444444',
        cantidad_entregada: 10,
        indicaciones: 'Tomar 1 tableta cada 8 horas si presenta fiebre',
    },
    {
        codigo_medicamento: 'MED-004',
        cedula_paciente: '28234567',
        fecha_entrega: '2025-01-15',
        cedula_tejedor: '44444444',
        cantidad_entregada: 14,
        indicaciones: 'Tomar 1 cápsula cada 12 horas antes de alimentos',
    },
    {
        codigo_medicamento: 'MED-001',
        cedula_paciente: '15876543',
        fecha_entrega: '2025-01-22',
        cedula_tejedor: '44444444',
        cantidad_entregada: 20,
        indicaciones: 'En caso de dolor',
    },
];

export const mockTejedoresAbordajes: TejedorAbordaje[] = [
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '11111111', rol_abordaje: 'Coordinador' },
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '33333333', rol_abordaje: 'Médico' },
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '44444444', rol_abordaje: 'Farmacia' },
    { codigo_abordaje: 'ABD-002', cedula_tejedor: '22222222', rol_abordaje: 'Registro' },
    { codigo_abordaje: 'ABD-002', cedula_tejedor: '33333333', rol_abordaje: 'Médico' },
    { codigo_abordaje: 'ABD-003', cedula_tejedor: '11111111', rol_abordaje: 'Coordinador' },
    { codigo_abordaje: 'ABD-003', cedula_tejedor: '33333333', rol_abordaje: 'Médico' },
];

// Helper para obtener relaciones (simula JOINs)
export function getPacienteConRelaciones(cedulaPaciente: string) {
    const paciente = mockPacientes.find(p => p.cedula_paciente === cedulaPaciente);
    if (!paciente) return null;

    const comunidad = mockComunidades.find(c => c.codigo_comunidad === paciente.codigo_comunidad);
    const antecedente = mockAntecedentes.find(a => a.cedula_paciente === cedulaPaciente);
    const consultas = mockConsultas.filter(c => c.cedula_paciente === cedulaPaciente);
    const medicamentos = mockMedicamentosPacientes.filter(m => m.cedula_paciente === cedulaPaciente);

    return {
        ...paciente,
        comunidad,
        antecedentes: antecedente,
        consultas,
        medicamentos_entregados: medicamentos,
    };
}

export function getAbordajeConRelaciones(codigoAbordaje: string) {
    const abordaje = mockAbordajes.find(a => a.codigo_abordaje === codigoAbordaje);
    if (!abordaje) return null;

    const comunidades = mockAbordajeComunidades
        .filter(ac => ac.codigo_abordaje === codigoAbordaje)
        .map(ac => mockComunidades.find(c => c.codigo_comunidad === ac.codigo_comunidad))
        .filter(Boolean);

    const tejedores = mockTejedoresAbordajes
        .filter(ta => ta.codigo_abordaje === codigoAbordaje)
        .map(ta => ({
            ...mockTejedores.find(t => t.cedula_tejedor === ta.cedula_tejedor),
            rol_abordaje: ta.rol_abordaje,
        }))
        .filter(t => t.cedula_tejedor);

    const consultas = mockConsultas.filter(c => c.codigo_abordaje === codigoAbordaje);

    return {
        ...abordaje,
        comunidades,
        tejedores,
        consultas,
        total_consultas: consultas.length,
        pacientes_unicos: new Set(consultas.map(c => c.cedula_paciente)).size,
    };
}
