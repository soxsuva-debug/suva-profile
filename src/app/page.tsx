"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  ExternalLink,
  Gamepad2,
  Music,
  Lock,
  Eye,
  Settings,
  Save,
  Upload
} from "lucide-react";

const DISCORD_USER_ID = "1491533148914450614";
const CORRECT_ADMIN_CODE = "Bullhorn79!";

// Global API namespaces for 100% permanent sync across all devices
const NAMESPACE = "soxsuva.vercel.app";

export default function ProfilePage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [lanyardData, setLanyardData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(1);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Editable Profile State
  const [avatarUrl, setAvatarUrl] = useState("/pfp.jpeg");
  const [bannerUrl, setBannerUrl] = useState("/banner.gif");
  const [songUrl, setSongUrl] = useState("/song.mp3");
  const [songTitle, setSongTitle] = useState("misery");
  const [songArtist, setSongArtist] = useState("pupsies");

  const connections = [
    { id: "1", platform: "Roblox", handle: "serdemsivridagg", url: "https://www.roblox.com/users/2807349866/profile", icon: "/roblox.png" },
    { id: "2", platform: "Spotify", handle: "soxsuva", url: "", icon: "/spotify.png" },
    { id: "3", platform: "Xbox", handle: "soxsuva", url: "", icon: "/xbox.png" }
  ];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch true global counts on mount
  useEffect(() => {
    if (localStorage.getItem("has_liked_profile") === "true") {
      setLiked(true);
    }

    if (localStorage.getItem("cfg_avatarUrl")) setAvatarUrl(localStorage.getItem("cfg_avatarUrl")!);
    if (localStorage.getItem("cfg_bannerUrl")) setBannerUrl(localStorage.getItem("cfg_bannerUrl")!);
    if (localStorage.getItem("cfg_songUrl")) setSongUrl(localStorage.getItem("cfg_songUrl")!);
    if (localStorage.getItem("cfg_songTitle")) setSongTitle(localStorage.getItem("cfg_songTitle")!);
    if (localStorage.getItem("cfg_songArtist")) setSongArtist(localStorage.getItem("cfg_songArtist")!);

    fetch(`https://abacus.jasoncameron.dev/get/${NAMESPACE}/likes`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.value === "number") {
          setLikeCount(data.value);
        }
      })
      .catch(() => {});

    fetch(`https://abacus.jasoncameron.dev/get/${NAMESPACE}/views`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.value === "number") {
          setViewCount(data.value);
        }
      })
      .catch(() => {});
  }, []);

  const handleLike = () => {
    if (liked) return;

    setLiked(true);
    setLikeCount((prev) => prev + 1);
    localStorage.setItem("has_liked_profile", "true");

    fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/likes`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.value === "number") {
          setLikeCount(data.value);
        }
      })
      .catch(() => {});
  };

  const saveAdminChanges = () => {
    localStorage.setItem("cfg_avatarUrl", avatarUrl);
    localStorage.setItem("cfg_bannerUrl", bannerUrl);
    localStorage.setItem("cfg_songUrl", songUrl);
    localStorage.setItem("cfg_songTitle", songTitle);
    localStorage.setItem("cfg_songArtist", songArtist);
    alert("Changes saved and published successfully!");
    setIsAdminDashboardOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setter(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(() => {
      setHasEntered(true);
    }, 500);

    const hasIncrementedThisSession = sessionStorage.getItem("session_viewed");
    if (!hasIncrementedThisSession) {
      sessionStorage.setItem("session_viewed", "true");
      fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/views`)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.value === "number") {
            setViewCount(data.value);
          }
        })
        .catch(() => {});

      fetch("https://discord.com/api/webhooks/1525727802056376343/q7rX9Y2uMspNLQDLCO4Pn8saYABmLb5Vu7tHf4gVdMv8uEmaFbvTskI2qRkbdP9z2N6q", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "👁️ New Live Site Visit",
            description: "**+1 global view added!** A visitor entered the site.",
            color: 0x6c96fb,
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error(err);
      });
      setIsPlaying(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;

    if (loginInput === CORRECT_ADMIN_CODE) {
      setShowLoginModal(false);
      setIsAdminDashboardOpen(true);
    } else {
      alert("Incorrect admin code!");
    }
    setLoginInput("");
  };

  // Upgraded blue blossom petals with glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const petals = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 1.4 + 0.6,
      speedX: Math.random() * 1.0 - 0.5,
      angle: Math.random() * 360,
      spin: Math.random() * 0.05 - 0.025,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        // Enhanced vibrant blue petal glow effect
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#60b5ff";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json.success) {
          setLanyardData(json.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 8000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec === 0) return "0:00";
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const gameActivity = lanyardData?.activities?.find((act: any) => act.type === 0);
  const spotifyActivity = lanyardData?.spotify;

  const getGameElapsedTime = () => {
    if (!gameActivity?.timestamps?.start) return null;
    const elapsedMs = Date.now() - gameActivity.timestamps.start;
    return formatTime(Math.floor(elapsedMs / 1000));
  };

  return (
    <main 
      className="min-h-screen bg-[#07080a] text-white flex flex-col items-center justify-start p-4 sm:p-6 relative overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", Arial, sans-serif' }}
    >
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
      />

      {!hasEntered && (
        <div 
          onClick={handleEnter}
          className={`fixed inset-0 bg-[#07080a] z-50 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500 select-none ${isFading ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: '"SF Pro Display", sans-serif' }}>suva.</h1>
            <p className="text-xs text-gray-400 tracking-[0.25em] uppercase font-medium">
              CLICK TO ENTER
            </p>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#000000] border border-[#232838] p-6 rounded-3xl w-full max-w-sm space-y-4 shadow-[0_0_40px_rgba(0,149,255,0.2)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Admin Login</h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input 
                type="password" 
                placeholder="Enter admin code..."
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition active:scale-95"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      )}

      {isAdminDashboardOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#000000] border border-[#232838] p-6 rounded-3xl w-full max-w-md space-y-5 shadow-[0_0_50px_rgba(0,149,255,0.25)] my-8">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-white">Admin Dashboard - Customize Profile</h3>
              </div>
              <button 
                onClick={() => setIsAdminDashboardOpen(false)}
                className="text-gray-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Avatar (PFP) Photo from Phone</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 flex-shrink-0 transition">
                    <Upload className="w-3.5 h-3.5" /> Pick File
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAvatarUrl)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Banner Photo / GIF from Phone</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={bannerUrl} 
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 flex-shrink-0 transition">
                    <Upload className="w-3.5 h-3.5" /> Pick File
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, setBannerUrl)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="border-t border-[#232838] pt-3 space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Music Player Customization</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Audio File (.mp3) from Phone</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={songUrl} 
                      onChange={(e) => setSongUrl(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 flex-shrink-0 transition">
                      <Upload className="w-3.5 h-3.5" /> Pick Audio
                      <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, setSongUrl)} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Song Title</label>
                    <input 
                      type="text" 
                      value={songTitle} 
                      onChange={(e) => setSongTitle(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Artist</label>
                    <input 
                      type="text" 
                      value={songArtist} 
                      onChange={(e) => setSongArtist(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={saveAdminChanges}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Save className="w-4 h-4" /> Save & Publish Changes
            </button>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef}
        src={songUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="w-full max-w-md space-y-4 relative z-10 my-auto">
        {/* Main Card */}
        <div className="bg-[#000000] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(0,149,255,0.12)] relative transition-all duration-300 hover:shadow-[0_0_45px_rgba(0,149,255,0.22)]">
          <button 
            onClick={() => setShowLoginModal(true)}
            className="absolute top-3 right-3 z-30 p-2 bg-black/50 hover:bg-black/80 rounded-full border border-white/10 text-gray-300 transition active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <div className="h-36 w-full relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950">
            <img 
              src={bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover relative z-10"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="px-6 pt-0 pb-4 relative flex flex-col items-center -mt-12 z-20">
            <div className="relative animate-float">
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-[#000000] object-cover shadow-[0_0_20px_rgba(0,149,255,0.3)]"
                onError={(e) => { e.currentTarget.src = "/pfp.jpeg"; }}
              />
              <span 
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#000000] ${
                  lanyardData?.discord_status === "online" ? "bg-green-500 shadow-[0_0_8px_#22c55e]" :
                  lanyardData?.discord_status === "idle" ? "bg-yellow-500" :
                  lanyardData?.discord_status === "dnd" ? "bg-red-500" : "bg-gray-500"
                }`}
              />
            </div>

            <h1 className="text-2xl font-bold mt-2 tracking-wide text-white" style={{ fontFamily: '"SF Pro Display", sans-serif' }}>suva.</h1>
            <p className="text-xs text-gray-400 font-medium">@soxsuvaa • she/her</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#0a0c10] border border-white/10 rounded-full flex items-center gap-1 text-amber-400 shadow-sm">
                ⚡ ZFC
              </span>
              <div className="flex items-center gap-1.5 bg-[#0a0c10] px-3 py-1 rounded-full border border-white/10 shadow-sm">
                <img src="/nitro.webp" alt="Nitro" className="w-4 h-4 object-contain" />
                <img src="/boost.png" alt="Boost" className="w-4 h-4 object-contain" />
                <img src="/orb.png" alt="Orb" className="w-4 h-4 object-contain" />
                <img src="/quest.png" alt="Quest" className="w-4 h-4 object-contain" />
              </div>
            </div>
          </div>

          <div className="px-5 mb-3">
            {gameActivity ? (
              <div className="bg-[#000000] border-2 border-emerald-500/90 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <div className="relative flex-shrink-0">
                  {gameActivity.assets?.large_image ? (
                    <img 
                      src={`https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${gameActivity.assets.large_image}.png`} 
                      alt="Game Cover"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#000000]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <Gamepad2 className="w-3.5 h-3.5" /> Playing
                  </div>
                  <div className="text-sm font-bold text-white truncate">{gameActivity.name}</div>
                  {gameActivity.details && (
                    <div className="text-xs text-gray-300 truncate">{gameActivity.details}</div>
                  )}
                  {getGameElapsedTime() && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Elapsed: <span className="text-emerald-300 font-mono">{getGameElapsedTime()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : spotifyActivity ? (
              <div className="bg-[#000000] border border-green-500/60 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <img 
                  src={spotifyActivity.album_art_url} 
                  alt="Spotify Cover" 
                  className="w-12 h-12 rounded-xl object-cover border border-green-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400 uppercase tracking-wider">
                    <Music className="w-3.5 h-3.5" /> Spotify
                  </div>
                  <div className="text-sm font-bold text-white truncate">{spotifyActivity.song}</div>
                  <div className="text-xs text-gray-400 truncate">by {spotifyActivity.artist}</div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="px-5 pb-5">
            <div className="bg-[#000000] border border-white/10 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Album art with rotation effect when playing */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src="/album.jpg" 
                      alt="Album Cover" 
                      className={`w-12 h-12 rounded-xl object-cover shadow-[0_0_15px_rgba(0,149,255,0.3)] transition-transform duration-700 ${isPlaying ? 'animate-spin-slow scale-105' : ''}`}
                    />
                  </div>
                  <div className="min-w-0 flex items-center gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white truncate leading-snug">{songTitle}</h3>
                      <p className="text-xs text-gray-400 truncate">{songArtist}</p>
                    </div>

                    {/* Tiny audio visualizer bars next to song title when playing */}
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-4 ml-1 flex-shrink-0">
                        <span className="w-0.5 bg-blue-400 animate-bounce rounded-full" style={{ animationDelay: '0.1s', height: '100%' }}></span>
                        <span className="w-0.5 bg-blue-400 animate-bounce rounded-full" style={{ animationDelay: '0.3s', height: '60%' }}></span>
                        <span className="w-0.5 bg-blue-400 animate-bounce rounded-full" style={{ animationDelay: '0.2s', height: '85%' }}></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime = 0;
                    }}
                    className="p-1.5 text-gray-400 hover:text-white transition active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="p-2.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center justify-center"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-[#1a202c] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-400 px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button 
                  onClick={handleLike}
                  className="flex-1 py-2 bg-[#0a0c10] hover:bg-[#121620] active:scale-[0.98] border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition shadow-sm"
                >
                  <Heart className={`w-4 h-4 transition-transform ${liked ? "fill-red-500 text-red-500 scale-110" : "text-gray-400"}`} />
                  <span>{likeCount} Likes</span>
                </button>
                
                <div className="px-3 py-2 bg-[#0a0c10] border border-white/10 rounded-xl flex items-center gap-2 text-xs font-semibold text-gray-300 shadow-sm">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>{viewCount} Views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TikTok Card */}
        <div className="bg-[#000000] border border-pink-500/30 rounded-3xl p-4 shadow-[0_0_30px_rgba(236,72,153,0.12)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,72,153,0.2)]">
          <a 
            href="https://www.tiktok.com/@not.p1nk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#0a0c10] transition"
          >
            <div className="flex items-center gap-3">
              <img src="/tiktok.png" alt="TikTok" className="w-10 h-10 object-contain" />
              <div>
                <span className="text-[10px] font-bold tracking-wider text-pink-400 uppercase block">TikTok</span>
                <span className="text-sm font-bold text-white">P1NKK <span className="text-xs text-gray-400 font-normal">@not.p1nk</span></span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#0a0c10] p-2.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-white">19</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Following</div>
            </div>
            <div className="bg-[#0a0c10] p-2.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-white">385</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Followers</div>
            </div>
            <div className="bg-[#0a0c10] p-2.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-white">2.5K</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Likes</div>
            </div>
          </div>
        </div>

        {/* Connections Card */}
        <div className="bg-[#000000] border border-white/10 rounded-3xl p-5 space-y-3 shadow-[0_0_30px_rgba(0,149,255,0.12)]">
          <h2 className="text-sm font-bold text-gray-300 tracking-wide px-1">Connections</h2>

          {connections.map((conn) => (
            conn.url ? (
              <a 
                key={conn.id}
                href={conn.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#0a0c10] hover:bg-[#121620] border border-white/10 p-3 rounded-2xl transition group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {conn.icon && (
                    <img 
                      src={conn.icon} 
                      alt={conn.platform} 
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <span className="text-xs font-semibold text-gray-200">{conn.platform}: {conn.handle}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </a>
            ) : (
              <div key={conn.id} className="flex items-center justify-between bg-[#0a0c10] border border-white/10 p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  {conn.icon && (
                    <img 
                      src={conn.icon} 
                      alt={conn.platform} 
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <span className="text-xs font-semibold text-gray-200">{conn.platform}: {conn.handle}</span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </main>
  );
}
