"use client";

import React, { useEffect, useState } from "react";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  ExternalLink,
  Gamepad2,
  Music
} from "lucide-react";

// Discord User ID for Lanyard API
const DISCORD_USER_ID = "1491533148914450614";

export default function ProfilePage() {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [lanyardData, setLanyardData] = useState<any>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicProgress, setMusicProgress] = useState(13);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // -------------------------------------------------------------
  // LANYARD PRESENCE FETCHING
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json.success) {
          setLanyardData(json.data);
        }
      } catch (err) {
        console.error("Lanyard API Error:", err);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Extract Playing Game or Spotify Activity
  const gameActivity = lanyardData?.activities?.find((act: any) => act.type === 0);
  const spotifyActivity = lanyardData?.spotify;

  // Calculate Elapsed Game Time
  const getGameElapsedTime = () => {
    if (!gameActivity?.timestamps?.start) return null;
    const elapsedMs = Date.now() - gameActivity.timestamps.start;
    const totalSecs = Math.floor(elapsedMs / 1000);
    return formatTime(totalSecs);
  };

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white flex flex-col items-center justify-start p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-md space-y-4">
        
        {/* ========================================================= */}
        {/* MAIN PROFILE CARD CONTAINER                               */}
        {/* ========================================================= */}
        <div className="bg-[#13151b] border border-[#232733] rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* PROFILE BANNER */}
          <div className="h-36 w-full relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
            <img 
              src="/banner.gif" 
              alt="Profile Banner" 
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* AVATAR & HEADER SECTION */}
          <div className="px-6 pt-0 pb-4 relative flex flex-col items-center -mt-12 z-20">
            {/* Avatar Wrapper with Status Indicator */}
            <div className="relative">
              <img 
                src="/pfp.jpeg" 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full border-4 border-[#13151b] object-cover shadow-lg"
              />
              <span 
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#13151b] ${
                  lanyardData?.discord_status === "online" 
                    ? "bg-green-500" 
                    : lanyardData?.discord_status === "idle" 
                    ? "bg-yellow-500" 
                    : lanyardData?.discord_status === "dnd" 
                    ? "bg-red-500" 
                    : "bg-gray-500"
                }`}
                title={`Status: ${lanyardData?.discord_status || "offline"}`}
              />
            </div>

            {/* Profile User Information */}
            <h1 className="text-2xl font-bold mt-2 tracking-wide text-white">
              suva.
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              @soxsuvaa • she/her
            </p>

            {/* Badges Bar */}
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#1e222d] border border-[#2f3545] rounded-full flex items-center gap-1 text-amber-400 shadow-sm">
                ⚡ ZFC
              </span>
              <div className="flex items-center gap-1.5 bg-[#1e222d] px-3 py-1 rounded-full border border-[#2f3545] shadow-sm">
                <img 
                  src="/nitro.webp" 
                  alt="Discord Nitro Badge" 
                  className="w-4 h-4 object-contain" 
                />
                <img 
                  src="/boost.png" 
                  alt="Server Boost Badge" 
                  className="w-4 h-4 object-contain" 
                />
                <img 
                  src="/orb.png" 
                  alt="Orb Badge" 
                  className="w-4 h-4 object-contain" 
                />
                <img 
                  src="/quest.jpg" 
                  alt="Quest Badge" 
                  className="w-4 h-4 object-contain" 
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ACTIVITY / GAME STATUS AREA (HIGHLIGHTED GREEN BORDER)   */}
          {/* ========================================================= */}
          <div className="px-5 mb-3">
            {gameActivity ? (
              <div className="bg-[#181c24] border-2 border-emerald-500/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-lg shadow-emerald-950/20">
                <div className="relative flex-shrink-0">
                  {gameActivity.assets?.large_image ? (
                    <img 
                      src={`https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${gameActivity.assets.large_image}.png`} 
                      alt="Game Cover"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#181c24]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <Gamepad2 className="w-3.5 h-3.5" /> Playing
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {gameActivity.name}
                  </div>
                  {gameActivity.details && (
                    <div className="text-xs text-gray-300 truncate">
                      {gameActivity.details}
                    </div>
                  )}
                  {getGameElapsedTime() && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Elapsed: <span className="text-emerald-300 font-mono font-medium">{getGameElapsedTime()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : spotifyActivity ? (
              <div className="bg-[#181c24] border border-green-500/50 rounded-2xl p-3.5 flex items-center gap-3.5">
                <img 
                  src={spotifyActivity.album_art_url} 
                  alt="Spotify Album Cover" 
                  className="w-12 h-12 rounded-xl object-cover border border-green-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400 uppercase tracking-wider">
                    <Music className="w-3.5 h-3.5" /> Listening to Spotify
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {spotifyActivity.song}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    by {spotifyActivity.artist}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* ========================================================= */}
          {/* MUSIC PLAYER CARD                                         */}
          {/* ========================================================= */}
          <div className="px-5 pb-5">
            <div className="bg-[#181b22] border border-[#2a2f3d] rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src="/album.jpg" 
                    alt="Album Cover" 
                    className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate leading-snug">
                      misery
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      pupsies
                    </p>
                  </div>
                </div>

                {/* Music Controls */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setMusicProgress(0)}
                    aria-label="Restart song"
                    className="p-1.5 text-gray-400 hover:text-white transition duration-150"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    aria-label={isPlayingMusic ? "Pause" : "Play"}
                    className="p-2.5 bg-white text-black rounded-full hover:scale-105 transition duration-150 shadow-lg flex items-center justify-center"
                  >
                    {isPlayingMusic ? (
                      <Pause className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-4 space-y-1">
                <input 
                  type="range" 
                  min="0" 
                  max="166" 
                  value={musicProgress}
                  onChange={(e) => setMusicProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#2a2f3d] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-400 px-0.5">
                  <span>{formatTime(musicProgress)}</span>
                  <span>2:46</span>
                </div>
              </div>

              {/* Like Button */}
              <button 
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount(prev => liked ? prev - 1 : prev + 1);
                }}
                className="w-full mt-3 py-2 bg-[#1f2430] hover:bg-[#262c3b] border border-[#2f3647] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition duration-150"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    liked ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`} 
                />
                <span>{likeCount} Likes</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* TIKTOK EMBED SECTION                                      */}
        {/* ========================================================= */}
        <div className="bg-[#13151b] border border-pink-500/40 rounded-3xl p-4 shadow-lg relative overflow-hidden">
          <a 
            href="https://www.tiktok.com/@not.p1nk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#1a1d26] transition duration-150"
          >
            <div className="flex items-center gap-3">
              <img 
                src="/tiktok.png" 
                alt="TikTok Logo" 
                className="w-10 h-10 object-contain" 
              />
              <div>
                <span className="text-[10px] font-bold tracking-wider text-pink-400 uppercase block">
                  TikTok
                </span>
                <span className="text-sm font-bold text-white">
                  P1NKK <span className="text-xs text-gray-400 font-normal">@not.p1nk</span>
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#181b22] p-2.5 rounded-xl border border-[#252a36]">
              <div className="text-xs font-bold text-white">19</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Following
              </div>
            </div>
            <div className="bg-[#181b22] p-2.5 rounded-xl border border-[#252a36]">
              <div className="text-xs font-bold text-white">385</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Followers
              </div>
            </div>
            <div className="bg-[#181b22] p-2.5 rounded-xl border border-[#252a36]">
              <div className="text-xs font-bold text-white">2.5K</div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Likes
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONNECTIONS SECTION                                       */}
        {/* ========================================================= */}
        <div className="bg-[#13151b] border border-[#232733] rounded-3xl p-5 space-y-3 shadow-xl">
          <h2 className="text-sm font-bold text-gray-300 tracking-wide px-1">
            Connections
          </h2>

          {/* Roblox (Clickable to profile URL) */}
          <a 
            href="https://www.roblox.com/users/2807349866/profile" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#181b22] hover:bg-[#1f2430] border border-[#252a36] p-3 rounded-2xl transition duration-150 group"
          >
            <div className="flex items-center gap-3">
              <img 
                src="/roblox.png" 
                alt="Roblox Icon" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-xs font-semibold text-gray-200">
                serdemsivridagg
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition duration-150" />
          </a>

          {/* Spotify (Display Badge - Non Clickable) */}
          <div className="flex items-center justify-between bg-[#181b22] border border-[#252a36] p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <img 
                src="/spotify.png" 
                alt="Spotify Icon" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-xs font-semibold text-gray-200">
                soxsuva
              </span>
            </div>
          </div>

          {/* Xbox (Display Badge - Non Clickable) */}
          <div className="flex items-center justify-between bg-[#181b22] border border-[#252a36] p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <img 
                src="/xbox.png" 
                alt="Xbox Icon" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-xs font-semibold text-gray-200">
                soxsuva
              </span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
