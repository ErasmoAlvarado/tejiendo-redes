'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockEnfermedades } from '@/lib/mock-data';
import type { Enfermedad } from '@/types/models';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function EnfermedadesPage() {
    const [enfermedades, setEnfermedades] = React.useState(mockEnfermedades);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingEnfermedad, setEditingEnfermedad] = React.useState<Enfermedad | null>(null);

    const [formData, setFormData] = React.useState({
        codigo_enfermedad: '',
        nombre_enfermedad: '',
        tipo_patologia: '',
        descripcion: '',
    });

    const handleAdd = () => {
        setEditingEnfermedad(null);
        setFormData({
            codigo_enfermedad: '',
            nombre_enfermedad: '',
            tipo_patologia: '',
            descripcion: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (enfermedad: Enfermedad) => {
        setEditingEnfermedad(enfermedad);
        setFormData({
            codigo_enfermedad: enfermedad.codigo_enfermedad,
            nombre_enfermedad: enfermedad.nombre_enfermedad,
            tipo_patologia: enfermedad.tipo_patologia,
            descripcion: enfermedad.descripcion || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (codigo: string) => {
        if (confirm('¿Está seguro de eliminar esta enfermedad?')) {
            setEnfermedades(prev => prev.filter(e => e.codigo_enfermedad !== codigo));
            toast.success('Enfermedad eliminada correctamente');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingEnfermedad) {
            setEnfermedades(prev =>
                prev.map(en =>
                    en.codigo_enfermedad === editingEnfermedad.codigo_enfermedad
                        ? { ...formData }
                        : en
                )
            );
            toast.success('Enfermedad actualizada correctamente');
        } else {
            setEnfermedades(prev => [...prev, formData]);
            toast.success('Enfermedad creada correctamente');
        }

        setIsModalOpen(false);
    };

    const columns: Column<Enfermedad>[] = [
        {
            key: 'codigo_enfermedad',
            label: 'Código',
            sortable: true,
        },
        {
            key: 'nombre_enfermedad',
            label: 'Nombre',
            sortable: true,
        },
        {
            key: 'tipo_patologia',
            label: 'Tipo Patología',
            sortable: true,
        },
        {
            key: 'descripcion',
            label: 'Descripción',
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (enfermedad) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(enfermedad)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(enfermedad.codigo_enfermedad)}
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
                    <h1 className="text-3xl text-gray-900 mb-2">Enfermedades</h1>
                    <p className="text-gray-600">
                        Catálogo de enfermedades para estandarizar diagnósticos
                    </p>
                </div>

                <DataTable
                    data={enfermedades}
                    columns={columns}
                    searchPlaceholder="Buscar por código, nombre o tipo..."
                    onAdd={handleAdd}
                    addLabel="Agregar Enfermedad"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingEnfermedad ? 'Editar Enfermedad' : 'Nueva Enfermedad'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigo">Código *</Label>
                                <Input
                                    id="codigo"
                                    placeholder="ENF-001"
                                    value={formData.codigo_enfermedad}
                                    onChange={(e) => setFormData({ ...formData, codigo_enfermedad: e.target.value })}
                                    required
                                    disabled={!!editingEnfermedad}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre_enfermedad}
                                    onChange={(e) => setFormData({ ...formData, nombre_enfermedad: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo Patología *</Label>
                                <Input
                                    id="tipo"
                                    placeholder="Ej: Respiratoria, Viral..."
                                    value={formData.tipo_patologia}
                                    onChange={(e) => setFormData({ ...formData, tipo_patologia: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
