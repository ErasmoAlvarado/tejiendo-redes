'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { enfermedades, type NewEnfermedad, type Enfermedad } from '@/db/schema/enfermedades';
import { eq } from 'drizzle-orm';

/**
 * Obtener todas las enfermedades
 */
export async function getEnfermedades() {
    try {
        const data = await db.select().from(enfermedades);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching enfermedades:', error);
        return { success: false, error: 'Error al obtener las enfermedades' };
    }
}

/**
 * Crear una nueva enfermedad
 */
export async function createEnfermedad(data: NewEnfermedad) {
    try {
        await db.insert(enfermedades).values(data);
        revalidatePath('/datos-basicos/enfermedades');
        return { success: true, message: 'Enfermedad creada correctamente' };
    } catch (error) {
        console.error('Error creating enfermedad:', error);
        return { success: false, error: 'Error al crear la enfermedad' };
    }
}

/**
 * Actualizar una enfermedad
 */
export async function updateEnfermedad(codigo: string, data: Partial<NewEnfermedad>) {
    try {
        await db.update(enfermedades)
            .set(data)
            .where(eq(enfermedades.codigoEnfermedad, codigo));
        revalidatePath('/datos-basicos/enfermedades');
        return { success: true, message: 'Enfermedad actualizada correctamente' };
    } catch (error) {
        console.error('Error updating enfermedad:', error);
        return { success: false, error: 'Error al actualizar la enfermedad' };
    }
}

/**
 * Eliminar una enfermedad
 */
export async function deleteEnfermedad(codigo: string) {
    try {
        await db.delete(enfermedades)
            .where(eq(enfermedades.codigoEnfermedad, codigo));
        revalidatePath('/datos-basicos/enfermedades');
        return { success: true, message: 'Enfermedad eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting enfermedad:', error);
        return { success: false, error: 'Error al eliminar la enfermedad' };
    }
}
