'use server'

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { abordaje } from '@/db/schema/abordajes';
import { abordajeComunidad, tejedoresAbordaje, medicamentosPacientes } from '@/db/schema/relations';
import { comunidades } from '@/db/schema/comunidades';
import { tejedores } from '@/db/schema/tejedores';
import { consultas } from '@/db/schema/consultas';
import { medicamentos } from '@/db/schema/medicamentos';
import { eq, and } from 'drizzle-orm';

/**
 * Obtener todos los abordajes
 */
export async function getAbordajes() {
    try {
        const data = await db.select().from(abordaje);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching abordajes:', error);
        return { success: false, error: 'Error al obtener los abordajes' };
    }
}

/**
 * Obtener un abordaje por su ID (código) con todas sus relaciones
 */
export async function getAbordajeById(id: string) {
    try {
        // 1. Obtener datos del abordaje
        const abordajeData = await db.query.abordaje.findFirst({
            where: eq(abordaje.codigoAbordaje, id),
        });

        if (!abordajeData) {
            return { success: false, error: 'Abordaje no encontrado' };
        }

        // 2. Obtener comunidades relacionadas
        const comunidadesData = await db.select({
            codigoComunidad: comunidades.codigoComunidad,
            nombreComunidad: comunidades.nombreComunidad,
            municipio: comunidades.municipio,
            parroquia: comunidades.direccion, // Usamos direccion como proxy de parroquia/ubicación si no hay campo explícito
            estado: comunidades.estado,
            habitantes: comunidades.cantidadHabitantes,
            observaciones: abordajeComunidad.observaciones,
        })
            .from(abordajeComunidad)
            .innerJoin(comunidades, eq(abordajeComunidad.codigoComunidad, comunidades.codigoComunidad))
            .where(eq(abordajeComunidad.codigoAbordaje, id));

        // 3. Obtener tejedores participantes
        const tejedoresData = await db.select({
            cedulaTejedor: tejedores.cedulaTejedor,
            nombreTejedor: tejedores.nombreTejedor,
            apellidoTejedor: tejedores.apellidoTejedor,
            profesionTejedor: tejedores.profesionTejedor, // Needed for filtering medics
            rolAbordaje: tejedoresAbordaje.rolEnAbordaje,
        })
            .from(tejedoresAbordaje)
            .innerJoin(tejedores, eq(tejedoresAbordaje.cedulaTejedor, tejedores.cedulaTejedor))
            .where(eq(tejedoresAbordaje.codigoAbordaje, id));

        // 4. Obtener consultas realizadas
        const consultasData = await db.select()
            .from(consultas)
            .where(eq(consultas.codigoAbordaje, id));

        // 5. Obtener medicamentos entregados (basado en la fecha del abordaje)
        // Nota: Como no hay link directo abordaje->medicamentos, asumimos que son las entregas de esa fecha
        const medicamentosData = await db.select({
            codigoMedicamento: medicamentos.codigoMedicamento,
            cedulaPaciente: medicamentosPacientes.cedulaPaciente,
            cantidadEntregada: medicamentosPacientes.cantidadEntregada,
            indicaciones: medicamentos.descripcion, // Usamos descripcion como info extra
            nombreMedicamento: medicamentos.nombreMedicamento, // Para mostrar nombre
        })
            .from(medicamentosPacientes)
            .innerJoin(medicamentos, eq(medicamentosPacientes.codigoMedicamento, medicamentos.codigoMedicamento))
            .where(eq(medicamentosPacientes.fechaEntrega, abordajeData.fechaAbordaje));


        // Construir objeto de respuesta completo
        const fullData = {
            ...abordajeData,
            comunidades: comunidadesData,
            tejedores: tejedoresData,
            consultas: consultasData,
            medicamentos_entregados: medicamentosData,
            // Métricas calculadas
            total_consultas: consultasData.length,
            pacientes_unicos: new Set(consultasData.map(c => c.cedulaPaciente)).size,
        };

        return { success: true, data: fullData };

    } catch (error) {
        console.error('Error fetching abordaje details:', error);
        return { success: false, error: 'Error al obtener los detalles del abordaje' };
    }
}

/**
 * Crear un nuevo abordaje
 */
export async function createAbordaje(data: typeof abordaje.$inferInsert) {
    try {
        await db.insert(abordaje).values(data);
        revalidatePath('/abordajes');
        return { success: true };
    } catch (error) {
        console.error('Error creating abordaje:', error);
        return { success: false, error: 'Error al crear el abordaje' };
    }
}

/**
 * Actualizar un abordaje existente
 */
export async function updateAbordaje(id: string, data: Partial<typeof abordaje.$inferInsert>) {
    try {
        await db.update(abordaje)
            .set(data)
            .where(eq(abordaje.codigoAbordaje, id));
        revalidatePath('/abordajes');
        revalidatePath(`/abordajes/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating abordaje:', error);
        return { success: false, error: 'Error al actualizar el abordaje' };
    }
}

/**
 * Agregar comunidad a un abordaje
 */
export async function addComunidadToAbordaje(codigoAbordaje: string, codigoComunidad: string) {
    try {
        // Verificar si ya existe
        const existing = await db.select()
            .from(abordajeComunidad)
            .where(and(
                eq(abordajeComunidad.codigoAbordaje, codigoAbordaje),
                eq(abordajeComunidad.codigoComunidad, codigoComunidad)
            ));

        if (existing.length > 0) {
            return { success: false, error: 'La comunidad ya está asignada a este abordaje' };
        }

        await db.insert(abordajeComunidad).values({
            codigoAbordaje,
            codigoComunidad,
        });

        revalidatePath(`/abordajes/${codigoAbordaje}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding comunidad to abordaje:', error);
        return { success: false, error: 'Error al agregar la comunidad' };
    }
}

/**
 * Remover comunidad de un abordaje
 */
export async function removeComunidadFromAbordaje(codigoAbordaje: string, codigoComunidad: string) {
    try {
        await db.delete(abordajeComunidad)
            .where(and(
                eq(abordajeComunidad.codigoAbordaje, codigoAbordaje),
                eq(abordajeComunidad.codigoComunidad, codigoComunidad)
            ));

        revalidatePath(`/abordajes/${codigoAbordaje}`);
        return { success: true };
    } catch (error) {
        console.error('Error removing comunidad from abordaje:', error);
        return { success: false, error: 'Error al remover la comunidad' };
    }
}

/**
 * Agregar tejedor a un abordaje
 */
export async function addTejedorToAbordaje(codigoAbordaje: string, cedulaTejedor: string, rol: string) {
    try {
        // Verificar si ya existe
        const existing = await db.select()
            .from(tejedoresAbordaje)
            .where(and(
                eq(tejedoresAbordaje.codigoAbordaje, codigoAbordaje),
                eq(tejedoresAbordaje.cedulaTejedor, cedulaTejedor)
            ));

        if (existing.length > 0) {
            return { success: false, error: 'El tejedor ya está asignado a este abordaje' };
        }

        await db.insert(tejedoresAbordaje).values({
            codigoAbordaje,
            cedulaTejedor,
            rolEnAbordaje: rol,
        });

        revalidatePath(`/abordajes/${codigoAbordaje}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding tejedor to abordaje:', error);
        return { success: false, error: 'Error al agregar el tejedor' };
    }
}

/**
 * Remover tejedor de un abordaje
 */
export async function removeTejedorFromAbordaje(codigoAbordaje: string, cedulaTejedor: string) {
    try {
        await db.delete(tejedoresAbordaje)
            .where(and(
                eq(tejedoresAbordaje.codigoAbordaje, codigoAbordaje),
                eq(tejedoresAbordaje.cedulaTejedor, cedulaTejedor)
            ));

        revalidatePath(`/abordajes/${codigoAbordaje}`);
        return { success: true };
    } catch (error) {
        console.error('Error removing tejedor from abordaje:', error);
        return { success: false, error: 'Error al remover el tejedor' };
    }
}

/**
 * Registrar entrega de medicamento
 */
export async function registerMedicamentoEntrega(data: typeof medicamentosPacientes.$inferInsert) {
    try {
        await db.insert(medicamentosPacientes).values(data);
        revalidatePath('/abordajes');
        return { success: true };
    } catch (error) {
        console.error('Error registering medicamento entrega:', error);
        return { success: false, error: 'Error al registrar la entrega de medicamento' };
    }
}

