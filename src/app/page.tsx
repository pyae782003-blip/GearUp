import Link from 'next/link'
import Image from 'next/image'
import { getAllServices } from '@/app/actions/services'
import Header from '@/components/Header'

export default async function HomePage() {
  const result = await getAllServices()
  const services = result.services || []

  return (
    <div className="min-h-screen bg-[#F0F2F4]">
      {/* Header */}
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left */}
          <div className="text-left space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Transform Your Vision Into Reality

            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Professional creative services powered by cutting-edge design and AI technology.
            </p>
            <div className="flex gap-4">
              <a
                href="#services"
                className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all duration-300 transform hover:scale-105"
              >
                Explore Services
              </a>
              <Link
                href="/track"
                className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-300"
              >
                Track Order
              </Link>
            </div>
          </div>

          {/* Image - Right */}
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20">
            <Image
              src="/hero-banner.png"
              alt="Services Overview"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">Our Services</h2>
        <p className="text-slate-600 text-center mb-12">Choose from our premium creative solutions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.name}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>

              <div className="mb-6 pt-6 border-t border-slate-100">
                <span className="text-3xl font-bold text-slate-900">
                  ${service.price.toFixed(2)}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature: string, idx: number) => (
                  <li key={idx} className="text-slate-600 text-sm flex items-center">
                    <span className="text-slate-900 mr-2 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/order?service=${service.id}`}
                className="block w-full text-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200"
              >
                Order Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-slate-900 rounded-2xl p-12 text-center shadow-xl shadow-slate-900/10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 text-lg">Choose a service and place your order in minutes</p>
          <a
            href="#services"
            className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-200 shadow-sm"
          >
            Browse Services
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-500">
          <p>&copy; 2025 GearUp Design Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
