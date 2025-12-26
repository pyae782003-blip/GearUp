'use client'

import { useState } from 'react'
import { deleteService } from '@/app/actions/services'
import { useRouter } from 'next/navigation'
import ServiceForm from './ServiceForm'

interface Service {
    id: string
    name: string
    description: string
    icon: string
    price: number
    features: string[]
    active: boolean
}

interface ServicesTableProps {
    services: Service[]
    onUpdate?: () => void
}

export default function ServicesTable({ services, onUpdate }: ServicesTableProps) {
    const router = useRouter()
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, id: string, name: string } | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteModal({ show: true, id, name })
    }

    const confirmDelete = async () => {
        if (!deleteModal) return

        setIsDeleting(true)
        try {
            await deleteService(deleteModal.id)
            if (onUpdate) onUpdate()
            router.refresh()
            setDeleteModal(null)
        } catch (error) {
            console.error('Failed to delete service:', error)
            alert('Failed to delete service')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Icon</th>
                            <th className="text-left py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Name</th>
                            <th className="text-left py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Description</th>
                            <th className="text-left py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Price</th>
                            <th className="text-left py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</th>
                            <th className="text-right py-4 px-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-slate-500">
                                    No services found. Create your first service to get started.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="text-3xl">{service.icon}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-900 font-medium">{service.name}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-500 text-sm line-clamp-2">{service.description}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-900 font-bold">{service.price.toLocaleString()} MMK</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {service.active ? (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setEditingService(service)
                                                    setShowForm(true)
                                                }}
                                                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-medium border border-slate-200 shadow-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(service.id, service.name)}
                                                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 rounded-lg transition-colors text-sm font-medium border border-red-200 shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ServiceForm
                    service={editingService || undefined}
                    onClose={() => {
                        setShowForm(false)
                        setEditingService(null)
                        if (onUpdate) onUpdate()
                    }}
                />
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Service</h3>
                        <p className="text-white/70 mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deleteModal.name}"</span>?
                            <br />
                            <span className="text-red-400 text-sm mt-2 block">This action cannot be undone.</span>
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
