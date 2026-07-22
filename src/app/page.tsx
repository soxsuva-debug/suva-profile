"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Volume2, VolumeX, 
  ExternalLink, Sparkles, Check, RotateCcw
} from "lucide-react";

// ----------------------------------------------------
// ⚙️ CONFIGURATION: Your Discord User ID Added
// ----------------------------------------------------
const DISCORD_USER_ID = "1491533148914450614";

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

// --- Clean SVG Discord Badges ---
const ZfcBadge = () => (
  <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-xs font-mono font-bold text-zinc-200 shadow-sm">
    <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
      <path d="M13 2L3 14h7v8l10-12h-7z"/>
    </svg>
    <span>ZFC</span>
  </div>
);

const ActiveDevBadge = () => (
  <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/>
    <circle cx="6" cy="12" r="1.5"/>
  </svg>
);

const NitroBadge = () => (
  <svg className="w-4 h-4 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L2 19h20L12 3zm0 4.5l6.5 10.5h-13L12 7.5z"/>
  </svg>
);

const HypeSquadBadge = () => (
  <svg className="w-4 h-4 text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.7)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const LegacyGemBadge = () => (
  <svg className="w-4 h-4 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l4.5 5.5L12 22 7.5 7.5 12 2z"/>
    <path d="M12 2l4.5 5.5H7.5L12 2z" opacity="0.5"/>
  </svg>
);

// --- Connection SVG Icons ---
const TikTokIcon = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525 0h3.08c.12 1.73.91 3.2 2.21 4.1 1.04.73 2.3 1.15 3.61 1.19V8.4c-1.89-.02-3.64-.62-5.11-1.66V15c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9 9c.53 0 1.04.05 1.54.14V17.3c-.5-.14-1.01-.22-1.54-.22-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V0z"/>
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

  // Live Lanyard Discord Status State
  const [status, setStatus] = useState<DiscordStatus>("offline");
  const [customStatus, setCustomStatus] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Lanyard Sync Effect ---
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
          console.error("WebSocket message parse error:", e);
        }
      };

      ws.onclose = () => {
        setTimeout(connectLanyardWS, 5000); // Auto reconnect
      };
    };

    fetchLanyardStatus();
    connectLanyardWS();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Unique view tracking
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

  const renderStatusBadge = () => {
    switch (status) {
      case "online":
        return <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full shadow-md" title="Online (Live Discord)" />;
      case "idle":
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-amber-400 border-4 border-zinc-950 rounded-full shadow-md flex items-center justify-start pl-0.5" title="Idle (Live Discord)">
            <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full -mt-1 -ml-0.5" />
          </div>
        );
      case "dnd":
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-red-500 border-4 border-zinc-950 rounded-full shadow-md flex items-center justify-center" title="Do Not Disturb (Live Discord)">
            <div className="w-2.5 h-0.5 bg-zinc-950 rounded-full" />
          </div>
        );
      case "offline":
      default:
        return (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#747f8d] border-4 border-zinc-950 rounded-full shadow-md flex items-center justify-center" title="Offline (Live Discord)">
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

      {/* Intro Blur Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400"
            >
              suva.
            </motion.h1>
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-300/80 mt-4 animate-pulse">
              Click anywhere to enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[400px] flex flex-col gap-4 my-6">

        {/* --- MAIN PROFILE CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-[32px] bg-zinc-950/70 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] backdrop-blur-3xl overflow-hidden relative"
        >
          {/* Top Header Views Count */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[11px] text-zinc-300">
              <Eye size={12} className="text-blue-400" />
              <span>{views}</span>
            </div>
          </div>

          {/* Banner */}
          <div className="h-44 w-full relative bg-zinc-900 overflow-hidden">
            <img src="/banner.gif" alt="Banner" className="w-full h-full object-cover" />
          </div>

          {/* Profile Content Details */}
          <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-16">
            
            {/* PFP & Live Lanyard Status Badge */}
            <div className="relative mb-2">
              <div className="w-24 h-24 rounded-full border-4 border-zinc-950 shadow-2xl overflow-hidden bg-zinc-900">
                <img 
                  src="/pfp.jpeg" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/pfp.jpg";
                  }}
                  alt="suva" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {renderStatusBadge()}
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">suva.</h2>
            <p className="text-xs text-zinc-400 font-medium">@soxsuvaa • she/her</p>

            {/* Custom Discord Status Text if present */}
            {customStatus && (
              <p className="text-[11px] text-zinc-300 bg-white/5 border border-white/10 px-3 py-0.5 rounded-full mt-1.5 font-sans">
                {customStatus}
              </p>
            )}

            {/* Badges Layout */}
            <div className="flex items-center gap-2 my-3">
              <ZfcBadge />
              
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <ActiveDevBadge />
                <NitroBadge />
                <HypeSquadBadge />
                <LegacyGemBadge />
              </div>
            </div>

            {/* Music Player */}
            <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 my-2 text-left backdrop-blur-md relative overflow-hidden">
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
                  <button onClick={togglePlay} className="p-2.5 bg-white text-black rounded-full hover:scale-105 transition shadow-lg">
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  </button>
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
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{currentTimeStr}</span>
                  <span>{durationStr}</span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={toggleLike}
              className={`w-full mt-2 py-2.5 rounded-xl border font-medium text-xs flex items-center justify-center gap-2 transition ${
                hasLiked 
                  ? "bg-pink-500/10 border-pink-500/40 text-pink-400" 
                  : "bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20"
              }`}
            >
              <Heart size={14} className={hasLiked ? "fill-pink-400 text-pink-400" : ""} />
              <span>{likes} Likes</span>
            </button>

          </div>
        </motion.div>

        {/* --- SHOWCASED TIKTOK CARD --- */}
        <motion.a
          href="https://tiktok.com/@not.p1nk"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-[28px] bg-zinc-950/80 border border-pink-500/40 shadow-[0_0_35px_rgba(236,72,153,0.15)] backdrop-blur-2xl flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                <TikTokIcon />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">TikTok</p>
                <p className="text-sm font-black text-white">P1NKK <span className="text-zinc-400 font-normal">@not.p1nk</span></p>
              </div>
            </div>
            <ExternalLink size={16} className="text-zinc-500 group-hover:text-white transition" />
          </div>

          {/* TikTok Stats Grid */}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-[28px] bg-zinc-950/70 border border-white/10 backdrop-blur-2xl flex flex-col gap-2.5"
        >
          <p className="text-xs font-bold text-zinc-400 text-left px-1">Connections</p>

          <a 
            href="https://roblox.com/users/serdemsivridagg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/10">
                <RobloxIcon />
              </div>
              <span className="text-xs font-medium text-zinc-200">serdemsivridagg</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>

          <a 
            href="https://open.spotify.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <SpotifyIcon />
              </div>
              <span className="text-xs font-medium text-zinc-200">soxsuva</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>

          <a 
            href="https://xbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <XboxIcon />
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
