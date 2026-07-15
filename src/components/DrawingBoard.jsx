import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

// forwardRef permet de recevoir une "référence" depuis le composant parent (index.jsx)
const DrawingBoard = forwardRef(({ children }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round'; 
    ctx.lineWidth = 12; 
    ctx.strokeStyle = '#1f2937'; 
  }, []);

  const getCoordinates = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); 
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(canvas, e);
    ctx.lineTo(x, y); 
    ctx.stroke();     
    ctx.beginPath();  
    ctx.moveTo(x, y); 
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // useImperativeHandle expose la fonction clearCanvas au parent via la ref
  useImperativeHandle(ref, () => ({
    clearCanvas
  }));

  return (
    // J'ai retiré le flex-col et le bouton Effacer. Le composant n'est plus QUE le canvas.
    <div className="w-full h-80 relative bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-inner">

      {children}

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full relative z-10 touch-none cursor-crosshair"
      />
    </div>
  );
});

// Bonne pratique React quand on utilise forwardRef
DrawingBoard.displayName = 'DrawingBoard';

export default DrawingBoard;