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
  Lock
} from "lucide-react";

const DISCORD_USER_ID = "1491533148914450614";

export default function ProfilePage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [lanyardData, setLanyardData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(() => {
      setHasEntered(true);
    }, 500);
    
    fetch("https://discord.com/api/webhooks/1525727802056376343/q7rX9Y2uMspNLQDLCO4Pn8saYABmLb5Vu7tHf4gVdMv8uEmaFbvTskI2qRkbdP9z2N6q", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "👁️ New Site Visit",
          description: "**+1 view added!** Someone entered the site.",
          color: 0x3b82f6,
          timestamp: new Date().toISOString()
        }]
      })
    }).catch(() => {});

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error(err);
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;

    fetch("https://discord.com/api/webhooks/1525727802056376343/q7rX9Y2uMspNLQDLCO4Pn8saYABmLb5Vu7tHf4gVdMv8uEmaFbvTskI2qRkbdP9z2N6q", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: "@everyone",
        embeds: [{
          title: "⚠️ Failed Login Attempt",
          description: "Someone attempted to log in to the profile dashboard.",
          fields: [{
            name: "Attempted Username / ID",
            value: `\`\`\`${loginInput}\`\`\``,
            inline: false
          }],
          color: 0xef4444,
          timestamp: new Date().toISOString()
        }]
      })
    }).catch(() => {});

    setLoginInput("");
    setShowLoginModal(false);
  };

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

    const petals = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 4,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: Math.random() * 0.8 - 0.4,
      angle: Math.random() * 360,
      spin: Math.random() * 0.04 - 0.02,
      opacity: Math.random() * 0.6 + 0.3,
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

        ctx.fillStyle = "#80caff";
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
    <main className="min-h-screen bg-[#07080a] text-white flex flex-col items-center justify-start p-4 sm:p-6 font-sans relative overflow-hidden">
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
            <h1 className="text-4xl font-extrabold text-white tracking-tight">suva.</h1>
            <p className="text-xs text-gray-400 tracking-[0.25em] uppercase font-medium">
              CLICK TO ENTER
            </p>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-[#232838] p-6 rounded-3xl w-full max-w-sm space-y-4 shadow-2xl">
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
                type="text" 
                placeholder="Enter access code or user..."
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-[#141720] border border-[#232838] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="w-full max-w-md space-y-4 relative z-10 my-auto">
        <div className="bg-[#0f1117]/90 backdrop-blur-md border border-[#1f2430] rounded-3xl overflow-hidden shadow-2xl relative">
          <button 
            onClick={() => setShowLoginModal(true)}
            className="absolute top-3 right-3 z-30 p-2 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-gray-300 transition"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <div className="h-36 w-full relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950">
            <img 
              src="/banner.gif" 
              alt="Banner" 
              className="w-full h-full object-cover relative z-10"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="px-6 pt-0 pb-4 relative flex flex-col items-center -mt-12 z-20">
            <div className="relative">
              <img 
                src="/pfp.jpeg" 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-[#0f1117] object-cover shadow-2xl"
              />
              <span 
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#0f1117] ${
                  lanyardData?.discord_status === "online" ? "bg-green-500" :
                  lanyardData?.discord_status === "idle" ? "bg-yellow-500" :
                  lanyardData?.discord_status === "dnd" ? "bg-red-500" : "bg-gray-500"
                }`}
              />
            </div>

            <h1 className="text-2xl font-bold mt-2 tracking-wide text-white">suva.</h1>
            <p className="text-xs text-gray-400 font-medium">@soxsuvaa • she/her</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#171a24] border border-[#262c3d] rounded-full flex items-center gap-1 text-amber-400 shadow-sm">
                ⚡ ZFC
              </span>
              <div className="flex items-center gap-1.5 bg-[#171a24] px-3 py-1 rounded-full border border-[#262c3d] shadow-sm">
                <img src="/nitro.webp" alt="Nitro" className="w-4 h-4 object-contain" />
                <img src="/boost.png" alt="Boost" className="w-4 h-4 object-contain" />
                <img src="/orb.png" alt="Orb" className="w-4 h-4 object-contain" />
                <img src="/quest.png" alt="Quest" className="w-4 h-4 object-contain" />
              </div>
            </div>
          </div>

          <div className="px-5 mb-3">
            {gameActivity ? (
              <div className="bg-[#141822] border-2 border-emerald-500/90 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-lg shadow-emerald-950/30">
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
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#141822]" />
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
              <div className="bg-[#141822] border border-green-500/60 rounded-2xl p-3.5 flex items-center gap-3.5">
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
            <div className="bg-[#141720] border border-[#232838] rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src="/album.jpg" 
                    alt="Album Cover" 
                    className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate leading-snug">misery</h3>
                    <p className="text-xs text-gray-400 truncate">pupsies</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime = 0;
                    }}
                    className="p-1.5 text-gray-400 hover:text-white transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="p-2.5 bg-white text-black rounded-full hover:scale-105 transition shadow-lg flex items-center justify-center"
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
                  className="w-full h-1.5 bg-[#252b3b] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-400 px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount(prev => liked ? prev - 1 : prev + 1);
                }}
                className="w-full mt-3 py-2 bg-[#1b202c] hover:bg-[#222838] border border-[#2a3245] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition"
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                <span>{likeCount} Likes</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1117]/90 backdrop-blur-md border border-pink-500/30 rounded-3xl p-4 shadow-lg relative overflow-hidden">
          <a 
            href="https://www.tiktok.com/@not.p1nk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#161922] transition"
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
            <div className="bg-[#141720] p-2.5 rounded-xl border border-[#232838]">
              <div className="text-xs font-bold text-white">19</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Following</div>
            </div>
            <div className="bg-[#141720] p-2.5 rounded-xl border border-[#232838]">
              <div className="text-xs font-bold text-white">385</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Followers</div>
            </div>
            <div className="bg-[#141720] p-2.5 rounded-xl border border-[#232838]">
              <div className="text-xs font-bold text-white">2.5K</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Likes</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1117]/90 backdrop-blur-md border border-[#1f2430] rounded-3xl p-5 space-y-3 shadow-xl">
          <h2 className="text-sm font-bold text-gray-300 tracking-wide px-1">Connections</h2>

          <a 
            href="https://www.roblox.com/users/2807349866/profile" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#141720] hover:bg-[#1c212e] border border-[#232838] p-3 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <img src="/roblox.png" alt="Roblox" className="w-7 h-7 object-contain" />
              <span className="text-xs font-semibold text-gray-200">serdemsivridagg</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
          </a>

          <div className="flex items-center justify-between bg-[#141720] border border-[#232838] p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <img src="/spotify.png" alt="Spotify" className="w-7 h-7 object-contain" />
              <span className="text-xs font-semibold text-gray-200">soxsuva</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#141720] border border-[#232838] p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <img src="/xbox.png" alt="Xbox" className="w-7 h-7 object-contain" />
              <span className="text-xs font-semibold text-gray-200">soxsuva</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
