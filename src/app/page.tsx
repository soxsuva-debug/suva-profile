export default function Page() {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: `
            :root {
                --bg-color: #0b0c10;
                --card-bg: rgba(18, 19, 26, 0.85);
                --accent-color: #5865f2;
                --text-main: #ffffff;
                --text-sub: #b9bbbe;
                --border-radius: 16px;
                --petal-color: #60b5ff;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            body {
                background-color: var(--bg-color);
                color: var(--text-main);
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
                overflow-x: hidden;
                position: relative;
            }

            .bg-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: radial-gradient(circle at 50% 50%, #1a1c29 0%, var(--bg-color) 100%);
                pointer-events: none;
            }

            canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            }

            .card {
                width: 100%;
                max-width: 420px;
                background: var(--card-bg);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: var(--border-radius);
                backdrop-filter: blur(12px);
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                position: relative;
            }

            .banner {
                width: 100%;
                height: 140px;
                background-size: cover;
                background-position: center;
                position: relative;
            }

            .avatar-container {
                position: relative;
                margin-top: -50px;
                margin-left: 20px;
                display: inline-block;
            }

            .avatar {
                width: 90px;
                height: 90px;
                border-radius: 50%;
                border: 4px solid #12131a;
                object-fit: cover;
            }

            .status-dot {
                width: 16px;
                height: 16px;
                background-color: #23a55a;
                border-radius: 50%;
                border: 3px solid #12131a;
                position: absolute;
                bottom: 8px;
                right: 4px;
            }

            .profile-content {
                padding: 15px 20px 20px 20px;
            }

            .username-title {
                font-size: 26px;
                font-weight: 800;
                color: #5865f2;
                letter-spacing: -0.5px;
            }

            .handle-row {
                font-size: 14px;
                color: var(--text-sub);
                margin-top: 2px;
                margin-bottom: 12px;
            }

            .badges {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }

            .badge {
                background: rgba(255, 255, 255, 0.06);
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 12px;
                color: #d1d5db;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .tiktok-card {
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(236, 72, 153, 0.3);
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 16px;
                text-decoration: none;
                color: inherit;
                display: block;
                transition: border-color 0.2s;
            }

            .tiktok-card:hover {
                border-color: rgba(236, 72, 153, 0.6);
            }

            .tiktok-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .tiktok-user-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .tiktok-icon {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }

            .tiktok-title {
                font-size: 13px;
                font-weight: 700;
                color: #ec4899;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .tiktok-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                text-align: center;
            }

            .stat-box {
                background: rgba(0, 0, 0, 0.3);
                padding: 8px 4px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.04);
            }

            .stat-value {
                font-size: 13px;
                font-weight: 700;
                color: #ffffff;
            }

            .stat-label {
                font-size: 10px;
                color: var(--text-sub);
                text-transform: uppercase;
                margin-top: 2px;
            }

            .player-card {
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 16px;
            }

            .player-header {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                color: #1db954;
                letter-spacing: 0.5px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .song-details {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .album-art {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                object-fit: cover;
            }

            .song-info {
                flex-grow: 1;
            }

            .song-title {
                font-size: 15px;
                font-weight: 700;
            }

            .song-artist {
                font-size: 13px;
                color: var(--text-sub);
            }

            .play-btn {
                background: #ffffff;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: transform 0.1s ease;
            }

            .play-btn:active {
                transform: scale(0.92);
            }

            .bio-box {
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 12px;
                font-size: 14px;
                line-height: 1.4;
                color: #e1e1e1;
                margin-bottom: 16px;
            }

            .bio-title {
                font-size: 11px;
                font-weight: 700;
                color: var(--text-sub);
                text-transform: uppercase;
                margin-bottom: 4px;
            }

            .footer {
                text-align: center;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                padding-top: 5px;
                transition: color 0.2s;
            }

            .footer:hover {
                color: var(--text-sub);
            }

            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 999;
            }

            .modal {
                background: #12131a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 24px;
                width: 90%;
                max-width: 360px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
            }

            .modal h3 {
                margin-bottom: 16px;
                font-size: 18px;
                text-align: center;
            }

            .modal label {
                font-size: 11px;
                font-weight: 700;
                color: var(--text-sub);
                text-transform: uppercase;
                display: block;
                margin-bottom: 4px;
            }

            .modal input {
                width: 100%;
                padding: 10px 12px;
                margin-bottom: 12px;
                background: #0b0c10;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: white;
                outline: none;
            }

            .modal input[type="color"] {
                padding: 4px;
                height: 40px;
                cursor: pointer;
            }

            .modal input:focus {
                border-color: var(--accent-color);
            }

            .modal-btn {
                width: 100%;
                padding: 10px;
                background: var(--accent-color);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 4px;
            }

            .admin-dashboard {
                display: none;
                text-align: left;
            }

            .admin-dashboard h4 {
                color: #23a55a;
                margin-bottom: 10px;
            }
        ` }} />

        <canvas id="petalCanvas"></canvas>
    
        <div className="card">
            <div className="banner" style={{ backgroundImage: "url('IMG_9063.jpeg')" }}></div>
    
            <div className="avatar-container">
                <img src="357BDB9B-081D-4F65-AD1B-98837265B5E8.jpeg" alt="Profile" className="avatar" />
                <div className="status-dot"></div>
            </div>
    
            <div className="profile-content">
                <div className="username-title">suva.</div>
                <div className="handle-row">soxsuva</div>
    
                <div className="badges">
                    <span className="badge">⚡ ZFC</span>
                    <span className="badge">✈️ Suva</span>
                    <span className="badge">👑 VIP</span>
                </div>
    
                <a href="https://www.tiktok.com/@not.p1nk" target="_blank" rel="noreferrer" className="tiktok-card">
                    <div className="tiktok-header">
                        <div className="tiktok-user-info">
                            <svg className="tiktok-icon" viewBox="0 0 24 24" fill="#ec4899"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.33 6.33 0 0 0 10.86 4.47 6.32 6.32 0 0 0 1.81-4.47V9.16a8.16 8.16 0 0 0 4.97 1.83V7.52a4.81 4.81 0 0 1-1.05-.83z"/></svg>
                            <span className="tiktok-title">TikTok @not.p1nk</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>↗</span>
                    </div>
                    <div className="tiktok-stats">
                        <div className="stat-box">
                            <div className="stat-value">186</div>
                            <div className="stat-label">Following</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">690</div>
                            <div className="stat-label">Followers</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">4,395</div>
                            <div className="stat-label">Likes</div>
                        </div>
                    </div>
                </a>
    
                <div className="player-card">
                    <div className="player-header">
                        <span>Listening to Audio</span>
                    </div>
                    <div className="song-details">
                        <img src="IMG_9145.jpeg" alt="Album Cover" className="album-art" />
                        <div className="song-info">
                            <div className="song-title">misery.</div>
                            <div className="song-artist">pupsies</div>
                        </div>
                        <button className="play-btn" onClick={() => (window as any).toggleAudio()}>
                            <span id="play-icon">▶</span>
                        </button>
                    </div>
                    <audio id="audio-player" loop src="pupsies - misery. (Lyrics).mp3"></audio>
                </div>
    
                <div className="bio-box">
                    <div className="bio-title">Bio</div>
                    <div>welcome to suva.</div>
                </div>
    
                <div className="footer" onClick={() => (window as any).openAdminModal()}>
                    Created by suva.
                </div>
            </div>
        </div>
    
        <div className="modal-overlay" id="adminModal">
            <div className="modal">
                <div id="login-form">
                    <h3>Admin Access</h3>
                    <input type="email" id="adminEmail" placeholder="Email" />
                    <input type="password" id="adminPassword" placeholder="Password" />
                    <button className="modal-btn" onClick={() => (window as any).verifyAdmin()}>Login</button>
                </div>
    
                <div id="admin-dashboard" className="admin-dashboard">
                    <h4>System Status: Secure</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px' }}>Admin logged in as soxsuva@gmail.com</p>
                    
                    <label htmlFor="bgColorPicker">Background Color</label>
                    <input type="color" id="bgColorPicker" defaultValue="#0b0c10" onInput={(e) => (window as any).updateBgColor((e.target as HTMLInputElement).value)} />
    
                    <label htmlFor="petalColorPicker" style={{ marginTop: '8px' }}>Cherry Blossom Color</label>
                    <input type="color" id="petalColorPicker" defaultValue="#60b5ff" onInput={(e) => (window as any).updatePetalColor((e.target as HTMLInputElement).value)} />
    
                    <button className="modal-btn" style={{ background: '#da373c', marginTop: '15px' }} onClick={() => (window as any).closeAdminModal()}>Close Panel</button>
                </div>
            </div>
        </div>
    
        <script dangerouslySetInnerHTML={{ __html: `
            window.toggleAudio = function() {
                const player = document.getElementById('audio-player');
                const icon = document.getElementById('play-icon');
                if (player.paused) {
                    player.play();
                    icon.textContent = '❚❚';
                } else {
                    player.pause();
                    icon.textContent = '▶';
                }
            }
    
            window.openAdminModal = function() {
                document.getElementById('adminModal').style.display = 'flex';
            }
    
            window.closeAdminModal = function() {
                document.getElementById('adminModal').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('admin-dashboard').style.display = 'none';
                document.getElementById('adminEmail').value = '';
                document.getElementById('adminPassword').value = '';
            }
    
            let customPetalColor = '#60b5ff';
    
            window.updateBgColor = function(color) {
                document.documentElement.style.setProperty('--bg-color', color);
            }
    
            window.updatePetalColor = function(color) {
                customPetalColor = color;
            }

            const canvas = document.getElementById('petalCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
        
                let width = canvas.width = window.innerWidth;
                let height = canvas.height = window.innerHeight;
        
                window.addEventListener('resize', () => {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                });
        
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
        
                function animatePetals() {
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
        
                        ctx.fillStyle = customPetalColor;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    });
        
                    requestAnimationFrame(animatePetals);
                }
                animatePetals();
            }
    
            async function hashString(str) {
                const encoder = new TextEncoder();
                const data = encoder.encode(str);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
    
            window.verifyAdmin = async function() {
                const email = document.getElementById('adminEmail').value.trim();
                const password = document.getElementById('adminPassword').value;
    
                const targetEmailHash = "be3cf9b3f37bcf7b23395d8efd234c264b3ef1bd588fb7c81d86d5e1ef93bfbc";
                const targetPassHash = "9d36440e0be2cb003b1e35bb3d1b802e8d350ecbc9219c6767eb27eb2bf0cdd3";
    
                const inputEmailHash = await hashString(email);
                const inputPassHash = await hashString(password);
    
                if (inputEmailHash === targetEmailHash && inputPassHash === targetPassHash) {
                    document.getElementById('login-form').style.display = 'none';
                    document.getElementById('admin-dashboard').style.display = 'block';
                } else {
                    alert('Invalid Credentials');
                }
            }
    
            window.onclick = function(event) {
                const modal = document.getElementById('adminModal');
                if (event.target === modal) {
                    window.closeAdminModal();
                }
            }
        ` }} />
      </>
    );
}
