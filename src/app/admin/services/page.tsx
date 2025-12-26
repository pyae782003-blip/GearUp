'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { getAllServicesAdmin } from "@/app/actions/services"
import ServicesTable from "@/components/ServicesTable"
import ServiceForm from "@/components/ServiceForm"
import Link from "next/link"

export default function AdminServicesPage() {
    const { data: session, status } = useSession()
    const [services, setServices] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/auth/signin?callbackUrl=/admin/services')
        }
    }, [status])

    useEffect(() => {
        loadServices()
    }, [])

    const loadServices = async () => {
        setLoading(true)
        const result = await getAllServicesAdmin()
        setServices(result.services || [])
        setLoading(false)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F0F2F4]">
            {/* Header */}
            <header className="border-b border-slate-200 backdrop-blur-sm bg-white/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm mb-2 inline-block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900">Manage Services</h1>
                            <p className="text-slate-500 text-sm">Create, edit, and manage your service offerings</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">All Services</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 shadow-sm transition-all text-sm"
                        >
                            + Add New Service
                        </button>
                    </div>
                    <div className="p-0">
                        <ServicesTable services={services} onUpdate={loadServices} />
                    </div>
                </div>
            </main>

            {showForm && (
                <ServiceForm
                    onClose={() => {
                        setShowForm(false)
                        loadServices()
                    }}
                />
            )}
        </div>
    )
}
