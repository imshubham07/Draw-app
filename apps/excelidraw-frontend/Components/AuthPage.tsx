"use client"

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full max-w-md p-8 m-4 bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isSignin ? "Welcome back" : "Create account"}
                    </h1>
                    <p className="text-gray-600">
                        {isSignin
                            ? "Sign in to continue to your account"
                            : "Sign up to get started"}
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {isSignin && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    <button
                        onClick={() => { }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        {isSignin ? "Sign in" : "Create account"}
                    </button>
                </div>



                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    {isSignin ? "Don't have an account? " : "Already have an account? "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        {isSignin ? "Sign up" : "Sign in"}
                    </a>
                </p>
            </div>
        </div>
    )
}