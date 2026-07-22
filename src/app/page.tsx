"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Volume2, VolumeX, 
  ExternalLink, Check, RotateCcw, Settings, X, ShieldCheck
} from "lucide-react";

// ----------------------------------------------------
// ⚙️ CONFIGURATION: Discord User ID
// ----------------------------------------------------
const DISCORD_USER_ID = "1491533148914450614";

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

// --- Blue Petals Animation Component ---
const FallingPetals = () => {
  const [petals, setPetals] = useState<Array<{ id: number; x: number; duration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
      size: 12 + Math.random() * 10,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: "-10vh", x: `${petal.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [`${petal.x}vw`, `${petal.x + (Math.random() * 10 - 5)}vw`, `${petal.x}vw`],
            opacity: [0, 0.8, 0.8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
          style={{ width: petal.size, height: petal.size }}
          className="absolute"
        >
          {/* Blue Petal SVG Shape */}
          <svg viewBox="0 0 30 30" fill="none" className="w-full h-full text-blue-400/60 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
            <path
              d="M15 0C15 0 20 10 25 15C30 20 20 30 15 30C10 30 0 20 5 15C10 10 15 0 15 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(1);

  // Admin Panel State
  const [adminOpen, setAdminOpen] = useState(false);
  const [customViewsInput, setCustomViewsInput] = useState("");
  const [customLikesInput, setCustomLikesInput] = useState("");

  // Live Lanyard Discord Status State
  const [status, setStatus] = useState<DiscordStatus>("offline");
  const [customStatus, setCustomStatus] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lanyard REST & WS Sync
  useEffect(() => {
    let ws: WebSocket | null = null;

    const fetchLanyardStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const data = await res.json();
        if (data?.success && data?.data) {
          setStatus(data.data.discord_status || "offline");
          if (data.data.custom_status?.state) {
            setCustomStatus(data.data.custom_status.state);
          }
        }
      } catch (err) {
        console.error("Lanyard REST error:", err);
      }
    };

    const connectLanyardWS = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_USER_ID },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.t === "INIT_STATE" || parsed.t === "PRESENCE_UPDATE") {
            const presence = parsed.d;
            if (presence?.discord_status) {
              setStatus(presence.discord_status as DiscordStatus);
            }
            if (presence?.custom_status?.state) {
              setCustomStatus(presence.custom_status.state);
            } else {
              setCustomStatus(null);
            }
          }
        } catch (e) {
          console.error("WebSocket parse error:", e);
        }
      };

      ws.onclose = () => {
        setTimeout(connectLanyardWS, 5000);
      };
    };

    fetchLanyardStatus();
    connectLanyardWS();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Unique View Counter Logic
  useEffect(() => {
    const handleUniqueView = async () => {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipRes.json();
        const viewedIPs = JSON.parse(localStorage.getItem("suva_viewed_ips") || "[]");

        if (!viewedIPs.includes(ip)) {
          const currentViews = parseInt(localStorage.getItem("suva_views_count") || "1", 10);
          const nextViews = currentViews + 1;
          setViews(nextViews);
          localStorage.setItem("suva_views_count", nextViews.toString());
          localStorage.setItem("suva_viewed_ips", JSON.stringify([...viewedIPs, ip]));
        } else {
          setViews(parseInt(localStorage.getItem("suva_views_count") || "1", 10));
        }
      } catch (e) {
        setViews(parseInt(localStorage.getItem("suva_views_count") || "1", 10));
      }
    };

    handleUniqueView();
  }, []);

  const handleEnter = () => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * (audioRef.current.duration || 1);
    audioRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);

    const cMin = Math.floor(current / 60);
    const cSec = Math.floor(current % 60).toString().padStart(2, "0");
    setCurrentTimeStr(`${cMin}:${cSec}`);

    if (audioRef.current.duration) {
      const dMin = Math.floor(duration / 60);
      const dSec = Math.floor(duration % 60).toString().padStart(2, "0");
      setDurationStr(`${dMin}:${dSec}`);
    }
  };

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const updateViewsFromAdmin = () => {
    const val = parseInt(customViewsInput, 10);
    if (!isNaN(val)) {
      setViews(val);
      localStorage.setItem("suva_views_count", val.toString());
    }
  };

  const updateLikesFromAdmin = () => {
    const val = parseInt(customLikesInput, 10);
    if (!isNaN(val)) {
      setLikes(val);
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case "online":
        return <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" title="Online" />;
      case "idle":
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-amber-400 border-4 border-zinc-950 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)] flex items-center justify-start pl-0.5" title="Idle">
            <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full -mt-1 -ml-0.5" />
          </div>
        );
      case "dnd":
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-red-500 border-4 border-zinc-950 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)] flex items-center justify-center" title="Do Not Disturb">
            <div className="w-2.5 h-0.5 bg-zinc-950 rounded-full" />
          </div>
        );
      case "offline":
      default:
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#747f8d] border-4 border-zinc-950 rounded-full flex items-center justify-center" title="Offline">
            <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-y-auto select-none">
      <audio
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        loop
      />

      {/* --- BACKGROUND ANIMATION --- */}
      <FallingPetals />

      {/* --- INTRO SCREEN OVERLAY --- */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.h1 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]"
            >
              suva.
            </motion.h1>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-xs font-mono uppercase tracking-widest text-indigo-300/80 mt-4"
            >
              Click anywhere to enter
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADMIN PANEL MODAL --- */}
      <AnimatePresence>
        {adminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-indigo-400" size={18} />
                  <h3 className="font-bold text-sm text-white">Admin Control Panel</h3>
                </div>
                <button onClick={() => setAdminOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Override Views</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="number" 
                      placeholder={views.toString()} 
                      value={customViewsInput}
                      onChange={(e) => setCustomViewsInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <button onClick={updateViewsFromAdmin} className="bg-indigo-600 hover:bg-indigo-500 text-xs px-3 rounded-lg font-medium">Set</button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Override Likes</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="number" 
                      placeholder={likes.toString()} 
                      value={customLikesInput}
                      onChange={(e) => setCustomLikesInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <button onClick={updateLikesFromAdmin} className="bg-indigo-600 hover:bg-indigo-500 text-xs px-3 rounded-lg font-medium">Set</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[400px] flex flex-col gap-4 my-6 z-10">

        {/* --- MAIN PROFILE CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-[32px] bg-zinc-950/80 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-3xl overflow-hidden relative"
        >
          {/* Top Admin & Views Header */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between">
            <button 
              onClick={() => setAdminOpen(true)}
              className="p-1.5 rounded-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white transition hover:scale-105"
              title="Admin Panel"
            >
              <Settings size={14} />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[11px] text-zinc-300">
              <Eye size={12} className="text-blue-400" />
              <span>{views}</span>
            </div>
          </div>

          {/* Banner Image */}
          <div className="h-44 w-full relative bg-zinc-900 overflow-hidden">
            <img src="/banner.gif" alt="Banner" className="w-full h-full object-cover" />
          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-16">
            
            {/* PFP */}
            <div className="relative mb-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-full border-4 border-zinc-950 shadow-2xl overflow-hidden bg-zinc-900"
              >
                <img 
                  src="/pfp.jpeg" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/pfp.jpg";
                  }}
                  alt="suva" 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              {renderStatusBadge()}
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">suva.</h2>
            <p className="text-xs text-zinc-400 font-medium">@soxsuvaa • she/her</p>

            {/* Live Discord Status State */}
            {customStatus && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[11px] text-zinc-300 bg-white/5 border border-white/10 px-3 py-0.5 rounded-full mt-2 font-sans"
              >
                {customStatus}
              </motion.p>
            )}

            {/* Badges Pill Box */}
            <div className="flex items-center gap-2 my-3.5">
              {/* ZFC Custom Badge */}
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-xs font-mono font-bold text-zinc-200 shadow-sm hover:border-white/20 transition">
                <span className="text-amber-400">⚡</span>
                <span>ZFC</span>
              </div>
              
              {/* Discord Badges Container */}
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
                {/* 1st Badge: Nitro */}
                <div title="Nitro" className="w-4 h-4 flex items-center justify-center">
                  <img src="/nitro.webp" alt="Nitro" className="w-full h-full object-contain" />
                </div>

                {/* 2nd Badge: Boost */}
                <div title="Server Booster" className="w-4 h-4 flex items-center justify-center">
                  <img src="/boost.png" alt="Boost" className="w-full h-full object-contain" />
                </div>

                {/* 3rd Badge: Quest */}
                <div title="Quest Completed" className="w-4 h-4 flex items-center justify-center">
                  <img src="/quest.jpg" alt="Quest" className="w-full h-full object-contain rounded-full" />
                </div>

                {/* 4th Badge: Orb */}
                <div title="Orb Badge" className="w-4 h-4 flex items-center justify-center">
                  <img src="/orb.png" alt="Orb" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Music Player */}
            <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 my-1 text-left backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src="/album.jpg" alt="Album" className="w-12 h-12 rounded-xl object-cover shadow-md" />
                  <div>
                    <p className="text-xs font-bold text-white">misery</p>
                    <p className="text-[11px] text-zinc-400 font-medium">pupsies</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 mr-1">
                      <motion.span animate={{ height: ["20%", "100%", "30%"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-blue-400 rounded-full" />
                      <motion.span animate={{ height: ["80%", "20%", "90%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-blue-400 rounded-full" />
                      <motion.span animate={{ height: ["40%", "90%", "20%"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-blue-400 rounded-full" />
                    </div>
                  )}

                  <button onClick={restartAudio} className="p-2 text-zinc-400 hover:text-white transition">
                    <RotateCcw size={14} />
                  </button>
                  <button onClick={toggleMute} className="p-2 text-zinc-400 hover:text-white transition">
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <button onClick={togglePlay} className="p-2.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-lg">
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{currentTimeStr}</span>
                  <span>{durationStr}</span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={toggleLike}
              className={`w-full mt-2 py-2.5 rounded-xl border font-medium text-xs flex items-center justify-center gap-2 transition ${
                hasLiked 
                  ? "bg-pink-500/10 border-pink-500/40 text-pink-400" 
                  : "bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20"
              }`}
            >
              <Heart size={14} className={hasLiked ? "fill-pink-400 text-pink-400" : ""} />
              <span>{likes} Likes</span>
            </motion.button>

          </div>
        </motion.div>

        {/* --- TIKTOK SHOWCASE CARD --- */}
        <motion.a
          href="https://tiktok.com/@not.p1nk"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-[28px] bg-zinc-950/80 border border-pink-500/40 shadow-[0_0_35px_rgba(236,72,153,0.15)] backdrop-blur-2xl flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img src="/tiktok.png" alt="TikTok" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">TikTok</p>
                <p className="text-sm font-black text-white">P1NKK <span className="text-zinc-400 font-normal">@not.p1nk</span></p>
              </div>
            </div>
            <ExternalLink size={16} className="text-zinc-500 group-hover:text-white transition" />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs font-black text-white">19</p>
              <p className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase">Following</p>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs font-black text-white">385</p>
              <p className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase">Followers</p>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs font-black text-white">2.5K</p>
              <p className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase">Likes</p>
            </div>
          </div>
        </motion.a>

        {/* --- CONNECTIONS CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full p-4 rounded-[28px] bg-zinc-950/70 border border-white/10 backdrop-blur-2xl flex flex-col gap-2.5"
        >
          <p className="text-xs font-bold text-zinc-400 text-left px-1">Connections</p>

          {/* Roblox Connection */}
          <a 
            href="https://roblox.com/users/serdemsivridagg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 p-1 flex items-center justify-center">
                <img src="/roblox.png" alt="Roblox" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-medium text-zinc-200">serdemsivridagg</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>

          {/* Spotify Connection */}
          <a 
            href="https://open.spotify.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 p-1 flex items-center justify-center">
                <img src="/spotify.png" alt="Spotify" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-medium text-zinc-200">soxsuva</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>

          {/* Xbox Connection */}
          <a 
            href="https://xbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 p-1 flex items-center justify-center">
                <img src="/xbox.png" alt="Xbox" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-medium text-zinc-200">soxsuva</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>
        </motion.div>

      </div>
    </div>
  );
}
