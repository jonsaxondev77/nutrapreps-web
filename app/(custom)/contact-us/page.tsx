'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { useSendContactFormMutation } from '@/lib/store/services/contactApi';
import { FaWhatsapp, FaEnvelope, FaQuestionCircle, FaUser, FaTag, FaPencilAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactUsPage = () => {
    // Get the mutation function from the RTK Query hook
    const [sendContactForm, { isLoading }] = useSendContactFormMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
    });

    // The onSubmit handler calls the mutation
    const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
        toast.promise(
            sendContactForm(data).unwrap(), // This triggers the API call
            {
                loading: 'Sending your message...',
                success: (response) => {
                    reset(); // Clear the form on success
                    return response.message || 'Message sent successfully!';
                },
                error: (err) => err.data?.message || 'Failed to send message. Please try again.',
            }
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
                    <p className="text-lg text-gray-600 mt-2">We&apos;re here to help. How can we assist you today?</p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* WhatsApp Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
                        <FaWhatsapp className="text-5xl text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                        <p className="text-gray-600 mb-4">Scan the QR code to chat with us directly.</p>
                        <div className="w-40 h-40">
                             <Image
                                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://wa.me/+447469878640"
                                alt="WhatsApp QR Code"
                                width={160}
                                height={160}
                            />
                        </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
                        <FaEnvelope className="text-5xl text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                        <p className="text-gray-600 mb-4">Get in touch via email for any inquiries.</p>
                        <a href="mailto:info@nutrapreps.co.uk" className="text-blue-600 font-semibold hover:underline">
                            info@nutrapreps.co.uk
                        </a>
                    </div>

                    {/* FAQs Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
                        <FaQuestionCircle className="text-5xl text-purple-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">FAQs</h3>
                        <p className="text-gray-600 mb-4">Have a question? Check our FAQs for a quick answer.</p>
                        <Link href="/faqs" className="text-purple-600 font-semibold hover:underline">
                            Visit FAQs
                        </Link>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Send us a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Input */}
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input {...register('name')} placeholder="Your Name" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input {...register('email')} placeholder="Your Email" type="email" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        {/* Subject Input */}
                        <div className="relative">
                            <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input {...register('subject')} placeholder="Subject" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                        </div>
                        {/* Message Textarea */}
                        <div className="relative">
                             <FaPencilAlt className="absolute left-4 top-5 text-gray-400" />
                            <textarea {...register('message')} placeholder="Your Message" rows={5} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                        </div>
                        {/* Submit Button */}
                        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400">
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;

