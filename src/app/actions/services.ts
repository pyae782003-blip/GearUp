'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllServices() {
    try {
        const services = await prisma.service.findMany({
            where: { active: true },
            orderBy: { createdAt: 'asc' }
        })

        return {
            success: true,
            services: services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                icon: s.icon,
                price: s.price,
                features: JSON.parse(s.features)
            }))
        }
    } catch (error) {
        console.error('Error fetching services:', error)
        return { success: false, error: 'Failed to fetch services', services: [] }
    }
}

export async function createService(data: {
    name: string
    description: string
    icon: string
    price: number
    features: string[]
}) {
    try {
        await prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                price: data.price,
                features: JSON.stringify(data.features)
            }
        })
        revalidatePath('/admin/services')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating service:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to create service' }
    }
}

export async function updateService(id: string, data: {
    name: string
    description: string
    icon: string
    price: number
    features: string[]
}) {
    try {
        await prisma.service.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                price: data.price,
                features: JSON.stringify(data.features)
            }
        })
        revalidatePath('/admin/services')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error updating service:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update service' }
    }
}

export async function deleteService(id: string) {
    try {
        // Hard delete
        await prisma.service.delete({
            where: { id }
        })
        revalidatePath('/admin/services')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting service:', error)
        return { success: false, error: 'Failed to delete service' }
    }
}

export async function getAllServicesAdmin() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: 'asc' }
        })

        return {
            success: true,
            services: services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                icon: s.icon,
                price: s.price,
                features: JSON.parse(s.features),
                active: s.active
            }))
        }
    } catch (error) {
        console.error('Error fetching services:', error)
        return { success: false, error: 'Failed to fetch services', services: [] }
    }
}
