"use client";


import { useEffect, useRef, useState } from "react"
import {Canvas} from "@/Components/Canvas"
import {WS_URL} from "@/app/config"



export function RoomCanvas({ roomId }: { roomId: string }) {

    const [socket, setSocket] = useState<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTlkNzBkMy02NGM5LTQzODMtYmUzZS01MGEwYTcyMmE1YzUiLCJlbWFpbCI6InNodWJoYW0wNDVAZ21haWwuY29tIiwiaWF0IjoxNzYxMzk3NDkzfQ.10srJmKA7lDivRt7rz-7w_pTT8VtQxAUjfEo7Aeok5s`);

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

    }, [])

    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}