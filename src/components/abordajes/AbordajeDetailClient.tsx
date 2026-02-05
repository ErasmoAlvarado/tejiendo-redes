'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { EmptyState } from '@/components/shared/UIComponents';

interface AbordajeDetailClientProps {
    abordajeData: any; // We can improve typing later
}

export function AbordajeDetailClient({ abordajeData }: AbordajeDetailClientProps) {
    const router = useRouter();

    if (!abordajeData) {
        return (
            <MainLayout>
                <EmptyState
                    icon="error"
                    title="Abordaje no encontrado"
                    description="El abordaje que buscas no existe o fue eliminado"
                    action={{
                        label: 'Volver a abordajes',
                        onClick: () => router.push('/abordajes'),
                    }}
                />
            </MainLayout>
        );
    }

    const { id } = abordajeData;
    // Note: abordajeData includes metada: consultas, medicamentos_entregados, communities, tejedores
    const medicamentosEntregados = abordajeData.medicamentos_entregados || [];

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl text-gray-900">{abordajeData.descripcion}</h1>
                            <p className="text-gray-600">{abordajeData.codigoAbordaje}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            variant={
                                abordajeData.estado === 'Finalizado'
                                    ? 'default'
                                    : abordajeData.estado === 'En Curso'
                                        ? 'secondary'
                                        : 'outline'
                            }
                        >
                            {abordajeData.estado}
                        </Badge>
                        <Button onClick={() => router.push(`/abordajes/${abordajeData.codigoAbordaje}/editar`)}>
                            Editar Abordaje
                        </Button>
                    </div>
                </div>

                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Fecha</p>
                                    <p className="text-lg">
                                        {new Date(abordajeData.fechaAbordaje).toLocaleDateString('es-VE')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Horario</p>
                                    <p className="text-lg">
                                        {abordajeData.horaInicio}
                                        {abordajeData.horaFin && ` - ${abordajeData.horaFin}`}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Consultas</p>
                                    <p className="text-lg">{abordajeData.total_consultas}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Pacientes Únicos</p>
                                    <p className="text-lg">{abordajeData.pacientes_unicos}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="comunidades" className="w-full">
                    <TabsList>
                        <TabsTrigger value="comunidades">
                            Comunidades ({abordajeData.comunidades?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="tejedores">
                            Tejedores ({abordajeData.tejedores?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="consultas">
                            Consultas ({abordajeData.consultas?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="medicamentos">
                            Medicamentos ({medicamentosEntregados.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="comunidades">
                        {abordajeData.comunidades && abordajeData.comunidades.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {abordajeData.comunidades.map((comunidad: any) => (
                                    <Card key={comunidad.codigoComunidad}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{comunidad.nombreComunidad}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-600" />
                                                <span>
                                                    {comunidad.parroquia}, {comunidad.municipio}, {comunidad.estado}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-gray-600" />
                                                <span>{comunidad.habitantes} habitantes</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin comunidades asignadas"
                                description="Este abordaje no tiene comunidades asignadas"
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="tejedores">
                        {abordajeData.tejedores && abordajeData.tejedores.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {abordajeData.tejedores.map((tejedor: any) => (
                                    <Card key={tejedor.cedulaTejedor}>
                                        <CardContent className="pt-6">
                                            <div className="space-y-2">
                                                <p className="text-base">
                                                    {tejedor.nombreTejedor} {tejedor.apellidoTejedor}
                                                </p>
                                                <Badge variant="secondary">{tejedor.rolAbordaje || 'Participante'}</Badge>
                                                <p className="text-sm text-gray-600">C.I. {tejedor.cedulaTejedor}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin tejedores asignados"
                                description="Este abordaje no tiene tejedores asignados"
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="consultas">
                        {abordajeData.consultas && abordajeData.consultas.length > 0 ? (
                            <div className="space-y-4">
                                {abordajeData.consultas.map((consulta: any) => (
                                    <Card key={consulta.codigoConsulta}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{consulta.codigoConsulta}</CardTitle>
                                                {/* Add morbilidad if available in join */}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Paciente</p>
                                                <p className="text-base">C.I. {consulta.cedulaPaciente}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Motivo</p>
                                                <p className="text-base">{consulta.motivoConsulta}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Diagnóstico</p>
                                                <p className="text-base">{consulta.diagnosticoTexto}</p>
                                            </div>
                                            {consulta.tratamiento && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Tratamiento</p>
                                                    <p className="text-base">{consulta.tratamiento}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin consultas registradas"
                                description="Este abordaje no tiene consultas médicas registradas"
                                action={{
                                    label: 'Registrar Consulta',
                                    onClick: () => router.push(`/abordajes/${abordajeData.codigoAbordaje}/nueva-consulta`),
                                }}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="medicamentos">
                        {medicamentosEntregados.length > 0 ? (
                            <div className="space-y-4">
                                {medicamentosEntregados.map((entrega: any, index: number) => (
                                    <Card key={index}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-600">Medicamento</p>
                                                    <p className="text-base font-medium">{entrega.nombreMedicamento}</p>
                                                    <p className="text-sm text-gray-400">{entrega.codigoMedicamento}</p>

                                                    <p className="text-sm text-gray-600 mt-2">Paciente</p>
                                                    <p className="text-base">C.I. {entrega.cedulaPaciente}</p>

                                                    {entrega.indicaciones && (
                                                        <>
                                                            <p className="text-sm text-gray-600 mt-2">Indicaciones</p>
                                                            <p className="text-base">{entrega.indicaciones}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <Badge variant="secondary">
                                                    {entrega.cantidadEntregada} unidades
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin entregas de medicamentos"
                                description="No hay medicamentos entregados en este abordaje"
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
