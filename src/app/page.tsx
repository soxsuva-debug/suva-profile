"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Eye, Volume2, VolumeX, 
  RotateCcw, ShieldCheck, Code, Sparkles, Check, X, Gamepad2, Disc, Lock, KeyRound
} from "lucide-react";

export default function ProfilePage() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");

  // Counters
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(0);

  // Security State
  const [showAdmin, setShowAdmin] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Discord Lanyard State
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
    songUrl: "/pupsies-misery.mp3",
    albumCoverUrl: "/misery.jpg"
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check local visitor tracking on load
  useEffect(() => {
    const savedViews = parseInt(localStorage.getItem("suva_views") || "0", 10);
    const savedLikes = parseInt(localStorage.getItem("suva_likes") || "0", 10);
    const userLiked = localStorage.getItem("suva_has_liked") === "true";

    setViews(savedViews);
    setLikes(savedLikes);
    setHasLiked(userLiked);
  }, []);

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
    const interval = setInterval(fetchDiscordStatus, 10000);
    return () => clearInterval(interval);
  }, [discordId]);

  const handleEnter = () => {
    setEntered(true);
    
    // Visitor IP/Browser unique check: Only increment view once per user device
    const hasViewedBefore = localStorage.getItem("suva_has_viewed");
    if (!hasViewedBefore) {
      const newViewCount = views + 1;
      setViews(newViewCount);
      localStorage.setItem("suva_views", newViewCount.toString());
      localStorage.setItem("suva_has_viewed", "true");
    }

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
      case "online": return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]";
      case "idle": return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]";
      case "dnd": return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]";
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

      {/* Animated Glowing Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -30, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 40, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Enter Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.h1 
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-5xl md:text-7xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]"
              >
                {profile.username}
              </motion.h1>
              <motion.p 
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold"
              >
                [ Click Anywhere To Enter ]
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Profile Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: entered ? 1 : 0.9, opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        className="w-full max-w-sm rounded-3xl bg-zinc-950/70 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden relative z-10"
      >
        {/* View Counter Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-zinc-300 backdrop-blur-md shadow-lg"
        >
          <Eye size={12} className="text-emerald-400 animate-pulse" />
          <span className="font-mono">{views.toLocaleString()}</span>
        </motion.div>

        {/* Banner */}
        <div className="h-36 w-full relative overflow-hidden bg-zinc-900">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-zinc-950" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center -mt-14">
          {/* Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative mb-3"
          >
            <img
              src={discordData?.discord_user?.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${discordData.discord_user.avatar}.png` : profile.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-950 shadow-2xl ring-2 ring-white/10"
            />
            <div 
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-zinc-950 ${getStatusColor(discordData?.discord_status)} transition-all duration-300`}
              title={`Discord Status: ${discordData?.discord_status || "offline"}`}
            />
          </motion.div>

          {/* User Info */}
          <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-md">{profile.username}</h2>
          
          <div className="flex items-center gap-2 my-2.5">
            <span className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]"><ShieldCheck size={14} /></span>
            <span className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><Sparkles size={14} /></span>
            <span className="p-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><Code size={14} /></span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{profile.role}</p>

          {/* Tagline Box */}
          <div className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-3 text-center backdrop-blur-sm">
            <p className="text-sm italic text-zinc-300 font-medium">{profile.tagline}</p>
          </div>

          {/* Discord Activity / Game Status */}
          {currentActivity && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 mb-3 text-left flex items-center gap-3 shadow-lg"
            >
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Gamepad2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Playing Now</p>
                <p className="text-xs font-bold text-white truncate">{currentActivity.name}</p>
                {currentActivity.details && <p className="text-[11px] text-zinc-400 truncate">{currentActivity.details}</p>}
              </div>
            </motion.div>
          )}

          {/* Spotify Live Activity */}
          {spotifyData && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 mb-3 text-left flex items-center gap-3 shadow-lg"
            >
              <img src={spotifyData.album_art_url} alt="Spotify" className="w-10 h-10 rounded-lg object-cover shadow-md" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                  <Disc size={10} className="animate-spin" /> Listening to Spotify
                </p>
                <p className="text-xs font-bold text-white truncate">{spotifyData.song}</p>
                <p className="text-[11px] text-zinc-400 truncate">{spotifyData.artist}</p>
              </div>
            </motion.div>
          )}

          {/* Audio Player */}
          <div className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 text-left shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profile.albumCoverUrl}
                alt="Album Cover"
                className="w-12 h-12 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{profile.songTitle}</p>
                <p className="text-xs text-zinc-400 truncate font-medium">{profile.artistName}</p>
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
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
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
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
              >
                {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
              </motion.button>

              <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="w-full flex items-center justify-between pt-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                hasLiked
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <Heart size={14} className={hasLiked ? "fill-rose-400" : ""} />
              <span>{likes}</span>
            </motion.button>

            <span className="text-[11px] text-zinc-500 font-mono">
              {profile.username}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Admin Login Trigger Button at Bottom Right */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowAdmin(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 backdrop-blur-md transition shadow-xl"
        >
          <Lock size={12} />
          <span>Admin</span>
        </button>
      </div>

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
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4 py-2">
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
                        type="email"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="soxsuva@gmail.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Password</label>
                      <input
                        type="password"
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
                /* Admin Editor Panel */
                <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Admin Customizer</h3>

                  <div>
                    <label className="block text-indigo-400 font-bold mb-1">Discord User ID</label>
                    <input
                      type="text"
                      value={discordId}
                      onChange={(e) => setDiscordId(e.target.value)}
                      className="w-full bg-zinc-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Tagline / Text</label>
                    <input
                      type="text"
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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
                    <label className="block text-zinc-400 mb-1">Banner Image URL</label>
                    <input
                      type="text"
                      value={profile.bannerUrl}
                      onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Song Title</label>
                    <input
                      type="text"
                      value={profile.songTitle}
                      onChange={(e) => setProfile({ ...profile, songTitle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Artist Name</label>
                    <input
                      type="text"
                      value={profile.artistName}
                      onChange={(e) => setProfile({ ...profile, artistName: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Audio Direct MP3 URL</label>
                    <input
                      type="text"
                      value={profile.songUrl}
                      onChange={(e) => setProfile({ ...profile, songUrl: e.target.value })}
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
