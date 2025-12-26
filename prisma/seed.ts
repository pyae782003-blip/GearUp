import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const services = [
        {
            name: 'Logo & Branding',
            description: 'Professional logo design and complete brand identity packages',
            icon: '🎨',
            price: 299.00,
            features: JSON.stringify(['Custom Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography Selection'])
        },
        {
            name: 'Presentation Slides',
            description: 'Engaging presentation decks that captivate your audience',
            icon: '📊',
            price: 149.00,
            features: JSON.stringify(['Custom Templates', 'Data Visualization', 'Professional Design', 'Unlimited Revisions'])
        },
        {
            name: 'CV Form',
            description: 'Modern, ATS-friendly CV designs that get you noticed',
            icon: '📄',
            price: 49.00,
            features: JSON.stringify(['ATS Optimization', 'Modern Layouts', 'Professional Formatting', '2 Revisions'])
        },
        {
            name: 'AI Character',
            description: 'Unique AI-generated characters for your brand or project',
            icon: '🤖',
            price: 79.00,
            features: JSON.stringify(['Custom AI Art', 'Multiple Variations', 'High Resolution', 'Commercial Rights'])
        },
        {
            name: 'AI Video Ads',
            description: 'Cutting-edge AI-powered video advertisements',
            icon: '🎬',
            price: 399.00,
            features: JSON.stringify(['AI Video Generation', 'Script Writing', 'Voiceover', 'Music & SFX'])
        }
    ]

    const existingCount = await prisma.service.count()

    if (existingCount === 0) {
        for (const service of services) {
            await prisma.service.create({
                data: service
            })
        }
        console.log('Services seeded successfully!')
    } else {
        console.log('Services already exist, skipping seed')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
