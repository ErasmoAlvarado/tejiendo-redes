'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Users, Phone, Info, UserCheck } from 'lucide-react';
import { Comunidad } from '@/db/schema/comunidades';
import { Responsable } from '@/db/schema/responsable';
import { createComunidad, deleteComunidad, updateComunidad } from '@/actions/comunidades-actions';
import { TIPO_COMUNIDAD_MAP } from '@/types/models';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ComunidadWithResponsable extends Comunidad {
    responsable: Responsable | null;
}

interface ComunidadesClientProps {
    initialData: ComunidadWithResponsable[];
    responsables: Responsable[];
}

export default function ComunidadesClient({ initialData, responsables }: ComunidadesClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('basico');
    const [isLoading, setIsLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        codigoComunidad: '',
        nombreComunidad: '',
        tipoComunidad: '',
        estado: '',
        municipio: '',
        direccion: '',
        ubicacionFisica: '',
        cedulaResponsable: '',
        cantidadHabitantes: 0,
        cantidadFamilias: 0,
        telefonoComunidad: '',
    });

    const generarCodigo = (prefix: string, length: number) => {
        return `${prefix}-${(length + 1).toString().padStart(3, '0')}`;
    };

    const handleAdd = () => {
        const nuevoCodigo = generarCodigo('COM', initialData.length);
        setFormData({
            codigoComunidad: nuevoCodigo,
            nombreComunidad: '',
            tipoComunidad: '',
            estado: '',
            municipio: '',
            direccion: '',
            ubicacionFisica: '',
            cedulaResponsable: '',
            cantidadHabitantes: 0,
            cantidadFamilias: 0,
            telefonoComunidad: '',
        });
        setIsEditing(false);
        setActiveTab('basico');
        setIsModalOpen(true);
    };

    const handleEdit = (comunidad: ComunidadWithResponsable) => {
        setFormData({
            codigoComunidad: comunidad.codigoComunidad,
            nombreComunidad: comunidad.nombreComunidad,
            tipoComunidad: comunidad.tipoComunidad,
            estado: comunidad.estado,
            municipio: comunidad.municipio,
            direccion: comunidad.direccion,
            ubicacionFisica: comunidad.ubicacionFisica,
            cedulaResponsable: comunidad.cedulaResponsable,
            cantidadHabitantes: comunidad.cantidadHabitantes,
            cantidadFamilias: comunidad.cantidadFamilias,
            telefonoComunidad: comunidad.telefonoComunidad,
        });
        setIsEditing(true);
        setActiveTab('basico');
        setIsModalOpen(true);
    };

    const handleDelete = async (codigo: string) => {
        if (confirm('¿Está seguro de eliminar esta comunidad?')) {
            const res = await deleteComunidad(codigo);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombreComunidad || !formData.estado || !formData.municipio || !formData.cedulaResponsable) {
            toast.error('Por favor complete los campos obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            let res;
            if (isEditing) {
                res = await updateComunidad(formData.codigoComunidad, formData);
            } else {
                res = await createComunidad(formData);
            }

            if (res.success) {
                toast.success(res.message);
                setIsModalOpen(false);
                router.refresh();
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

    const columns: Column<ComunidadWithResponsable>[] = [
        {
            key: 'codigoComunidad',
            label: 'Código',
            sortable: true
        },
        {
            key: 'nombreComunidad',
            label: 'Nombre',
            sortable: true,
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
        },
        {
            key: 'municipio',
            label: 'Municipio',
            sortable: true,
        },
        {
            key: 'tipoComunidad',
            label: 'Tipo',
            render: (c) => TIPO_COMUNIDAD_MAP[c.tipoComunidad] || c.tipoComunidad
        },
        {
            key: 'cantidadHabitantes',
            label: 'Habitantes',
            render: (c) => c.cantidadHabitantes?.toLocaleString() || '0'
        },
        {
            key: 'responsable',
            label: 'Responsable',
            render: (c) => c.responsable ? `${c.responsable.nombreResponsable} ${c.responsable.apellidoResponsable}` : c.cedulaResponsable
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (c) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        title="Editar"
                        onClick={() => handleEdit(c)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Eliminar"
                        onClick={() => handleDelete(c.codigoComunidad)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl text-gray-900 mb-2 font-bold tracking-tight">Comunidades</h1>
                        <p className="text-gray-600">
                            Gestión de comunidades atendidas por la organización
                        </p>
                    </div>
                </div>

                <DataTable
                    data={initialData}
                    columns={columns}
                    searchPlaceholder="Buscar comunidad..."
                    onAdd={handleAdd}
                    addLabel="Agregar Comunidad"
                />

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-600" />
                                {isEditing ? 'Editar Comunidad' : 'Registrar Nueva Comunidad'}
                            </DialogTitle>
                            <DialogDescription>
                                Ingrese los detalles geográficos y demográficos de la comunidad.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="basico" className="flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Básico
                                    </TabsTrigger>
                                    <TabsTrigger value="ubicacion" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Ubicación
                                    </TabsTrigger>
                                    <TabsTrigger value="social" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Social y Demográfico
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basico" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="codigo">Código de Comunidad</Label>
                                            <Input
                                                id="codigo"
                                                value={formData.codigoComunidad}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">Nombre de la Comunidad *</Label>
                                            <Input
                                                id="nombre"
                                                placeholder="Ej. La Esperanza"
                                                value={formData.nombreComunidad}
                                                onChange={(e) => setFormData({ ...formData, nombreComunidad: e.target.value })}
                                                required
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tipo">Tipo de Comunidad</Label>
                                            <Select
                                                value={formData.tipoComunidad}
                                                onValueChange={(val) => setFormData({ ...formData, tipoComunidad: val })}
                                            >
                                                <SelectTrigger id="tipo">
                                                    <SelectValue placeholder="Seleccione tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Urbana</SelectItem>
                                                    <SelectItem value="2">Rural</SelectItem>
                                                    <SelectItem value="3">Indígena</SelectItem>
                                                    <SelectItem value="4">Base de Misiones</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono de Contacto</Label>
                                            <div className="flex gap-2">
                                                <Phone className="w-4 h-4 mt-3 text-gray-400" />
                                                <Input
                                                    id="telefono"
                                                    placeholder="0212-0000000"
                                                    value={formData.telefonoComunidad}
                                                    onChange={(e) => setFormData({ ...formData, telefonoComunidad: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="button" onClick={() => setActiveTab('ubicacion')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                            Siguiente: Ubicación
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="ubicacion" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="estado">Estado *</Label>
                                            <Input
                                                id="estado"
                                                placeholder="Ej. Miranda"
                                                value={formData.estado}
                                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                                required
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="municipio">Municipio *</Label>
                                            <Input
                                                id="municipio"
                                                placeholder="Ej. Baruta"
                                                value={formData.municipio}
                                                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                                required
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion">Dirección Exacta</Label>
                                        <Input
                                            id="direccion"
                                            placeholder="Calle, Avenida, Número de casa..."
                                            value={formData.direccion}
                                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="referencia">Ubicación Física (Punto de referencia)</Label>
                                        <Textarea
                                            id="referencia"
                                            placeholder="Ej. Detrás de la escuela, cerca del ambulatorio..."
                                            value={formData.ubicacionFisica}
                                            onChange={(e) => setFormData({ ...formData, ubicacionFisica: e.target.value })}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('basico')}>
                                            Atrás
                                        </Button>
                                        <Button type="button" onClick={() => setActiveTab('social')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                            Siguiente: Social
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="social" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="habitantes">Cantidad de Habitantes</Label>
                                            <Input
                                                id="habitantes"
                                                type="number"
                                                value={formData.cantidadHabitantes}
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                onChange={(e) => setFormData({ ...formData, cantidadHabitantes: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="familias">Cantidad de Familias</Label>
                                            <Input
                                                id="familias"
                                                type="number"
                                                value={formData.cantidadFamilias}
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                onChange={(e) => setFormData({ ...formData, cantidadFamilias: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="responsable" className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-blue-600" />
                                            Responsable de la Comunidad (Enlace Social) *
                                        </Label>
                                        <Select
                                            value={formData.cedulaResponsable}
                                            onValueChange={(val) => setFormData({ ...formData, cedulaResponsable: val })}
                                        >
                                            <SelectTrigger id="responsable">
                                                <SelectValue placeholder="Seleccione un responsable" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {responsables.map(r => (
                                                    <SelectItem key={r.cedulaResponsable} value={r.cedulaResponsable}>
                                                        {r.nombreResponsable} {r.apellidoResponsable} ({r.cedulaResponsable})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-between pt-6">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('ubicacion')}>
                                            Atrás
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-100 transition-all active:scale-95"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Comunidad')}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
