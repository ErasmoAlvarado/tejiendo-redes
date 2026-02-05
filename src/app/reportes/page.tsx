import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
    getReporteAbordajes,
    getReporteComunidades,
    getReportePacientes,
    getReporteMorbilidad,
    getReporteMedicamentos,
    getComunidadesParaFiltro
} from '@/actions/reportes-actions';
import ReportesClient from '@/app/reportes/ReportesClient';

export default async function ReportesPage() {
    // Obtener todos los datos de reportes en paralelo para mejor rendimiento
    const [
        comunidadesResult,
        abordajesResult,
        comunidadesReporteResult,
        pacientesResult,
        morbilidadResult,
        medicamentosResult
    ] = await Promise.all([
        getComunidadesParaFiltro(),
        getReporteAbordajes(),
        getReporteComunidades(),
        getReportePacientes(),
        getReporteMorbilidad(),
        getReporteMedicamentos()
    ]);

    // Extraer datos o usar arrays vacíos como fallback
    const comunidades = comunidadesResult.success ? comunidadesResult.data : [];
    const reporteAbordajes = abordajesResult.success ? abordajesResult.data : [];
    const reporteComunidades = comunidadesReporteResult.success ? comunidadesReporteResult.data : [];
    const reportePacientes = pacientesResult.success ? pacientesResult.data : [];
    const dataMorbilidad = morbilidadResult.success ? morbilidadResult.data : [];
    const reporteMedicamentos = medicamentosResult.success ? medicamentosResult.data : [];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Reportes</h1>
                    <p className="text-gray-600">Generación de reportes con filtros personalizados</p>
                </div>

                <ReportesClient
                    comunidades={comunidades}
                    reporteAbordajes={reporteAbordajes}
                    reporteComunidades={reporteComunidades}
                    reportePacientes={reportePacientes}
                    dataMorbilidad={dataMorbilidad}
                    reporteMedicamentos={reporteMedicamentos}
                />
            </div>
        </MainLayout>
    );
}
