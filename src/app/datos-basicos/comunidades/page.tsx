'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockComunidades } from '@/lib/mock-data';
import type { Comunidad } from '@/types/models';
import { toast } from 'sonner';

export default function ComunidadesPage() {
    const [comunidades] = React.useState(mockComunidades);

    const columns: Column<Comunidad>[] = [
        { key: 'codigo_comunidad', label: 'Código', sortable: true },
        { key: 'nombre_comunidad', label: 'Nombre', sortable: true },
        { key: 'estado', label: 'Estado' },
        { key: 'municipio', label: 'Municipio' },
        { key: 'parroquia', label: 'Parroquia' },
        { key: 'habitantes', label: 'Habitantes', sortable: true },
        {
            key: 'acciones',
            label: 'Acciones',
            render: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Comunidades</h1>
                    <p className="text-gray-600">Gestión de comunidades atendidas</p>
                </div>
                <DataTable
                    data={comunidades}
                    columns={columns}
                    searchPlaceholder="Buscar comunidad..."
                    onAdd={() => toast.info('Abrir modal de agregar')}
                    addLabel="Agregar Comunidad"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
