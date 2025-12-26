"use client";


import { useEffect, useRef, useState } from "react"
import {Canvas} from "@/Components/Canvas"
import {WS_URL} from "@/app/config"
import { useRouter } from "next/navigation";



export function RoomCanvas({ roomId }: { roomId: string }) {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();


    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
            // Redirect to signin if no token
            router.push("/signin");
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        }

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }

    }, [roomId, router])

    if (!socket) {
        return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>Connecting to server....</p>
            </div>
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}