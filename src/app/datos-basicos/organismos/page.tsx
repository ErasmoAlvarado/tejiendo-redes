import { getOrganismos } from '@/actions/organismos-actions';
import { getTejedores } from '@/actions/tejedores-actions';
import OrganismosClient from './organismos-client';

export default async function OrganismosPage() {
    const [organismosRes, tejedoresRes] = await Promise.all([
        getOrganismos(),
        getTejedores(),
    ]);

    if (!organismosRes.success || !tejedoresRes.success) {
        return <div>Error al cargar los datos.</div>;
    }

    return (
        <OrganismosClient
            initialData={organismosRes.data || []}
            tejedores={tejedoresRes.data || []}
        />
    );
}
