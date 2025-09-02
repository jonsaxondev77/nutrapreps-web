'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { Phone, Mail, HelpCircle, User, Type, MessageSquare, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Reusable card component for contact options
const ContactCard = ({ icon: Icon, title, children, href }: { icon: React.ElementType, title: string, children: React.ReactNode, href?: string }) => {
  const CardContent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-600 text-sm flex-grow flex flex-col justify-center">{children}</div>
    </div>
  );

  // If an href is provided, wrap the card in a Link component
  if (href) {
    return <Link href={href} className="block h-full"><CardContent /></Link>;
  }
  return <CardContent />;
};


const ContactUsPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    // TODO: Implement backend API call to send the contact form data.
    // The current implementation only logs the data to the console.
    console.log('Contact form submitted:', data);
    
    // Simulate an API call with a promise
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.promise(promise, {
        loading: 'Sending message...',
        success: () => {
            reset(); // Clear the form on success
            return 'Message sent successfully! We will get back to you shortly.';
        },
        error: 'Failed to send message. Please try again later.',
    });
  };

  return (
    <div className="flex-grow bg-gray-50">
        <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">We're here to help. Contact us through any of the channels below.</p>
        </div>

        {/* Contact Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ContactCard icon={Phone} title="WhatsApp">
                <p className="mb-4">Scan the QR code to chat with us directly on WhatsApp for a quick response.</p>
                <div className="flex justify-center">
                    <Image 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/+447469878640" 
                        alt="WhatsApp QR Code"
                        width={150}
                        height={150}
                    />
                </div>
            </ContactCard>
            <ContactCard icon={Mail} title="Email Us">
                <p className="mb-4">For detailed inquiries, email is the best way to reach us. We'll get back to you within 24 hours.</p>
                <a href="mailto:info@nutrapreps.com" className="font-semibold text-green-600 hover:underline break-all">info@nutrapreps.com</a>
            </ContactCard>
            <ContactCard icon={HelpCircle} title="FAQs" href="/faqs">
                 <p>Have a question? Our FAQ page is filled with answers to common inquiries about our service, meals, and delivery.</p>
                 <span className="mt-auto pt-4 font-semibold text-green-600 hover:underline">Visit FAQs</span>
            </ContactCard>
        </div>
        
        {/* Contact Form Section */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Send us a Message</h2>
                <p className="mt-2 text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="name" {...register('name')} className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="email" id="email" {...register('email')} className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>
                 <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" id="subject" {...register('subject')} className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                    </div>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                 <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <div className="relative">
                         <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea id="message" {...register('message')} rows={5} className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"></textarea>
                    </div>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <div className="text-right">
                    <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

