'use server'

import { db } from '@/db';
import { abordaje } from '@/db/schema/abordajes';

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
