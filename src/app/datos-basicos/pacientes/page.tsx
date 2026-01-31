'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { mockPacientes, mockComunidades } from '@/lib/mock-data';
import type { Paciente } from '@/types/models';
import { calcularEdad } from '@/types/models';
import { toast } from 'sonner';

export default function PacientesPage() {
    const router = useRouter();
    const [pacientes] = React.useState(mockPacientes);

    const handleDelete = (cedula: string) => {
        if (confirm('¿Está seguro de eliminar este paciente?')) {
            toast.success('Paciente eliminado correctamente');
        }
    };

    const columns: Column<Paciente>[] = [
        {
            key: 'cedula_paciente',
            label: 'Cédula',
            sortable: true,
        },
        {
            key: 'nombre_completo',
            label: 'Nombre Completo',
            render: (paciente) =>
                `${paciente.nombre_paciente} ${paciente.apellido_paciente}`,
            sortable: true,
        },
        {
            key: 'edad',
            label: 'Edad',
            render: (paciente) => `${calcularEdad(paciente.fecha_nacimiento)} años`,
        },
        {
            key: 'sexo',
            label: 'Sexo',
            render: (paciente) => (
                <Badge variant="outline">
                    {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'N/A'}
                </Badge>
            ),
        },
        {
            key: 'codigo_comunidad',
            label: 'Comunidad',
            render: (paciente) => {
                const comunidad = mockComunidades.find(
                    (c) => c.codigo_comunidad === paciente.codigo_comunidad
                );
                return comunidad?.nombre_comunidad || '-';
            },
        },
        {
            key: 'telefono_paciente',
            label: 'Teléfono',
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (paciente) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/datos-basicos/pacientes/${paciente.cedula_paciente}`)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/datos-basicos/pacientes/${paciente.cedula_paciente}/editar`)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(paciente.cedula_paciente)}
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Pacientes</h1>
                    <p className="text-gray-600">
                        Gestión del registro de pacientes del sistema
                    </p>
                </div>

                <DataTable
                    data={pacientes}
                    columns={columns}
                    searchPlaceholder="Buscar por cédula, nombre, teléfono..."
                    onAdd={() => router.push('/datos-basicos/pacientes/nuevo')}
                    addLabel="Agregar Paciente"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
