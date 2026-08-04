"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, Store, Bus, ShoppingCart, ArrowRight, ArrowLeft, User, Phone, HelpCircle, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add logic here in future
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans bg-white text-zinc-950">
      {/* Left Panel (Visual Graphic & Trusted By) */}
      <div className="hidden lg:flex flex-col w-full lg:w-1/2 bg-[#f4f4f5] relative p-8 md:p-12">
        {/* Logo at top left */}
        <div className="absolute top-12 left-12">
          <Image src="/logo-light.svg" alt="PayneX Logo" width={140} height={42} priority style={{ width: "auto", height: "auto" }} />
        </div>

        {/* Center Graphic */}
        <div className="flex-1 flex items-center justify-center mt-12 mb-4 relative w-full">
          <Image
            src="/ic_contact_us.png"
            alt="Contact Us Graphic"
            width={900}
            height={700}
            className="w-[115%] max-w-[115%] xl:w-[100%] xl:max-w-[100%] h-auto object-contain drop-shadow-sm"
            priority
          />
        </div>

        {/* Trusted Section at bottom */}
        <div className="w-full max-w-[85%] xl:max-w-[80%] mx-auto mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Trusted by Businesses Worldwide</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="flex justify-between items-start text-left">
            <div className="flex items-start gap-3">
              <Store className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Retail</p>
                <p className="text-xs text-gray-500">Seamless in-store payments</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bus className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Transit</p>
                <p className="text-xs text-gray-500">Contactless ticketing</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShoppingCart className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">E-Commerce</p>
                <p className="text-xs text-gray-500">Frictionless online checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-white overflow-y-auto">
        
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex justify-center">
          <Image src="/logo-light.svg" alt="PayneX Logo" width={160} height={48} priority style={{ width: "auto", height: "auto" }} />
        </div>

        {/* Form Container */}
        <div className="max-w-[460px] w-full mx-auto flex flex-col justify-center flex-1 py-10">
          {isSent ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-[32px] font-bold mb-4 tracking-tight text-gray-900">Message Sent</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
                Thank you for reaching out!<br />
                Our team will get back to you as soon as possible.
              </p>
              <Link href="/" className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:underline font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:underline font-medium mb-10 w-fit">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
              
              <h1 className="text-[32px] font-bold mb-2 tracking-tight text-gray-900">Contact us</h1>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                You can reach us anytime via <a href="mailto:hello@paynex.com" className="text-blue-600 hover:underline font-medium">hello@paynex.com</a>
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[13px] font-medium text-gray-700">First Name*</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        required
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-[13px]"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[13px] font-medium text-gray-700">Last Name*</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        required
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-[13px]"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">Email*</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-[13px]"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[13px] font-medium text-gray-700">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone no."
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-[13px]"
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[13px] font-medium text-gray-700">Subject*</Label>
                  <div className="relative">
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we assist you?"
                      required
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-[13px]"
                    />
                    <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[13px] font-medium text-gray-700">Message*</Label>
                  <div className="relative">
                    <textarea
                      id="message"
                      placeholder="Briefly describe your inquiry..."
                      required
                      className="w-full min-h-[120px] rounded-xl border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 pr-4 py-3 text-[13px] resize-none"
                    />
                    <MessageSquare className="absolute left-3.5 top-3.5 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-fit min-w-[200px] h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : null}
                  {isLoading ? "Sending..." : "Send Message"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
