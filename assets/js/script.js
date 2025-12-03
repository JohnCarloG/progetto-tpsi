/* ===================================================================
   SCRIPT.JS - JavaScript del sito "Firenze - La Città dell'Arte"
   
   Questo file contiene tutta la logica interattiva del sito:
   1. Gestione della Navbar (link attivo, chiusura su mobile)
   2. Effetti di scroll (parallax)
   3. Animazione Timeline (reveal on scroll)
   4. Mappa Leaflet (inizializzazione)
   5. Contatti interattivi (toggle dettagli)
   6. Fallback per il modello 3D
   7. Smooth scroll per link interni
   
   CONCETTI CHIAVE:
   - DOMContentLoaded: evento che si attiva quando l'HTML è pronto
   - querySelectorAll: seleziona TUTTI gli elementi che matchano
   - addEventListener: "ascolta" eventi (click, scroll, ecc.)
   - classList: manipola le classi CSS di un elemento
   - IntersectionObserver: rileva quando elementi entrano nella viewport
   =================================================================== */


/* ===================================================================
   INIZIALIZZAZIONE - Punto di partenza del codice
   =================================================================== */

/*
   DOMContentLoaded: Evento che si attiva quando il browser
   ha finito di parsare l'HTML e costruire il DOM.
   
   PERCHÉ USARLO?
   - Se lo script è in <head>, l'HTML non esiste ancora
   - Se lo script è in fondo al body, il DOM è già pronto
   - Con DOMContentLoaded, funziona in ENTRAMBI i casi
   
   È una buona pratica usarlo SEMPRE per sicurezza.
*/
document.addEventListener('DOMContentLoaded', function() {
    // Chiama tutte le funzioni di inizializzazione
    initializeNavbar();              // Gestione link attivo navbar
    initializeScrollEffects();       // Effetto parallax
    initializeTimeline();            // Animazione timeline
    initializeStaticMap();           // Mappa Leaflet
    initializeContacts();            // Toggle contatti
    initializeModelViewerFallback(); // Fallback modello 3D
});

/* ===================================================================
   1. NAVBAR - Gestione del link attivo
   ===================================================================
   
   Questa funzione:
   - Aggiunge la classe 'active' al link cliccato
   - Rimuove 'active' dagli altri link
   - Chiude il menu hamburger su mobile dopo un click
   - Aggiorna il link attivo durante lo scroll
*/

function initializeNavbar() {
    // querySelectorAll restituisce una NodeList (simile a un array)
    // di TUTTI gli elementi che matchano il selettore CSS
    const navLinks = document.querySelectorAll('.nav-link');
    
    // forEach: esegue una funzione per OGNI elemento della lista
    navLinks.forEach(link => {
        // addEventListener: "ascolta" l'evento 'click' su questo link
        link.addEventListener('click', function() {
            
            // 1. Rimuovi la classe 'active' da TUTTI i link
            navLinks.forEach(l => l.classList.remove('active'));
            /*
               classList: oggetto che permette di manipolare le classi CSS
               - classList.remove('classe'): rimuove una classe
               - classList.add('classe'): aggiunge una classe
               - classList.toggle('classe'): aggiunge se non c'è, rimuove se c'è
               - classList.contains('classe'): restituisce true/false
            */
            
            // 2. Aggiungi 'active' SOLO al link cliccato (this)
            // 'this' si riferisce all'elemento che ha ricevuto il click
            this.classList.add('active');
            
            // 3. Chiudi il menu mobile se è aperto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            /*
               querySelector (singolare): restituisce il PRIMO elemento
               che matcha il selettore, oppure null se non esiste
            */
            
            if (navbarCollapse.classList.contains('show')) {
                // 'show' è la classe Bootstrap che rende visibile il menu
                
                // Crea un nuovo oggetto Collapse di Bootstrap
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide(); // Chiude il menu
            }
        });
    });
    
    // 4. Aggiorna il link attivo mentre l'utente scrolla
    window.addEventListener('scroll', updateActiveNavLink);
    /*
       window: oggetto globale che rappresenta la finestra del browser
       'scroll': evento che si attiva ad ogni scroll
    */
}

/*
   FUNZIONE: Aggiorna il link attivo in base alla sezione visibile
   
   Come funziona:
   1. Per ogni sezione, calcola la sua posizione dall'alto
   2. Se lo scroll è passato quella posizione, quella è la sezione "corrente"
   3. Evidenzia il link corrispondente nella navbar
*/
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    // 'section[id]' seleziona tutti i <section> che hanno un attributo id
    
    let current = ''; // Variabile per memorizzare l'id della sezione corrente
    
    sections.forEach(section => {
        // offsetTop: distanza in pixel dalla cima del documento
        const sectionTop = section.offsetTop;
        
        // scrollY: posizione corrente dello scroll (alias di window.scrollY)
        // -200: offset per anticipare il cambio (la sezione è "attiva" 200px prima)
        if (scrollY >= (sectionTop - 200)) {
            // getAttribute('id'): ottiene il valore dell'attributo id
            current = section.getAttribute('id');
        }
    });
    
    // Aggiorna le classi dei link
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // link.getAttribute('href') restituisce es. "#storia"
        // .slice(1) rimuove il # → "storia"
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

/* ===================================================================
   2. EFFETTI DI SCROLL - Parallax leggero
   ===================================================================
   
   Il parallax è un effetto dove lo sfondo si muove più lentamente
   del contenuto in primo piano, creando un senso di profondità.
*/

function initializeScrollEffects() {
    const heroSection = document.querySelector('.hero-section');
    
    // Controllo di sicurezza: se l'elemento non esiste, esci
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Muove lo sfondo verticalmente a metà velocità dello scroll
            // scrollPosition * 0.5 = effetto parallax al 50%
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
            /*
               Template literal (backtick `):
               Permette di inserire variabili ${...} nelle stringhe
               Molto più leggibile di: 'center ' + scrollPosition * 0.5 + 'px'
            */
        });
    }
}

/* ===================================================================
   3. TIMELINE - Animazione reveal on scroll
   ===================================================================
   
   Usa IntersectionObserver per rilevare quando gli elementi
   della timeline entrano nella viewport e attivare l'animazione.
   
   INTERSECTIONOBSERVER: API moderna che "osserva" elementi e
   notifica quando entrano/escono dalla viewport.
   
   VANTAGGI rispetto a controllare scroll manualmente:
   - Più performante (il browser ottimizza)
   - Codice più pulito
   - Supporta soglie multiple (0%, 50%, 100%)
*/

function initializeTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    
    // Se non ci sono elementi, esci dalla funzione
    if (!items.length) return;
    // items.length = numero di elementi trovati
    // !items.length = true se length è 0 (falsy)
    
    // Crea un nuovo IntersectionObserver
    const observer = new IntersectionObserver(entries => {
        /*
           'entries' è un array di oggetti IntersectionObserverEntry
           Ogni entry contiene info sull'elemento osservato:
           - entry.target: l'elemento DOM
           - entry.isIntersecting: true se l'elemento è visibile
           - entry.intersectionRatio: percentuale visibile (0-1)
        */
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // L'elemento è entrato nella viewport!
                // Aggiungi la classe 'visible' per attivare l'animazione CSS
                entry.target.classList.add('visible');
            }
            // NOTA: non rimuoviamo 'visible' quando esce
            // L'animazione rimane, non si ripete
        });
        
    }, { threshold: 0.2 });
    /*
       OPZIONI dell'observer:
       - threshold: 0.2 = attiva quando il 20% dell'elemento è visibile
       - threshold: 0 = appena tocca il bordo
       - threshold: 1 = solo quando è completamente visibile
       - threshold: [0, 0.5, 1] = notifica a più soglie
    */
    
    // Inizia ad osservare ogni elemento della timeline
    items.forEach(item => observer.observe(item));
}

/* ===================================================================
   4. MAPPA LEAFLET - Inizializzazione mappa interattiva
   ===================================================================
   
   LEAFLET: Libreria open-source per mappe interattive.
   Usa OpenStreetMap come provider di tile (immagini mappa).
   
   COME FUNZIONA:
   1. Crea un oggetto mappa con L.map()
   2. Aggiungi un layer di tile (immagini) con L.tileLayer()
   3. Aggiungi marker, popup, ecc.
*/

function initializeStaticMap() {
    const mapEl = document.getElementById('mappa-duomo');
    
    // Controlli di sicurezza
    // typeof L === 'undefined' = Leaflet non è caricato
    if (!mapEl || typeof L === 'undefined') return;

    // Coordinate del Duomo di Firenze [latitudine, longitudine]
    const center = [43.773106, 11.255889];
    
    // Crea la mappa
    const map = L.map('mappa-duomo', {
        center,              // Shorthand ES6: equivale a center: center
        zoom: 18,            // Livello di zoom (1-20, più alto = più vicino)
        minZoom: 17,         // Zoom minimo consentito
        maxZoom: 19,         // Zoom massimo consentito
        
        // Disabilita tutte le interazioni (mappa statica)
        dragging: false,         // Non trascinabile
        scrollWheelZoom: false,  // No zoom con rotella mouse
        touchZoom: false,        // No zoom con pinch su touch
        doubleClickZoom: false,  // No zoom con doppio click
        boxZoom: false,          // No zoom con shift+drag
        keyboard: false          // No navigazione da tastiera
    });

    // Aggiungi il layer delle tile (immagini della mappa)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        /*
           URL TEMPLATE:
           - {s}: subdomain (a, b, c) per bilanciamento carico
           - {z}: livello di zoom
           - {x}, {y}: coordinate della tile
        */
        attribution: '© OpenStreetMap contributors'
        // Attribution: crediti richiesti da OpenStreetMap
    }).addTo(map);

    // Aggiungi un marker (puntina) sulla mappa
    L.marker(center)
        .addTo(map)
        .bindPopup('<strong>Piazza del Duomo</strong><br>Centro storico di Firenze.')
        // bindPopup: associa un popup al marker
        .openPopup();
        // openPopup: mostra il popup immediatamente
}

/* ===================================================================
   5. UTILITY - Smooth scroll per link interni
   ===================================================================
   
   Questa funzione implementa lo scroll fluido quando si clicca
   su link che puntano ad ancore interne (es. #storia, #contatti).
   
   NOTA: CSS scroll-behavior: smooth fa la stessa cosa,
   ma questo codice aggiunge l'offset per la navbar fissa.
*/

// Seleziona tutti i link che iniziano con #
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    /*
       SELETTORE: a[href^="#"]
       - a: elemento anchor (link)
       - [href^="#"]: attributo href che INIZIA CON (^=) il carattere #
    */
    
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Se l'href è solo "#", non fare nulla
        if (href === '#') return;
        
        // Previeni il comportamento default del browser
        // (saltare istantaneamente all'ancora)
        e.preventDefault();
        /*
           e = oggetto Event contenente info sull'evento
           e.preventDefault() = blocca l'azione predefinita
        */
        
        // Trova l'elemento target usando l'href come selettore
        const target = document.querySelector(href);
        
        if (target) {
            // Calcola la posizione considerando l'altezza della navbar
            const offsetTop = target.offsetTop - 80; // -80px per la navbar
            
            // Scrolla alla posizione calcolata
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'  // Animazione fluida
            });
        }
    });
});

// Log per confermare che il sito è stato inizializzato
console.log('Firenze - Website initialized');
/*
   console.log(): Stampa un messaggio nella Console del browser
   Utile per il debugging - puoi vedere questo messaggio in:
   Chrome: F12 → Tab "Console"
*/

/* ===================================================================
   6. CONTATTI INTERATTIVI - Toggle mostra/nascondi dettagli
   ===================================================================
   
   Permette di mostrare/nascondere i dettagli di contatto
   cliccando sul pulsante "Mostra Dettagli".
*/

function initializeContacts() {
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach(card => {
        // Trova il pulsante e il div dei dettagli dentro questa card
        const btn = card.querySelector('button');
        const details = card.querySelector('.contact-details');
        
        // Controllo di sicurezza
        if (!btn || !details) return;
        
        btn.addEventListener('click', () => {
            /*
               ARROW FUNCTION: () => { }
               Sintassi moderna (ES6) per funzioni anonime
               Equivalente a: function() { }
            */
            
            // toggle('d-none'): aggiunge la classe se non c'è, la rimuove se c'è
            details.classList.toggle('d-none');
            
            // Cambia il testo del pulsante in base allo stato
            btn.textContent = details.classList.contains('d-none') 
                ? 'Mostra Dettagli'   // Se nascosto, mostra questo testo
                : 'Nascondi Dettagli'; // Se visibile, mostra questo testo
            /*
               OPERATORE TERNARIO: condizione ? valore_se_true : valore_se_false
               È un if/else compatto in una sola riga
            */
        });
    });
}

/* ===================================================================
   7. MODEL VIEWER FALLBACK - Gestione errori modello 3D
   ===================================================================
   
   Se il file GLB principale non si carica, prova a caricare
   un file STL come fallback usando Three.js.
   
   GLB: formato binario di glTF, supportato nativamente da model-viewer
   STL: formato più semplice, richiede Three.js per la visualizzazione
*/

function initializeModelViewerFallback() {
    const mv = document.getElementById('duomoViewer');
    if (!mv) return;
    
    // Trova la card contenitore e il footer
    const containerCard = mv.closest('.duomo-3d');
    /*
       closest(): Risale il DOM cercando il primo antenato
       che matcha il selettore. Opposto di querySelector.
    */
    const footer = containerCard?.querySelector('.card-footer');
    /*
       ?. = Optional chaining (ES2020)
       Se containerCard è null/undefined, non genera errore
       ma restituisce undefined invece di chiamare querySelector
    */
    
    // Ascolta l'evento di errore del model-viewer
    mv.addEventListener('error', () => {
        // Il file GLB non si è caricato, prova con STL
        const stlPath = 'assets/models/duomo.stl';
        
        // Crea un contenitore per il canvas Three.js
        const wrapper = document.createElement('div');
        /*
           createElement(): Crea un nuovo elemento HTML in memoria
           Non è ancora visibile finché non lo aggiungi al DOM
        */
        wrapper.style.width = '100%';
        wrapper.style.height = '320px';
        wrapper.style.background = '#111';
        wrapper.style.borderBottomLeftRadius = '.5rem';
        wrapper.style.borderBottomRightRadius = '.5rem';
        wrapper.style.position = 'relative';
        
        // Messaggio di caricamento
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = 'Caricamento fallback STL...';
        loadingMsg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fbbf24;font-size:0.9rem;';
        /*
           cssText: Imposta più stili CSS in una stringa unica
           Comodo ma meno leggibile di style.property = value
        */
        wrapper.appendChild(loadingMsg);
        /*
           appendChild(): Aggiunge un elemento come ultimo figlio
        */
        
        // Sostituisci il model-viewer con il wrapper
        mv.replaceWith(wrapper);
        /*
           replaceWith(): Sostituisce l'elemento con un altro
        */
        
        // Inizializza Three.js per caricare l'STL
        initializeThreeStlViewer(wrapper, stlPath, () => {
            // Callback di successo
            if (loadingMsg.parentNode) loadingMsg.remove();
            if (footer) footer.innerHTML = '<span class="text-success">✓ Modello STL caricato con Three.js</span> — Usa mouse per ruotare, scroll per zoom.';
        }, (error) => {
            // Callback di errore
            loadingMsg.textContent = 'Errore nel caricamento del modello 3D';
            loadingMsg.style.color = '#dc3545';
            if (footer) footer.innerHTML = `<span class="text-danger">Nessun modello disponibile.</span> Aggiungi <code>duomo.glb</code> o <code>duomo.stl</code> in <code>assets/models/</code>`;
            console.error('STL load error:', error);
        });
    });
}

/* ===================================================================
   8. THREE.JS STL VIEWER - Visualizzatore 3D con Three.js
   ===================================================================
   
   THREE.JS: Libreria JavaScript per grafica 3D nel browser.
   Usa WebGL per renderizzare grafica 3D accelerata dalla GPU.
   
   COMPONENTI BASE di una scena Three.js:
   1. Scene: contenitore di tutti gli oggetti 3D
   2. Camera: il "punto di vista" della scena
   3. Renderer: disegna la scena su un canvas HTML
   4. Mesh: oggetti 3D (geometria + materiale)
   5. Light: luci per illuminare gli oggetti
   
   PARAMETRI:
   - container: elemento DOM dove inserire il canvas
   - stlPath: percorso del file STL
   - onSuccess: callback chiamata se il caricamento ha successo
   - onError: callback chiamata se c'è un errore
*/

function initializeThreeStlViewer(container, stlPath, onSuccess, onError) {
    // Verifica che Three.js e STLLoader siano disponibili
    if (typeof THREE === 'undefined' || typeof THREE.STLLoader === 'undefined') {
        if (onError) onError(new Error('Three.js o STLLoader non disponibili'));
        return;
    }
    
    // ===== 1. CREA LA SCENA =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Sfondo grigio scuro
    
    // ===== 2. CREA LA CAMERA =====
    const camera = new THREE.PerspectiveCamera(
        45,  // FOV: Field of View (angolo di visione in gradi)
        container.clientWidth / container.clientHeight,  // Aspect ratio
        0.1,   // Near plane: distanza minima di rendering
        1000   // Far plane: distanza massima di rendering
    );
    camera.position.set(0, 30, 90); // Posizione iniziale (x, y, z)

    // ===== 3. CREA IL RENDERER =====
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    /*
       antialias: true = bordi più smussati (anti-aliasing)
       Migliora la qualità visiva ma usa più risorse
    */
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    /*
       devicePixelRatio: rapporto tra pixel fisici e CSS
       Es. su display Retina è 2, quindi rende a 2x risoluzione
    */
    container.appendChild(renderer.domElement);
    // renderer.domElement è il <canvas> creato da Three.js

    // ===== 4. AGGIUNGI I CONTROLLI ORBIT =====
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    /*
       OrbitControls: permette di ruotare la camera intorno all'oggetto
       - Click sinistro + drag: ruota
       - Click destro + drag: sposta
       - Scroll: zoom
    */
    controls.enableDamping = true;     // Movimento fluido (inerzia)
    controls.dampingFactor = 0.05;     // Quantità di smorzamento
    controls.autoRotate = true;        // Rotazione automatica
    controls.autoRotateSpeed = 0.8;    // Velocità rotazione

    // ===== 5. AGGIUNGI LE LUCI =====
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    /*
       AmbientLight: luce ambientale uniforme (no ombre)
       Parametri: colore, intensità
    */
    scene.add(ambient);
    
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    /*
       DirectionalLight: luce direzionale (come il sole)
       Crea ombre definite
    */
    dir.position.set(50, 80, 40);
    scene.add(dir);

    // ===== 6. AGGIUNGI UNA GRIGLIA (opzionale, per riferimento) =====
    const grid = new THREE.GridHelper(200, 20, 0x333333, 0x222222);
    /*
       GridHelper: griglia sul piano XZ
       Parametri: dimensione, divisioni, colore1, colore2
    */
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    scene.add(grid);

    // ===== 7. CARICA IL FILE STL =====
    const loader = new THREE.STLLoader();
    loader.load(
        stlPath,  // URL del file
        
        // Callback di successo
        geometry => {
            /*
               geometry: oggetto BufferGeometry con i vertici del modello
            */
            
            // Crea il materiale (aspetto visivo)
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xbda76b,     // Colore oro/bronzo
                specular: 0x555555,  // Colore riflessi
                shininess: 30        // Lucidità (0-100)
            });
            
            // Crea la mesh (geometria + materiale)
            const mesh = new THREE.Mesh(geometry, material);
            
            // Calcola le dimensioni per scalare il modello
            geometry.computeBoundingBox();
            const bbox = geometry.boundingBox;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            
            // Scala per adattare alla vista
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 60 / maxDim;
            mesh.scale.set(scale, scale, scale);
            
            // Centra il modello
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            mesh.position.set(
                -center.x * scale, 
                -center.y * scale + 0, 
                -center.z * scale
            );
            
            // Aggiungi alla scena
            scene.add(mesh);
            
            // Chiama il callback di successo
            if (onSuccess) onSuccess();
        },
        
        undefined,  // Callback di progresso (non usato)
        
        // Callback di errore
        error => {
            if (onError) onError(error);
        }
    );

    // ===== 8. GESTISCI IL RESIZE DELLA FINESTRA =====
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix(); // Ricalcola la proiezione
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // ===== 9. LOOP DI ANIMAZIONE =====
    function animate() {
        requestAnimationFrame(animate);
        /*
           requestAnimationFrame: chiede al browser di chiamare
           la funzione prima del prossimo repaint (~60 volte/sec)
           
           Più efficiente di setInterval perché:
           - Si sincronizza con il refresh del monitor
           - Si ferma quando la tab non è visibile
        */
        
        controls.update(); // Aggiorna i controlli (per damping e autoRotate)
        renderer.render(scene, camera); // Disegna la scena
    }
    animate(); // Avvia il loop
}

