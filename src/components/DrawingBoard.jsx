import React, { useRef, useState, useEffect } from 'react';

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Configuration initiale du canvas au chargement du composant.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Adapter la résolution du canvas à sa taille réelle pour éviter un tracé flou.
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Style du trait.
    ctx.lineCap = 'round'; // Rend le bout du trait arrondi.
    ctx.lineJoin = 'round'; // Rend les angles arrondis.
    ctx.lineWidth = 12; // Épaisseur idéale pour le doigt.
    ctx.strokeStyle = '#1f2937'; // Couleur gris foncé.
  }, []);

  // Fonction utilitaire pour calculer les coordonnées relatives (Souris ou Tactile)
  const getCoordinates = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    // Gère la différence entre l'événement tactile (e.touches) et la souris (e.clientX)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Démarre le tracé et force le dessin d'un point statique.
  const startDrawing = (e) => {
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(canvas, e);

    // Dessine le point initial sans attendre la mise à jour asynchrone du state React.
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Arrête le tracé.
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); // Coupe le trait en cours pour ne pas le lier au prochain.
  };

  // Fonction principale de dessin (Quand il y a un mouvement de la souris ou du doigt)
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(canvas, e);

    ctx.lineTo(x, y); // Trace la ligne.
    ctx.stroke();     // Applique l'encre.
    ctx.beginPath();  // Prépare le segment suivant.
    ctx.moveTo(x, y); // Déplace le point de départ.
  };

  // Fonction pour nettoyer tout le canvas.
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Conteneur du canvas : 
        - bg-transparent pour voir la lettre en arrière-plan.
        - z-10 assure qu'il reste cliquable au-dessus du calque.
      */}
      <div className="w-full relative bg-transparent border-2 border-gray-300 rounded-xl overflow-hidden z-10">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-80 touch-none cursor-crosshair"
        />
      </div>

      <button 
        onClick={clearCanvas}
        className="px-8 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold shadow-sm hover:bg-red-100 transition-colors active:scale-95"
      >
        Effacer
      </button>
    </div>
  );
}