'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { organismos, type NewOrganismo, type Organismo } from '@/db/schema/organismos';
import { tejedores } from '@/db/schema/tejedores';
import { eq } from 'drizzle-orm';

/**
 * Obtener todos los organismos con sus tejedores responsables
 */
export async function getOrganismos() {
    try {
        const result = await db.select()
            .from(organismos)
            .leftJoin(tejedores, eq(organismos.cedulaTejedor, tejedores.cedulaTejedor));

        // Transformar data para el cliente
        const data = result.map(({ organismos, tejedores }) => ({
            ...organismos,
            tejedor: tejedores
        }));

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching organismos:', error);
        return { success: false, error: 'Error al obtener los organismos' };
    }
}

/**
 * Crear un nuevo organismo
 */
export async function createOrganismo(data: NewOrganismo) {
    try {
        await db.insert(organismos).values(data);
        revalidatePath('/datos-basicos/organismos');
        return { success: true, message: 'Organismo creado correctamente' };
    } catch (error) {
        console.error('Error creating organismo:', error);
        return { success: false, error: 'Error al crear el organismo' };
    }
}

/**
 * Actualizar un organismo
 */
export async function updateOrganismo(codigo: string, data: Partial<NewOrganismo>) {
    try {
        await db.update(organismos)
            .set(data)
            .where(eq(organismos.codigoOrganismo, codigo));
        revalidatePath('/datos-basicos/organismos');
        return { success: true, message: 'Organismo actualizado correctamente' };
    } catch (error) {
        console.error('Error updating organismo:', error);
        return { success: false, error: 'Error al actualizar el organismo' };
    }
}

/**
 * Eliminar un organismo
 */
export async function deleteOrganismo(codigo: string) {
    try {
        await db.delete(organismos)
            .where(eq(organismos.codigoOrganismo, codigo));
        revalidatePath('/datos-basicos/organismos');
        return { success: true, message: 'Organismo eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting organismo:', error);
        return { success: false, error: 'Error al eliminar el organismo' };
    }
}
