"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/app/config";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            if (isSignin) {
                // Sign in
                const response = await axios.post(`${HTTP_BACKEND}/signin`, {
                    username: email,
                    password: password
                });

                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                    router.push("/dashboard");
                }
            } else {
                // Sign up
                const response = await axios.post(`${HTTP_BACKEND}/signup`, {
                    username: email,
                    password: password,
                    name: name
                });

                if (response.data.userId) {
                    // After signup, automatically sign in
                    const signinResponse = await axios.post(`${HTTP_BACKEND}/signin`, {
                        username: email,
                        password: password
                    });

                    if (signinResponse.data.token) {
                        localStorage.setItem("token", signinResponse.data.token);
                        router.push("/dashboard");
                    }
                }
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Animated Background Elements - Reduced for performance */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Grid Pattern Overlay - Optimized */}
            <div 
                className="absolute inset-0 opacity-5 pointer-events-none" 
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            ></div>

            <div className="relative flex min-h-screen">
                {/* Left Side - Branding & Info */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative">
                    {/* Logo */}
                    <Link href="/" className="absolute top-8 left-8">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                DrawApp
                            </span>
                        </div>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Create.
                            <br />
                            Collaborate.
                            <br />
                            <span className="text-blue-400">
                                Innovate.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                            Join thousands of teams using DrawApp for real-time collaboration.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-6">
                        {[
                            "Real-time collaboration",
                            "Infinite canvas",
                            "Simple drawing tools",
                            "Free forever"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-gray-300 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex justify-center mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    DrawApp
                                </span>
                            </div>
                        </Link>

                        {/* Auth Card */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {isSignin ? "Welcome back" : "Get started"}
                                </h2>
                                <p className="text-gray-300">
                                    {isSignin
                                        ? "Sign in to continue your creative journey"
                                        : "Create your free account in seconds"}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-red-200 text-sm">{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <div className="space-y-5">
                                {!isSignin && (
                                    <div>
                                        <label className="block text-sm font-bold text-white mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {isSignin && (
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                                Remember me
                                            </span>
                                        </label>
                                        <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            {isSignin ? "Sign in" : "Create account"}
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-300">
                                    {isSignin ? "Don't have an account? " : "Already have an account? "}
                                    <Link 
                                        href={isSignin ? "/signup" : "/signin"} 
                                        className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                                    >
                                        {isSignin ? "Sign up for free" : "Sign in"}
                                    </Link>
                                </p>
                            </div>

                            {/* Divider with Social Proof */}
                            {!isSignin && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-center text-sm text-gray-400">
                                        Join 10,000+ teams creating with DrawApp 🚀
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Back to Home */}
                        <div className="mt-6 text-center">
                            <Link 
                                href="/" 
                                className="text-gray-400 hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2"
                            >
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}