"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Settings, Volume2, VolumeX, 
  RotateCcw, ShieldCheck, Code, Sparkles, Check, X, Gamepad2, Disc
} from "lucide-react";

export default function ProfilePage() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");
  const [likes, setLikes] = useState(8);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(1026);
  const [showAdmin, setShowAdmin] = useState(false);

  // Pre-loaded with your Discord User ID
  const [discordId, setDiscordId] = useState("1491533148914450614");
  const [discordData, setDiscordData] = useState<any>(null);

  // Profile Customization State
  const [profile, setProfile] = useState({
    username: "suva.uk",
    tagline: "hi",
    role: "Editor",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    songTitle: "90mph",
    artistName: "JBEE",
    songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    albumCoverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=80"
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch live Discord status from Lanyard API
  useEffect(() => {
    if (!discordId) return;

    const fetchDiscordStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const data = await res.json();
        if (data.success) {
          setDiscordData(data.data);
        }
      } catch (err) {
        console.error("Error fetching Lanyard status:", err);
      }
    };

    fetchDiscordStatus();
    const interval = setInterval(fetchDiscordStatus, 10000); // Polls every 10 seconds
    return () => clearInterval(interval);
  }, [discordId]);

  // Keyboard shortcut to open admin modal (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        setShowAdmin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setViews((prev) => prev + 1);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500";
      case "idle": return "bg-amber-500";
      case "dnd": return "bg-rose-500";
      default: return "bg-zinc-500";
    }
  };

  const currentActivity = discordData?.activities?.find((a: any) => a.type === 0);
  const spotifyData = discordData?.spotify;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden select-none">
      <audio
        ref={audioRef}
        src={profile.songUrl}
        onTimeUpdate={handleTimeUpdate}
        loop
      />

      {/* Enter Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.h1 
              animate={{ opacity: [0.6, 1, 0.6] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 text-white"
            >
              {profile.username}
            </motion.h1>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Click to Enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: entered ? 1 : 0.95, opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm rounded-3xl bg-zinc-900/80 border border-zinc-800/80 shadow-2xl backdrop-blur-xl overflow-hidden relative"
      >
        {/* Admin Settings Cog */}
        <button
          onClick={() => setShowAdmin(true)}
          className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-zinc-400 hover:text-white transition"
          title="Open Admin Panel"
        >
          <Settings size={16} />
        </button>

        {/* View Counter Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs text-zinc-300 backdrop-blur-md">
          <Eye size={12} />
          <span>{views.toLocaleString()}</span>
        </div>

        {/* Banner */}
        <div className="h-32 w-full relative overflow-hidden bg-zinc-800">
          <img
            src={profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-zinc-900/90" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center -mt-12">
          {/* Avatar with Live Discord Avatar & Status Indicator */}
          <div className="relative mb-3">
            <img
              src={discordData?.discord_user?.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${discordData.discord_user.avatar}.png` : profile.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-900 shadow-xl"
            />
            <div 
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-zinc-900 ${getStatusColor(discordData?.discord_status)}`}
              title={`Discord Status: ${discordData?.discord_status || "offline"}`}
            />
          </div>

          {/* User Info */}
          <h2 className="text-xl font-bold tracking-wide text-white">{profile.username}</h2>
          
          <div className="flex items-center gap-2 my-2">
            <span className="p-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><ShieldCheck size={14} /></span>
            <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Sparkles size={14} /></span>
            <span className="p-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"><Code size={14} /></span>
          </div>

          <p className="text-sm font-medium text-zinc-400 mb-3">{profile.role}</p>

          {/* Bio / Quote Container */}
          <div className="w-full py-2.5 px-4 rounded-2xl bg-zinc-800/40 border border-zinc-800/60 mb-3 text-center">
            <p className="text-sm italic text-zinc-300">{profile.tagline}</p>
          </div>

          {/* Live Discord Activity / Game Status */}
          {currentActivity && (
            <div className="w-full p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-3 text-left flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Gamepad2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Playing Now</p>
                <p className="text-xs font-semibold text-white truncate">{currentActivity.name}</p>
                {currentActivity.details && <p className="text-[11px] text-zinc-400 truncate">{currentActivity.details}</p>}
              </div>
            </div>
          )}

          {/* Live Spotify Status */}
          {spotifyData && (
            <div className="w-full p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-3 text-left flex items-center gap-3">
              <img src={spotifyData.album_art_url} alt="Spotify" className="w-10 h-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                  <Disc size={10} className="animate-spin" /> Listening to Spotify
                </p>
                <p className="text-xs font-semibold text-white truncate">{spotifyData.song}</p>
                <p className="text-[11px] text-zinc-400 truncate">{spotifyData.artist}</p>
              </div>
            </div>
          )}

          {/* Audio Player */}
          <div className="w-full p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-800/80 mb-4 text-left">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profile.albumCoverUrl}
                alt="Album Cover"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{profile.songTitle}</p>
                <p className="text-xs text-zinc-400 truncate">{profile.artistName}</p>
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>{currentTimeStr}</span>
                <span>{durationStr}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2 pt-1">
              <button 
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} 
                className="text-zinc-400 hover:text-white transition"
              >
                <RotateCcw size={16} />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
              >
                {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
              </button>

              <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="w-full flex items-center justify-between pt-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                hasLiked
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  : "bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <Heart size={14} className={hasLiked ? "fill-rose-400" : ""} />
              <span>{likes}</span>
            </button>

            <span className="text-[11px] text-zinc-500 font-mono">
              {profile.username}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Embedded Admin Modal */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} /> Admin Customizer
                </h3>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="p-1 text-zinc-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-indigo-400 font-bold mb-1">Discord User ID</label>
                  <input
                    type="text"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    className="w-full bg-zinc-800 border border-indigo-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Tagline / Text</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={profile.bannerUrl}
                    onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Song Title</label>
                  <input
                    type="text"
                    value={profile.songTitle}
                    onChange={(e) => setProfile({ ...profile, songTitle: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={profile.artistName}
                    onChange={(e) => setProfile({ ...profile, artistName: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Audio Direct MP3 URL</label>
                  <input
                    type="text"
                    value={profile.songUrl}
                    onChange={(e) => setProfile({ ...profile, songUrl: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowAdmin(false)}
                className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save & Apply
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
