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
    Enfermedad,
    ConsultaEnfermedad,
} from '@/types/models';

// Datos mock - En producción, estos vendrían de MySQL
export const mockResponsables: Responsable[] = [
    {
        cedula_responsable: '12345678',
        nombre_responsable: 'María',
        apellido_responsable: 'González',
        direccion_responsable: 'Urbanización Los Rosales, Casa 45',
        telefono_responsable: '0424-1234567',
        correo_responsable: 'maria.gonzalez@example.com',
        cargo: 'Presidente',
    },
    {
        cedula_responsable: '87654321',
        nombre_responsable: 'José',
        apellido_responsable: 'Pérez',
        direccion_responsable: 'Sector El Valle, Calle Principal',
        telefono_responsable: '0412-9876543',
        correo_responsable: 'jose.perez@example.com',
        cargo: 'Vocal',
    },
];

export const mockTejedores: Tejedor[] = [
    {
        cedula_tejedor: '11111111',
        nombre_tejedor: 'Carlos',
        apellido_tejedor: 'Ramírez',
        fecha_nacimiento: '1985-05-20',
        direccion_tejedor: 'Av. Principal, Edificio Salud',
        telefono_tejedor: '0414-1111111',
        correo_tejedor: 'carlos.ramirez@salud.gob.ve',
        profesion_tejedor: 'Médico',
        fecha_ingreso: '2020-01-10',
        tipo_voluntario: 'Permanente',
        usuario: 'carlos.admin',
        rol: 'ADMIN',
        activo: true,
    },
    {
        cedula_tejedor: '22222222',
        nombre_tejedor: 'Ana',
        apellido_tejedor: 'Martínez',
        fecha_nacimiento: '1990-08-15',
        direccion_tejedor: 'Calle 5, Casa 12',
        telefono_tejedor: '0424-2222222',
        correo_tejedor: 'ana.martinez@salud.gob.ve',
        profesion_tejedor: 'Enfermera',
        fecha_ingreso: '2021-03-15',
        tipo_voluntario: 'Permanente',
        usuario: 'ana.registro',
        rol: 'REGISTRO',
        activo: true,
    },
    {
        cedula_tejedor: '33333333',
        nombre_tejedor: 'Luis',
        apellido_tejedor: 'Fernández',
        fecha_nacimiento: '1982-12-05',
        direccion_tejedor: 'Urbanización Norte, Torre A',
        telefono_tejedor: '0412-3333333',
        correo_tejedor: 'luis.fernandez@salud.gob.ve',
        profesion_tejedor: 'Médico Especialista',
        fecha_ingreso: '2020-05-20',
        tipo_voluntario: 'Colaborador',
        usuario: 'luis.medico',
        rol: 'MEDICO',
        activo: true,
    },
    {
        cedula_tejedor: '44444444',
        nombre_tejedor: 'Rosa',
        apellido_tejedor: 'Silva',
        fecha_nacimiento: '1988-04-30',
        direccion_tejedor: 'Sector Centro, Calle 8',
        telefono_tejedor: '0426-4444444',
        correo_tejedor: 'rosa.silva@salud.gob.ve',
        profesion_tejedor: 'Farmacéutico',
        fecha_ingreso: '2022-01-05',
        tipo_voluntario: 'Permanente',
        usuario: 'rosa.farmacia',
        rol: 'FARMACIA',
        activo: true,
    },
];

export const mockEspecialidades: Especialidad[] = [
    {
        codigo_especialidad: 'ESP-001',
        nombre_especialidad: 'Medicina General',
        descripcion: 'Atención médica general y preventiva',
    },
    {
        codigo_especialidad: 'ESP-002',
        nombre_especialidad: 'Pediatría',
        descripcion: 'Especialización en salud infantil',
    },
    {
        codigo_especialidad: 'ESP-003',
        nombre_especialidad: 'Ginecología',
        descripcion: 'Salud de la mujer',
    },
    {
        codigo_especialidad: 'ESP-004',
        nombre_especialidad: 'Odontología',
        descripcion: 'Salud bucal',
    },
];

export const mockEnfermedades: Enfermedad[] = [
    {
        codigo_enfermedad: 'ENF-001',
        nombre_enfermedad: 'Gripe Común',
        tipo_patologia: 'Viral',
        descripcion: 'Infección viral de las vías respiratorias',
    },
    {
        codigo_enfermedad: 'ENF-002',
        nombre_enfermedad: 'Hipertensión Arterial',
        tipo_patologia: 'Cardiaca',
        descripcion: 'Presión arterial elevada persistente',
    },
    {
        codigo_enfermedad: 'ENF-003',
        nombre_enfermedad: 'Asma Bronquial',
        tipo_patologia: 'Respiratoria',
        descripcion: 'Inflamación crónica de las vías aéreas',
    },
];

export const mockComunidades: Comunidad[] = [
    {
        codigo_comunidad: 'COM-001',
        nombre_comunidad: 'La Esperanza',
        tipo_comunidad: 'Urbana',
        estado: 'Miranda',
        municipio: 'Baruta',
        direccion: 'Calle Principal con Av. Las Acacias',
        ubicacion_fisica: 'Cerca del módulo policial',
        cedula_responsable: '12345678',
        cantidad_habitantes: 1500,
        cantidad_familias: 450,
        telefono_comunidad: '0212-9998877',
    },
    {
        codigo_comunidad: 'COM-002',
        nombre_comunidad: 'Los Pinos',
        tipo_comunidad: 'Rural',
        estado: 'Distrito Capital',
        municipio: 'Libertador',
        direccion: 'Carretera Mamera-El Junquito, km 12',
        ubicacion_fisica: 'Parte alta del cerro',
        cedula_responsable: '87654321',
        cantidad_habitantes: 2300,
        cantidad_familias: 680,
        telefono_comunidad: '0212-3334455',
    },
    {
        codigo_comunidad: 'COM-003',
        nombre_comunidad: 'El Progreso',
        tipo_comunidad: 'Urbana',
        estado: 'Miranda',
        municipio: 'Sucre',
        direccion: 'Sector Julián Blanco',
        ubicacion_fisica: 'Al lado de la escuela',
        cedula_responsable: '12345678',
        cantidad_habitantes: 1800,
        cantidad_familias: 520,
        telefono_comunidad: '0212-5556677',
    },
];

export const mockOrganismos: Organismo[] = [
    {
        codigo_organismo: 'ORG-001',
        cedula_tejedor: '11111111',
        nombre_organismo: 'Ministerio de Salud',
        pais_organismo: 'Venezuela',
        estado_organismo: 'Distrito Capital',
        municipio_organismo: 'Libertador',
        direccion_organismo: 'Edificio Sede MPPS',
        ubicacion_fisica: 'Piso 5',
        correo_organismo: 'contacto@salud.gob.ve',
        telefono_organismo: '0212-5551234',
    },
    {
        codigo_organismo: 'ORG-002',
        cedula_tejedor: '22222222',
        nombre_organismo: 'Cruz Roja Venezolana',
        pais_organismo: 'Venezuela',
        estado_organismo: 'Distrito Capital',
        municipio_organismo: 'Libertador',
        direccion_organismo: 'Av. Andrés Bello',
        ubicacion_fisica: 'Sede Principal',
        correo_organismo: 'info@cruzroja.org.ve',
        telefono_organismo: '0212-5555678',
    },
];

export const mockPacientes: Paciente[] = [
    {
        cedula_paciente: '26123456',
        codigo_comunidad: 'COM-001',
        nombre_paciente: 'Pedro',
        apellido_paciente: 'López',
        sexo: 'M',
        fecha_nacimiento: '1998-05-15',
        direccion_paciente: 'Calle 1, Casa 5',
        telefono_paciente: '0424-9998888',
        correo_paciente: 'pedro.lopez@example.com',
        nota: 'Paciente regular',
    },
    {
        cedula_paciente: '28234567',
        codigo_comunidad: 'COM-001',
        nombre_paciente: 'Laura',
        apellido_paciente: 'Gutiérrez',
        sexo: 'F',
        fecha_nacimiento: '2000-08-22',
        direccion_paciente: 'Av. Principal, Edificio B, Apto 5',
        telefono_paciente: '0412-7776666',
        correo_paciente: 'laura.g@example.com',
        nota: '',
    },
    {
        cedula_paciente: '15876543',
        codigo_comunidad: 'COM-002',
        nombre_paciente: 'Roberto',
        apellido_paciente: 'Sánchez',
        sexo: 'M',
        fecha_nacimiento: '1985-12-03',
        direccion_paciente: 'Sector Norte, Calle 12',
        telefono_paciente: '0414-5554444',
        correo_paciente: 'roberto.s@example.com',
    },
    {
        cedula_paciente: '30456789',
        codigo_comunidad: 'COM-003',
        nombre_paciente: 'Carmen',
        apellido_paciente: 'Díaz',
        sexo: 'F',
        fecha_nacimiento: '2015-03-10',
        direccion_paciente: 'Urbanización Sur, Casa 8',
        telefono_paciente: '0426-3332222',
        correo_paciente: 'carmen.d@example.com',
    },
];

export const mockAntecedentes: Antecedente[] = [
    {
        codigo_antecedente: 'ANT-001',
        cedula_paciente: '26123456',
        peso: 75.5,
        talla: 1.78,
        temperatura: 36.5,
        FC: '72',
        TA: '120/80',
        enfermedades_previas: 'Asma bronquial',
        alergias: 'Penicilina',
        enfermedades_familia: 'Hipertensión (Padre)',
    },
    {
        codigo_antecedente: 'ANT-002',
        cedula_paciente: '15876543',
        peso: 82.0,
        talla: 1.70,
        temperatura: 36.8,
        FC: '80',
        TA: '140/90',
        enfermedades_previas: 'Hipertensión arterial, Diabetes tipo 2',
        alergias: 'Ninguna conocida',
        enfermedades_familia: 'Diabetes (Madre)',
    },
];

export const mockMedicamentos: Medicamento[] = [
    {
        codigo_medicamento: 'MED-001',
        nombre_medicamento: 'Paracetamol 500mg',
        presentacion: 'Tabletas',
        descripcion: 'Analgésico y antipirético',
        existence: 250,
    },
    {
        codigo_medicamento: 'MED-002',
        nombre_medicamento: 'Ibuprofeno 400mg',
        presentacion: 'Tabletas',
        descripcion: 'Antiinflamatorio no esteroideo',
        existence: 15,
    },
    {
        codigo_medicamento: 'MED-003',
        nombre_medicamento: 'Amoxicilina 500mg',
        presentacion: 'Cápsulas',
        descripcion: 'Antibiótico de amplio espectro',
        existence: 180,
    },
    {
        codigo_medicamento: 'MED-004',
        nombre_medicamento: 'Omeprazol 20mg',
        presentacion: 'Cápsulas',
        descripcion: 'Inhibidor de bomba de protones',
        existence: 5,
    },
    {
        codigo_medicamento: 'MED-005',
        nombre_medicamento: 'Salbutamol Inhalador',
        presentacion: 'Inhalador',
        descripcion: 'Broncodilatador',
        existence: 45,
    },
];

export const mockAbordajes: Abordaje[] = [
    {
        codigo_abordaje: 'ABD-001',
        fecha_abordaje: '2025-01-15',
        hora_inicio: '08:00',
        hora_fin: '14:00',
        descripcion: 'Jornada de atención médica integral',
        estado: 'Finalizado',
    },
    {
        codigo_abordaje: 'ABD-002',
        fecha_abordaje: '2025-01-22',
        hora_inicio: '09:00',
        hora_fin: '15:00',
        descripcion: 'Operativo de salud preventiva',
        estado: 'Finalizado',
    },
    {
        codigo_abordaje: 'ABD-003',
        fecha_abordaje: '2025-01-30',
        hora_inicio: '08:30',
        hora_fin: '17:00',
        descripcion: 'Campaña de vacunación y medicina general',
        estado: 'En Curso',
    },
];

export const mockAbordajeComunidades: AbordajeComunidad[] = [
    { codigo_abordaje: 'ABD-001', codigo_comunidad: 'COM-001', observaciones: 'Mucha afluencia' },
    { codigo_abordaje: 'ABD-001', codigo_comunidad: 'COM-002' },
    { codigo_abordaje: 'ABD-002', codigo_comunidad: 'COM-003' },
    { codigo_abordaje: 'ABD-003', codigo_comunidad: 'COM-001' },
];

export const mockMedicos: Medico[] = [
    {
        cedula_tejedor: '33333333',
        codigo_especialidad: 'ESP-001',
        matricula_colegio_medico: 'MPPS-12345',
        matricula_sanidad: 'MS-9988',
    },
];

export const mockConsultas: Consulta[] = [
    {
        codigo_consulta: 'CON-001',
        codigo_abordaje: 'ABD-001',
        cedula_paciente: '26123456',
        cedula_medico: '33333333',
        motivo_consulta: 'Control de asma',
        diagnostico_texto: 'Asma bronquial controlada',
        tratamiento: 'Continuar con salbutamol PRN',
        recomendaciones: 'Evitar exposición a irritantes respiratorios',
    },
    {
        codigo_consulta: 'CON-002',
        codigo_abordaje: 'ABD-001',
        cedula_paciente: '28234567',
        cedula_medico: '33333333',
        motivo_consulta: 'Dolor abdominal',
        diagnostico_texto: 'Gastritis aguda',
        tratamiento: 'Omeprazol 20mg cada 12h por 7 días',
        recomendaciones: 'Dieta blanda, evitar irritantes gástricos',
    },
    {
        codigo_consulta: 'CON-003',
        codigo_abordaje: 'ABD-002',
        cedula_paciente: '15876543',
        cedula_medico: '33333333',
        motivo_consulta: 'Control de HTA y diabetes',
        diagnostico_texto: 'Hipertensión arterial esencial, Diabetes tipo 2',
        tratamiento: 'Continuar enalapril y metformina',
        recomendaciones: 'Control mensual de presión arterial y glicemia',
    },
];

export const mockConsultaEnfermedades: ConsultaEnfermedad[] = [
    { codigo_consulta: 'CON-001', codigo_enfermedad: 'ENF-003' },
    { codigo_consulta: 'CON-002', codigo_enfermedad: 'ENF-001' },
    { codigo_consulta: 'CON-003', codigo_enfermedad: 'ENF-002' },
];

export const mockMedicamentosPacientes: MedicamentoPaciente[] = [
    {
        codigo_medicamento: 'MED-001',
        cedula_paciente: '26123456',
        fecha_entrega: '2025-01-15',
        cantidad_entregada: 10,
        cedula_tejedor: '44444444',
    },
    {
        codigo_medicamento: 'MED-004',
        cedula_paciente: '28234567',
        fecha_entrega: '2025-01-15',
        cantidad_entregada: 14,
        cedula_tejedor: '44444444',
    },
    {
        codigo_medicamento: 'MED-001',
        cedula_paciente: '15876543',
        fecha_entrega: '2025-01-22',
        cantidad_entregada: 20,
        cedula_tejedor: '44444444',
    },
];

export const mockTejedoresAbordajes: TejedorAbordaje[] = [
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '11111111', rol_en_abordaje: 'Coordinador' },
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '33333333', rol_en_abordaje: 'Médico' },
    { codigo_abordaje: 'ABD-001', cedula_tejedor: '44444444', rol_en_abordaje: 'Farmacia' },
    { codigo_abordaje: 'ABD-002', cedula_tejedor: '22222222', rol_en_abordaje: 'Registro' },
    { codigo_abordaje: 'ABD-002', cedula_tejedor: '33333333', rol_en_abordaje: 'Médico' },
    { codigo_abordaje: 'ABD-003', cedula_tejedor: '11111111', rol_en_abordaje: 'Coordinador' },
    { codigo_abordaje: 'ABD-003', cedula_tejedor: '33333333', rol_en_abordaje: 'Médico' },
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
            rol_en_abordaje: ta.rol_en_abordaje,
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
