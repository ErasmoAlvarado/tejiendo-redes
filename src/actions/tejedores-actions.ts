'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { tejedores, type NewTejedor, type Tejedor } from '@/db/schema/tejedores';
import { eq } from 'drizzle-orm';

/**
 * Obtener todos los tejedores
 */
export async function getTejedores() {
    try {
        const data = await db.select().from(tejedores);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching tejedores:', error);
        return { success: false, error: 'Error al obtener los tejedores' };
    }
}

/**
 * Crear un nuevo tejedor
 */
export async function createTejedor(data: NewTejedor) {
    try {
        await db.insert(tejedores).values(data);
        revalidatePath('/datos-basicos/tejedores');
        return { success: true, message: 'Tejedor creado correctamente' };
    } catch (error) {
        console.error('Error creating tejedor:', error);
        return { success: false, error: 'Error al crear el tejedor' };
    }
}

/**
 * Actualizar un tejedor existente
 */
export async function updateTejedor(cedula: string, data: Partial<NewTejedor>) {
    try {
        await db.update(tejedores)
            .set(data)
            .where(eq(tejedores.cedulaTejedor, cedula));
        revalidatePath('/datos-basicos/tejedores');
        return { success: true, message: 'Tejedor actualizado correctamente' };
    } catch (error) {
        console.error('Error updating tejedor:', error);
        return { success: false, error: 'Error al actualizar el tejedor' };
    }
}

/**
 * Eliminar un tejedor
 */
export async function deleteTejedor(cedula: string) {
    try {
        await db.delete(tejedores)
            .where(eq(tejedores.cedulaTejedor, cedula));
        revalidatePath('/datos-basicos/tejedores');
        return { success: true, message: 'Tejedor eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting tejedor:', error);
        return { success: false, error: 'Error al eliminar el tejedor' };
    }
}
