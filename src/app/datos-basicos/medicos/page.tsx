'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { mockTejedores } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function MedicosPage() {
    const [medicos] = React.useState(
        mockTejedores.filter((t) => t.rol === 'MEDICO')
    );

    const columns: Column<any>[] = [
        { key: 'cedula_tejedor', label: 'Cédula', sortable: true },
        {
            key: 'nombre_completo',
            label: 'Nombre Completo',
            render: (m) => `${m.nombre_tejedor} ${m.apellido_tejedor}`,
            sortable: true,
        },
        { key: 'telefono_tejedor', label: 'Teléfono' },
        { key: 'correo_tejedor', label: 'Correo' },
        {
            key: 'acciones',
            label: 'Acciones',
            render: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Médicos</h1>
                    <p className="text-gray-600">
                        Gestión de médicos (tejedores con rol MEDICO)
                    </p>
                </div>
                <DataTable
                    data={medicos}
                    columns={columns}
                    searchPlaceholder="Buscar médico..."
                    onAdd={() => toast.info('Asignar tejedor como médico')}
                    addLabel="Asignar Médico"
                />
            </div>
        </MainLayout>
    );
}
