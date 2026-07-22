"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Repeat,
  RotateCcw,
  Volume2,
  Heart,
  MessageSquare,
  Eye,
  CheckCircle2,
  Diamond,
  Code2,
  LogIn,
} from "lucide-react";

const PROFILE_DATA = {
  username: "suva",
  displayName: "suva.uk",
  status: "Editor",
  bannerImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
  avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500",
  views: 1026,
  initialLikes: 8,
  quotes: [
    { text: 'She like, "Why you heartless?"', author: "Nemzzz" },
    { text: "These hoes won't even get it", author: "Nemzzz" },
    { text: "Started from the bottom", author: "Now we're here" },
  ],
  song: {
    title: "90mph",
    artist: "JBEE",
    duration: "4:55",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300",
  },
  roblox: {
    name: "ALEX",
    handle: "@B9X1Q",
    friends: "25",
    followers: "19.6K",
    following: "2",
  },
};

export default function ProfilePage() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(PROFILE_DATA.initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % PROFILE_DATA.quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setIsPlaying(true);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black pointer-events-none" />

      <AnimatePresence>
        {!entered ? (
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              {PROFILE_DATA.displayName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mt-8 text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase"
            >
              CLICK TO ENTER
            </motion.p>
          </motion.div>
        ) : (
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[420px] my-8 space-y-4"
          >
            <div className="relative bg-[#0d0d0d]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-medium text-neutral-300">
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                <span>{PROFILE_DATA.views.toLocaleString()}</span>
              </div>

              <div className="h-32 w-full relative overflow-hidden bg-neutral-900">
                <img
                  src={PROFILE_DATA.bannerImg}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-60 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d]" />
              </div>

              <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center -mt-14">
                <div className="relative w-24 h-24 mb-3">
                  <img
                    src={PROFILE_DATA.avatarImg}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-2 border-white/20 shadow-lg"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-neutral-500 border-2 border-black rounded-full" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                  {PROFILE_DATA.displayName}
                </h2>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                  <div className="p-1 rounded-md bg-blue-600/20 text-blue-400">
                    <CheckCircle2 className="w-4 h-4 fill-blue-500 text-black" />
                  </div>
                  <div className="p-1 rounded-md bg-cyan-500/20 text-cyan-300">
                    <Diamond className="w-4 h-4 fill-cyan-400 text-black" />
                  </div>
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-sm font-medium text-neutral-400 mb-5">
                  {PROFILE_DATA.status}<span className="animate-pulse">|</span>
                </p>

                <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1"
                    >
                      <p className="text-xs italic font-medium text-neutral-200">
                        {PROFILE_DATA.quotes[quoteIndex].text}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        ~{PROFILE_DATA.quotes[quoteIndex].author}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-center gap-1.5 mt-3">
                    {PROFILE_DATA.quotes.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === quoteIndex ? "w-5 bg-white" : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={PROFILE_DATA.song.cover}
                      alt="Album Cover"
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {PROFILE_DATA.song.title}
                      </h4>
                      <p className="text-xs text-neutral-400 truncate">
                        {PROFILE_DATA.song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>0:15</span>
                      <span>{PROFILE_DATA.song.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <button className="text-neutral-500 hover:text-white transition">
                      <Repeat className="w-4 h-4 text-emerald-500" />
                    </button>
                    <button className="text-neutral-500 hover:text-white transition">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-neutral-400" />
                      <div className="w-12 h-1 bg-white/20 rounded-full">
                        <div className="w-3/4 h-full bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full mt-4 pt-2">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-neutral-300 hover:bg-white/10 transition"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasLiked ? "fill-pink-500 text-pink-500" : "text-neutral-400"
                      }`}
                    />
                    <span>{likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Me</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-1">
              {["tiktok", "instagram", "discord", "twitch", "snapchat"].map((platform) => (
                <button
                  key={platform}
                  className="w-11 h-11 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition shadow-lg"
                >
                  <span className="capitalize text-xs font-bold">{platform[0]}</span>
                </button>
              ))}
            </div>

            <div className="bg-[#0d0d0d]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200"
                    alt="Roblox Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase block">
                    ROBLOX
                  </span>
                  <h3 className="text-sm font-bold text-white">{PROFILE_DATA.roblox.name}</h3>
                  <p className="text-xs text-neutral-400">{PROFILE_DATA.roblox.handle}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 text-center border-t border-white/5 pt-3">
                <div>
                  <p className="text-sm font-bold text-white">{PROFILE_DATA.roblox.friends}</p>
                  <p className="text-[10px] font-medium text-neutral-500 tracking-wider uppercase">
                    FRIENDS
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{PROFILE_DATA.roblox.followers}</p>
                  <p className="text-[10px] font-medium text-neutral-500 tracking-wider uppercase">
                    FOLLOWERS
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{PROFILE_DATA.roblox.following}</p>
                  <p className="text-[10px] font-medium text-neutral-500 tracking-wider uppercase">
                    FOLLOWING
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 pt-2 text-xs text-neutral-500">
              <a
                href="/admin"
                className="flex items-center gap-1.5 hover:text-neutral-300 transition font-medium"
              >
                <LogIn className="w-3.5 h-3.5" /> Admin Login
              </a>
              <p className="text-[11px] text-neutral-600">
                Created by <span className="text-neutral-400 font-medium">suva.uk</span>
              </p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
