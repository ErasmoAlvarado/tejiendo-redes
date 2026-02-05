import { getPacientes } from '@/actions/pacientes-actions';
import { getComunidades } from '@/actions/comunidades-actions';
import PacientesClient from './pacientes-client';

export default async function PacientesPage() {
    const [pacientesRes, comunidadesRes] = await Promise.all([
        getPacientes(),
        getComunidades(),
    ]);

    if (!pacientesRes.success || !comunidadesRes.success) {
        return <div>Error al cargar los datos.</div>;
    }

    return (
        <PacientesClient
            initialData={pacientesRes.data || []}
            comunidades={comunidadesRes.data || []}
        />
    );
}
