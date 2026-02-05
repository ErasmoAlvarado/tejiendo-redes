'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { comunidades, type NewComunidad, type Comunidad } from '@/db/schema/comunidades';
import { responsable } from '@/db/schema/responsable';
import { eq } from 'drizzle-orm';

/**
 * Obtener todas las comunidades con sus responsables
 */
export async function getComunidades() {
    try {
        const result = await db.select()
            .from(comunidades)
            .leftJoin(responsable, eq(comunidades.cedulaResponsable, responsable.cedulaResponsable));

        // Transformar data para el cliente
        const data = result.map(({ comunidades, responsable }) => ({
            ...comunidades,
            responsable: responsable
        }));

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching comunidades:', error);
        return { success: false, error: 'Error al obtener las comunidades' };
    }
}

/**
 * Crear una nueva comunidad
 */
export async function createComunidad(data: NewComunidad) {
    try {
        await db.insert(comunidades).values(data);
        revalidatePath('/datos-basicos/comunidades');
        return { success: true, message: 'Comunidad creada correctamente' };
    } catch (error) {
        console.error('Error creating comunidad:', error);
        return { success: false, error: 'Error al crear la comunidad' };
    }
}

/**
 * Actualizar una comunidad
 */
export async function updateComunidad(codigo: string, data: Partial<NewComunidad>) {
    try {
        await db.update(comunidades)
            .set(data)
            .where(eq(comunidades.codigoComunidad, codigo));
        revalidatePath('/datos-basicos/comunidades');
        return { success: true, message: 'Comunidad actualizada correctamente' };
    } catch (error) {
        console.error('Error updating comunidad:', error);
        return { success: false, error: 'Error al actualizar la comunidad' };
    }
}

/**
 * Eliminar una comunidad
 */
export async function deleteComunidad(codigo: string) {
    try {
        await db.delete(comunidades)
            .where(eq(comunidades.codigoComunidad, codigo));
        revalidatePath('/datos-basicos/comunidades');
        return { success: true, message: 'Comunidad eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting comunidad:', error);
        return { success: false, error: 'Error al eliminar la comunidad' };
    }
}
