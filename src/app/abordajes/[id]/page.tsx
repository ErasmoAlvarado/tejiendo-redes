import React from 'react';
import { getAbordajeById } from '@/actions/abordajes-actions';
import { AbordajeDetailClient } from '@/components/abordajes/AbordajeDetailClient';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyState } from '@/components/shared/UIComponents';

export default async function AbordajeDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getAbordajeById(id);

    if (!result.success || !result.data) {
        return (
            <MainLayout>
                <EmptyState
                    icon="error"
                    title="Error al cargar"
                    description={result.error || 'No se pudo cargar el abordaje'}
                    action={{
                        label: 'Volver a abordajes',
                        onClick: undefined, // Client side navigation handled in wrapper if needed, or simple link
                        href: '/abordajes'
                    }}
                />
            </MainLayout>
        );
    }

    return <AbordajeDetailClient abordajeData={result.data} />;
}
