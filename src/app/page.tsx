"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Volume2, VolumeX, 
  RotateCcw, Lock, KeyRound, ExternalLink, Check, X, ShieldAlert, Sparkles
} from "lucide-react";

// Discord & Social Icons
const ActiveDevBadge = () => (
  <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
  </svg>
);
const NitroBadge = () => (
  <svg className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5 3L2 12l5.5 9h9L22 12l-5.5-9h-9zm1.8 3h5.4L18.6 12l-3.9 6H9.3L5.4 12l3.9-6z"/>
  </svg>
);
const BoostBadge = () => (
  <svg className="w-4 h-4 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/>
  </svg>
);
const HypeSquadBadge = () => (
  <svg className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 12l11 10 11-10L12 2zm0 3.8l7 6.2-7 6.2-7-6.2 7-6.2z"/>
  </svg>
);

const RobloxIcon = () => (
  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.164 0L0 18.836 18.836 24 24 5.164 5.164 0zm10.231 13.682l-5.113-1.37 1.37-5.113 5.113 1.37-1.37 5.113z"/>
  </svg>
);
const SpotifyIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
  </svg>
);
const XboxIcon = () => (
  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.975 0C5.396 0 0 5.371 0 11.975c0 6.604 5.396 12.025 11.975 12.025 6.58 0 12.025-5.421 12.025-12.025C24 5.371 18.555 0 11.975 0zm.025 3.325c2.825 0 5.362 1.05 7.338 2.788-1.125.862-2.738 2.012-4.8 3.512C13.238 8.65 12.575 8.012 12 8.012c-.575 0-1.238.638-2.538 1.613-2.062-1.5-3.675-2.65-4.8-3.513 1.976-1.737 4.513-2.787 7.338-2.787zM4.325 7.725c1.175.912 2.763 2.075 4.8 3.562-1.575 1.4-2.825 2.713-3.725 3.913-1.05-1.163-1.788-2.588-2.075-4.163.225-1.212.688-2.325 1.35-3.312zm15.35 0c.662.987 1.125 2.1 1.35 3.312-.287 1.575-1.025 3-2.075 4.163-.9-1.2-2.15-2.513-3.725-3.913 2.037-1.487 3.625-2.65 4.8-3.562z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525 0h3.08c.12 1.73.91 3.2 2.21 4.1 1.04.73 2.3 1.15 3.61 1.19V8.4c-1.89-.02-3.64-.62-5.11-1.66V15c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9 9c.53 0 1.04.05 1.54.14V17.3c-.5-.14-1.01-.22-1.54-.22-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V0z"/>
  </svg>
);

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

  // Admin Modal States
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Unique View Counter
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "suva123") {
      setIsAdminLoggedIn(true);
      setShowAdminModal(false);
      setLoginError("");
    } else {
      setLoginError("Invalid Admin Password");
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

  return (
    <div className="min-h-screen bg-[#07080c] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <audio
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        loop
      />

      {/* Enter Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer"
          >
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
              suva.
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-300/80 mt-4">
              Click to enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Card */}
      <div className="w-full max-w-[400px] rounded-[32px] bg-zinc-950/70 border border-blue-500/30 shadow-[0_0_35px_rgba(59,130,246,0.25)] backdrop-blur-3xl overflow-hidden relative">
        
        {/* Top Header Buttons */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[11px] text-zinc-300">
            <Eye size={12} className="text-blue-400" />
            <span>{views}</span>
          </div>

          <button
            onClick={() => setShowAdminModal(true)}
            className="p-1.5 rounded-full bg-black/70 border border-white/10 text-zinc-400 hover:text-white hover:border-blue-500/50 transition-all"
          >
            <Lock size={12} />
          </button>
        </div>

        {/* Banner */}
        <div className="h-44 w-full relative bg-zinc-900">
          <img src="/banner.gif" alt="Banner" className="w-full h-full object-cover" />
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-16">
          
          {/* Profile Picture with JPEG/JPG Dual Route Fallback */}
          <div className="relative w-24 h-24 rounded-full border-4 border-zinc-950 shadow-2xl mb-2 overflow-hidden bg-zinc-900">
            <img 
              src="/pfp.jpeg" 
              onError={(e) => {
                // If .jpeg fails, try fallback to .jpg
                (e.target as HTMLImageElement).src = "/pfp.jpg";
              }}
              alt="suva" 
              className="w-full h-full object-cover" 
            />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">suva.</h2>
          <p className="text-xs text-zinc-400 font-medium">@soxsuvaa • she/her</p>

          {/* Badges */}
          <div className="flex items-center gap-2.5 my-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            <ActiveDevBadge />
            <NitroBadge />
            <BoostBadge />
            <HypeSquadBadge />
          </div>

          {/* Clean Music Player */}
          <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 my-3 text-left backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src="/album.jpg" alt="Album" className="w-12 h-12 rounded-xl object-cover shadow-md" />
                <div>
                  <p className="text-xs font-bold text-white">misery</p>
                  <p className="text-[11px] text-zinc-400 font-medium">pupsies</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-2 text-zinc-400 hover:text-white transition">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <button onClick={togglePlay} className="p-2.5 bg-white text-black rounded-full hover:scale-105 transition shadow-lg">
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </button>
              </div>
            </div>

            {/* Track Progress Bar */}
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

          {/* Social Connections Grid */}
          <div className="w-full grid grid-cols-2 gap-2 my-2">
            <a 
              href="https://tiktok.com/@not.p1nk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <TikTokIcon />
                <span className="text-xs font-medium text-zinc-300">TikTok</span>
              </div>
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </a>

            <a 
              href="https://roblox.com/users/serdemsivridagg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <RobloxIcon />
                <span className="text-xs font-medium text-zinc-300">Roblox</span>
              </div>
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </a>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SpotifyIcon />
                <span className="text-xs font-medium text-zinc-300">Spotify</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Active</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XboxIcon />
                <span className="text-xs font-medium text-zinc-300">Xbox</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Online</span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={toggleLike}
            className={`w-full py-2.5 rounded-xl border font-medium text-xs flex items-center justify-center gap-2 transition ${
              hasLiked 
                ? "bg-pink-500/10 border-pink-500/40 text-pink-400" 
                : "bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20"
            }`}
          >
            <Heart size={14} className={hasLiked ? "fill-pink-400 text-pink-400" : ""} />
            <span>{likes} Likes</span>
          </button>

        </div>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-white/10 p-6 relative shadow-2xl">
              <button 
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <KeyRound size={18} className="text-blue-400" />
                    <h3>Admin Portal</h3>
                  </div>
                  <p className="text-xs text-zinc-400">Enter your passcode to manage profile configurations.</p>
                  
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />

                  {loginError && <p className="text-[11px] text-red-400">{loginError}</p>}

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Authenticate
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Sparkles size={18} />
                    <h3>Admin Controls Active</h3>
                  </div>
                  <p className="text-xs text-zinc-400">You are logged in. View count overrides and custom badges unlocked.</p>
                  <button
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setShowAdminModal(false);
                    }}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
