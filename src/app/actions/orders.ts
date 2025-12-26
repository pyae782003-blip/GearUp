'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitOrder(formData: {
    service: string
    projectDetails: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    paymentSlip?: string
    projectFiles?: string
}) {
    try {
        const order = await prisma.order.create({
            data: {
                service: formData.service,
                projectDetails: formData.projectDetails,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                paymentSlip: formData.paymentSlip,
                projectFiles: formData.projectFiles,
                status: 'PENDING'
            }
        })

        return { success: true, orderId: order.id }
    } catch (error) {
        console.error('Error creating order:', error)
        return { success: false, error: 'Failed to create order' }
    }
}

export async function getOrderByIdOrEmail(search: string) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { id: search },
                    { customerEmail: search }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, orders }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return { success: false, error: 'Failed to fetch orders', orders: [] }
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Error updating order status:', error)
        return { success: false, error: 'Failed to update order status' }
    }
}

export async function deleteOrder(orderId: string) {
    try {
        await prisma.order.delete({
            where: { id: orderId }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Error deleting order:', error)
        return { success: false, error: 'Failed to delete order' }
    }
}

export async function updateOrder(orderId: string, data: {
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    projectDetails?: string
    service?: string
}) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Error updating order:', error)
        return { success: false, error: 'Failed to update order' }
    }
}

export async function getAllOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, orders }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return { success: false, error: 'Failed to fetch orders', orders: [] }
    }
}
