"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Volume2, VolumeX, 
  RotateCcw, Lock, KeyRound, ExternalLink, Check, X
} from "lucide-react";

// Discord Badge SVGs
const ActiveDevBadge = () => (
  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
  </svg>
);
const NitroBadge = () => (
  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5 3L2 12l5.5 9h9L22 12l-5.5-9h-9zm1.8 3h5.4L18.6 12l-3.9 6H9.3L5.4 12l3.9-6z"/>
  </svg>
);
const BoostBadge = () => (
  <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/>
  </svg>
);
const HypeSquadBadge = () => (
  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 12l11 10 11-10L12 2zm0 3.8l7 6.2-7 6.2-7-6.2 7-6.2z"/>
  </svg>
);

// Connection Logos
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

  const [likes, setLikes] = useState(14);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(128);

  const [showAdmin, setShowAdmin] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [discordId] = useState("1491533148914450614");
  const [discordData, setDiscordData] = useState<any>(null);

  const [profile, setProfile] = useState({
    username: "suva.",
    handle: "soxsuvaa",
    pronouns: "she/her",
    tagline: "hi",
    // User requested avatar URL (from Photo Booth image)
    avatarUrl: "https://i.ibb.co/689yYx4/suva-pfp.png", 
    bannerUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZydWJuaGt5dm5uZHB3czB2MmxlOW4yc244ZjE5bzVjZmJkZnh5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKRn6q8RylCkh0y/giphy.gif",
    songTitle: "misery",
    artistName: "pupsies",
    songUrl: "/pupsies-misery.mp3",
    albumCoverUrl: "/misery.jpg"
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedViews = parseInt(localStorage.getItem("suva_views") || "128", 10);
    const savedLikes = parseInt(localStorage.getItem("suva_likes") || "14", 10);
    const userLiked = localStorage.getItem("suva_has_liked") === "true";

    setViews(savedViews);
    setLikes(savedLikes);
    setHasLiked(userLiked);
  }, []);

  useEffect(() => {
    if (!discordId) return;

    const fetchDiscord = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const data = await res.json();
        if (data.success) {
          setDiscordData(data.data);
        }
      } catch (e) {
        console.error("Lanyard error:", e);
      }
    };

    fetchDiscord();
    const interval = setInterval(fetchDiscord, 10000);
    return () => clearInterval(interval);
  }, [discordId]);

  const handleEnter = () => {
    setEntered(true);
    
    if (!localStorage.getItem("suva_has_viewed")) {
      const nextViews = views + 1;
      setViews(nextViews);
      localStorage.setItem("suva_views", nextViews.toString());
      localStorage.setItem("suva_has_viewed", "true");
    }

    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.log("Audio play error:", err);
      });
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleLike = () => {
    let newLikes = likes;
    if (!hasLiked) {
      newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      localStorage.setItem("suva_has_liked", "true");
    } else {
      newLikes = Math.max(0, likes - 1);
      setLikes(newLikes);
      setHasLiked(false);
      localStorage.setItem("suva_has_liked", "false");
    }
    localStorage.setItem("suva_likes", newLikes.toString());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "soxsuva@gmail.com" && passwordInput === "Bullhorn79!") {
      setIsAuthenticated(true);
      setAuthError(false);
      setUsernameInput("");
      setPasswordInput("");
    } else {
      setAuthError(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]";
      case "idle": return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]";
      case "dnd": return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]";
      default: return "bg-zinc-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <audio
        ref={audioRef}
        src={profile.songUrl}
        onTimeUpdate={handleTimeUpdate}
        loop
      />

      {/* Atmospheric Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 1200 - 600, 
              y: Math.random() * 1000 - 500, 
              opacity: Math.random() * 0.5 + 0.2, 
              scale: Math.random() * 0.8 + 0.4 
            }}
            animate={{ 
              y: [0, -120, 0], 
              x: [0, 40, 0],
              opacity: [0.2, 0.7, 0.2] 
            }}
            transition={{ 
              duration: Math.random() * 8 + 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-2 h-2 bg-blue-300/30 rounded-full blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Enter Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <motion.h1 
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(99,102,241,0.3)",
                    "0 0 40px rgba(168,85,247,0.6)",
                    "0 0 20px rgba(99,102,241,0.3)"
                  ]
                }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-300"
              >
                {profile.username}
              </motion.h1>
              
              <div className="flex items-center justify-center gap-2">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-indigo-500/50" />
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-indigo-300/80">
                  Click to enter
                </p>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-indigo-500/50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: entered ? 1 : 0.92, opacity: entered ? 1 : 0, y: entered ? 0 : 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] space-y-4 relative z-10 my-8"
      >
        {/* Main Profile Glass Card */}
        <div className="rounded-[32px] bg-zinc-950/60 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-3xl overflow-hidden relative">
          
          {/* Views Counter */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] text-zinc-300 backdrop-blur-md shadow-xl">
            <Eye size={12} className="text-blue-400 animate-pulse" />
            <span className="font-mono font-medium">{views.toLocaleString()}</span>
          </div>

          {/* Banner */}
          <div className="h-40 w-full relative overflow-hidden bg-zinc-900">
            <img
              src={profile.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-950/90" />
          </div>

          {/* Card Body */}
          <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-16">
            {/* Avatar */}
            <div className="relative mb-3">
              <motion.div 
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-zinc-950/90 shadow-2xl ring-1 ring-white/10"
                />
                <div 
                  className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-zinc-950 ${getStatusColor(discordData?.discord_status)}`}
                  title={`Status: ${discordData?.discord_status || "offline"}`}
                />
              </motion.div>
            </div>

            {/* Names */}
            <div className="space-y-0.5 mb-2">
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5 drop-shadow-md">
                {profile.username}
              </h2>
              <p className="text-xs font-medium text-zinc-400 flex items-center justify-center gap-1.5">
                <span>@{profile.handle}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500 font-mono text-[11px]">{profile.pronouns}</span>
              </p>
            </div>

            {/* Real Discord Badges */}
            <div className="flex items-center gap-2 my-2 py-1 px-3 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <span title="Active Developer"><ActiveDevBadge /></span>
              <span title="Subscriber / Nitro"><NitroBadge /></span>
              <span title="Server Booster"><BoostBadge /></span>
              <span title="HypeSquad"><HypeSquadBadge /></span>
            </div>

            {/* Tagline Box */}
            <div className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.03] border border-white/5 my-2 text-center backdrop-blur-md">
              <p className="text-xs text-zinc-300 font-medium italic">"{profile.tagline}"</p>
            </div>

            {/* Music Player */}
            <div className="w-full p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 my-2 text-left shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={profile.albumCoverUrl}
                  alt="Album Cover"
                  className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{profile.songTitle}</p>
                    {isPlaying && (
                      <div className="flex items-end gap-[2px] h-3">
                        <motion.span animate={{ height: ["20%", "100%", "30%"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-indigo-400 rounded-full" />
                        <motion.span animate={{ height: ["60%", "20%", "90%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2px] bg-indigo-400 rounded-full" />
                        <motion.span animate={{ height: ["30%", "80%", "40%"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-indigo-400 rounded-full" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate font-medium mt-0.5">{profile.artistName}</p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>{currentTimeStr}</span>
                  <span>{durationStr}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between mt-2 pt-1">
                <button 
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} 
                  className="text-zinc-500 hover:text-white transition"
                >
                  <RotateCcw size={14} />
                </button>
                
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-xl"
                >
                  {isPlaying ? <Pause size={15} fill="black" /> : <Play size={15} fill="black" className="ml-0.5" />}
                </motion.button>

                <button onClick={toggleMute} className="text-zinc-500 hover:text-white transition">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Like Counter */}
            <div className="w-full flex items-center justify-between pt-2">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  hasLiked
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                <Heart size={13} className={hasLiked ? "fill-rose-400" : ""} />
                <span>{likes}</span>
              </motion.button>

              <span className="text-[11px] text-zinc-500 font-mono">
                {profile.username}
              </span>
            </div>
          </div>
        </div>

        {/* TikTok Card (Replacing Roblox Card) */}
        <div className="p-4 rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-3xl text-left shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-black border border-white/10 text-white">
              <TikTokIcon />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">TikTok</p>
              <p className="text-sm font-bold text-white leading-tight">P1NKK <span className="text-xs font-normal text-zinc-400">@not.p1nk</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
            <div className="bg-white/[0.02] p-2 rounded-2xl border border-white/5">
              <p className="text-sm font-black text-white">19</p>
              <p className="text-[9px] uppercase font-bold text-zinc-500">Following</p>
            </div>
            <div className="bg-white/[0.02] p-2 rounded-2xl border border-white/5">
              <p className="text-sm font-black text-white">385</p>
              <p className="text-[9px] uppercase font-bold text-zinc-500">Followers</p>
            </div>
            <div className="bg-white/[0.02] p-2 rounded-2xl border border-white/5">
              <p className="text-sm font-black text-white">2.5K</p>
              <p className="text-[9px] uppercase font-bold text-zinc-500">Likes</p>
            </div>
          </div>
        </div>

        {/* Connections Box */}
        <div className="p-4 rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-3xl text-left shadow-xl space-y-3">
          <p className="text-xs font-bold text-zinc-400 tracking-wider">Connections</p>

          <div className="space-y-2">
            {/* Roblox Connection */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5">
                <RobloxIcon />
                <span className="text-xs font-medium text-zinc-200">serdemsivridagg</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Check size={13} className="text-emerald-400" />
                <ExternalLink size={12} />
              </div>
            </div>

            {/* Spotify Connection */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5">
                <SpotifyIcon />
                <span className="text-xs font-medium text-zinc-200">soxsuva</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Check size={13} className="text-emerald-400" />
                <ExternalLink size={12} />
              </div>
            </div>

            {/* Xbox Connection */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5">
                <XboxIcon />
                <span className="text-xs font-medium text-zinc-200">soxsuva</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Check size={13} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login Modal Trigger */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAdmin(true)}
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition"
          >
            <Lock size={11} />
            <span>Admin Login</span>
          </button>
        </div>
      </motion.div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAdmin(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white transition"
              >
                <X size={20} />
              </button>

              {!isAuthenticated ? (
                <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 py-2 text-left">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-lg mb-1">
                    <KeyRound size={20} /> Owner Admin Access
                  </div>
                  <p className="text-xs text-zinc-400">
                    Sign in to modify live site settings.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Username</label>
                      <input
                        type="text"
                        name="admin_user_field"
                        autoComplete="off"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Enter email"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        name="admin_pass_field"
                        autoComplete="off"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    {authError && <p className="text-xs text-rose-500 mt-1 font-medium">Invalid credentials. Try again.</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-lg"
                  >
                    Log In
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs text-left max-h-[75vh] overflow-y-auto pr-1">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Admin Customizer</h3>

                  <div>
                    <label className="block text-zinc-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={profile.avatarUrl}
                      onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => setShowAdmin(false)}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Save & Apply
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
