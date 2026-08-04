"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Store, Bus, ShoppingCart, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.paynex.world/v1/merchant/auth/login", {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "paynex-mode": "Test"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("paynexToken", data.session.accessToken);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans bg-white text-zinc-950">
      {/* Left Panel (Visual Graphic & Trusted By) */}
      <div className="hidden lg:flex flex-col w-full lg:w-1/2 bg-[#f4f4f5] relative p-8 md:p-12">
        {/* Logo at top left */}
        <div className="absolute top-12 left-12">
          <Image src="/logo-light.svg" alt="PayneX Logo" width={110} height={32} priority style={{ width: 110, height: "auto" }} />
        </div>

        {/* Center Graphic */}
        <div className="flex-1 flex items-center justify-center mt-12 mb-4 relative w-full">
          <Image
            src="/login-dashboard-new.png"
            alt="PayneX Platform Overview"
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
          <Image src="/logo-light.svg" alt="PayneX Logo" width={120} height={36} priority style={{ width: 120, height: "auto" }} />
        </div>

        {/* Form Container */}
        <div className="max-w-[420px] w-full mx-auto flex flex-col justify-center flex-1">
          <h1 className="text-[32px] font-bold mb-2 tracking-tight text-gray-900">Login to your account</h1>
          <p className="text-gray-500 mb-10 text-sm">
            Enter your email below to login to your Paynex account.
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white pl-10 pr-10 text-sm"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot Password?</Link>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : null}
              {isLoading ? "Logging in..." : "Login"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Or Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-xs text-gray-400">Or</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Don't have an account? <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact us</Link>
          </p>
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

