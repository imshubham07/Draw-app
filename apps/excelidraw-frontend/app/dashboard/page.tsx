"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/app/config";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Plus, LogOut, Loader2, Sparkles, Users2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();
    const [roomName, setRoomName] = useState("");
    const [roomSlug, setRoomSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleCreateRoom = async () => {
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${HTTP_BACKEND}/room`,
                { name: roomName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.roomId) {
                // Get the room slug
                const roomResponse = await axios.get(`${HTTP_BACKEND}/room/${roomName.toLowerCase().replace(/\s+/g, "-")}`);
                if (roomResponse.data.room) {
                    router.push(`/canvas/${roomResponse.data.room.id}`);
                }
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create room. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.get(`${HTTP_BACKEND}/room/${roomSlug}`);
            if (response.data.room) {
                router.push(`/canvas/${response.data.room.id}`);
            } else {
                setError("Room not found");
            }
        } catch (err: any) {
            setError("Room not found or does not exist");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (!isAuthenticated) {
        return (
            <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>
                <div className="text-center relative z-10">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-400" />
                    <p className="mt-4 text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
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
            />

            {/* Header */}
            <header className="bg-white/10 backdrop-blur-xl border-b-2 border-white/20 sticky top-0 z-50 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-md border-2 border-blue-400/30 rounded-xl flex items-center justify-center group-hover:border-blue-400/60 transition-all">
                                <Sparkles className="w-7 h-7 text-blue-400" />
                            </div>
                            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                DrawApp
                            </span>
                        </Link>
                        <Button 
                            onClick={handleLogout} 
                            className="gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-2 border-red-400/30 hover:border-red-400/60 backdrop-blur-md transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border-2 border-blue-400/30 text-blue-300 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 mr-2" />
                            DASHBOARD
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
                            Welcome to Your
                            <span className="block text-blue-400 mt-2">
                                Creative Space
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            Create a new room or join an existing one to start collaborating in real-time
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-md border-2 border-red-400/30 text-red-300 rounded-xl text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Create Room Card */}
                        <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/20 backdrop-blur-md border-2 border-blue-400/30 rounded-xl group-hover:border-blue-400/60 transition-all">
                                    <Plus className="w-7 h-7 text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Create Room</h2>
                            </div>
                            <p className="text-gray-300 mb-6 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                Start a new collaborative whiteboard session
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                        Room Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="My Awesome Project"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400/60 outline-none transition-all"
                                        style={{ fontFamily: 'Comic Sans MS, cursive' }}
                                    />
                                </div>
                                <Button
                                    onClick={handleCreateRoom}
                                    disabled={!roomName.trim() || loading}
                                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-2 border-blue-400/30 hover:border-blue-400/60 backdrop-blur-md font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 mr-2" />
                                            Create Room
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {/* Join Room Card */}
                        <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/20 backdrop-blur-md border-2 border-purple-400/30 rounded-xl group-hover:border-purple-400/60 transition-all">
                                    <Pencil className="w-7 h-7 text-purple-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Join Room</h2>
                            </div>
                            <p className="text-gray-300 mb-6 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                Enter a room slug to join an existing session
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                        Room Slug
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="my-awesome-project"
                                        value={roomSlug}
                                        onChange={(e) => setRoomSlug(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400/60 outline-none transition-all"
                                        style={{ fontFamily: 'Comic Sans MS, cursive' }}
                                    />
                                </div>
                                <Button
                                    onClick={handleJoinRoom}
                                    disabled={!roomSlug.trim() || loading}
                                    className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-2 border-purple-400/30 hover:border-purple-400/60 backdrop-blur-md font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        <>
                                            <Pencil className="w-5 h-5 mr-2" />
                                            Join Room
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-green-400/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/20 backdrop-blur-md border-2 border-green-400/30 rounded-xl">
                                    <Users2 className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Active Users</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>2.5K+</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-yellow-400/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/20 backdrop-blur-md border-2 border-yellow-400/30 rounded-xl">
                                    <Clock className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Uptime</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>99.9%</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-500/20 backdrop-blur-md border-2 border-pink-400/30 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Rooms Created</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>15K+</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Info Section */}
                    <Card className="p-8 bg-white/10 backdrop-blur-xl border-2 border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            <Sparkles className="w-6 h-6 text-blue-400" />
                            Quick Tips
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                <p className="text-gray-300 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                    Room names are converted to URL-friendly slugs automatically
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                <p className="text-gray-300 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                    Share the room slug with your team to collaborate
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                <p className="text-gray-300 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                    All changes are synced in real-time across all participants
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                                <p className="text-gray-300 text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                                    Your drawings are automatically saved to the cloud
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
