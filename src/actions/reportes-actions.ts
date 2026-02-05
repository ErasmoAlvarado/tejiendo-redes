'use server'

import { db } from '@/db';
import { abordaje } from '@/db/schema/abordajes';
import { abordajeComunidad } from '@/db/schema/relations';
import { comunidades } from '@/db/schema/comunidades';
import { pacientes } from '@/db/schema/pacientes';
import { consultas } from '@/db/schema/consultas';
import { consultasEnfermedades } from '@/db/schema/relations';
import { enfermedades } from '@/db/schema/enfermedades';
import { medicamentos } from '@/db/schema/medicamentos';
import { eq, sql, and, gte, lte, count } from 'drizzle-orm';

/**
 * Obtener datos para el Reporte de Abordajes
 */
export async function getReporteAbordajes(fechaInicio?: string, fechaFin?: string, codigoComunidad?: string) {
    try {
        // Obtener todos los abordajes
        const abordajes = await db
            .select()
            .from(abordaje);

        // Obtener conteos de comunidades por abordaje
        const comunidadesCounts = await db
            .select({
                codigoAbordaje: abordajeComunidad.codigoAbordaje,
                total: count(abordajeComunidad.codigoComunidad)
            })
            .from(abordajeComunidad)
            .groupBy(abordajeComunidad.codigoAbordaje);

        // Obtener conteos de pacientes por abordaje
        const pacientesCounts = await db
            .select({
                codigoAbordaje: consultas.codigoAbordaje,
                total: sql<number>`COUNT(DISTINCT ${consultas.cedulaPaciente})`
            })
            .from(consultas)
            .groupBy(consultas.codigoAbordaje);

        // Crear mapas para búsqueda rápida
        const comunidadesMap = new Map(comunidadesCounts.map(c => [c.codigoAbordaje, c.total]));
        const pacientesMap = new Map(pacientesCounts.map(p => [p.codigoAbordaje, Number(p.total)]));

        // Combinar datos
        const result = abordajes.map(a => ({
            codigo_abordaje: a.codigoAbordaje,
            fecha_abordaje: a.fechaAbordaje,
            descripcion: a.descripcion,
            hora_inicio: a.horaInicio,
            hora_fin: a.horaFin,
            comunidades: comunidadesMap.get(a.codigoAbordaje) || 0,
            pacientes_atendidos: pacientesMap.get(a.codigoAbordaje) || 0
        }));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching reporte abordajes:', error);
        return { success: false, error: 'Error al obtener el reporte de abordajes', data: [] };
    }
}


/**
 * Obtener datos para el Reporte de Comunidades
 */
export async function getReporteComunidades(codigoComunidad?: string) {
    try {
        // Obtener todas las comunidades
        const todasComunidades = await db
            .select()
            .from(comunidades);

        // Obtener conteos de pacientes por comunidad
        const pacientesCounts = await db
            .select({
                codigoComunidad: pacientes.codigoComunidad,
                total: count(pacientes.cedulaPaciente)
            })
            .from(pacientes)
            .groupBy(pacientes.codigoComunidad);

        // Obtener conteos de abordajes por comunidad
        const abordajesCounts = await db
            .select({
                codigoComunidad: abordajeComunidad.codigoComunidad,
                total: count(abordajeComunidad.codigoAbordaje)
            })
            .from(abordajeComunidad)
            .groupBy(abordajeComunidad.codigoComunidad);

        // Obtener conteos de consultas por comunidad
        const consultasCounts = await db
            .select({
                codigoComunidad: pacientes.codigoComunidad,
                total: count(consultas.codigoConsulta)
            })
            .from(consultas)
            .innerJoin(pacientes, eq(consultas.cedulaPaciente, pacientes.cedulaPaciente))
            .groupBy(pacientes.codigoComunidad);

        // Crear mapas para búsqueda rápida
        const pacientesMap = new Map(pacientesCounts.map(p => [p.codigoComunidad, p.total]));
        const abordajesMap = new Map(abordajesCounts.map(a => [a.codigoComunidad, a.total]));
        const consultasMap = new Map(consultasCounts.map(c => [c.codigoComunidad, c.total]));

        // Combinar datos
        const result = todasComunidades.map(c => ({
            codigo_comunidad: c.codigoComunidad,
            nombre_comunidad: c.nombreComunidad,
            estado: c.estado,
            municipio: c.municipio,
            cantidad_habitantes: c.cantidadHabitantes,
            pacientes_tratados: pacientesMap.get(c.codigoComunidad) || 0,
            abordajes_realizados: abordajesMap.get(c.codigoComunidad) || 0,
            total_consultas: consultasMap.get(c.codigoComunidad) || 0
        }));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching reporte comunidades:', error);
        return { success: false, error: 'Error al obtener el reporte de comunidades', data: [] };
    }
}

/**
 * Obtener datos para el Reporte de Pacientes
 */
export async function getReportePacientes(codigoComunidad?: string) {
    try {
        // Obtener pacientes con sus comunidades
        const todosPacientes = await db
            .select({
                cedula_paciente: pacientes.cedulaPaciente,
                codigo_comunidad: pacientes.codigoComunidad,
                nombre_paciente: pacientes.nombrePaciente,
                apellido_paciente: pacientes.apellidoPaciente,
                fecha_nacimiento: pacientes.fechaNacimiento,
                direccion_paciente: pacientes.direccionPaciente,
                telefono_paciente: pacientes.telefonoPaciente,
                correo_paciente: pacientes.correoPaciente
            })
            .from(pacientes);

        // Obtener datos de comunidades
        const comunidadesData = await db
            .select({
                codigo: comunidades.codigoComunidad,
                nombre: comunidades.nombreComunidad
            })
            .from(comunidades);

        // Crear mapa de comunidades
        const comunidadesMap = new Map(comunidadesData.map(c => [c.codigo, c.nombre]));

        // Combinar datos
        const result = todosPacientes.map(p => ({
            cedula_paciente: p.cedula_paciente,
            codigo_comunidad: p.codigo_comunidad,
            nombre_comunidad: comunidadesMap.get(p.codigo_comunidad) || '',
            nombre_paciente: p.nombre_paciente,
            apellido_paciente: p.apellido_paciente,
            fecha_nacimiento: p.fecha_nacimiento,
            direccion_paciente: p.direccion_paciente,
            telefono_paciente: p.telefono_paciente,
            correo_paciente: p.correo_paciente
        }));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching reporte pacientes:', error);
        return { success: false, error: 'Error al obtener el reporte de pacientes', data: [] };
    }
}

/**
 * Obtener datos para el Reporte de Morbilidad
 */
export async function getReporteMorbilidad(fechaInicio?: string, fechaFin?: string) {
    try {
        // Subconsulta para obtener total de consultas (para calcular porcentajes)
        const totalConsultas = await db
            .select({ total: count(consultas.codigoConsulta) })
            .from(consultas);

        const total = totalConsultas[0]?.total || 1; // Evitar división por cero

        // Subconsulta para casos y pacientes por enfermedad
        const casosPorEnfermedad = db
            .select({
                codigoEnfermedad: consultasEnfermedades.codigoEnfermedad,
                totalCasos: count(consultasEnfermedades.codigoConsulta).as('total_casos'),
                pacientesAfectados: sql<number>`COUNT(DISTINCT ${consultas.cedulaPaciente})`.as('pacientes_afectados'),
                ultimaConsulta: sql<Date>`MAX(${abordaje.fechaAbordaje})`.as('ultima_consulta')
            })
            .from(consultasEnfermedades)
            .innerJoin(consultas, eq(consultasEnfermedades.codigoConsulta, consultas.codigoConsulta))
            .innerJoin(abordaje, eq(consultas.codigoAbordaje, abordaje.codigoAbordaje))
            .groupBy(consultasEnfermedades.codigoEnfermedad)
            .as('casos_count');

        // Consulta principal
        const result = await db
            .select({
                codigo_enfermedad: enfermedades.codigoEnfermedad,
                nombre_enfermedad: enfermedades.nombreEnfermedad,
                tipo_patologia: enfermedades.tipoPatologia,
                total_casos: sql<number>`COALESCE(${casosPorEnfermedad.totalCasos}, 0)`,
                pacientes_afectados: sql<number>`COALESCE(${casosPorEnfermedad.pacientesAfectados}, 0)`,
                porcentaje: sql<string>`ROUND((COALESCE(${casosPorEnfermedad.totalCasos}, 0) * 100.0 / ${total}), 2)`,
                ultima_consulta: casosPorEnfermedad.ultimaConsulta
            })
            .from(enfermedades)
            .leftJoin(casosPorEnfermedad, eq(enfermedades.codigoEnfermedad, casosPorEnfermedad.codigoEnfermedad));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching reporte morbilidad:', error);
        return { success: false, error: 'Error al obtener el reporte de morbilidad', data: [] };
    }
}

/**
 * Obtener datos para el Reporte de Medicamentos
 */
export async function getReporteMedicamentos() {
    try {
        const result = await db
            .select({
                codigo_medicamento: medicamentos.codigoMedicamento,
                nombre_medicamento: medicamentos.nombreMedicamento,
                presentacion: medicamentos.presentacion,
                existencia: medicamentos.existencia,
                descripcion: medicamentos.descripcion
            })
            .from(medicamentos)
            .orderBy(medicamentos.nombreMedicamento);

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching reporte medicamentos:', error);
        return { success: false, error: 'Error al obtener el reporte de medicamentos', data: [] };
    }
}

/**
 * Obtener lista de comunidades para el filtro
 */
export async function getComunidadesParaFiltro() {
    try {
        const result = await db
            .select({
                codigo_comunidad: comunidades.codigoComunidad,
                nombre_comunidad: comunidades.nombreComunidad
            })
            .from(comunidades)
            .orderBy(comunidades.nombreComunidad);

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching comunidades para filtro:', error);
        return { success: false, error: 'Error al obtener las comunidades', data: [] };
    }
}
