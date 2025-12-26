import { Tool } from "@/Components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    id?: string;
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id?: string;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id?: string;
    type: "pencil";
    points: { x: number; y: number }[];
} | {
    id?: string;
    type: "arrow";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | {
    id?: string;
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | {
    id?: string;
    type: "text";
    x: number;
    y: number;
    text: string;
    fontSize?: number;
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "block";
    private currentPencilPath: { x: number; y: number }[] = [];
    private currentEraserPath: { x: number; y: number }[] = [];
    private textInput: HTMLTextAreaElement | null = null;
    private textInputPosition: { x: number; y: number } | null = null;
    
    // Camera for pan and zoom
    private cameraOffset = { x: 0, y: 0 };
    private cameraZoom = 1;
    private isDragging = false;
    private dragStart = { x: 0, y: 0 };
    private isPanning = false;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.loadCameraState();
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        if (this.textInput) {
            this.textInput.remove();
            this.textInput = null;
        }
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
        this.canvas.removeEventListener("wheel", this.wheelHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    getWorldCoords(e: MouseEvent) {
        return {
            x: (e.clientX - this.cameraOffset.x) / this.cameraZoom,
            y: (e.clientY - this.cameraOffset.y) / this.cameraZoom
        };
    }

    getCameraZoom() {
        return this.cameraZoom;
    }

    zoomIn() {
        const newZoom = Math.min(this.cameraZoom * 1.2, 5);
        this.cameraZoom = newZoom;
        this.clearCanvas();
        this.saveCameraState();
    }

    zoomOut() {
        const newZoom = Math.max(this.cameraZoom / 1.2, 0.1);
        this.cameraZoom = newZoom;
        this.clearCanvas();
        this.saveCameraState();
    }

    resetZoom() {
        this.cameraZoom = 1;
        this.cameraOffset = { x: 0, y: 0 };
        this.clearCanvas();
        this.saveCameraState();
    }

    saveCameraState() {
        try {
            const state = {
                offset: this.cameraOffset,
                zoom: this.cameraZoom,
                roomId: this.roomId
            };
            localStorage.setItem(`canvas-camera-${this.roomId}`, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save camera state:", e);
        }
    }

    loadCameraState() {
        try {
            const saved = localStorage.getItem(`canvas-camera-${this.roomId}`);
            if (saved) {
                const state = JSON.parse(saved);
                this.cameraOffset = state.offset || { x: 0, y: 0 };
                this.cameraZoom = state.zoom || 1;
            }
        } catch (e) {
            console.error("Failed to load camera state:", e);
        }
    }

    broadcastCamera() {
        this.socket.send(JSON.stringify({
            type: "camera_update",
            cameraOffset: this.cameraOffset,
            cameraZoom: this.cameraZoom,
            roomId: this.roomId
        }));
        this.saveCameraState();
    }

    isPointInShape(x: number, y: number, shape: Shape, radius: number = 0): boolean {
        if (shape.type === "rect") {
            return x >= shape.x - radius && x <= shape.x + shape.width + radius &&
                   y >= shape.y - radius && y <= shape.y + shape.height + radius;
        } else if (shape.type === "circle") {
            const dx = x - shape.centerX;
            const dy = y - shape.centerY;
            return Math.sqrt(dx * dx + dy * dy) <= Math.abs(shape.radius) + radius;
        } else if (shape.type === "pencil") {
            // Check if point is near any line segment in pencil path
            for (let i = 0; i < shape.points.length - 1; i++) {
                const p1 = shape.points[i];
                const p2 = shape.points[i + 1];
                const dist = this.distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
                if (dist < 10 + radius) return true;
            }
        } else if (shape.type === "arrow") {
            const dist = this.distanceToLineSegment(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
            return dist < 10 + radius;
        } else if (shape.type === "line") {
            const dist = this.distanceToLineSegment(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
            return dist < 10 + radius;
        } else if (shape.type === "text") {
            // Simple bounding box for text (approximate)
            const textWidth = shape.text.length * (shape.fontSize || 20) * 0.6;
            const textHeight = (shape.fontSize || 20);
            return x >= shape.x - radius && x <= shape.x + textWidth + radius &&
                   y >= shape.y - textHeight - radius && y <= shape.y + radius;
        }
        return false;
    }

    distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq != 0) param = dot / lenSq;
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    deleteShape(shapeId: string) {
        this.socket.send(JSON.stringify({
            type: "delete_shape",
            shapeId,
            roomId: this.roomId
        }));
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    drawGrid() {
        const gridSize = 20;
        const dotSize = 1.5;
        
        // Calculate visible area in world coordinates
        const startX = Math.floor((-this.cameraOffset.x / this.cameraZoom) / gridSize) * gridSize;
        const startY = Math.floor((-this.cameraOffset.y / this.cameraZoom) / gridSize) * gridSize;
        const endX = startX + (this.canvas.width / this.cameraZoom) + gridSize;
        const endY = startY + (this.canvas.height / this.cameraZoom) + gridSize;
        
        this.ctx.fillStyle = 'rgba(100, 100, 130, 0.3)';
        
        for (let x = startX; x < endX; x += gridSize) {
            for (let y = startY; y < endY; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, dotSize / this.cameraZoom, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            } else if (message.type == "camera_update") {
                // Apply camera update from other users
                this.cameraOffset = message.cameraOffset;
                this.cameraZoom = message.cameraZoom;
                this.clearCanvas();
            } else if (message.type == "delete_shape") {
                // Remove shape from local state
                this.existingShapes = this.existingShapes.filter(s => s.id !== message.shapeId);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        // Clear and reset transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0f0f1e');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera transform
        this.ctx.translate(this.cameraOffset.x, this.cameraOffset.y);
        this.ctx.scale(this.cameraZoom, this.cameraZoom);

        // Draw dot grid pattern
        this.drawGrid();

        // Render all shapes in creation order
        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                this.ctx.lineWidth = 1;
            } else if (shape.type === "circle") {
                console.log(shape);
                this.ctx.strokeStyle = "rgba(251, 146, 60, 0.9)";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (shape.type === "pencil") {
                if (shape.points && shape.points.length > 1) {
                    this.ctx.strokeStyle = "rgba(167, 139, 250, 0.9)";
                    this.ctx.lineWidth = 2;
                    this.ctx.lineCap = "round";
                    this.ctx.lineJoin = "round";
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                    this.ctx.lineWidth = 1;
                }
            } else if (shape.type === "arrow") {
                this.ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
                this.ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
                this.ctx.lineWidth = 2;
                
                // Draw line
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
                
                // Draw arrowhead
                const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
                const headLength = 15;
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x2, shape.y2);
                this.ctx.lineTo(
                    shape.x2 - headLength * Math.cos(angle - Math.PI / 6),
                    shape.y2 - headLength * Math.sin(angle - Math.PI / 6)
                );
                this.ctx.lineTo(
                    shape.x2 - headLength * Math.cos(angle + Math.PI / 6),
                    shape.y2 - headLength * Math.sin(angle + Math.PI / 6)
                );
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.fill();
                this.ctx.lineWidth = 1;
            } else if (shape.type === "line") {
                this.ctx.strokeStyle = "rgba(244, 63, 94, 0.9)";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
            } else if (shape.type === "text") {
                this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                this.ctx.font = `${shape.fontSize || 20}px sans-serif`;
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        // Middle mouse or space+left mouse for panning
        if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
            this.isPanning = true;
            this.dragStart = { x: e.clientX - this.cameraOffset.x, y: e.clientY - this.cameraOffset.y };
            return;
        }

        // Left-click with block tool also enables panning (for navigation)
        if (e.button === 0 && this.selectedTool === "block") {
            this.isPanning = true;
            this.dragStart = { x: e.clientX - this.cameraOffset.x, y: e.clientY - this.cameraOffset.y };
            return;
        }

        const worldCoords = this.getWorldCoords(e);
        this.clicked = true
        this.startX = worldCoords.x;
        this.startY = worldCoords.y;
        
        if (this.selectedTool === "pencil") {
            this.currentPencilPath = [{ x: worldCoords.x, y: worldCoords.y }];
        } else if (this.selectedTool === "eraser") {
            this.currentEraserPath = [{ x: worldCoords.x, y: worldCoords.y }];
        } else if (this.selectedTool === "text") {
            // Create text input at click position
            console.log("Text tool clicked at:", e.clientX, e.clientY);
            this.createTextInput(e.clientX, e.clientY, worldCoords.x, worldCoords.y);
            this.clicked = false;
            return;
        }
    }
    
    createTextInput(screenX: number, screenY: number, worldX: number, worldY: number) {
        console.log("Creating text input at screen:", screenX, screenY, "world:", worldX, worldY);
        
        // Remove existing input if any
        if (this.textInput) {
            try {
                if (this.textInput.parentNode) {
                    this.textInput.remove();
                }
            } catch (e) {
                // Element already removed, ignore
            }
            this.textInput = null;
        }
        
        // Create textarea element for better text editing
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.left = screenX + 'px';
        textarea.style.top = screenY + 'px';
        textarea.style.fontSize = '20px';
        textarea.style.fontFamily = 'sans-serif';
        textarea.style.border = 'none';
        textarea.style.background = 'transparent';
        textarea.style.color = 'rgba(255, 255, 255, 0.95)';
        textarea.style.padding = '2px';
        textarea.style.borderRadius = '0';
        textarea.style.outline = '1px dashed rgba(96, 165, 250, 0.5)';
        textarea.style.outlineOffset = '4px';
        textarea.style.minWidth = '100px';
        textarea.style.minHeight = '24px';
        textarea.style.resize = 'none';
        textarea.style.zIndex = '10000';
        textarea.style.overflow = 'hidden';
        textarea.style.lineHeight = '1.2';
        textarea.placeholder = '';
        textarea.rows = 1;
        
        this.textInput = textarea;
        this.textInputPosition = { x: worldX, y: worldY };
        
        document.body.appendChild(textarea);
        console.log("Text input appended to body, focusing...");
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            textarea.focus();
            textarea.select();
        }, 10);
        
        // Guard to prevent multiple calls
        let isFinished = false;
        
        // Handle completion
        const finishText = () => {
            if (isFinished) return;
            isFinished = true;
            
            console.log("Finishing text input");
            const text = textarea.value.trim();
            if (text && this.textInputPosition) {
                console.log("Creating text shape:", text);
                const shape: Shape = {
                    id: Date.now().toString() + Math.random().toString(36),
                    type: "text",
                    x: this.textInputPosition.x,
                    y: this.textInputPosition.y,
                    text: text,
                    fontSize: 20
                };
                this.existingShapes.push(shape);
                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: this.roomId
                }));
                this.clearCanvas();
            }
            
            if (textarea.parentNode) {
                textarea.remove();
            }
            this.textInput = null;
            this.textInputPosition = null;
        };
        
        const cancelText = () => {
            if (isFinished) return;
            isFinished = true;
            
            if (textarea.parentNode) {
                textarea.remove();
            }
            this.textInput = null;
            this.textInputPosition = null;
        };
        
        textarea.addEventListener('blur', finishText);
        textarea.addEventListener('keydown', (e) => {
            e.stopPropagation(); // Prevent canvas from receiving the event
            
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textarea.blur(); // This will trigger finishText via blur event
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelText();
            }
        });
        
        // Prevent canvas interactions while typing
        textarea.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        textarea.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    mouseUpHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            this.isPanning = false;
            // Broadcast camera position after panning
            this.broadcastCamera();
            return;
        }

        this.clicked = false
        const worldCoords = this.getWorldCoords(e);
        const width = worldCoords.x - this.startX;
        const height = worldCoords.y - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {

            shape = {
                id: Date.now().toString() + Math.random().toString(36),
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                id: Date.now().toString() + Math.random().toString(36),
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        } else if (selectedTool === "pencil") {
            if (this.currentPencilPath.length > 0) {
                shape = {
                    id: Date.now().toString() + Math.random().toString(36),
                    type: "pencil",
                    points: this.currentPencilPath
                }
                this.currentPencilPath = [];
            }
        } else if (selectedTool === "arrow") {
            shape = {
                id: Date.now().toString() + Math.random().toString(36),
                type: "arrow",
                x1: this.startX,
                y1: this.startY,
                x2: worldCoords.x,
                y2: worldCoords.y
            }
        } else if (selectedTool === "line") {
            shape = {
                id: Date.now().toString() + Math.random().toString(36),
                type: "line",
                x1: this.startX,
                y1: this.startY,
                x2: worldCoords.x,
                y2: worldCoords.y
            }
        } else if (selectedTool === "eraser") {
            // Shapes are deleted during drag, just clear the path
            this.currentEraserPath = [];
            return; // Don't create a shape for eraser
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        
        const zoomSensitivity = 0.001;
        const zoomAmount = -e.deltaY * zoomSensitivity;
        const newZoom = this.cameraZoom + zoomAmount;
        
        // Limit zoom levels
        if (newZoom < 0.1 || newZoom > 5) return;
        
        // Zoom towards mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Get world position before zoom
        const worldPosBeforeZoom = {
            x: (mouseX - this.cameraOffset.x) / this.cameraZoom,
            y: (mouseY - this.cameraOffset.y) / this.cameraZoom
        };
        
        // Update zoom
        this.cameraZoom = newZoom;
        
        // Adjust offset to keep mouse position fixed
        this.cameraOffset.x = mouseX - worldPosBeforeZoom.x * this.cameraZoom;
        this.cameraOffset.y = mouseY - worldPosBeforeZoom.y * this.cameraZoom;
        
        this.clearCanvas();
        
        // Broadcast camera position after zoom
        this.broadcastCamera();
    }

    mouseMoveHandler = (e: MouseEvent) => {
        // Handle panning
        if (this.isPanning) {
            this.cameraOffset.x = e.clientX - this.dragStart.x;
            this.cameraOffset.y = e.clientY - this.dragStart.y;
            this.clearCanvas();
            return;
        }

        if (this.clicked) {
            const selectedTool = this.selectedTool;
            
            // Block tool is selection mode - don't draw anything
            if (selectedTool === "block") {
                return;
            }
            
            const worldCoords = this.getWorldCoords(e);
            
            // Eraser tool - delete shapes in real-time as we move
            if (selectedTool === "eraser") {
                this.currentEraserPath.push({ x: worldCoords.x, y: worldCoords.y });
                
                // Check and delete all shapes touching the eraser path
                const eraserRadius = 10;
                const shapesToDelete: string[] = [];
                
                for (const shape of this.existingShapes) {
                    if (shape.id && this.isPointInShape(worldCoords.x, worldCoords.y, shape, eraserRadius)) {
                        if (!shapesToDelete.includes(shape.id)) {
                            shapesToDelete.push(shape.id);
                        }
                    }
                }
                
                // Delete all touched shapes immediately
                for (const shapeId of shapesToDelete) {
                    this.deleteShape(shapeId);
                }
                
                return;
            }
            
            const width = worldCoords.x - this.startX;
            const height = worldCoords.y - this.startY;
            this.clearCanvas();
            console.log(selectedTool)
            if (selectedTool === "rect") {
                this.ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.startX, this.startY, width, height);
                this.ctx.lineWidth = 1;   
            } else if (selectedTool === "circle") {
                this.ctx.strokeStyle = "rgba(251, 146, 60, 0.9)";
                this.ctx.lineWidth = 2;
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (selectedTool === "pencil") {
                this.currentPencilPath.push({ x: worldCoords.x, y: worldCoords.y });
                
                if (this.currentPencilPath.length > 1) {
                    this.ctx.strokeStyle = "rgba(167, 139, 250, 0.9)";
                    this.ctx.lineWidth = 2;
                    this.ctx.lineCap = "round";
                    this.ctx.lineJoin = "round";
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.currentPencilPath[0].x, this.currentPencilPath[0].y);
                    for (let i = 1; i < this.currentPencilPath.length; i++) {
                        this.ctx.lineTo(this.currentPencilPath[i].x, this.currentPencilPath[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                    this.ctx.lineWidth = 1;
                }
            } else if (selectedTool === "arrow") {
                this.ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
                this.ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
                this.ctx.lineWidth = 2;
                
                // Draw line
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(worldCoords.x, worldCoords.y);
                this.ctx.stroke();
                
                // Draw arrowhead
                const angle = Math.atan2(worldCoords.y - this.startY, worldCoords.x - this.startX);
                const headLength = 15;
                this.ctx.beginPath();
                this.ctx.moveTo(worldCoords.x, worldCoords.y);
                this.ctx.lineTo(
                    worldCoords.x - headLength * Math.cos(angle - Math.PI / 6),
                    worldCoords.y - headLength * Math.sin(angle - Math.PI / 6)
                );
                this.ctx.lineTo(
                    worldCoords.x - headLength * Math.cos(angle + Math.PI / 6),
                    worldCoords.y - headLength * Math.sin(angle + Math.PI / 6)
                );
                this.ctx.lineTo(worldCoords.x, worldCoords.y);
                this.ctx.fill();
                this.ctx.lineWidth = 1;
            } else if (selectedTool === "line") {
                this.ctx.strokeStyle = "rgba(244, 63, 94, 0.9)";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(worldCoords.x, worldCoords.y);
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
        this.canvas.addEventListener("wheel", this.wheelHandler, { passive: false })
    }
}