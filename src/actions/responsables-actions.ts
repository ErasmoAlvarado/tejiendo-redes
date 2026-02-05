'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { responsable as responsables, type NewResponsable, type Responsable } from '@/db/schema/responsable';
import { eq } from 'drizzle-orm';

/**
 * Obtener todos los responsables
 */
export async function getResponsables() {
    try {
        const data = await db.select().from(responsables);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching responsables:', error);
        return { success: false, error: 'Error al obtener los responsables' };
    }
}

/**
 * Crear un nuevo responsable
 */
export async function createResponsable(data: NewResponsable) {
    try {
        await db.insert(responsables).values(data);
        revalidatePath('/datos-basicos/responsables');
        return { success: true, message: 'Responsable creado correctamente' };
    } catch (error) {
        console.error('Error creating responsable:', error);
        return { success: false, error: 'Error al crear el responsable' };
    }
}

/**
 * Actualizar un responsable
 */
export async function updateResponsable(cedula: string, data: Partial<NewResponsable>) {
    try {
        await db.update(responsables)
            .set(data)
            .where(eq(responsables.cedulaResponsable, cedula));
        revalidatePath('/datos-basicos/responsables');
        return { success: true, message: 'Responsable actualizado correctamente' };
    } catch (error) {
        console.error('Error updating responsable:', error);
        return { success: false, error: 'Error al actualizar el responsable' };
    }
}

/**
 * Eliminar un responsable
 */
export async function deleteResponsable(cedula: string) {
    try {
        await db.delete(responsables)
            .where(eq(responsables.cedulaResponsable, cedula));
        revalidatePath('/datos-basicos/responsables');
        return { success: true, message: 'Responsable eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting responsable:', error);
        return { success: false, error: 'Error al eliminar el responsable' };
    }
}
