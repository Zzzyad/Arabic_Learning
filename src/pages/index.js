import { useState, useEffect } from 'react';
import DrawingBoard from '@/components/DrawingBoard';
import alphabetData from '../../data/alphabet.json'; 

export default function Home() {
  const [lettreActuelle, setLettreActuelle] = useState(null);
  const [formeActuelle, setFormeActuelle] = useState('isolee');
  const [mode, setMode] = useState('calque'); // Deux modes possibles : 'calque' ou 'test'.
  const [revelerSolution, setRevelerSolution] = useState(false); // Gère l'affichage de la solution en mode Test.

  // Initialisation au premier chargement de la page.
  useEffect(() => {
    choisirNouvelExercice();
  }, []);

  // Sélectionne une combinaison aléatoire d'une lettre et d'une position.
  const choisirNouvelExercice = () => {
    const formesPossibles = ['isolee', 'initiale', 'mediane', 'finale'];
    
    // Si aucune lettre n'est chargée (initialisation)
    if (!lettreActuelle) {
      const indexAleatoire = Math.floor(Math.random() * alphabetData.length);
      const formeAleatoire = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
      setLettreActuelle(alphabetData[indexAleatoire]);
      setFormeActuelle(formeAleatoire);
      setRevelerSolution(false);
      return;
    }

    // Boucle de sécurité pour s'assurer de ne pas tomber sur le même exercice d'affilée.
    let nouvelleLettre;
    let nouvelleForme;
    do {
      const indexAleatoire = Math.floor(Math.random() * alphabetData.length);
      nouvelleLettre = alphabetData[indexAleatoire];
      nouvelleForme = formesPossibles[Math.floor(Math.random() * formesPossibles.length)];
    } while (
      nouvelleLettre.id === lettreActuelle.id && 
      nouvelleForme === formeActuelle && 
      alphabetData.length > 1
    );

    setLettreActuelle(nouvelleLettre);
    setFormeActuelle(nouvelleForme);
    setRevelerSolution(false); // On réinitialise la solution pour le nouvel exercice.
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Apprentissage de l'Arabe</h1>
        <p className="text-gray-500 mt-2">Maîtrise l'alphabet et ses différentes formes</p>
      </header>
      
      <main className="w-full flex flex-col items-center gap-6">
        
        {/* INTERFACE : SÉLECTEUR DE MODE (ONGLETS PENSÉS POUR TABLETTE) */}
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

        {/* INTERFACE : CONSIGNE D'EXERCICE */}
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

        {/* ZONE DU COMPOSANT CANVAS + FILIGRANE */}
        <div className="relative w-full max-w-lg mx-auto">
          
          {/* LOGIQUE DU CALQUE VISUEL :
            La lettre s'affiche si on est en mode 'calque' OU si on a cliqué sur 'Vérifier' (revelerSolution).
            Si la solution est révélée en mode test, elle s'affiche en vert pour bien contraster avec ton tracé.
          */}
          {lettreActuelle && (
            <div 
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                mode === 'calque' || revelerSolution ? 'opacity-25' : 'opacity-0'
              }`}
            >
              <span 
                className={`transition-colors duration-300 ${
                  revelerSolution && mode === 'test' ? 'text-green-600 font-bold' : 'text-[#1f2937]'
                }`} 
                style={{ fontSize: '180px', lineHeight: '1' }}
                dir="rtl"
              >
                {lettreActuelle.formes[formeActuelle]}
              </span>
            </div>
          )}
          
          {/* Utilisation de key pour forcer le rechargement du composant DrawingBoard à chaque nouvel exercice.
          */}
          <DrawingBoard key={`${lettreActuelle?.id}-${formeActuelle}-${mode}`} />
        </div>

        {/* INTERFACE : BOUTONS DE CONTRÔLE DE JEU */}
        <div className="flex gap-4 w-full max-w-lg justify-center">
          {/* Le bouton vérifier ne s'affiche qu'en mode test et si la solution n'est pas encore dévoilée */}
          {mode === 'test' && !revelerSolution && (
            <button 
              onClick={() => setRevelerSolution(true)}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition-colors active:scale-95"
            >
              Vérifier
            </button>
          )}
          
          <button 
            onClick={choisirNouvelExercice}
            className={`px-6 py-3 text-white font-bold rounded-lg shadow-md transition-colors active:scale-95 ${
              mode === 'test' && !revelerSolution ? 'bg-gray-400 hover:bg-gray-500' : 'flex-1 bg-blue-600 hover:bg-blue-700'
                }`}
          >
            Lettre suivante
          </button>
        </div>
      </main>
    </div>
  );
}