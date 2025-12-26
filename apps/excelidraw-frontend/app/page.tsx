import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download, ArrowRight, Zap, Shield, Lock, Cloud, Palette, MessageSquare, Layers, Code2, Trophy, Star, Menu, X, CheckCircle, Rocket, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Navigation Bar */}
      <nav className="relative top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DrawApp
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/signin" className="text-gray-300 hover:text-white font-medium text-sm transition-colors px-3 py-2 hover:bg-white/10 rounded-md">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold px-6 py-2 text-sm rounded-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              {/* Badge */}
              <div className="flex justify-center animate-fadeInUp">
                <div className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-gray-200 rounded-full text-sm font-medium shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>Trusted by 10,000+ users worldwide</span>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="text-center space-y-4 animate-fadeInUp">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                  Collaborate.
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                  Create.
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-blue-400 leading-tight">
                  Innovate.
                </h1>
              </div>
              
              {/* Subheading */}
              <p className="text-center mx-auto max-w-3xl text-xl md:text-2xl text-gray-300 leading-relaxed animate-fadeInUp">
                The most intuitive collaborative whiteboard for teams who want to{" "}
                <span className="text-white font-semibold">visualize ideas</span> and{" "}
                <span className="text-white font-semibold">work together</span> in real-time.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex justify-center pt-4 animate-fadeInUp">
                <Link href="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-all px-10 py-5 text-lg font-semibold rounded-xl flex items-center gap-3 group shadow-xl hover:shadow-2xl hover:shadow-blue-500/50">
                    Start Creating Free
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-12 pt-8 animate-fadeInUp">
                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-400/50 transition-all">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">Free Forever</span>
                </div>
                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-400/50 transition-all">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">No Credit Card</span>
                </div>
                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-400/50 transition-all">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">Setup in 2 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to
              <span className="block text-blue-400 mt-2">
                create together
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Powerful features designed for modern teams
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Card 1 */}
            <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-blue-400/50 transition-all duration-300 rounded-3xl">
              <div className="mb-5">
                <div className="inline-flex p-3 rounded-xl bg-blue-600">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Sync</h3>
              <p className="text-gray-300 leading-relaxed">
                Watch changes happen instantly as your team collaborates.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-teal-400/50 transition-all duration-300 rounded-3xl">
              <div className="mb-5">
                <div className="inline-flex p-3 rounded-xl bg-teal-600">
                  <Users2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multiplayer Magic</h3>
              <p className="text-gray-300 leading-relaxed">
                See live cursors and presence indicators in real-time.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-purple-400/50 transition-all duration-300 rounded-3xl">
              <div className="mb-5">
                <div className="inline-flex p-3 rounded-xl bg-purple-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Simple & Powerful</h3>
              <p className="text-gray-300 leading-relaxed">
                Intuitive tools help you create perfect diagrams effortlessly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
                Join thousands of teams creating better together. Start for free, no credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-all px-8 py-4 text-base font-semibold rounded-xl shadow-lg flex items-center gap-2 group">
                    Start Creating Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="px-8 py-4 text-base font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-colors rounded-xl">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DrawApp
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Simple, powerful whiteboard for teams.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 DrawApp. Built with ❤️ by{" "}
              <a 
                href="https://github.com/imshubham07" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                @imshubham07
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}