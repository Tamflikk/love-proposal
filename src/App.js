import { useState, useEffect, useRef } from 'react';
import { Heart, Star, Music, ArrowRight, ChevronRight, Volume2 } from 'lucide-react';
import CredentialsDialog from './dialogs/CredentialDialogs';
import confetti from 'canvas-confetti';
import Desencuentro from './assets/audio/desencuentro.mp3';
import Elvis from './assets/audio/elvis.mp3';
import Encuentro from './assets/audio/encuentro.mp3';

export default function ProposalGame() {
  const [stage, setStage] = useState('start');
  const [completed, setCompleted] = useState([]);
  const [score, setScore] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const typingRef = useRef(null);
  const audioRef = useRef(null);
  
  // Song selection state
  const [selectedSong, setSelectedSong] = useState(null);
  
  // Memory game state
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [memoryCards, setMemoryCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  
  // Question game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Message screens state
  const [currentMessageScreen, setCurrentMessageScreen] = useState(0);
  
  // Final proposal state
  const [proposalAnimationComplete, setProposalAnimationComplete] = useState(false);
  
  // Background effects
  const [hearts, setHearts] = useState([]);
  const [stars, setStars] = useState([]);

  // Songs available for selection
  const songs = [
    { 
      id: 'desencuentro', 
      title: 'Desencuentro', 
      artist: 'Residente', 
      url: Desencuentro
    },
    { 
      id: 'canthelp', 
      title: "Can't Help Falling in Love", 
      artist: 'Elvis Presley', 
      url: Elvis
    },
    { 
      id: 'encuentro', 
      title: 'El Encuentro', 
      artist: 'Residente & Jessie Reyez', 
      url: Encuentro 
    }
  ];
  
  // Memory game cards - replace with your shared memories
  const memoryItems = [
    { id: 1, content: '❤️', match: 1 },
    { id: 2, content: '❤️', match: 1 },
    { id: 3, content: '🌟', match: 2 },
    { id: 4, content: '🌟', match: 2 },
    { id: 5, content: '🎵', match: 3 },
    { id: 6, content: '🎵', match: 3 },
    { id: 7, content: '🎁', match: 4 },
    { id: 8, content: '🎁', match: 4 },
    { id: 9, content: '🌹', match: 5 },
    { id: 10, content: '🌹', match: 5 },
    { id: 11, content: '🍕', match: 6 },
    { id: 12, content: '🍕', match: 6 },
  ];
  
  // Questions - customize these with your own related to your relationship
  const questions = [
    {
      question: "¿Dónde nos conocimos?",
      options: ["En una fiesta", "En la universidad", "Por amigos", "En el colegio"],
      correctAnswer: 3 // Índice de la respuesta correcta (0-based)
    },
    {
      question: "¿Cuál era nuestro bobba favorito?",
      options: ["Chai Latte", "Pumpkin Spice Latte", "Blueberry Popping", "Peppermint Mocha"],
      correctAnswer: 0
    },
    {
      question: "¿Donde te invite a comer la primera vez que te hable?",
      options: ["Tuesday", "Chester", "Burger king", "Las islas"],
      correctAnswer: 2
    },
    {
      question: "¿Donde se nos pincho la llanta del auto?",
      options: ["En la playa xd", "En el centro comercial", "En la Av. Circunvalacion", "En el parque Tunari"],
      correctAnswer: 3
    },
    {
      question: "¿Cual era nuestra frase de amors?",
      options: ["Forever and ever", "Para siempre y un poco mas", "Nos amaremos hasta en sueños", "Siempre juntos"],
      correctAnswer: 1 // Cambiar por el correcto
    }
  ];
  
  // Message screens content - personalize these!
  const messageScreens = [
    {
      title: "Has llegado hasta aquí...",
      content: "Desde que te conocí, cada día tiene un brillo distinto. Hay algo que llevo tiempo queriendo decirte, pero esperé el momento perfecto para expresarlo de una forma especial."
    },
    {
      title: "Antes de continuar...",
      content: "Quiero que sepas que me haces profundamente feliz. Tu sonrisa ilumina mis días y me llena de ilusión imaginar un futuro en el que tú siempre estés presente."
    },
    {
      title: "Tengo que confesarte algo...",
      content: "Cuando estoy contigo, me siento lleno de vida. Me haces sentir completo. Me inspiras a ser una mejor versión de mí. Me haces sentir fuerte... pero también vulnerable. Porque contigo puedo ser yo mismo, sin máscaras. Y eso, aunque me asusta, también me hace sentir que todo vale la pena. Lo que siento por ti es tan grande, que solo pensar en perderte me paraliza."
    },
    {
      title: "Un último paso...",
      content: "Has transformado mi vida de maneras que jamás imaginé. A tu lado, cada instante cobra sentido, y solo deseo seguir construyendo recuerdos juntos. Ahora estoy listo para hacerte una pregunta muy especial..."
    }
  ];  
  
  // Initialize memory game
  useEffect(() => {
    if (stage === 'memory') {
      setMemoryCards(shuffleArray([...memoryItems]));
    }
  }, [stage]);
  
  // Initialize background animations
  useEffect(() => {
    // Create animated hearts for background
    const newHearts = [];
    for (let i = 0; i < 20; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 16,
        opacity: 0.3 + Math.random() * 0.4,
        animationDuration: 3 + Math.random() * 7,
        animationDelay: Math.random() * 5
      });
    }
    setHearts(newHearts);
    
    // Create animated stars for background
    const newStars = [];
    for (let i = 0; i < 25; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.4,
        animationDuration: 4 + Math.random() * 6,
        animationDelay: Math.random() * 5
      });
    }
    setStars(newStars);
  }, []);
  
  // Audio handling
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Play selected song
  const playSong = (songId) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // In a real implementation, you would use the actual audio URL
    // For this example, we're creating a new Audio element
    const audio = new Audio(song.url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(e => console.log('Audio play error:', e));
    
    audioRef.current = audio;
    setSelectedSong(songId);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Text typing animation effect
  useEffect(() => {
    if (stage === 'message') {
      const currentMessage = messageScreens[currentMessageScreen].content;
      let index = 0;
      setTypingText('');
      setShowNextButton(false);
      
      clearTimeout(typingRef.current);
      
      const typeNextCharacter = () => {
        if (index < currentMessage.length) {
          setTypingText(currentMessage.substring(0, index + 1));
          index++;
          typingRef.current = setTimeout(typeNextCharacter, 30);
        } else {
          setShowNextButton(true);
        }
      };
      
      typeNextCharacter();
      
      return () => {
        clearTimeout(typingRef.current);
      };
    }
  }, [stage, currentMessageScreen]);

  // Proposal animation - ahora sin efecto de latido
  useEffect(() => {
    if (stage === 'proposal') {
      // Start with empty text and animate it in
      setTypingText('');
      let index = 0;
      const proposalText = "¿Quieres ser mi novia?";
      
      const typeProposal = () => {
        if (index < proposalText.length) {
          setTypingText(proposalText.substring(0, index + 1));
          index++;
          typingRef.current = setTimeout(typeProposal, 80); // Slower for dramatic effect
        } else {
          setTimeout(() => {
            setProposalAnimationComplete(true);
          }, 500);
        }
      };
      
      setTimeout(typeProposal, 1000);
      
      return () => {
        clearTimeout(typingRef.current);
      };
    }
  }, [stage]);
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Handle memory card flip
  const handleFlip = (id) => {
    if (disabled || flipped.includes(id) || matched.includes(id)) return;
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      
      const firstCardId = newFlipped[0];
      const secondCardId = newFlipped[1];
      
      const firstCard = memoryCards.find(card => card.id === firstCardId);
      const secondCard = memoryCards.find(card => card.id === secondCardId);
      
      if (firstCard.match === secondCard.match) {
        setMatched([...matched, firstCardId, secondCardId]);
        setScore(score + 1);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
    
    // Check if game completed
    if (matched.length + 2 === memoryCards.length) {
      setTimeout(() => {
        completeStage('memory');
      }, 1000);
    }
  };
  
  // Handle question answers
  const handleAnswer = (questionIndex, answerIndex) => {
    if (showFeedback) return; // Prevent multiple selections during feedback
    
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      
      if (answerIndex === questions[questionIndex].correctAnswer) {
        if (questionIndex < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          completeStage('quiz');
        }
      }
    }, 1000);
  };
  
  // Mark a stage as completed and progress to next stage
  const completeStage = (stageName) => {
    setCompleted([...completed, stageName]);
    
    // Determine next stage
    if (stageName === 'start') {
      setStage('memory');
    } else if (stageName === 'memory') {
      setStage('quiz');
    } else if (stageName === 'quiz') {
      setStage('message');
      setCurrentMessageScreen(0);
      setShowNextButton(false);
    } else if (stageName === 'message') {
      if (currentMessageScreen < messageScreens.length - 1) {
        setCurrentMessageScreen(currentMessageScreen + 1);
        setShowNextButton(false);
      } else {
        setStage('proposal');
        setProposalAnimationComplete(false);
      }
    }
  };
  
  // Handle next message button
  const handleNextMessage = () => {
    completeStage('message');
  };
  
  // Trigger confetti explosion
  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };
  
  // Handle proposal response
  const handleResponse = (isYes) => {
    if (isYes) {
      // Show confetti animation
      triggerConfetti();
      
      // Show credentials dialog
      setShowCredentials(true);
    } else {
      // Improved feedback
      alert("¡Tómate tu tiempo para pensarlo! Estaré esperando tu respuesta... ❤️");
    }
  };
  
  // Render the current stage
  const renderStage = () => {
    switch (stage) {
      case 'start':
        return (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-3xl font-bold mb-4 text-rose-600">Tengo algo especial para ti</h1>
            <p className="text-lg mb-6">¿Te animas a descubrir que es?</p>
            
            <div className="mb-8 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3 text-rose-500">Elige una canción para acompañarte:</h3>
              <div className="grid grid-cols-1 gap-3">
                {songs.map(song => (
                  <button
                    key={song.id}
                    onClick={() => playSong(song.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 
                      ${selectedSong === song.id 
                        ? 'bg-rose-50 border-rose-500 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-rose-300'}`}
                  >
                    <div className="flex items-center">
                      <Music className={`mr-3 ${selectedSong === song.id ? 'text-rose-500' : 'text-gray-400'}`} size={20} />
                      <div className="text-left">
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-gray-500">{song.artist}</p>
                      </div>
                    </div>
                    {selectedSong === song.id && (
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => completeStage('start')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-full text-lg flex items-center transition-all duration-300 transform hover:scale-105"
              disabled={!selectedSong}
            >
              Comenzar <ArrowRight className="ml-2" size={20} />
            </button>
            {!selectedSong && (
              <p className="text-sm text-gray-500 mt-2">Selecciona una canción para continuar</p>
            )}
          </div>
        );
      
      case 'memory':
        return (
          <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold mb-1 text-center">Primero practiquemos la memoria</h2>
            <h2 className="text-md mb-4 text-center">Encuentra las parejas para avanzar</h2>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {memoryCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-2xl
                    ${flipped.includes(card.id) || matched.includes(card.id) 
                      ? 'bg-rose-100' 
                      : 'bg-rose-500'} 
                    ${matched.includes(card.id) ? 'opacity-70' : 'opacity-100'}
                    transition-all duration-300`}
                >
                  {(flipped.includes(card.id) || matched.includes(card.id)) && (
                    <span className="text-3xl">{card.content}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Parejas encontradas: {matched.length / 2} de {memoryCards.length / 2}
            </div>
          </div>
        );
      
      case 'quiz':
        const question = questions[currentQuestion];
        return (
          <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold mb-4 text-center">{question.question}</h2>
            <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`py-3 px-4 rounded-lg border-2 text-left transition-all duration-200
                    ${showFeedback && answers[currentQuestion] === index 
                      ? index === question.correctAnswer
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Pregunta {currentQuestion + 1} de {questions.length}
            </div>
          </div>
        );
      
      case 'message':
        const currentMessage = messageScreens[currentMessageScreen];
        return (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md relative overflow-hidden">
              {hearts.slice(0, 5).map((heart, i) => (
                <Heart
                  key={`heart-decoration-${i}`}
                  className="absolute text-rose-200"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: i % 2 === 0 ? '10%' : '85%',
                    width: `${heart.size/2}px`,
                    height: `${heart.size/2}px`,
                    opacity: heart.opacity - 0.1,
                  }}
                />
              ))}
              <h2 className="text-2xl font-bold mb-4 text-rose-600">{currentMessage.title}</h2>
              <p className="text-lg mb-6">{typingText}<span className={`animate-pulse ${showNextButton ? 'hidden' : 'inline'}`}>|</span></p>
              {showNextButton && (
                <button 
                  onClick={handleNextMessage}
                  className="mt-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-full text-lg flex items-center mx-auto transition-all duration-300 transform hover:scale-105"
                >
                  Continuar <ChevronRight className="ml-1" size={18} />
                </button>
              )}
            </div>
          </div>
        );
      
      case 'proposal':
        return (
          <div className="flex flex-col items-center justify-center p-4 text-center relative min-h-[400px]">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map(heart => (
                <Heart
                  key={`heart-bg-${heart.id}`}
                  className="absolute text-rose-500"
                  style={{
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    width: `${heart.size}px`,
                    height: `${heart.size}px`,
                    opacity: heart.opacity,
                    animation: `float ${heart.animationDuration}s ease-in-out ${heart.animationDelay}s infinite alternate`
                  }}
                />
              ))}
              {stars.map(star => (
                <Star
                  key={`star-bg-${star.id}`}
                  className="absolute text-amber-400"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.opacity,
                    animation: `pulse ${star.animationDuration}s ease-in-out ${star.animationDelay}s infinite alternate`
                  }}
                />
              ))}
            </div>
            
            <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 max-w-sm w-full relative z-10 backdrop-blur">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                {/* Se eliminó el efecto animate-pulse del título */}
                <h1 className="text-4xl font-bold text-rose-600 mb-6">
                  {typingText}
                  <span className={`animate-pulse ${proposalAnimationComplete ? 'hidden' : 'inline'}`}>|</span>
                </h1>
                
                {proposalAnimationComplete && (
                  <div className="flex flex-col gap-4 mt-6 animate-fade-in">
                    <button 
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full text-xl transform transition hover:scale-105 text-center animate-bounce"
                      onClick={() => handleResponse(true)}
                    >
                      ¡Sí, quiero! ❤️
                    </button>
                    <button 
                      onClick={() => handleResponse(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full text-lg transform transition hover:scale-105"
                    >
                      Necesito pensarlo...
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Credentials dialog */}
            {showCredentials && (
              <CredentialsDialog 
                onClose={() => setShowCredentials(false)}
                onRedirect={() => window.open('https://love-history.netlify.app/', '_blank')}
              />
            )}
          </div>
        );
      
      default:
        return <div>Cargando...</div>;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-rose-50 to-rose-100 overflow-hidden">
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* Progress indicator */}
      {stage !== 'start' && stage !== 'proposal' && (
        <div className="bg-white p-2 shadow-sm w-full">
          <div className="flex justify-center gap-2 max-w-sm mx-auto">
            <div className={`h-2 flex-1 rounded-full ${completed.includes('start') || stage !== 'start' ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${completed.includes('memory') || stage === 'message' ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${completed.includes('quiz') ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${completed.includes('message') ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      )}
      
      {/* Volume control - siempre visible */}
      <div className="fixed top-8 right-8 z-50">
        <div 
          className="bg-white bg-opacity-80 rounded-full p-2 shadow-md cursor-pointer flex items-center"
          onClick={() => setShowVolumeControl(!showVolumeControl)}
        >
          <Volume2 size={20} className="text-rose-500" />
          {showVolumeControl && (
            <div className="ml-2 w-24 h-6 flex items-center">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange}
                className="w-full h-1 appearance-none bg-rose-200 rounded-full outline-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(244, 63, 94, 1) 0%, rgba(244, 63, 94, 1) ${volume * 100}%, rgba(254, 205, 211, 1) ${volume * 100}%, rgba(254, 205, 211, 1) 100%)`
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {renderStage()}
        </div>
      </div>
    </div>
  );
}