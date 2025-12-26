'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getAllServices } from '@/app/actions/services'
import { submitOrder } from '@/app/actions/orders'
import { fileToBase64 } from '@/lib/fileUtils'
import Link from 'next/link'

const orderSchema = z.object({
    service: z.string().min(1, 'Please select a service'),
    projectDetails: z.string().min(20, 'Please provide at least 20 characters describing your project'),
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    customerEmail: z.string().email('Please enter a valid email address'),
    customerPhone: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

function OrderForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedService = searchParams.get('service') || ''

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [paymentSlip, setPaymentSlip] = useState<string | null>(null)
    const [paymentPreview, setPaymentPreview] = useState<string | null>(null)
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadServices = async () => {
            const result = await getAllServices()
            setServices(result.services || [])
            setLoading(false)
        }
        loadServices()
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            service: preselectedService,
        },
    })

    const selectedService = watch('service')
    const selectedServiceData = services.find(s => s.id === selectedService)

    const handlePaymentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB')
                return
            }
            const base64 = await fileToBase64(file)
            setPaymentSlip(base64)
            setPaymentPreview(base64)
        }
    }

    const nextStep = async () => {
        let isValid = false
        if (currentStep === 1) {
            isValid = await trigger('service')
        } else if (currentStep === 2) {
            isValid = await trigger('projectDetails')
        } else if (currentStep === 3) {
            // Payment slip validation
            if (!paymentSlip) {
                alert('Please upload payment slip to continue')
                return
            }
            isValid = true
        } else if (currentStep === 4) {
            isValid = await trigger(['customerName', 'customerEmail', 'customerPhone'])
        }

        if (isValid) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    const onSubmit = async (data: OrderFormData) => {
        setIsSubmitting(true)
        const result = await submitOrder({
            ...data,
            paymentSlip: paymentSlip || undefined
        })
        setIsSubmitting(false)

        if (result.success) {
            // Redirect to tracking page with order ID
            router.push(`/track?orderId=${result.orderId}`)
        } else {
            alert('Failed to submit order. Please try again.')
        }
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-[#F0F2F4] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-12 text-center max-w-md border border-slate-200 shadow-xl">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Submitted!</h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for your order. We'll get back to you soon!
                    </p>
                    <p className="text-slate-500 text-sm">Redirecting to home page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F0F2F4] py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center mb-6">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Place Your Order</h1>
                    <p className="text-slate-600">Complete the form below to get started</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-xl mx-auto">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                                        : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 5 && (
                                    <div
                                        className={`w-8 h-1 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-slate-900' : 'bg-slate-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between max-w-xl mx-auto mt-2 text-xs text-slate-500">
                        <span>Service</span>
                        <span>Details</span>
                        <span>Payment</span>
                        <span>Contact</span>
                        <span>Review</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    {/* Step 1: Select Service */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Select a Service</h2>
                            {loading ? (
                                <div className="text-center text-white/60 py-8">Loading services...</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {services.map((service) => (
                                        <label
                                            key={service.id}
                                            className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 ${selectedService === service.id
                                                ? 'border-slate-900 bg-slate-50 shadow-md ring-1 ring-slate-900'
                                                : 'border-slate-200 bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={service.id}
                                                {...register('service')}
                                                className="sr-only"
                                            />
                                            <div className="text-4xl mb-2">{service.icon}</div>
                                            <h3 className="text-slate-900 font-semibold">{service.name}</h3>
                                            <p className="text-slate-500 text-sm mt-1">{service.description}</p>
                                            <p className="text-slate-900 font-bold text-lg mt-3">{service.price.toLocaleString()} MMK</p>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {errors.service && (
                                <p className="text-red-400 text-sm">{errors.service.message}</p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Project Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Details</h2>
                            <p className="text-slate-600 mb-6">Tell us about your project for: <span className="text-slate-900 font-bold">{selectedServiceData?.name}</span></p>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">
                                    Describe your project requirements
                                </label>
                                <textarea
                                    {...register('projectDetails')}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Please provide as much detail as possible about what you need..."
                                />
                                {errors.projectDetails && (
                                    <p className="text-red-400 text-sm mt-1">{errors.projectDetails.message}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment Slip Upload */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Payment Slip</h2>
                            <p className="text-slate-600 mb-6">Please upload proof of payment to proceed with your order</p>

                            {/* Payment Details */}
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                                    <span className="text-2xl mr-3">💳</span>
                                    Payment Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <span className="text-slate-500 w-32">Payment Method:</span>
                                        <span className="text-slate-900 font-semibold">KBZ Pay</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-slate-500 w-32">Account Number:</span>
                                        <span className="text-slate-900 font-mono text-lg font-bold">09895411035</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-slate-500 w-32">Account Name:</span>
                                        <span className="text-slate-900 font-semibold">Aye Aye Lwin</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-purple-100">
                                    <p className="text-slate-600 text-sm">📌 Please complete payment before uploading your payment slip</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">
                                    Payment Slip (Image) *
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePaymentUpload}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
                                />
                                <p className="text-slate-400 text-sm mt-2">Accepted formats: JPG, PNG, GIF (Max 5MB)</p>
                            </div>

                            {paymentPreview && (
                                <div className="mt-6">
                                    <p className="text-slate-600 text-sm mb-2">Preview:</p>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <img
                                            src={paymentPreview}
                                            alt="Payment slip preview"
                                            className="max-w-full h-auto max-h-96 mx-auto rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Contact Info */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    {...register('customerName')}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="John Doe"
                                />
                                {errors.customerName && (
                                    <p className="text-red-400 text-sm mt-1">{errors.customerName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    {...register('customerEmail')}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="john@example.com"
                                />
                                {errors.customerEmail && (
                                    <p className="text-red-400 text-sm mt-1">{errors.customerEmail.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    {...register('customerPhone')}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Your Order</h2>

                            <div className="bg-slate-50 rounded-lg p-6 space-y-4 border border-slate-200">
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Service</p>
                                    <p className="text-slate-900 font-semibold">{selectedServiceData?.name}</p>
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Project Details</p>
                                    <p className="text-slate-900">{watch('projectDetails')}</p>
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Payment Slip</p>
                                    <p className="text-green-600">✓ Uploaded</p>
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Contact</p>
                                    <p className="text-slate-900">{watch('customerName')}</p>
                                    <p className="text-slate-600 text-sm">{watch('customerEmail')}</p>
                                    {watch('customerPhone') && (
                                        <p className="text-slate-600 text-sm">{watch('customerPhone')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200"
                            >
                                Previous
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="ml-auto px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Order'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F0F2F4] flex items-center justify-center">
                <div className="text-slate-900 text-xl">Loading...</div>
            </div>
        }>
            <OrderForm />
        </Suspense>
    )
}
