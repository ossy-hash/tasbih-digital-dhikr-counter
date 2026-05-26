import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Undo2, 
  Volume2, 
  VolumeX, 
  History, 
  Sparkles, 
  Trash2, 
  Plus, 
  X, 
  Music, 
  BookOpen, 
  Award, 
  Moon, 
  Info, 
  Sun
} from 'lucide-react';

interface Dhikr {
  english: string;
  arabic: string;
  meaning: string;
  isCustom?: boolean;
}

interface HistoryItem {
  id: string;
  phrase: string;
  count: number;
  timestamp: string;
}

const DEFAULT_PRESETS: Dhikr[] = [
  { english: "Subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ", meaning: "Glory be to Allah" },
  { english: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", meaning: "Praise be to Allah" },
  { english: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", meaning: "Allah is the Greatest" },
  { english: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", meaning: "There is no god but Allah" },
  { english: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", meaning: "I seek forgiveness from Allah" },
];

const STANDARD_TARGETS = [33, 99, 100, 500, 1000];

const THEMES = [
  {
    id: 'emerald',
    name: 'Divine Emerald',
    bgGradient: 'from-[#020b09] via-[#041d1d] to-[#01140f]',
    textAccent: 'text-[#D4AF37]',
    borderAccent: 'border-[#D4AF37]/15',
    borderAccentSolid: 'border-[#D4AF37]/35',
    borderAccentSubtle: 'border-[#D4AF37]/10',
    bgAccentSubtle: 'bg-[#D4AF37]/10',
    bgAccentMoreSubtle: 'bg-[#D4AF37]/5',
    bgAccentGlow: 'bg-[#D4AF37]/10',
    headerBg: 'bg-[#031c17]/60 border-[#D4AF37]/15',
    logoContainerBg: 'from-[#06332a] to-[#031c17] border-[#D4AF37]/25',
    chipContainerBg: 'bg-[#03231f]/60 border-[#D4AF37]/15',
    cardBg: 'bg-[#031d18]/50 border-[#D4AF37]/15',
    innerPlateBg: 'from-[#052d24] via-[#031c17] to-[#010907] border-[#D4AF37]/35',
    undoBtn: 'bg-[#2b2519]/95 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#383021] hover:border-[#D4AF37]/60',
    applyBtn: 'bg-[#D4AF37] hover:bg-[#e4bf49] text-slate-950',
    bannerBg: 'from-[#D4AF37] via-[#f7d976] to-[#D4AF37]',
    badgeBg: 'bg-[#D4AF37]/25 text-[#D4AF37]'
  },
  {
    id: 'obsidian',
    name: 'Kaba Obsidian',
    bgGradient: 'from-[#020202] via-[#0d0d0d] to-[#050505]',
    textAccent: 'text-[#E5B842]',
    borderAccent: 'border-[#E5B842]/15',
    borderAccentSolid: 'border-[#E5B842]/35',
    borderAccentSubtle: 'border-[#E5B842]/10',
    bgAccentSubtle: 'bg-[#E5B842]/10',
    bgAccentMoreSubtle: 'bg-[#E5B842]/5',
    bgAccentGlow: 'bg-[#E5B842]/10',
    headerBg: 'bg-[#0c0c0c]/60 border-[#E5B842]/15',
    logoContainerBg: 'from-[#1a1a1a] to-[#0c0c0c] border-[#E5B842]/25',
    chipContainerBg: 'bg-[#121212]/60 border-[#E5B842]/15',
    cardBg: 'bg-[#121212]/50 border-[#E5B842]/15',
    innerPlateBg: 'from-[#222222] via-[#121212] to-[#040404] border-[#E5B842]/35',
    undoBtn: 'bg-[#262015]/95 text-[#E5B842] border-[#E5B842]/30 hover:bg-[#342a1a] hover:border-[#E5B842]/60',
    applyBtn: 'bg-[#E5B842] hover:bg-[#f3ca5b] text-slate-950',
    bannerBg: 'from-[#E5B842] via-[#ffd979] to-[#E5B842]',
    badgeBg: 'bg-[#E5B842]/25 text-[#E5B842]'
  },
  {
    id: 'velvet',
    name: 'Royal Sapphire',
    bgGradient: 'from-[#020514] via-[#071330] to-[#010617]',
    textAccent: 'text-[#38bdf8]',
    borderAccent: 'border-[#38bdf8]/15',
    borderAccentSolid: 'border-[#38bdf8]/35',
    borderAccentSubtle: 'border-[#38bdf8]/10',
    bgAccentSubtle: 'bg-[#38bdf8]/10',
    bgAccentMoreSubtle: 'bg-[#38bdf8]/5',
    bgAccentGlow: 'bg-[#38bdf8]/10',
    headerBg: 'bg-[#091535]/60 border-[#38bdf8]/15',
    logoContainerBg: 'from-[#11255e] to-[#091535] border-[#38bdf8]/25',
    chipContainerBg: 'bg-[#091535]/60 border-[#38bdf8]/15',
    cardBg: 'bg-[#091a3c]/50 border-[#38bdf8]/15',
    innerPlateBg: 'from-[#0f306e] via-[#091a3c] to-[#020a1c] border-[#38bdf8]/35',
    undoBtn: 'bg-[#132d4a]/95 text-[#38bdf8] border-[#38bdf8]/30 hover:bg-[#1b3d63] hover:border-[#38bdf8]/60',
    applyBtn: 'bg-[#38bdf8] hover:bg-[#7dd3fc] text-slate-950',
    bannerBg: 'from-[#38bdf8] via-[#a5f3fc] to-[#38bdf8]',
    badgeBg: 'bg-[#38bdf8]/25 text-[#38bdf8]'
  }
];

export default function App() {
  // App settings/state loaders
  const [presets, setPresets] = useState<Dhikr[]>(() => {
    const saved = localStorage.getItem('tasbih_presets_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.warn(e); }
    }
    return DEFAULT_PRESETS;
  });

  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tasbih_counts_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.warn(e); }
    }
    return {
      "Subhanallah": 0,
      "Alhamdulillah": 0,
      "Allahu Akbar": 0,
      "La ilaha illallah": 0,
      "Astaghfirullah": 0
    };
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return Number(localStorage.getItem('tasbih_active_idx_v2') || '0');
  });

  const [activeTarget, setActiveTarget] = useState<number>(() => {
    return Number(localStorage.getItem('tasbih_target_v2') || '33');
  });

  const [soundMode, setSoundMode] = useState<'bell' | 'wood' | 'mute'>(() => {
    return (localStorage.getItem('tasbih_sound_mode_v2') as 'bell' | 'wood' | 'mute') || 'bell';
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('tasbih_history_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.warn(e); }
    }
    return [];
  });

  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(() => {
    return Number(localStorage.getItem('tasbih_cycles_v2') || '0');
  });

  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('tasbih_theme_id_v2') || 'emerald';
  });

  // Presentation UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isCelebrationTriggered, setIsCelebrationTriggered] = useState(false);
  const [completionBanner, setCompletionBanner] = useState<string | null>(null);

  // Input states
  const [newEnglish, setNewEnglish] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [customTargetInput, setCustomTargetInput] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tasbih_presets_v2', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('tasbih_counts_v2', JSON.stringify(counts));
  }, [counts]);

  useEffect(() => {
    localStorage.setItem('tasbih_active_idx_v2', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem('tasbih_target_v2', activeTarget.toString());
  }, [activeTarget]);

  useEffect(() => {
    localStorage.setItem('tasbih_sound_mode_v2', soundMode);
  }, [soundMode]);

  useEffect(() => {
    localStorage.setItem('tasbih_history_v2', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('tasbih_cycles_v2', totalCompletedCycles.toString());
  }, [totalCompletedCycles]);

  useEffect(() => {
    localStorage.setItem('tasbih_theme_id_v2', themeId);
  }, [themeId]);

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const activeDhikr = presets[currentIndex] || DEFAULT_PRESETS[0];
  const currentCount = counts[activeDhikr.english] || 0;
  const progress = Math.min(currentCount / activeTarget, 1.0);

  const cycleTheme = () => {
    const nextIdx = (THEMES.findIndex(t => t.id === themeId) + 1) % THEMES.length;
    setThemeId(THEMES[nextIdx].id);
  };

  const playSound = (count: number) => {
    if (soundMode === 'mute') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (soundMode === 'wood') {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.setValueAtTime(1100 + (count % 33) * 5, now);
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (soundMode === 'bell') {
        const harmonics = [440, 660, 880, 1320];
        const gains = [0.12, 0.06, 0.03, 0.01];
        harmonics.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq + (count % 33) * 3, now);
          osc.type = 'sine';
          gainNode.gain.setValueAtTime(gains[idx], now);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.9);
        });
      }
    } catch (e) {
      console.warn("Audio Context failed to boot", e);
    }
  };

  const handleIncrement = () => {
    let nextCount = currentCount + 1;
    if (currentCount >= activeTarget) {
      nextCount = 1;
      setIsCelebrationTriggered(false);
    }
    const key = activeDhikr.english;
    
    setCounts(prev => ({
      ...prev,
      [key]: nextCount
    }));
    playSound(nextCount);

    if (nextCount === activeTarget) {
      setIsCelebrationTriggered(true);
      setTotalCompletedCycles(prev => prev + 1);

      const now = new Date();
      const timeVal = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateVal = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

      const newLog: HistoryItem = {
        id: Math.random().toString(36).substring(2),
        phrase: activeDhikr.english,
        count: activeTarget,
        timestamp: `${dateVal} • ${timeVal}`
      };

      setHistory(prev => [newLog, ...prev].slice(0, 15));
      setCompletionBanner(`Masha'Allah! Target of ${activeTarget} reached for ${activeDhikr.english}`);

      setTimeout(() => {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const nowTime = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, nowTime);
            gain.gain.setValueAtTime(0.12, nowTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, nowTime + 0.6);
            osc.start(nowTime);
            osc.stop(nowTime + 0.7);
          }
        } catch (e) {}
      }, 140);

      setTimeout(() => {
        setCompletionBanner(null);
      }, 5000);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      setCounts(prev => ({
        ...prev,
        [activeDhikr.english]: currentCount - 1
      }));
      playSound(currentCount - 1);
    }
  };

  const handleResetInitiation = () => {
    if (currentCount > 0) {
      setShowResetConfirm(true);
    }
  };

  const confirmReset = () => {
    setCounts(prev => ({
      ...prev,
      [activeDhikr.english]: 0
    }));
    setShowResetConfirm(false);
    setIsCelebrationTriggered(false);
  };

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newArabic.trim()) return;

    const keyName = newEnglish.trim();
    const isExist = presets.some(p => p.english.toLowerCase() === keyName.toLowerCase());
    
    if (isExist) {
       alert("This phrase already exists.");
       return;
    }

    const newItem: Dhikr = {
      english: keyName,
      arabic: newArabic.trim(),
      meaning: newMeaning.trim() || "Custom Dhikr Phrase",
      isCustom: true
    };

    setPresets(prev => [...prev, newItem]);
    setCounts(prev => ({
      ...prev,
      [keyName]: 0
    }));

    setCurrentIndex(presets.length);
    setNewEnglish('');
    setNewArabic('');
    setNewMeaning('');
    setShowAddModal(false);
  };

  const handleDeleteCustomPreset = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const presetToDelete = presets[indexToDelete];
    if (!presetToDelete.isCustom) return;

    if (confirm(`Remove custom phrase "${presetToDelete.english}"?`)) {
      const updatedPresets = presets.filter((_, idx) => idx !== indexToDelete);
      setPresets(updatedPresets);

      const updatedCounts = { ...counts };
      delete updatedCounts[presetToDelete.english];
      setCounts(updatedCounts);

      if (currentIndex >= updatedPresets.length) {
        setCurrentIndex(Math.max(0, updatedPresets.length - 1));
      }
    }
  };

  const handleCustomTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customTargetInput);
    if (!isNaN(val) && val > 0) {
      setActiveTarget(val);
      setCustomTargetInput('');
      setIsCelebrationTriggered(false);
    }
  };

  const clearHistoryLog = () => {
    if (confirm("Are you sure you want to clear your entire history log?")) {
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };


  return (
    <div id="dhikr-app-shell" className={`min-h-screen bg-gradient-to-tr ${activeTheme.bgGradient} text-slate-100 font-sans selection:bg-[#D4AF37]/35 selection:text-white flex flex-col justify-between`}>
      
      {/* GLOBAL MILESTONE REACHED ACCENT BANNER */}
      <AnimatePresence>
        {completionBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -45 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -45 }}
            className={`fixed top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[480px] bg-gradient-to-r ${activeTheme.bannerBg} text-slate-950 p-4 rounded-2xl shadow-2xl border border-white/20 z-50 flex items-center justify-between gap-3 font-sans`}
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-slate-950/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
              </span>
              <div>
                <span className="text-[10px] block font-black uppercase tracking-wider text-slate-950/70 leading-none">Milestone Reached</span>
                <p className="text-xs font-black text-slate-950 mt-1">{completionBanner}</p>
              </div>
            </div>
            <button 
              onClick={() => setCompletionBanner(null)}
              className="p-1 hover:bg-slate-950/10 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 text-slate-950" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE TOPBAR BANNER MENU */}
      <header className={`sticky top-0 z-40 ${activeTheme.headerBg} backdrop-blur-md border-b transition-colors duration-300 py-4 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <button
              onClick={cycleTheme}
              className={`p-2.5 bg-gradient-to-br ${activeTheme.logoContainerBg} rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center`}
              title={`Switch Custom Aesthetic Theme (Current: ${activeTheme.name})`}
            >
              {activeTheme.id === 'emerald' && <Moon className={`w-5.5 h-5.5 ${activeTheme.textAccent}`} />}
              {activeTheme.id === 'obsidian' && <Sparkles className={`w-5.5 h-5.5 ${activeTheme.textAccent}`} />}
              {activeTheme.id === 'velvet' && <Sun className={`w-5.5 h-5.5 ${activeTheme.textAccent}`} />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] tracking-widest ${activeTheme.textAccent} font-black uppercase`}>Tasbih Suite</span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-white mt-0.5">Tasbih Dhikr Digital</h1>
            </div>
          </div>

          {/* QUICK METRICS CAPSULE */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className={`px-3 py-1.5 bg-black/30 border ${activeTheme.borderAccent} rounded-lg flex items-center gap-2`}>
              <Award className={`w-4 h-4 ${activeTheme.textAccent}`} />
              <div>
                <span className="text-[8.5px] block text-slate-400 font-semibold uppercase tracking-wider leading-none">Cycles Complete</span>
                <span className="font-mono text-xs font-bold text-white leading-none mt-1.5 inline-block">{totalCompletedCycles} Times</span>
              </div>
            </div>

            <div className={`flex items-center bg-black/30 border ${activeTheme.borderAccent} rounded-lg p-0.5`}>
              {(['bell', 'wood', 'mute'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSoundMode(mode)}
                  className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                    soundMode === mode 
                      ? `${activeTheme.id === 'emerald' ? 'bg-[#D4AF37] text-slate-950 shadow' : activeTheme.id === 'obsidian' ? 'bg-[#E5B842] text-slate-950 shadow' : 'bg-[#38bdf8] text-slate-950 shadow'}`
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
                >
                  {mode === 'bell' && <Music className="w-3.5 h-3.5" />}
                  {mode === 'wood' && <Volume2 className="w-3.5 h-3.5" />}
                  {mode === 'mute' && <VolumeX className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* LAYOUT CONTAINER SWITCH CHANNELS */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow">
        
        <div id="interactive-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center">
            
            {/* INTERACTIVE COMPANION DASHBOARD (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* MOBILE SOUND & CYCLES HUB */}
              <div className={`lg:hidden bg-black/20 border ${activeTheme.borderAccent} rounded-2xl p-4 backdrop-blur shadow-md flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Award className={`w-5 h-5 ${activeTheme.textAccent}`} />
                  <div>
                    <h3 className="text-xs font-extrabold uppercase text-white tracking-widest">Completed Cycles</h3>
                    <p className="text-xs font-bold font-mono text-slate-300 mt-0.5">{totalCompletedCycles} Times Successfully</p>
                  </div>
                </div>
                
                {/* Audio pill for mobile */}
                <div className={`flex items-center bg-black/35 border ${activeTheme.borderAccent} rounded-lg p-0.5`}>
                  {(['bell', 'wood', 'mute'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSoundMode(mode)}
                      className={`p-1.5 rounded text-xs font-bold transition-all ${
                        soundMode === mode 
                          ? `${activeTheme.id === 'emerald' ? 'bg-[#D4AF37] text-slate-100' : activeTheme.id === 'obsidian' ? 'bg-[#E5B842] text-slate-100' : 'bg-[#38bdf8] text-slate-100'}`
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode === 'bell' && 'Bell'}
                      {mode === 'wood' && 'Click'}
                      {mode === 'mute' && 'Mute'}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST CONTROLLER UNIT */}
              <div className={`bg-black/20 border ${activeTheme.borderAccent} rounded-2xl p-4 backdrop-blur shadow-md`}>
                <div className={`flex items-center justify-between mb-3 pb-2 border-b ${activeTheme.borderAccentSubtle}`}>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className={`w-4 h-4 ${activeTheme.textAccent}`} />
                    <h3 className="text-xs font-bold tracking-wider text-white uppercase">Predefined & Custom</h3>
                  </div>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className={`text-[11px] font-extrabold ${activeTheme.textAccent} hover:text-white ${activeTheme.bgAccentSubtle} hover:bg-opacity-20 border ${activeTheme.borderAccentSolid} px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer`}
                  >
                    <Plus className="w-3 h-3" /> Add Phrase
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {presets.map((item, idx) => {
                    const isSelected = idx === currentIndex;
                    const progressVal = counts[item.english] || 0;
                    
                    return (
                      <div
                        key={item.english}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsCelebrationTriggered(false);
                        }}
                        className={`p-3 rounded-xl border transition-all text-left relative overflow-hidden cursor-pointer group ${
                          isSelected 
                            ? `${activeTheme.id === 'emerald' ? 'bg-[#063b2a]/70 border-[#D4AF37]/45 shadow-[#D4AF37]/5' : activeTheme.id === 'obsidian' ? 'bg-[#1e1a11]/70 border-[#E5B842]/45 shadow-[#E5B842]/5' : 'bg-[#091a3c]/70 border-[#38bdf8]/45 shadow-[#38bdf8]/5'} border shadow-md` 
                            : `bg-slate-900/10 border ${activeTheme.borderAccentSubtle} hover:border-slate-500`
                        }`}
                      >
                        <div 
                          className={`absolute left-0 bottom-0 top-0 ${activeTheme.bgAccentMoreSubtle} transition-all duration-300`}
                          style={{ width: `${Math.min((progressVal / activeTarget) * 100, 100)}%` }}
                        />

                        <div className="flex justify-between items-start gap-2 relative z-10">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-white font-sans">{item.english}</p>
                              {item.isCustom && (
                                <span className={`text-[8px] ${activeTheme.badgeBg} px-1 rounded font-bold uppercase`}>Custom</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">{item.meaning}</p>
                          </div>
                          
                          <div className="text-right shrink-0 font-sans">
                            <p className={`font-arabic text-sm ${activeTheme.textAccent} font-bold`}>{item.arabic}</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <span className="text-[10px] font-mono font-bold text-slate-300">{progressVal} counts</span>
                              {item.isCustom && (
                                <button
                                  onClick={(e) => handleDeleteCustomPreset(idx, e)}
                                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-all ml-1 cursor-pointer"
                                  title="Delete preset"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TARGETS CONFIG CHOICES */}
              <div className={`bg-black/20 border ${activeTheme.borderAccent} rounded-2xl p-4 backdrop-blur shadow-md`}>
                <h3 className={`text-xs font-bold tracking-wider text-white uppercase mb-3 pb-2 border-b ${activeTheme.borderAccentSubtle}`}>
                  Set Target Goal
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-2 gap-2">
                  {STANDARD_TARGETS.map((targetVal) => {
                    const isSelected = activeTarget === targetVal;
                    return (
                      <button
                        key={targetVal}
                        onClick={() => {
                          setActiveTarget(targetVal);
                          setIsCelebrationTriggered(false);
                        }}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? `bg-gradient-to-br ${activeTheme.id === 'emerald' ? 'from-[#D4AF37] to-[#e4bf49] shadow-[#D4AF37]/20' : activeTheme.id === 'obsidian' ? 'from-[#E5B842] to-[#f3ca5b] shadow-[#E5B842]/20' : 'from-[#38bdf8] to-[#7dd3fc] shadow-[#38bdf8]/20'} text-slate-950 font-black border border-[#fff]/20 shadow scale-102` 
                            : `bg-black/20 text-slate-300 border ${activeTheme.borderAccentSubtle} hover:border-slate-500`
                        }`}
                      >
                        {targetVal} Taps
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleCustomTargetSubmit} className={`mt-4 flex flex-col gap-1.5 pt-3 border-t ${activeTheme.borderAccentSubtle}`}>
                  <label htmlFor="custom-target-field" className="text-[9.5px] uppercase tracking-wider text-slate-400 font-bold block">
                    Set Custom Goal Size
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="custom-target-field"
                      type="number"
                      placeholder="e.g. 150"
                      value={customTargetInput}
                      onChange={(e) => setCustomTargetInput(e.target.value)}
                      className={`bg-black/30 border ${activeTheme.borderAccent} text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-${activeTheme.id === 'emerald' ? '[#D4AF37]' : activeTheme.id === 'obsidian' ? '[#E5B842]' : '[#38bdf8]'} flex-grow font-mono`}
                      min="1"
                    />
                    <button
                      type="submit"
                      className={`px-3 ${activeTheme.applyBtn} font-black text-xs rounded-lg transition-colors cursor-pointer shrink-0`}
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* CENTRE COLUMN: MASSIVE ENHANCED DIGITAL DIAL COUNTER (5 COLS) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              
              <div className={`w-full max-w-[440px] bg-black/35 border ${activeTheme.borderAccent} rounded-[36px] shadow-2xl p-6 backdrop-blur flex flex-col items-center justify-between relative min-h-[580px]`}>
                
                {/* Subtle water-glowing ambient background */}
                <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-br-[40px] ${
                  activeTheme.id === 'emerald' ? 'from-[#D4AF37]/5' : activeTheme.id === 'obsidian' ? 'from-[#E5B842]/5' : 'from-[#38bdf8]/5'
                }`} />

                <div className="w-full flex justify-between items-center text-left text-[10px] tracking-wider font-extrabold text-white/50 border-b border-white/10 pb-3 z-10">
                  <span>TASBIH ENGINE ACTIVE</span>
                  <span className={`${activeTheme.textAccent} font-black animate-pulse`}>● LIVE COUNTER</span>
                </div>

                {/* Header Detail Presentation */}
                <div className={`w-full pt-4 pb-4 border-b ${activeTheme.borderAccentSubtle} z-10 text-center`}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -7 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-1.5"
                    >
                      <span className="font-arabic text-3xl font-black text-white tracking-wide block leading-snug drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">
                        {activeDhikr.arabic}
                      </span>
                      <span className={`text-[12px] font-black tracking-widest uppercase ${activeTheme.textAccent}`}>
                        {activeDhikr.english}
                      </span>
                      <span className="text-slate-400 text-xs italic line-clamp-1 max-w-[280px] mx-auto font-sans">
                        "{activeDhikr.meaning}"
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ACTIVE CLICKER DIAL COMPONENT */}
                <div 
                  onClick={handleIncrement}
                  className="relative my-8 flex items-center justify-center cursor-pointer group select-none active:scale-95 transition-transform z-10"
                  id="active-web-clicker"
                >
                  {/* Glow backdrop indicator */}
                  <div className={`absolute w-56 h-56 rounded-full transition-all duration-500 blur-2xl ${
                    isCelebrationTriggered 
                      ? `${activeTheme.id === 'emerald' ? 'bg-[#D4AF37]/25 shadow-[#D4AF37]/45' : activeTheme.id === 'obsidian' ? 'bg-[#E5B842]/25 shadow-[#E5B842]/45' : 'bg-[#38bdf8]/25 shadow-[#38bdf8]/45'} scale-110` 
                      : `${activeTheme.id === 'emerald' ? 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/8' : activeTheme.id === 'obsidian' ? 'bg-[#E5B842]/5 group-hover:bg-[#E5B842]/8' : 'bg-[#38bdf8]/5 group-hover:bg-[#38bdf8]/8'} scale-100`
                  }`}></div>

                  {/* Progress Circle visual SVG */}
                  <svg className="w-64 h-64 transform -rotate-90 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke={activeTheme.id === 'emerald' ? 'rgba(212, 175, 55, 0.08)' : activeTheme.id === 'obsidian' ? 'rgba(229, 184, 66, 0.08)' : 'rgba(56, 189, 248, 0.08)'}
                      strokeWidth="11"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke={isCelebrationTriggered ? "#fbbf24" : activeTheme.id === 'emerald' ? '#D4AF37' : activeTheme.id === 'obsidian' ? '#E5B842' : '#38bdf8'}
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 110}
                      strokeDashoffset={2 * Math.PI * 110 * (1 - progress)}
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>

                  {/* Plate structure within click ring */}
                  <div className={`absolute w-[190px] h-[190px] rounded-full bg-gradient-to-br ${activeTheme.innerPlateBg} shadow-inner flex flex-col items-center justify-center gap-1 group-active:scale-95 duration-100 transition-transform`}>
                    <span className={`absolute inset-0 rounded-full ${activeTheme.bgAccentSubtle} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></span>

                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={`${currentIndex}-${currentCount}`}
                        initial={{ scale: 0.85, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        className={`text-6xl font-black font-mono tracking-tight ${
                          isCelebrationTriggered ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]' : 'text-white'
                        }`}
                      >
                        {currentCount}
                      </motion.span>
                    </AnimatePresence>

                    {/* Mini goal badge indicator */}
                    <div className={`px-2.5 py-1 bg-black/40 rounded-full border ${activeTheme.borderAccentSubtle} flex items-center gap-1.5 mt-1 z-10`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isCelebrationTriggered ? 'bg-amber-400 animate-pulse' : activeTheme.id === 'emerald' ? 'bg-[#D4AF37]' : activeTheme.id === 'obsidian' ? 'bg-[#E5B842]' : 'bg-[#38bdf8]'}`} />
                      <span className={`text-[9px] uppercase font-bold tracking-wider font-sans ${isCelebrationTriggered ? 'text-amber-400' : 'text-slate-300'}`}>
                        Target: {activeTarget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM UTILITY ACTIONS ROW */}
                <div className="w-full flex items-center justify-between gap-3 px-1 z-10">
                  <button
                    onClick={handleDecrement}
                    disabled={currentCount === 0}
                    className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 border shadow transition-all cursor-pointer active:scale-95 text-xs ${
                      currentCount > 0 
                        ? activeTheme.undoBtn
                        : `bg-black/20 text-slate-600 border ${activeTheme.borderAccentSubtle} opacity-30 cursor-not-allowed`
                    }`}
                  >
                    <Undo2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Undo</span>
                  </button>

                  <div className={`flex-grow max-w-[120px] py-2 bg-black/40 border ${activeTheme.borderAccent} rounded-xl text-center shadow-inner`}>
                    <span className={`text-[9px] ${activeTheme.textAccent} font-black uppercase tracking-widest block font-sans`}>
                      TAP CIRCLE
                    </span>
                  </div>

                  <button
                    onClick={handleResetInitiation}
                    disabled={currentCount === 0}
                    className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 border shadow transition-all cursor-pointer active:scale-95 text-xs ${
                      currentCount > 0 
                        ? 'bg-red-950/80 text-red-400 border-red-900/35 hover:bg-red-900/40' 
                        : `bg-black/20 text-slate-600 border ${activeTheme.borderAccentSubtle} opacity-30 cursor-not-allowed`
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Reset</span>
                  </button>
                </div>

              </div>

            </div>

            {/* HISTORICAL SESSIONS & DIRECTIVES PANEL (3 COLS) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              <div className={`bg-black/20 border ${activeTheme.borderAccent} rounded-2xl p-4 backdrop-blur shadow-md flex-grow flex flex-col min-h-[360px]`}>
                <div className={`flex items-center justify-between mb-4 pb-2 border-b ${activeTheme.borderAccentSubtle}`}>
                  <div className="flex items-center gap-1.5">
                    <History className={`w-4 h-4 ${activeTheme.textAccent}`} />
                    <h3 className="text-xs font-bold tracking-wider text-white uppercase">Historical Logs</h3>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistoryLog}
                      className="text-[9px] text-red-400 hover:text-red-300 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/10 cursor-pointer"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-grow max-h-[460px] pr-0.5 flex flex-col gap-2">
                  {history.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-1.5 flex-grow">
                      <History className={`w-6 h-6 ${activeTheme.textAccent} opacity-20`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-sans">No completed cycles</p>
                      <p className="text-[9px] text-slate-500 max-w-[140px] mx-auto text-center leading-relaxed font-sans">
                        Complete your chosen active target goal to record logs in your history!
                      </p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className={`p-2.5 bg-black/25 rounded-xl border ${activeTheme.borderAccentSubtle} flex items-center justify-between gap-2 text-xs group/item transition-all hover:bg-black/40`}>
                        <div className="flex-grow min-w-0 font-sans">
                          <p className="font-extrabold text-white text-[11px] leading-tight truncate">{item.phrase}</p>
                          <p className="text-[9.5px] text-slate-400 mt-1 leading-none font-mono">{item.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`font-mono text-[9.5px] font-extrabold ${activeTheme.textAccent} ${activeTheme.bgAccentMoreSubtle} px-1.5 py-0.5 rounded border ${activeTheme.borderAccentSubtle}`}>
                            {item.count} Taps
                          </span>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="p-1 px-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all opacity-0 group-hover/item:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Delete log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* QUICK APP CONTEXT EXPLANATIONS */}
              <div className={`p-4 bg-black/10 border ${activeTheme.borderAccentSubtle} rounded-2xl text-[11px] text-slate-300 leading-relaxed font-sans`}>
                <h4 className="font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className={`w-4 h-4 ${activeTheme.textAccent}`} /> Digital Tasbih
                </h4>
                <p>Keep track of your counts seamlessly. Tapping the central digital ring logs completions directly into your browser's persistent local storage. Enable synthesised tones or switch visual themes above.</p>
              </div>

            </div>

          </div>

      </main>

      {/* FOOTER DESCRIPTIVE SECTION */}
      <footer className={`w-full border-t ${activeTheme.borderAccent} bg-[#020b09] text-xs py-5 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-slate-400 font-medium text-center sm:text-left">
            Dedicated Spiritual Tasbih Digital Platform • Crafted with devotion
          </p>
          <span className="text-[10.5px] text-slate-500 font-mono text-center sm:text-right">
            Tasbih Suite • 2026
          </span>
        </div>
      </footer>

      {/* MODAL 1: CREATE CUSTOM PHRASE */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-sm bg-slate-950 border ${activeTheme.borderAccentSolid} rounded-2xl p-5 shadow-2xl relative font-sans`}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer animate-fadeIn"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus className={`w-4 h-4 ${activeTheme.textAccent}`} /> Create Custom Phrase
              </h4>

              <form onSubmit={handleAddPreset} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-en-input" className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wide">English Transliteration</label>
                  <input
                    id="modal-en-input"
                    type="text"
                    placeholder="e.g. Subhanallahul Azim"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    className={`bg-black/30 border ${activeTheme.borderAccent} text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-${activeTheme.id === 'emerald' ? '[#D4AF37]' : activeTheme.id === 'obsidian' ? '[#E5B842]' : '[#38bdf8]'}`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-ar-input" className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wide">Arabic Calligraphy</label>
                  <input
                    id="modal-ar-input"
                    type="text"
                    placeholder="e.g. سُبْحَانَ اللَّه الْعَظِيم"
                    value={newArabic}
                    onChange={(e) => setNewArabic(e.target.value)}
                    className={`bg-black/30 border ${activeTheme.borderAccent} text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-${activeTheme.id === 'emerald' ? '[#D4AF37]' : activeTheme.id === 'obsidian' ? '[#E5B842]' : '[#38bdf8]'} font-arabic`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-mean-input" className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wide">Translation Meaning / Description</label>
                  <input
                    id="modal-mean-input"
                    type="text"
                    placeholder="e.g. Glory be to Allah, the Magnificent"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className={`bg-black/30 border ${activeTheme.borderAccent} text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-${activeTheme.id === 'emerald' ? '[#D4AF37]' : activeTheme.id === 'obsidian' ? '[#E5B842]' : '[#38bdf8]'}`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full mt-2 py-2.5 ${activeTheme.applyBtn} font-black text-xs rounded-xl shadow transition-all cursor-pointer`}
                >
                  Save Preset Phrase
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: RESET CONFIRMATION SAFEGUARD */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-950 rounded-2xl p-5 border border-red-900/40 text-center flex flex-col gap-4 max-w-[280px] font-sans"
            >
              <h4 className="text-white font-black text-xs uppercase tracking-widest text-center">Reset Counter?</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Are you sure you want to reset the count for <strong className={`${activeTheme.textAccent} font-bold`}>{activeDhikr.english}</strong> back to zero?
              </p>
              <div className="flex items-center gap-2.5 mt-1 animate-fadeIn">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 py-2 bg-red-400 hover:bg-red-300 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
