document.addEventListener("DOMContentLoaded", () => {

    // 1. 動画データの定義
    const videos = [
        {
            id: 'kZK_2ebmMEc',
            title: 'Practice Part 1',
            category: 'practice',
            desc: 'AD',
            date: '2025.11.22'
        },
        {
            id: '2ErNS8IacLM',
            title: 'Practice Part 2',
            category: 'practice',
            desc: 'AD',
            date: '2025.11.22'
        },
        {
            id: 'm7grOAdYAkc',
            title: 'Practice Part 3',
            category: 'practice',
            desc: 'チームラン',
            date: '2025.11.22'
        },
        {
            id: 'RgjN1ZyZqLE',
            title: 'Practice Part 4',
            category: 'practice',
            desc: 'ブロンコ',
            date: '2025.11.22'
        },
        // 2025.11.23 Match Videos
        {
            id: '-Q0CK9qNQLQ',
            title: '第1試合 vs武蔵野',
            category: 'match',
            desc: '2025.11.23 Match',
            date: '2025.11.23'
        },
        {
            id: 'poSgHQdFDQk',
            title: '第2試合 vs文京',
            category: 'match',
            desc: '2025.11.23 Match',
            date: '2025.11.23'
        },
        {
            id: 'V9Koc8Lo0fI',
            title: '第3試合 vs武蔵野',
            category: 'match',
            desc: '2025.11.23 Match',
            date: '2025.11.23'
        },
        {
            id: 'hzom3L_wWoI',
            title: '第4試合 vs文京',
            category: 'match',
            desc: '2025.11.23 Match',
            date: '2025.11.23'
        },
        {
            id: '2DwxMubshzg',
            title: '第5試合 vs武蔵野',
            category: 'match',
            desc: '2025.11.23 Match',
            date: '2025.11.23'
        }
    ];

    // 2. アニメーション（Observer）の設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // 3. アーカイブ描画関数
    const archiveContainer = document.getElementById('archive-container');
    const dateNav = document.getElementById('date-nav');

    function groupVideosByDate(videoList) {
        const groups = {};
        videoList.forEach(video => {
            if (!groups[video.date]) {
                groups[video.date] = [];
            }
            groups[video.date].push(video);
        });
        // Sort dates descending (newest first)
        return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => ({
            date,
            videos: groups[date]
        }));
    }

    function renderArchive(filter = 'all') {
        archiveContainer.innerHTML = '';
        dateNav.innerHTML = '';

        const groupedVideos = groupVideosByDate(videos);
        let delayCounter = 0;

        groupedVideos.forEach(group => {
            // Filter videos within the group
            const filteredVideos = group.videos.filter(v => filter === 'all' || v.category === filter);

            if (filteredVideos.length === 0) return;

            // Create Section
            const section = document.createElement('section');
            section.id = `section-${group.date.replace(/\./g, '-')}`;
            section.className = 'date-section scroll-reveal';

            // Header
            const header = document.createElement('h2');
            header.className = 'date-header';
            header.textContent = `DAY ${group.date}`;
            section.appendChild(header);

            // Grid
            const grid = document.createElement('div');
            grid.className = 'video-grid';

            filteredVideos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card';
                card.style.animationDelay = `${delayCounter * 0.05}s`;

                // Placeholder check
                const isPlaceholder = video.id.startsWith('placeholder');
                const thumbUrl = isPlaceholder
                    ? 'https://via.placeholder.com/640x360/0a3825/ffffff?text=Video+Coming+Soon'
                    : `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;

                card.innerHTML = `
                    <div class="thumbnail-wrapper">
                        <img src="${thumbUrl}" alt="${video.title}">
                        <div class="play-overlay">
                            <div class="play-icon">▶</div>
                        </div>
                    </div>
                    <div class="card-content">
                        <span class="tag">${video.category.toUpperCase()}</span>
                        <h3>${video.title}</h3>
                        <p>${video.desc}</p>
                    </div>
                `;

                if (!isPlaceholder) {
                    card.addEventListener('click', () => openModal(video.id));
                }

                card.addEventListener('mousemove', handleTilt);
                card.addEventListener('mouseleave', resetTilt);

                // Cursor effects
                card.addEventListener('mouseenter', () => {
                    const cursorOutline = document.querySelector('.cursor-outline');
                    if (cursorOutline) {
                        cursorOutline.style.width = '60px';
                        cursorOutline.style.height = '60px';
                        cursorOutline.style.borderColor = '#fff';
                        cursorOutline.style.opacity = '1';
                    }
                });
                card.addEventListener('mouseleave', () => {
                    const cursorOutline = document.querySelector('.cursor-outline');
                    if (cursorOutline) {
                        cursorOutline.style.width = '40px';
                        cursorOutline.style.height = '40px';
                        cursorOutline.style.borderColor = 'var(--accent-color)';
                        cursorOutline.style.opacity = '0.6';
                    }
                });

                grid.appendChild(card);
                observer.observe(card);
                delayCounter++;
            });

            section.appendChild(grid);
            archiveContainer.appendChild(section);
            observer.observe(section);

            // Add to Nav
            const navLink = document.createElement('a');
            navLink.href = `#${section.id}`;
            navLink.className = 'date-nav-link';
            navLink.textContent = group.date;
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
            });
            dateNav.appendChild(navLink);
        });
    }

    // 4. 初期描画
    renderArchive();

    // --- Filters ---
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArchive(btn.getAttribute('data-filter'));
        });
    });

    // --- Modal ---
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('youtube-frame');
    const closeBtn = document.getElementById('close-modal');

    function openModal(videoId) {
        console.log('Opening modal for video:', videoId);
        if (!modal || !iframe) {
            console.error('Modal or iframe not found!');
            return;
        }
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.classList.add('active');
    }
    function closeModal() {
        console.log('Closing modal');
        if (modal) modal.classList.remove('active');
        if (iframe) setTimeout(() => { iframe.src = ''; }, 400);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- Tilt ---
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) scale(1.02)`;
    }
    function resetTilt(e) {
        // CSSアニメーションと競合しないようにtransformをリセット
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }

    // --- Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (matchMedia('(pointer:fine)').matches) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 400, fill: "forwards" });
        });
    }

    // --- Three.js Background ---
    if (typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#interactive-bg'), alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;

                float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
                float noise (in vec2 _st) {
                    vec2 i = floor(_st);
                    vec2 f = fract(_st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    vec2 st = gl_FragCoord.xy/u_resolution.xy;
                    st.x *= u_resolution.x/u_resolution.y;
                    vec2 mouse = u_mouse.xy / u_resolution.xy;
                    mouse.x *= u_resolution.x/u_resolution.y;

                    float t = u_time * 0.15;
                    
                    vec3 color1 = vec3(0.04, 0.22, 0.15); 
                    vec3 color2 = vec3(0.13, 0.55, 0.3); 
                    vec3 color3 = vec3(0.6, 0.9, 0.2); 

                    float n = noise(st * 2.5 + t);
                    float n2 = noise(st * 5.0 - t * 0.5);

                    vec3 color = mix(color1, color2, smoothstep(0.3, 0.8, n));
                    color += color3 * smoothstep(0.4, 0.5, n2) * 0.15;
                    
                    float dist = distance(st, mouse);
                    color += vec3(0.4, 1.0, 0.5) * smoothstep(0.3, 0.0, dist) * 0.2;

                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            uniforms.u_time.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        }

        window.addEventListener('mousemove', (e) => {
            uniforms.u_mouse.value.x = e.clientX;
            uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
        });
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.u_resolution.value.x = window.innerWidth;
            uniforms.u_resolution.value.y = window.innerHeight;
        });
        animate();
    }
});
