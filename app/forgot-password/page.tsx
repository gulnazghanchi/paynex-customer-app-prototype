"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, Store, Bus, ShoppingCart, ArrowRight, ArrowLeft, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add reset logic here in future
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
            src={isSent ? "/ic_message_sent.png" : "/ic_fp_first.png"}
            alt="Forgot Password Graphic"
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
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-white">
        
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex justify-center">
          <Image src="/logo-light.svg" alt="PayneX Logo" width={160} height={48} priority style={{ width: "auto", height: "auto" }} />
        </div>

        {/* Form Container */}
        <div className="max-w-[420px] w-full mx-auto flex flex-col justify-center flex-1">
          {isSent ? (
            <div className="flex flex-col text-left">
              <h1 className="text-[32px] font-bold mb-4 tracking-tight text-gray-900">Check your Email</h1>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-medium text-gray-700">{email || 'user.name@gmail.com'}</span>
                <button onClick={() => setIsSent(false)} className="text-[13px] text-blue-600 hover:underline font-medium">Change</button>
              </div>

              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                We've sent a secure password reset link to your email address.
                <br/>
                Please click the link to create a new password.
              </p>
              
              <p className="text-gray-500 text-[13px] leading-relaxed mb-10">
                Check your spam or junk folder if you don't see the email.
              </p>

              <Link href="/">
                <Button
                  type="button"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all mb-6"
                >
                  Back to Login
                </Button>
              </Link>

              <p className="text-center text-xs text-gray-500">
                Didn't receive the email? <button className="text-blue-600 hover:underline font-medium" onClick={handleReset}>Resend link</button>
              </p>
            </div>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:underline font-medium mb-10 w-fit">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
              
              <h1 className="text-[32px] font-bold mb-3 tracking-tight text-gray-900">Forgot password?</h1>
              <p className="text-gray-500 mb-10 text-sm leading-relaxed">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>

              <form className="space-y-6" onSubmit={handleReset}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 text-sm"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : null}
                  {isLoading ? "Sending..." : "Send Reset Link"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Security Message at bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-center text-xs text-gray-500 px-8">
          <Info className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <p>Your data is secure with enterprise-grade encryption and PCI compliance</p>
        </div>
      </div>
    </div>
  );
}
