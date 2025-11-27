// ===========================
// Inizializzazione
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeScrollEffects();
    initializeTimeline(); // nuova inizializzazione timeline
    initializeStaticMap(); // mappa Duomo
    initializeContacts(); // sezione contatti interattiva
    initializeModelViewerFallback(); // messaggio se modello 3D mancante
});

// ===========================
// Navbar - Active link management
// ===========================
function initializeNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Rimuovi la classe active da tutti i link
            navLinks.forEach(l => l.classList.remove('active'));
            // Aggiungi la classe active al link cliccato
            this.classList.add('active');
            
            // Chiudi il menu mobile se aperto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Aggiorna il link attivo durante lo scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ===========================
// Effetti di scroll
// ===========================
function initializeScrollEffects() {
    // Effetto parallax leggero sulla hero section
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
}

// ===========================
// Timeline
// ===========================
function initializeTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
}

// ===========================
// Mappa Statica
// ===========================
function initializeStaticMap() {
    const mapEl = document.getElementById('mappa-duomo');
    if (!mapEl || typeof L === 'undefined') return;

    const center = [43.773106, 11.255889]; // Piazza del Duomo Firenze
    const map = L.map('mappa-duomo', {
        center,
        zoom: 18,
        minZoom: 17,
        maxZoom: 19,
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker(center)
        .addTo(map)
        .bindPopup('<strong>Piazza del Duomo</strong><br>Centro storico di Firenze.')
        .openPopup();
}

// ===========================
// Utility
// ===========================

// Smooth scroll per link interni (supporto aggiuntivo)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Offset per navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

console.log('Firenze - Website initialized');

// ===========================
// Contatti Interattivi
// ===========================
function initializeContacts() {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach(card => {
        const btn = card.querySelector('button');
        const details = card.querySelector('.contact-details');
        if (!btn || !details) return;
        btn.addEventListener('click', () => {
            details.classList.toggle('d-none');
            btn.textContent = details.classList.contains('d-none') ? 'Mostra Dettagli' : 'Nascondi Dettagli';
        });
    });
}

// ===========================
// Model Viewer Fallback
// ===========================
function initializeModelViewerFallback() {
    const mv = document.getElementById('duomoViewer');
    if (!mv) return;
    
    const containerCard = mv.closest('.duomo-3d');
    const footer = containerCard?.querySelector('.card-footer');
    
    // Ascolta l'evento di caricamento riuscito
    mv.addEventListener('load', () => {
        if (footer) {
            footer.innerHTML = '<span class="text-success">✓ Modello 3D caricato</span> — Trascina per ruotare, scroll per zoom.';
        }
    });
    
    // Solo in caso di errore, prova il fallback STL
    mv.addEventListener('error', () => {
        const stlPath = 'assets/models/duomo.stl';
        
        // Sostituisci model-viewer con un canvas Three.js
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '320px';
        wrapper.style.background = '#111';
        wrapper.style.borderBottomLeftRadius = '.5rem';
        wrapper.style.borderBottomRightRadius = '.5rem';
        wrapper.style.position = 'relative';
        
        // Aggiungi messaggio di caricamento
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = 'Caricamento fallback STL...';
        loadingMsg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fbbf24;font-size:0.9rem;';
        wrapper.appendChild(loadingMsg);
        
        mv.replaceWith(wrapper);
        
        initializeThreeStlViewer(wrapper, stlPath, () => {
            // Successo: rimuovi il messaggio di caricamento
            if (loadingMsg.parentNode) loadingMsg.remove();
            if (footer) footer.innerHTML = '<span class="text-success">✓ Modello STL caricato con Three.js</span> — Usa mouse per ruotare, scroll per zoom.';
        }, (error) => {
            // Errore
            loadingMsg.textContent = 'Errore nel caricamento del modello 3D';
            loadingMsg.style.color = '#dc3545';
            if (footer) footer.innerHTML = `<span class="text-danger">Nessun modello disponibile.</span> Aggiungi <code>duomo.glb</code> o <code>duomo.stl</code> in <code>assets/models/</code>`;
            console.error('STL load error:', error);
        });
    });
}

// ===========================
// Three.js STL Viewer (semplice)
// ===========================
function initializeThreeStlViewer(container, stlPath, onSuccess, onError) {
    if (typeof THREE === 'undefined' || typeof THREE.STLLoader === 'undefined') {
        if (onError) onError(new Error('Three.js o STLLoader non disponibili'));
        return;
    }
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 30, 90);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(50, 80, 40);
    scene.add(dir);

    const grid = new THREE.GridHelper(200, 20, 0x333333, 0x222222);
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    scene.add(grid);

    const loader = new THREE.STLLoader();
    loader.load(
        stlPath,
        geometry => {
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xbda76b, 
                specular: 0x555555, 
                shininess: 30 
            });
            const mesh = new THREE.Mesh(geometry, material);
            geometry.computeBoundingBox();
            const bbox = geometry.boundingBox;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 60 / maxDim; // adatta alla vista
            mesh.scale.set(scale, scale, scale);
            // centra
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            mesh.position.set(-center.x * scale, -center.y * scale + 0, -center.z * scale);
            scene.add(mesh);
            
            if (onSuccess) onSuccess();
        },
        undefined,
        error => {
            if (onError) onError(error);
        }
    );

    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

