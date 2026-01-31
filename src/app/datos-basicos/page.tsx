'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import {
    Users,
    Stethoscope,
    GraduationCap,
    UserCheck,
    MapPin,
    Building2,
    Heart,
    Pill,
} from 'lucide-react';
import {
    mockTejedores,
    mockMedicos,
    mockEspecialidades,
    mockResponsables,
    mockComunidades,
    mockOrganismos,
    mockPacientes,
    mockMedicamentos,
} from '@/lib/mock-data';

interface DataCard {
    title: string;
    count: number;
    icon: React.ReactNode;
    path: string;
    color: string;
}

export default function DatosBasicosPage() {
    const router = useRouter();

    const dataCards: DataCard[] = [
        {
            title: 'Tejedores',
            count: mockTejedores.length,
            icon: <Users className="w-8 h-8" />,
            path: '/datos-basicos/tejedores',
            color: 'bg-blue-500',
        },
        {
            title: 'Médicos',
            count: mockMedicos ? mockMedicos.length : 0,
            icon: <Stethoscope className="w-8 h-8" />,
            path: '/datos-basicos/medicos',
            color: 'bg-green-500',
        },
        {
            title: 'Especialidades',
            count: mockEspecialidades.length,
            icon: <GraduationCap className="w-8 h-8" />,
            path: '/datos-basicos/especialidades',
            color: 'bg-purple-500',
        },
        {
            title: 'Responsables',
            count: mockResponsables.length,
            icon: <UserCheck className="w-8 h-8" />,
            path: '/datos-basicos/responsables',
            color: 'bg-yellow-500',
        },
        {
            title: 'Comunidades',
            count: mockComunidades.length,
            icon: <MapPin className="w-8 h-8" />,
            path: '/datos-basicos/comunidades',
            color: 'bg-red-500',
        },
        {
            title: 'Organismos',
            count: mockOrganismos.length,
            icon: <Building2 className="w-8 h-8" />,
            path: '/datos-basicos/organismos',
            color: 'bg-indigo-500',
        },
        {
            title: 'Pacientes',
            count: mockPacientes.length,
            icon: <Heart className="w-8 h-8" />,
            path: '/datos-basicos/pacientes',
            color: 'bg-pink-500',
        },
        {
            title: 'Medicamentos',
            count: mockMedicamentos.length,
            icon: <Pill className="w-8 h-8" />,
            path: '/datos-basicos/medicamentos',
            color: 'bg-teal-500',
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Datos Básicos</h1>
                    <p className="text-gray-600">
                        Gestión de catálogos y datos maestros del sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dataCards.map(card => (
                        <button
                            key={card.path}
                            onClick={() => router.push(card.path)}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${card.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                            </div>
                            <h3 className="text-xl text-gray-900 mb-1">{card.title}</h3>
                            <p className="text-3xl text-gray-900">{card.count}</p>
                            <p className="text-sm text-gray-600 mt-2">Ver todos →</p>
                        </button>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
