import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download, ArrowRight, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <header className="relative">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 rounded-full text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Now with AI-powered drawing assistance</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 mb-6">
              Collaborative
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                Whiteboarding
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="mx-auto mt-8 max-w-3xl text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Create stunning diagrams and sketches with your team in real-time.
              <span className="block mt-3 font-medium text-gray-800">Simple. Powerful. Free.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signin">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <span>Start in seconds</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                collaborate seamlessly
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for teams who want to create together
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {/* Card 1 */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Collaboration</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Work together with your team instantly. Share your drawings with a simple link and watch changes happen live.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                  <Users2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiplayer Editing</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Multiple users can edit simultaneously. See live cursors and presence indicators showing who's working where.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-pink-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg group-hover:shadow-pink-500/50 group-hover:scale-110 transition-all duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Drawing</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                AI-powered shape recognition and drawing assistance helps you create pixel-perfect diagrams effortlessly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto overflow-hidden">
            {/* Beautiful gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700"></div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
            
            {/* Content */}
            <div className="relative z-10 px-8 sm:px-16 py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
                  Ready to start creating?
                </h2>
                <p className="text-xl md:text-2xl text-white/95 leading-relaxed mb-12 font-light">
                  Join thousands of users who are already creating amazing diagrams and sketches. Start your creative journey today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <Link href="/canvas">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="bg-white text-indigo-600 hover:bg-gray-50 hover:scale-105 w-full sm:w-auto min-w-[200px] text-lg font-semibold shadow-xl group"
                    >
                      Open Canvas
                      <Pencil className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/gallery">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto min-w-[200px] text-lg font-semibold hover:scale-105 transition-all"
                    >
                      View Gallery
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="text-center sm:text-left">
              <h3 className="text-gray-900 font-bold text-2xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excalidraw Clone
              </h3>
              <p className="text-sm text-gray-500">
                © 2024 All rights reserved. Built with ❤️ .
              </p>
            </div>
            <div className="flex space-x-8">
              <a 
                href="https://github.com/imshubham07" 
                className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-125"
                aria-label="GitHub"
              >
                <Github className="h-7 w-7" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-125"
                aria-label="Download"
              >
                <Download className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}