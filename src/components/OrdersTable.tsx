'use client'

import { useState } from 'react'
import { updateOrderStatus, deleteOrder, updateOrder } from '@/app/actions/orders'
import { services } from '@/lib/services'

interface Order {
    id: string
    service: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    projectDetails: string
    status: string
    createdAt: Date
    paymentSlip: string | null
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)
    const [viewingPayment, setViewingPayment] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        projectDetails: '',
        service: ''
    })

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        await updateOrderStatus(orderId, newStatus)
    }

    const handleDelete = async (orderId: string) => {
        if (confirm('Are you sure you want to delete this order?')) {
            await deleteOrder(orderId)
        }
    }

    const openEditModal = (order: Order) => {
        setEditingOrder(order)
        setEditForm({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone || '',
            projectDetails: order.projectDetails,
            service: order.service
        })
    }

    const handleEditSubmit = async () => {
        if (!editingOrder) return

        await updateOrder(editingOrder.id, {
            customerName: editForm.customerName,
            customerEmail: editForm.customerEmail,
            customerPhone: editForm.customerPhone || undefined,
            projectDetails: editForm.projectDetails,
            service: editForm.service
        })
        setEditingOrder(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            case 'IN_PROGRESS':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
            case 'COMPLETED':
                return 'bg-green-500/20 text-green-400 border-green-500/50'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
        }
    }

    const getServiceName = (serviceId: string) => {
        return services.find(s => s.id === serviceId)?.name || serviceId
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-white/60 text-lg">No orders yet</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Customer</th>
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Service</th>
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Payment</th>
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Status</th>
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Date</th>
                            <th className="text-left py-4 px-4 text-white/80 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="text-white font-medium">{order.customerName}</p>
                                        <p className="text-white/60 text-sm">{order.customerEmail}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-white">{getServiceName(order.service)}</td>
                                <td className="py-4 px-4">
                                    {order.paymentSlip ? (
                                        <button
                                            onClick={() => setViewingPayment(order.paymentSlip)}
                                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm flex items-center gap-1"
                                        >
                                            <span>💳</span> View Slip
                                        </button>
                                    ) : (
                                        <span className="text-white/40 text-sm">No payment</span>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)} bg-transparent cursor-pointer`}
                                    >
                                        <option value="PENDING" className="bg-slate-800">Pending</option>
                                        <option value="IN_PROGRESS" className="bg-slate-800">In Progress</option>
                                        <option value="COMPLETED" className="bg-slate-800">Completed</option>
                                    </select>
                                </td>
                                <td className="py-4 px-4 text-white/60 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(order)}
                                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-white mb-6">Edit Order</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2">Customer Name</label>
                                <input
                                    type="text"
                                    value={editForm.customerName}
                                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Customer Email</label>
                                <input
                                    type="email"
                                    value={editForm.customerEmail}
                                    onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Customer Phone</label>
                                <input
                                    type="tel"
                                    value={editForm.customerPhone}
                                    onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Service</label>
                                <select
                                    value={editForm.service}
                                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                >
                                    {services.map(s => (
                                        <option key={s.id} value={s.id} className="bg-slate-800">{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Project Details</label>
                                <textarea
                                    value={editForm.projectDetails}
                                    onChange={(e) => setEditForm({ ...editForm, projectDetails: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleEditSubmit}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingOrder(null)}
                                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Slip Viewing Modal */}
            {viewingPayment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingPayment(null)}>
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full border border-white/10 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Payment Slip</h3>
                            <button
                                onClick={() => setViewingPayment(null)}
                                className="text-white/60 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg">
                            <img
                                src={viewingPayment}
                                alt="Payment slip"
                                className="max-w-full h-auto mx-auto rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <a
                                href={viewingPayment}
                                download="payment-slip.png"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center"
                            >
                                Download
                            </a>
                            <button
                                onClick={() => setViewingPayment(null)}
                                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
