'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { mockTejedores } from '@/lib/mock-data';
import type { Tejedor } from '@/types/models';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function TejedoresPage() {
    const [tejedores, setTejedores] = React.useState(mockTejedores);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingTejedor, setEditingTejedor] = React.useState<Tejedor | null>(null);

    const [formData, setFormData] = React.useState({
        cedula_tejedor: '',
        nombre_tejedor: '',
        apellido_tejedor: '',
        fecha_nacimiento: '',
        direccion_tejedor: '',
        telefono_tejedor: '',
        correo_tejedor: '',
        profesion_tejedor: '',
        fecha_ingreso: '',
        tipo_voluntario: '',
        usuario: '',
        rol: 'REGISTRO' as "REGISTRO" | "ADMIN" | "MEDICO" | "FARMACIA" | "LECTOR",
        activo: true,
    });

    const handleAdd = () => {
        setEditingTejedor(null);
        setFormData({
            cedula_tejedor: '',
            nombre_tejedor: '',
            apellido_tejedor: '',
            fecha_nacimiento: '',
            direccion_tejedor: '',
            telefono_tejedor: '',
            correo_tejedor: '',
            profesion_tejedor: '',
            fecha_ingreso: '',
            tipo_voluntario: '',
            usuario: '',
            rol: 'REGISTRO',
            activo: true,
        });
        setIsModalOpen(true);
    };

    const handleEdit = (tejedor: Tejedor) => {
        setEditingTejedor(tejedor);
        setFormData({
            cedula_tejedor: tejedor.cedula_tejedor,
            nombre_tejedor: tejedor.nombre_tejedor,
            apellido_tejedor: tejedor.apellido_tejedor,
            fecha_nacimiento: tejedor.fecha_nacimiento,
            direccion_tejedor: tejedor.direccion_tejedor,
            telefono_tejedor: tejedor.telefono_tejedor,
            correo_tejedor: tejedor.correo_tejedor,
            profesion_tejedor: tejedor.profesion_tejedor,
            fecha_ingreso: tejedor.fecha_ingreso,
            tipo_voluntario: tejedor.tipo_voluntario,
            usuario: tejedor.usuario || '',
            rol: (tejedor.rol || 'REGISTRO') as any,
            activo: tejedor.activo ?? true,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (cedula: string) => {
        if (confirm('¿Está seguro de eliminar este tejedor?')) {
            setTejedores(prev => prev.filter(t => t.cedula_tejedor !== cedula));
            toast.success('Tejedor eliminado correctamente');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTejedor) {
            // Editar
            setTejedores((prev: Tejedor[]) =>
                prev.map(t =>
                    t.cedula_tejedor === editingTejedor.cedula_tejedor
                        ? { ...t, ...formData }
                        : t
                )
            );
            toast.success('Tejedor actualizado correctamente');
        } else {
            // Crear
            setTejedores((prev: Tejedor[]) => [...prev, formData as Tejedor]);
            toast.success('Tejedor creado correctamente');
        }

        setIsModalOpen(false);
    };

    const columns: Column<Tejedor>[] = [
        {
            key: 'cedula_tejedor',
            label: 'Cédula',
            sortable: true,
        },
        {
            key: 'nombre_completo',
            label: 'Nombre Completo',
            render: (tejedor) => `${tejedor.nombre_tejedor} ${tejedor.apellido_tejedor}`,
            sortable: true,
        },
        {
            key: 'profesion_tejedor',
            label: 'Profesión',
            sortable: true,
        },
        {
            key: 'tipo_voluntario',
            label: 'Tipo',
            render: (tejedor) => (
                <Badge variant="outline">
                    {tejedor.tipo_voluntario}
                </Badge>
            ),
        },
        {
            key: 'telefono_tejedor',
            label: 'Teléfono',
        },
        {
            key: 'rol',
            label: 'Rol Sistema',
            render: (tejedor) => (
                <Badge
                    variant={
                        tejedor.rol === 'ADMIN'
                            ? 'default'
                            : tejedor.rol === 'MEDICO'
                                ? 'secondary'
                                : 'outline'
                    }
                >
                    {tejedor.rol || 'Sin Rol'}
                </Badge>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (tejedor) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tejedor)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tejedor.cedula_tejedor)}
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
                    <h1 className="text-3xl text-gray-900 mb-2">Tejedores</h1>
                    <p className="text-gray-600">
                        Gestión de personal y voluntarios del sistema
                    </p>
                </div>

                <DataTable
                    data={tejedores}
                    columns={columns}
                    searchPlaceholder="Buscar por cédula, nombre o profesión..."
                    onAdd={handleAdd}
                    addLabel="Agregar Tejedor"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />

                {/* Modal Formulario */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTejedor ? 'Editar Tejedor' : 'Nuevo Tejedor'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cedula">Cédula *</Label>
                                    <Input
                                        id="cedula"
                                        value={formData.cedula_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cedula_tejedor: e.target.value })
                                        }
                                        required
                                        disabled={!!editingTejedor}
                                        maxLength={12}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nombre_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido *</Label>
                                    <Input
                                        id="apellido"
                                        value={formData.apellido_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, apellido_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                                    <Input
                                        id="fecha_nacimiento"
                                        type="date"
                                        value={formData.fecha_nacimiento}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fecha_nacimiento: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profesion">Profesión *</Label>
                                    <Input
                                        id="profesion"
                                        value={formData.profesion_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, profesion_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo_voluntario">Tipo Voluntario *</Label>
                                    <Input
                                        id="tipo_voluntario"
                                        value={formData.tipo_voluntario}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tipo_voluntario: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_ingreso">Fecha de Ingreso *</Label>
                                    <Input
                                        id="fecha_ingreso"
                                        type="date"
                                        value={formData.fecha_ingreso}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fecha_ingreso: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono *</Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, telefono_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="correo">Correo Electrónico *</Label>
                                    <Input
                                        id="correo"
                                        type="email"
                                        value={formData.correo_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, correo_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="usuario">Usuario Sistema</Label>
                                    <Input
                                        id="usuario"
                                        value={formData.usuario}
                                        onChange={(e) =>
                                            setFormData({ ...formData, usuario: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rol">Rol Sistema</Label>
                                    <Select
                                        value={formData.rol}
                                        onValueChange={(value: any) =>
                                            setFormData({ ...formData, rol: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                                            <SelectItem value="REGISTRO">REGISTRO</SelectItem>
                                            <SelectItem value="MEDICO">MEDICO</SelectItem>
                                            <SelectItem value="FARMACIA">FARMACIA</SelectItem>
                                            <SelectItem value="LECTOR">LECTOR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="activo">Estado</Label>
                                    <Select
                                        value={formData.activo ? 'true' : 'false'}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, activo: value === 'true' })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Activo</SelectItem>
                                            <SelectItem value="false">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-full space-y-2">
                                    <Label htmlFor="direccion">Dirección *</Label>
                                    <Input
                                        id="direccion"
                                        value={formData.direccion_tejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, direccion_tejedor: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
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
