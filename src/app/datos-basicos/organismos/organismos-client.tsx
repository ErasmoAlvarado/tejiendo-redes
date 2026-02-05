'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Building2, MapPin, Phone, Mail, Info, User } from 'lucide-react';
import { Organismo } from '@/db/schema/organismos';
import { Tejedor } from '@/db/schema/tejedores';
import { createOrganismo, deleteOrganismo, updateOrganismo } from '@/actions/organismos-actions';
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

interface OrganismoWithTejedor extends Organismo {
    tejedor: Tejedor | null;
}

interface OrganismosClientProps {
    initialData: OrganismoWithTejedor[];
    tejedores: Tejedor[];
}

export default function OrganismosClient({ initialData, tejedores }: OrganismosClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('basico');
    const [isLoading, setIsLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        codigoOrganismo: '',
        cedulaTejedor: '',
        nombreOrganismo: '',
        paisOrganismo: 'Venezuela',
        estadoOrganismo: '',
        municipioOrganismo: '',
        direccionOrganismo: '',
        ubicacionFisica: '',
        correoOrganismo: '',
        telefonoOrganismo: '',
    });

    const generarCodigo = (prefix: string, length: number) => {
        return `${prefix}-${(length + 1).toString().padStart(3, '0')}`;
    };

    const handleAdd = () => {
        const nuevoCodigo = generarCodigo('ORG', initialData.length);
        setFormData({
            codigoOrganismo: nuevoCodigo,
            cedulaTejedor: '',
            nombreOrganismo: '',
            paisOrganismo: 'Venezuela',
            estadoOrganismo: '',
            municipioOrganismo: '',
            direccionOrganismo: '',
            ubicacionFisica: '',
            correoOrganismo: '',
            telefonoOrganismo: '',
        });
        setIsEditing(false);
        setActiveTab('basico');
        setIsModalOpen(true);
    };

    const handleEdit = (organismo: OrganismoWithTejedor) => {
        setFormData({
            codigoOrganismo: organismo.codigoOrganismo,
            cedulaTejedor: organismo.cedulaTejedor,
            nombreOrganismo: organismo.nombreOrganismo,
            paisOrganismo: organismo.paisOrganismo,
            estadoOrganismo: organismo.estadoOrganismo,
            municipioOrganismo: organismo.municipioOrganismo,
            direccionOrganismo: organismo.direccionOrganismo,
            ubicacionFisica: organismo.ubicacionFisica,
            correoOrganismo: organismo.correoOrganismo,
            telefonoOrganismo: organismo.telefonoOrganismo,
        });
        setIsEditing(true);
        setActiveTab('basico');
        setIsModalOpen(true);
    };

    const handleDelete = async (codigo: string) => {
        if (confirm('¿Está seguro de eliminar este organismo?')) {
            const res = await deleteOrganismo(codigo);
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

        if (!formData.nombreOrganismo || !formData.cedulaTejedor || !formData.estadoOrganismo || !formData.correoOrganismo) {
            toast.error('Por favor complete los campos obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            let res;
            if (isEditing) {
                res = await updateOrganismo(formData.codigoOrganismo, formData);
            } else {
                res = await createOrganismo(formData);
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

    const columns: Column<OrganismoWithTejedor>[] = [
        {
            key: 'codigoOrganismo',
            label: 'Código',
            sortable: true
        },
        {
            key: 'nombreOrganismo',
            label: 'Nombre Organismo',
            sortable: true,
        },
        {
            key: 'tejedor',
            label: 'Tejedor Enlace',
            render: (o) => o.tejedor ? `${o.tejedor.nombreTejedor} ${o.tejedor.apellidoTejedor}` : o.cedulaTejedor,
            sortable: true,
        },
        {
            key: 'correoOrganismo',
            label: 'Correo',
            render: (o) => (
                <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">{o.correoOrganismo}</span>
                </div>
            )
        },
        {
            key: 'telefonoOrganismo',
            label: 'Teléfono',
            render: (o) => o.telefonoOrganismo || '-'
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (o) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        title="Editar"
                        onClick={() => handleEdit(o)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Eliminar"
                        onClick={() => handleDelete(o.codigoOrganismo)}
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
                        <h1 className="text-3xl text-gray-900 mb-2 font-bold tracking-tight">Organismos</h1>
                        <p className="text-gray-600">
                            Gestión de organismos y entes asociados con la organización
                        </p>
                    </div>
                </div>

                <DataTable
                    data={initialData}
                    columns={columns}
                    searchPlaceholder="Buscar organismo..."
                    onAdd={handleAdd}
                    addLabel="Agregar Organismo"
                />

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                {isEditing ? 'Editar Organismo' : 'Registrar Nuevo Organismo'}
                            </DialogTitle>
                            <DialogDescription>
                                Complete la información institucional y de contacto del organismo.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="basico" className="flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Institucional
                                    </TabsTrigger>
                                    <TabsTrigger value="ubicacion" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Ubicación
                                    </TabsTrigger>
                                    <TabsTrigger value="contacto" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Contacto
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basico" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="codigo">Código</Label>
                                            <Input
                                                id="codigo"
                                                value={formData.codigoOrganismo}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">Nombre del Organismo *</Label>
                                            <Input
                                                id="nombre"
                                                placeholder="Ej. Ministerio de Salud"
                                                value={formData.nombreOrganismo}
                                                onChange={(e) => setFormData({ ...formData, nombreOrganismo: e.target.value })}
                                                required
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tejedor" className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-600" />
                                            Tejedor de Enlace (Responsable Interno) *
                                        </Label>
                                        <Select
                                            value={formData.cedulaTejedor}
                                            onValueChange={(val) => setFormData({ ...formData, cedulaTejedor: val })}
                                        >
                                            <SelectTrigger id="tejedor" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                                <SelectValue placeholder="Seleccione un tejedor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tejedores.map(t => (
                                                    <SelectItem key={t.cedulaTejedor} value={t.cedulaTejedor}>
                                                        {t.nombreTejedor} {t.apellidoTejedor} ({t.cedulaTejedor})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="button" onClick={() => setActiveTab('ubicacion')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                            Siguiente: Ubicación
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="ubicacion" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pais">País</Label>
                                            <Input
                                                id="pais"
                                                value={formData.paisOrganismo}
                                                onChange={(e) => setFormData({ ...formData, paisOrganismo: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="estado">Estado *</Label>
                                            <Input
                                                id="estado"
                                                placeholder="Ej. Distrito Capital"
                                                value={formData.estadoOrganismo}
                                                onChange={(e) => setFormData({ ...formData, estadoOrganismo: e.target.value })}
                                                required
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="municipio">Municipio</Label>
                                            <Input
                                                id="municipio"
                                                placeholder="Ej. Libertador"
                                                value={formData.municipioOrganismo}
                                                onChange={(e) => setFormData({ ...formData, municipioOrganismo: e.target.value })}
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion">Dirección Fiscal / Sede</Label>
                                        <Input
                                            id="direccion"
                                            placeholder="Av. Principal, Edificio..."
                                            value={formData.direccionOrganismo}
                                            onChange={(e) => setFormData({ ...formData, direccionOrganismo: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fisica">Ubicación Física (Piso/Oficina)</Label>
                                        <Textarea
                                            id="fisica"
                                            placeholder="Ej. Piso 5, Oficina 502..."
                                            value={formData.ubicacionFisica}
                                            onChange={(e) => setFormData({ ...formData, ubicacionFisica: e.target.value })}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('basico')}>
                                            Atrás
                                        </Button>
                                        <Button type="button" onClick={() => setActiveTab('contacto')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                            Siguiente: Contacto
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contacto" className="space-y-4 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="correo">Correo Electrónico *</Label>
                                            <div className="flex gap-2">
                                                <Mail className="w-4 h-4 mt-3 text-gray-400" />
                                                <Input
                                                    id="correo"
                                                    type="email"
                                                    placeholder="contacto@organismo.gob.ve"
                                                    value={formData.correoOrganismo}
                                                    onChange={(e) => setFormData({ ...formData, correoOrganismo: e.target.value })}
                                                    required
                                                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono</Label>
                                            <div className="flex gap-2">
                                                <Phone className="w-4 h-4 mt-3 text-gray-400" />
                                                <Input
                                                    id="telefono"
                                                    placeholder="0212-0000000"
                                                    value={formData.telefonoOrganismo}
                                                    onChange={(e) => setFormData({ ...formData, telefonoOrganismo: e.target.value })}
                                                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start mt-6">
                                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-blue-800">
                                            Asegúrese de que el tejedor de enlace seleccionado tenga sus datos de contacto actualizados, ya que será el punto de conexión principal con este organismo.
                                        </p>
                                    </div>
                                    <div className="flex justify-between pt-8">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('ubicacion')}>
                                            Atrás
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-100 transition-all active:scale-95"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Organismo')}
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
