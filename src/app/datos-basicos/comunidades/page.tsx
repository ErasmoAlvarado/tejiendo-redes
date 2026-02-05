import { getComunidades } from '@/actions/comunidades-actions';
import { getResponsables } from '@/actions/responsables-actions';
import ComunidadesClient from './comunidades-client';

export default async function ComunidadesPage() {
    const [comunidadesRes, responsablesRes] = await Promise.all([
        getComunidades(),
        getResponsables(),
    ]);

    if (!comunidadesRes.success || !responsablesRes.success) {
        return <div>Error al cargar los datos.</div>;
    }

    return (
        <ComunidadesClient
            initialData={comunidadesRes.data || []}
            responsables={responsablesRes.data || []}
        />
    );
}
