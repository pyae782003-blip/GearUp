'use client'

import { useState, useEffect, Suspense } from 'react'
import { getOrderByIdOrEmail } from '@/app/actions/orders'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function TrackingContent() {
    const searchParams = useSearchParams()
    const orderIdFromUrl = searchParams.get('orderId')

    const [searchTerm, setSearchTerm] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [showSuccessBanner, setShowSuccessBanner] = useState(false)

    useEffect(() => {
        if (orderIdFromUrl) {
            setSearchTerm(orderIdFromUrl)
            setShowSuccessBanner(true)
            // Auto-search
            performSearch(orderIdFromUrl)
        }
    }, [orderIdFromUrl])

    const performSearch = async (term: string) => {
        setLoading(true)
        setSearched(true)

        const result = await getOrderByIdOrEmail(term)
        if (result.success) {
            setOrders(result.orders)
        } else {
            setOrders([])
        }

        setLoading(false)
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        performSearch(searchTerm)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'IN_PROGRESS':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'COMPLETED':
                return 'bg-green-50 text-green-700 border-green-200'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="min-h-screen bg-[#F0F2F4] py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center mb-6">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Track Your Order</h1>
                    <p className="text-slate-600">Enter your order ID or email address to check your order status</p>
                </div>

                {/* Success Banner */}
                {showSuccessBanner && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✅</span>
                            <div>
                                <h3 className="text-xl font-semibold text-green-800">Order Submitted Successfully!</h3>
                                <p className="text-green-700">Your order has been received. Track your order status below.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Form */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter Order ID or Email"
                            required
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-sm transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Results */}
                {searched && (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
                                <p className="text-slate-500 text-lg">No orders found</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{order.service}</h3>
                                            <p className="text-slate-500 text-sm">Order ID: {order.id}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-slate-500 text-sm mb-1">Customer Name</p>
                                            <p className="text-slate-900">{order.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-sm mb-1">Email</p>
                                            <p className="text-slate-900">{order.customerEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-sm mb-1">Order Date</p>
                                            <p className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-sm mb-1">Last Updated</p>
                                            <p className="text-slate-900">{new Date(order.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-slate-500 text-sm mb-2">Project Details</p>
                                        <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{order.projectDetails}</p>
                                    </div>

                                    {/* Status Timeline */}
                                    <div className="border-t border-slate-200 pt-6">
                                        <p className="text-slate-500 text-sm mb-4">Order Progress</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-1 text-center ${order.status !== 'PENDING' ? 'opacity-50' : ''}`}>
                                                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${order.status === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                    1
                                                </div>
                                                <p className="text-slate-500 text-xs">Pending</p>
                                            </div>
                                            <div className="flex-1 h-1 bg-slate-200" />
                                            <div className={`flex-1 text-center ${order.status !== 'IN_PROGRESS' ? 'opacity-50' : ''}`}>
                                                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${order.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                    2
                                                </div>
                                                <p className="text-slate-500 text-xs">In Progress</p>
                                            </div>
                                            <div className="flex-1 h-1 bg-slate-200" />
                                            <div className={`flex-1 text-center ${order.status !== 'COMPLETED' ? 'opacity-50' : ''}`}>
                                                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${order.status === 'COMPLETED' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                    3
                                                </div>
                                                <p className="text-slate-500 text-xs">Completed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F0F2F4] flex items-center justify-center">
                <div className="text-slate-900 text-xl">Loading...</div>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}
