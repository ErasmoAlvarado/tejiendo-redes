'use client';

import { useState, useMemo } from 'react';
import { mockAbordajes, getAbordajeConRelaciones } from '@/lib/mock-data';
import type { Abordaje } from '@/types/models';

export function useAbordajes() {
    const [abordajes] = useState<Abordaje[]>(mockAbordajes);

    const stats = useMemo(() => {
        return {
            total: abordajes.length,
            finalizados: abordajes.filter((a) => a.estado === 'Finalizado').length,
            enCurso: abordajes.filter((a) => a.estado === 'En Curso').length,
        };
    }, [abordajes]);

    const getAbordajeConDetalles = (codigo: string) => {
        return getAbordajeConRelaciones(codigo);
    };

    return {
        abordajes,
        stats,
        getAbordajeConDetalles,
    };
}
