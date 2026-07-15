// Ajout de useRef dans les imports
import { useState, useEffect, useRef } from 'react';
import DrawingBoard from '@/components/DrawingBoard';
import alphabetData from '../../data/alphabet.json'; 

export default function Home() {
  const [vueActuelle, setVueActuelle] = useState('grille');
  const [lettreCible, setLettreCible] = useState(null);

  const [lettreActuelle, setLettreActuelle] = useState(null);
  const [formeActuelle, setFormeActuelle] = useState('isolee');
  const [mode, setMode] = useState('calque');
  const [revelerSolution, setRevelerSolution] = useState(false);

  // Création de la référence pour piloter le DrawingBoard
  const drawingBoardRef = useRef(null);

  const demarrerExercice = (lettre = null) => {
    setLettreCible(lettre);
    setVueActuelle('exercice');
    genererProchainExercice(lettre);
  };

  const genererProchainExercice = (lettreForcee = null) => {
    const formesPossibles = ['isolee', 'initiale', 'mediane', 'finale'];
    setRevelerSolution(false); 

    const lettreDeBase = lettreForcee || lettreCible;

    if (lettreDeBase) {
      let nouvelleForme;
      if (lettreActuelle && lettreActuelle.id === lettreDeBase.id) {
        do {
          nouvelleForme = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
        } while (nouvelleForme === formeActuelle);
      } else {
        nouvelleForme = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
      }
      setLettreActuelle(lettreDeBase);
      setFormeActuelle(nouvelleForme);
      
    } else {
      let nouvelleLettre;
      let nouvelleForme;

      if (!lettreActuelle) {
        nouvelleLettre = alphabetData[Math.floor(Math.random() * alphabetData.length)];
        nouvelleForme = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
      } else {
        do {
          nouvelleLettre = alphabetData[Math.floor(Math.random() * alphabetData.length)];
          nouvelleForme = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
        } while (nouvelleLettre.id === lettreActuelle.id && nouvelleForme === formeActuelle);
      }
      setLettreActuelle(nouvelleLettre);
      setFormeActuelle(nouvelleForme);
    }
  };

  // Fonction pour déclencher l'effacement depuis le parent
  const handleEffacer = () => {
    if (drawingBoardRef.current) {
      drawingBoardRef.current.clearCanvas();
    }
  };

  if (vueActuelle === 'grille') {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Apprentissage de l'Arabe</h1>
          <p className="text-gray-500 mt-2">Choisis une lettre ou lance le mode aléatoire</p>
        </header>

        <button 
          onClick={() => demarrerExercice(null)}
          className="mb-8 px-8 py-4 bg-emerald-600 text-white text-lg font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors active:scale-95 w-full max-w-md"
        >
          Mode Aléatoire (Tout l'alphabet)
        </button>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4 w-full max-w-3xl" dir="rtl">
          {alphabetData.map((lettre) => (
            <button
              key={lettre.id}
              onClick={() => demarrerExercice(lettre)}
              className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
            >
              <span className="text-4xl text-gray-800 mb-2">{lettre.formes.isolee}</span>
              <span className="text-xs text-gray-500 font-medium">{lettre.nom}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-lg mb-6 flex justify-between items-center">
        <button 
          onClick={() => setVueActuelle('grille')}
          className="text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
        >
          ← Retour à la grille
        </button>
        {lettreCible && (
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm">
            Focus : {lettreCible.nom}
          </span>
        )}
      </div>

      <main className="w-full flex flex-col items-center gap-6">
        
        <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner w-full max-w-xs">
          <button
            onClick={() => setMode('calque')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'calque' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mode Calque
          </button>
          <button
            onClick={() => {
              setMode('test');
              setRevelerSolution(false);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'test' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mode Test
          </button>
        </div>

        {lettreActuelle && (
          <div className="text-center bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 min-w-[220px]">
            <h2 className="text-xl font-semibold text-gray-700">
              Lettre : <span className="text-blue-600">{lettreActuelle.nom}</span>
            </h2>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              Position {formeActuelle}
            </p>
          </div>
        )}

        {/* Zone de dessin */}
        <div className="w-full max-w-lg mx-auto">
          <DrawingBoard ref={drawingBoardRef} key={`${lettreActuelle?.id}-${formeActuelle}-${mode}`}>
            
            {/* CONTENEUR SYNCHRONISÉ : GRILLE + LETTRE */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              
              {/* Boîte typographique fixe (180px de haut) pour verrouiller la position */}
              <div className="relative w-full flex justify-center items-center h-[180px]">
                
                {/* 1. LA GRILLE DU CAHIER (Liée à la typographie) */}
                <div className="absolute inset-0 w-full z-10 opacity-60">
                   {/* Ligne haute (Pour limiter les ascendants comme le Alif) */}
                   <div className="absolute top-[15%] w-full border-t border-dashed border-gray-400"></div> 
                   
                   {/* LIGNE DE BASE ROUGE - Calée mathématiquement à 72% de la hauteur */}
                   <div className="absolute top-[72%] w-full border-t-[2px] border-red-400 shadow-sm"></div> 
                   
                   {/* Ligne basse (Pour limiter les descendants comme le Jîm ou le Mîm) */}
                   <div className="absolute top-[110%] w-full border-t border-dashed border-gray-400"></div> 
                </div>

                {/* 2. LA LETTRE */}
                {lettreActuelle && (
                  <span 
                    className={`relative z-20 ${
                      mode === 'calque' ? 'opacity-25' : revelerSolution ? 'opacity-65' : 'opacity-0'
                    } ${
                      revelerSolution && mode === 'test' ? 'text-green-500 font-bold' : 'text-[#1f2937]'
                    }`} 
                    style={{ 
                      fontSize: '180px', 
                      lineHeight: '180px', // Crucial : Force la lettre à remplir exactement les 180px
                      display: 'inline-block' 
                    }}
                    dir="rtl"
                  >
                    {lettreActuelle.formes[formeActuelle]}
                  </span>
                )}
                
              </div>
            </div>

          </DrawingBoard>
        </div>

        {/* LIGNE DES 3 BOUTONS (Effacer, Vérifier, Suivant) */}
        <div className="flex gap-3 w-full max-w-lg justify-between">
          
          <button 
            onClick={handleEffacer}
            className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold shadow-sm hover:bg-red-100 transition-colors active:scale-95 text-sm sm:text-base"
          >
            Effacer
          </button>

          {mode === 'test' && !revelerSolution && (
            <button 
              onClick={() => setRevelerSolution(true)}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition-colors active:scale-95 text-sm sm:text-base"
            >
              Vérifier
            </button>
          )}
          
          <button 
            onClick={() => genererProchainExercice()}
            className={`flex-1 py-3 text-white font-bold rounded-lg shadow-md transition-colors active:scale-95 text-sm sm:text-base ${
              mode === 'test' && !revelerSolution ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Suivant
          </button>
        </div>

      </main>
    </div>
  );
}