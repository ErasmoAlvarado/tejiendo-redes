'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users } from 'lucide-react';
import { Tejedor } from '@/db/schema/tejedores'; // Use DB type instead of model
import { createTejedor, updateTejedor, deleteTejedor } from '@/actions/tejedores-actions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TejedoresClientProps {
    initialData: Tejedor[];
}

export default function TejedoresClient({ initialData }: TejedoresClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingTejedor, setEditingTejedor] = React.useState<Tejedor | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // Initial form state
    const initialFormState = {
        cedulaTejedor: '',
        nombreTejedor: '',
        apellidoTejedor: '',
        fechaNacimiento: '',
        direccionTejedor: '',
        telefonoTejedor: '',
        correoTejedor: '',
        profesionTejedor: '',
        fechaIngreso: '',
        tipoVoluntario: '',
    };

    const [formData, setFormData] = React.useState(initialFormState);

    const handleAdd = () => {
        setEditingTejedor(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleEdit = (tejedor: Tejedor) => {
        setEditingTejedor(tejedor);
        setFormData({
            cedulaTejedor: tejedor.cedulaTejedor,
            nombreTejedor: tejedor.nombreTejedor,
            apellidoTejedor: tejedor.apellidoTejedor,
            fechaNacimiento: new Date(tejedor.fechaNacimiento).toISOString().split('T')[0],
            direccionTejedor: tejedor.direccionTejedor,
            telefonoTejedor: tejedor.telefonoTejedor,
            correoTejedor: tejedor.correoTejedor,
            profesionTejedor: tejedor.profesionTejedor,
            fechaIngreso: new Date(tejedor.fechaIngreso).toISOString().split('T')[0],
            tipoVoluntario: tejedor.tipoVoluntario,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (cedula: string) => {
        if (confirm('¿Está seguro de eliminar este tejedor?')) {
            const res = await deleteTejedor(cedula);
            if (res.success) {
                toast.success('Tejedor eliminado correctamente');
                router.refresh();
            } else {
                toast.error(res.error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Prepare data for server action
            const dataToSave = {
                ...formData,
                fechaNacimiento: new Date(formData.fechaNacimiento),
                fechaIngreso: new Date(formData.fechaIngreso),
            };

            let res;
            if (editingTejedor) {
                res = await updateTejedor(editingTejedor.cedulaTejedor, dataToSave);
            } else {
                res = await createTejedor(dataToSave);
            }

            if (res.success) {
                toast.success(res.message);
                setIsModalOpen(false);
                router.refresh(); // Refresh server data
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const columns: Column<Tejedor>[] = [
        {
            key: 'cedulaTejedor',
            label: 'Cédula',
            sortable: true,
        },
        {
            key: 'nombreTejedor',
            label: 'Nombre Completo',
            render: (tejedor) => `${tejedor.nombreTejedor} ${tejedor.apellidoTejedor}`,
            sortable: true,
        },
        {
            key: 'profesionTejedor',
            label: 'Profesión',
            sortable: true,
        },
        {
            key: 'tipoVoluntario',
            label: 'Tipo',
            render: (tejedor) => (
                <Badge variant="outline">
                    {tejedor.tipoVoluntario}
                </Badge>
            ),
        },
        {
            key: 'telefonoTejedor',
            label: 'Teléfono',
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
                        onClick={() => handleDelete(tejedor.cedulaTejedor)}
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
                    data={initialData}
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
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                {editingTejedor ? 'Editar Tejedor' : 'Nuevo Tejedor'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cedula">Cédula *</Label>
                                    <Input
                                        id="cedula"
                                        value={formData.cedulaTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cedulaTejedor: e.target.value })
                                        }
                                        required
                                        disabled={!!editingTejedor}
                                        maxLength={12}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombreTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nombreTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido *</Label>
                                    <Input
                                        id="apellido"
                                        value={formData.apellidoTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, apellidoTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                                    <Input
                                        id="fechaNacimiento"
                                        type="date"
                                        value={formData.fechaNacimiento}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fechaNacimiento: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profesion">Profesión *</Label>
                                    <Input
                                        id="profesion"
                                        value={formData.profesionTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, profesionTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoVoluntario">Tipo Voluntario *</Label>
                                    <Input
                                        id="tipoVoluntario"
                                        value={formData.tipoVoluntario}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tipoVoluntario: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaIngreso">Fecha de Ingreso *</Label>
                                    <Input
                                        id="fechaIngreso"
                                        type="date"
                                        value={formData.fechaIngreso}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fechaIngreso: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono *</Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefonoTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, telefonoTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="correo">Correo Electrónico *</Label>
                                    <Input
                                        id="correo"
                                        type="email"
                                        value={formData.correoTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, correoTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="col-span-full space-y-2">
                                    <Label htmlFor="direccion">Dirección *</Label>
                                    <Input
                                        id="direccion"
                                        value={formData.direccionTejedor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, direccionTejedor: e.target.value })
                                        }
                                        required
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all active:scale-95"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Tejedor'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
