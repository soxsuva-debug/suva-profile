'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bgColor, setBgColor] = useState('#0b0c10');
    const [petalColor, setPetalColor] = useState('#60b5ff');

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Canvas Cherry Blossom Animation
    useEffect(() => {
        const canvas = document.getElementById('petalCanvas') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

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

        let animationFrameId: number;
        const animatePetals = () => {
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

                ctx.fillStyle = petalColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animatePetals);
        };
        animatePetals();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [petalColor]);

    const hashString = async (str: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    const verifyAdmin = async () => {
        const targetEmailHash = "be3cf9b3f37bcf7b23395d8efd234c264b3ef1bd588fb7c81d86d5e1ef93bfbc"; 
        const targetPassHash = "9d36440e0be2cb003b1e35bb3d1b802e8d350ecbc9219c6767eb27eb2bf0cdd3"; 

        const inputEmailHash = await hashString(email.trim());
        const inputPassHash = await hashString(password);

        if (inputEmailHash === targetEmailHash && inputPassHash === targetPassHash) {
            setLoggedIn(true);
        } else {
            alert('Invalid Credentials');
        }
    };

    return (
        <main style={{ backgroundColor: bgColor, color: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflowX: 'hidden', position: 'relative' }}>
            <canvas id="petalCanvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}></canvas>

            <div className="card" style={{ width: '100%', maxWidth: '420px', background: 'rgba(18, 19, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', backdropFilter: 'blur(12px)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)', position: 'relative' }}>
                <div className="banner" style={{ width: '100%', height: '140px', backgroundImage: "url('/IMG_9063.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}></div>

                <div className="avatar-container" style={{ position: 'relative', marginTop: '-50px', marginLeft: '20px', display: 'inline-block' }}>
                    <img src="/357BDB9B-081D-4F65-AD1B-98837265B5E8.jpeg" alt="Profile" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #12131a', objectFit: 'cover' }} />
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#23a55a', borderRadius: '50%', border: '3px solid #12131a', position: 'absolute', bottom: '8px', right: '4px' }}></div>
                </div>

                <div style={{ padding: '15px 20px 20px 20px' }}>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#5865f2', letterSpacing: '-0.5px' }}>suva.</div>
                    <div style={{ fontSize: '14px', color: '#b9bbbe', marginTop: '2px', marginBottom: '12px' }}>soxsuva</div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.05)' }}>⚡ ZFC</span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.05)' }}>✈️ Suva</span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.05)' }}>👑 VIP</span>
                    </div>

                    <a href="https://www.tiktok.com/@not.p1nk" target="_blank" rel="noreferrer" style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '12px', padding: '12px', marginBottom: '16px', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <svg style={{ width: '24px', height: '24px', fill: '#ec4899' }} viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.33 6.33 0 0 0 10.86 4.47 6.32 6.32 0 0 0 1.81-4.47V9.16a8.16 8.16 0 0 0 4.97 1.83V7.52a4.81 4.81 0 0 1-1.05-.83z"/></svg>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>TikTok @not.p1nk</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#b9bbbe' }}>↗</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700 }}>186</div>
                                <div style={{ fontSize: '10px', color: '#b9bbbe', textTransform: 'uppercase', marginTop: '2px' }}>Following</div>
                            </div>
                            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700 }}>690</div>
                                <div style={{ fontSize: '10px', color: '#b9bbbe', textTransform: 'uppercase', marginTop: '2px' }}>Followers</div>
                            </div>
                            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700 }}>4,395</div>
                                <div style={{ fontSize: '10px', color: '#b9bbbe', textTransform: 'uppercase', marginTop: '2px' }}>Likes</div>
                            </div>
                        </div>
                    </a>

                    <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#1db954', letterSpacing: '0.5px', marginBottom: '10px' }}>Listening to Audio</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/IMG_9145.jpeg" alt="Album Cover" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ flexGrow: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: 700 }}>misery.</div>
                                <div style={{ fontSize: '13px', color: '#b9bbbe' }}>pupsies</div>
                            </div>
                            <button onClick={toggleAudio} style={{ background: '#ffffff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span>{isPlaying ? '❚❚' : '▶'}</span>
                            </button>
                        </div>
                        <audio ref={audioRef} loop src="/pupsies - misery. (Lyrics).mp3"></audio>
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '12px', fontSize: '14px', lineHeight: '1.4', color: '#e1e1e1', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#b9bbbe', textTransform: 'uppercase', marginBottom: '4px' }}>Bio</div>
                        <div>welcome to suva.</div>
                    </div>

                    <div onClick={() => setModalOpen(true)} style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer', paddingTop: '5px' }}>
                        Created by suva.
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: '#12131a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '360px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' }}>
                        {!loggedIn ? (
                            <div>
                                <h3 style={{ marginBottom: '16px', fontSize: '18px', textAlign: 'center' }}>Admin Access</h3>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: '12px', background: '#0b0c10', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', outline: 'none' }} />
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: '12px', background: '#0b0c10', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', outline: 'none' }} />
                                <button onClick={verifyAdmin} style={{ width: '100%', padding: '10px', background: '#5865f2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Login</button>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ color: '#23a55a', marginBottom: '10px' }}>System Status: Secure</h4>
                                <p style={{ fontSize: '13px', color: '#b9bbbe', marginBottom: '12px' }}>Admin logged in as soxsuva@gmail.com</p>
                                
                                <label style={{ fontSize: '11px', fontWeight: 700, color: '#b9bbbe', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Background Color</label>
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', padding: '4px', height: '40px', background: '#0b0c10', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }} />

                                <label style={{ fontSize: '11px', fontWeight: 700, color: '#b9bbbe', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cherry Blossom Color</label>
                                <input type="color" value={petalColor} onChange={(e) => setPetalColor(e.target.value)} style={{ width: '100%', padding: '4px', height: '40px', background: '#0b0c10', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px' }} />

                                <button onClick={() => { setModalOpen(false); setLoggedIn(false); }} style={{ width: '100%', padding: '10px', background: '#da373c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Close Panel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
