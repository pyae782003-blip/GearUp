import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getAllOrders } from "@/app/actions/orders"
import OrdersTable from "@/components/OrdersTable"
import { signOut } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin?callbackUrl=/admin')
    }

    const result = await getAllOrders()
    const orders = result.orders || []

    return (
        <div className="min-h-screen bg-[#F0F2F4]">
            {/* Header */}
            <header className="border-b border-slate-200 backdrop-blur-sm bg-white/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-slate-500 text-sm">Manage your service orders</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/services"
                                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-lg transition-colors border border-slate-200 font-medium shadow-sm"
                            >
                                Manage Services
                            </Link>
                            <span className="text-slate-600">Welcome, {session.user?.email}</span>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 text-sm mb-2 font-medium uppercase tracking-wider">Total Orders</p>
                        <p className="text-4xl font-bold text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 text-sm mb-2 font-medium uppercase tracking-wider">Pending</p>
                        <p className="text-4xl font-bold text-yellow-600">
                            {orders.filter((o: any) => o.status === 'PENDING').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 text-sm mb-2 font-medium uppercase tracking-wider">In Progress</p>
                        <p className="text-4xl font-bold text-blue-600">
                            {orders.filter((o: any) => o.status === 'IN_PROGRESS').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 text-sm mb-2 font-medium uppercase tracking-wider">Completed</p>
                        <p className="text-4xl font-bold text-green-600">
                            {orders.filter((o: any) => o.status === 'COMPLETED').length}
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-900">All Orders</h2>
                    </div>
                    <div className="p-6">
                        <OrdersTable orders={orders} />
                    </div>
                </div>
            </main>
        </div>
    )
}
