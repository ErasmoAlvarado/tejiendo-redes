'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { especialidades, type NewEspecialidad, type Especialidad } from '@/db/schema/especialidades';
import { eq } from 'drizzle-orm';

/**
 * Obtener todas las especialidades
 */
export async function getEspecialidades() {
    try {
        const data = await db.select().from(especialidades);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching especialidades:', error);
        return { success: false, error: 'Error al obtener las especialidades' };
    }
}

/**
 * Crear una nueva especialidad
 */
export async function createEspecialidad(data: NewEspecialidad) {
    try {
        await db.insert(especialidades).values(data);
        revalidatePath('/datos-basicos/especialidades');
        return { success: true, message: 'Especialidad creada correctamente' };
    } catch (error) {
        console.error('Error creating especialidad:', error);
        return { success: false, error: 'Error al crear la especialidad' };
    }
}

/**
 * Actualizar una especialidad
 */
export async function updateEspecialidad(codigo: string, data: Partial<NewEspecialidad>) {
    try {
        await db.update(especialidades)
            .set(data)
            .where(eq(especialidades.codigoEspecialidad, codigo));
        revalidatePath('/datos-basicos/especialidades');
        return { success: true, message: 'Especialidad actualizada correctamente' };
    } catch (error) {
        console.error('Error updating especialidad:', error);
        return { success: false, error: 'Error al actualizar la especialidad' };
    }
}

/**
 * Eliminar una especialidad
 */
export async function deleteEspecialidad(codigo: string) {
    try {
        await db.delete(especialidades)
            .where(eq(especialidades.codigoEspecialidad, codigo));
        revalidatePath('/datos-basicos/especialidades');
        return { success: true, message: 'Especialidad eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting especialidad:', error);
        return { success: false, error: 'Error al eliminar la especialidad' };
    }
}
