import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Square, Eraser, ArrowRight, Minus, Type, ZoomIn, ZoomOut, Maximize2, LogOut, PenTool } from "lucide-react";
import { Game } from "@/app/draw/game";

export type Tool = "circle" | "rect" | "pencil" | "block" | "eraser" | "arrow" | "line" | "text";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("block")

    useEffect(() => {
        game?.setTool(selectedTool);
        
        // Update cursor based on selected tool
        if (canvasRef.current) {
            const cursorMap: Record<Tool, string> = {
                block: 'grab',
                pencil: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\'%3E%3Cpath d=\'M12 19l7-7 3 3-7 7-3-3z\'/%3E%3Cpath d=\'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\'/%3E%3Cpath d=\'M2 2l7.586 7.586\'/%3E%3C/svg%3E") 0 24, crosshair',
                rect: 'crosshair',
                circle: 'crosshair',
                arrow: 'crosshair',
                line: 'crosshair',
                text: 'text',
                eraser: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\'%3E%3Cpath d=\'m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.5L13 21\'/%3E%3Cpath d=\'M22 11h-6l-4 4\'/%3E%3Cpath d=\'m7 21 4-4\'/%3E%3C/svg%3E") 12 12, auto'
            };
            canvasRef.current.style.cursor = cursorMap[selectedTool];
        }
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            
            // Handle window resize
            const handleResize = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                    g.clearCanvas();
                }
            };
            
            window.addEventListener('resize', handleResize);

            return () => {
                g.destroy();
                window.removeEventListener('resize', handleResize);
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <AppHeader />
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        <ExitButton roomId={roomId} />
        <ZoomControls game={game} />
    </div>
}

function AppHeader() {
    return <div style={{
            position: "fixed",
            top: 20,
            left: 20,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "8px 16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 900
        }}>
            <PenTool size={24} color="#60a5fa" />
            <span style={{
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "0.5px"
            }}>Draw-app</span>
        </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
            <div className="flex gap-2">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("block")
                    }}
                    activated={selectedTool === "block"}
                    icon={<Square />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("arrow")
                }} activated={selectedTool === "arrow"} icon={<ArrowRight />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("line")
                }} activated={selectedTool === "line"} icon={<Minus />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("text")
                }} activated={selectedTool === "text"} icon={<Type />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("eraser")
                }} activated={selectedTool === "eraser"} icon={<Eraser />}></IconButton>
            </div>
        </div>
}

function ExitButton({roomId}: {roomId: string}) {
    const router = useRouter();
    
    const handleExit = () => {
        if (confirm('Are you sure you want to leave this room?')) {
            router.push('/dashboard');
        }
    };
    
    return <div style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
            <IconButton 
                onClick={handleExit}
                activated={false}
                icon={<LogOut size={20} />}
            />
        </div>
}

function ZoomControls({game}: {game: Game | undefined}) {
    const [zoom, setZoom] = useState(100);
    
    useEffect(() => {
        if (game && typeof game.getCameraZoom === 'function') {
            const interval = setInterval(() => {
                if (game && typeof game.getCameraZoom === 'function') {
                    const currentZoom = game.getCameraZoom();
                    setZoom(Math.round(currentZoom * 100));
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [game]);
    
    return <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        }}>
            <IconButton 
                onClick={() => game?.zoomOut()}
                activated={false}
                icon={<ZoomOut size={18} />}
            />
            <span style={{
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                minWidth: "50px",
                textAlign: "center"
            }}>{zoom}%</span>
            <IconButton 
                onClick={() => game?.zoomIn()}
                activated={false}
                icon={<ZoomIn size={18} />}
            />
            <IconButton 
                onClick={() => game?.resetZoom()}
                activated={false}
                icon={<Maximize2 size={18} />}
            />
        </div>
}