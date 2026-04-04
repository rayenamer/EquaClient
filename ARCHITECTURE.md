# 🏗️ Architecture EQUA - Application Immersive 3D

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    EQUA - Frontend Application                   │
│              Finance Without Barriers (Angular 19)               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌────────▼─────────┐    ┌─────────▼────────┐
           │   Visual Layer   │    │   Logic Layer    │
           │   (Three.js)     │    │   (Angular)      │
           └────────┬─────────┘    └─────────┬────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API Layer           │
                    │  (HTTP Client)          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Backend API           │
                    │  (Spring Boot 3)        │
                    └─────────────────────────┘
```

## 🎨 Architecture Frontend

### 1. Couche Présentation (Visual Layer)

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Window                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Canvas 3D (Fixed)                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Three.js Scene                          │  │  │
│  │  │                                                 │  │  │
│  │  │    ┌─────────────┐                            │  │  │
│  │  │    │  EQUA Token │  ← Votre PNG en 3D        │  │  │
│  │  │    │   (Coin)    │                            │  │  │
│  │  │    └─────────────┘                            │  │  │
│  │  │                                                 │  │  │
│  │  │    • Bloom Effect (Post-Processing)           │  │  │
│  │  │    • Particles (1000 points)                  │  │  │
│  │  │    • Lights (Ambient, Directional, Point)     │  │  │
│  │  │    • Fog Effect                               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              HTML Content (Scrollable)                 │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │  │
│  │  │   Hero   │ │  About   │ │Tokenomics│ ...          │  │
│  │  └──────────┘ └──────────┘ └──────────┘              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Architecture des Composants

```
AppComponent (Root)
    │
    └── RouterOutlet
            │
            └── HomeComponent
                    │
                    ├── ThreeService ──────┐
                    │   • init()           │
                    │   • animate()        │── Canvas 3D
                    │   • animateScroll()  │   WebGL
                    │   • focusOnObject()  │
                    │                      │
                    ├── ApiService ────────┤
                    │   • getProjects()    │── Backend
                    │   • getProjectById() │   API
                    │                      │
                    └── GSAP ScrollTrigger │
                        • Scroll animations│
                        • Camera control   │
```

## 🎯 Flow des Données

### Chargement de l'Application

```
1. main.ts
   │
   ├─→ AppComponent (Bootstrap)
   │   │
   │   └─→ Router
   │       │
   │       └─→ HomeComponent
   │           │
   │           ├─→ ngOnInit()
   │           │   └─→ loadProjects()
   │           │       └─→ ApiService.getProjects()
   │           │           │
   │           │           ├─→ Backend OK → projects[]
   │           │           └─→ Backend KO → mockProjects[]
   │           │
   │           └─→ ngAfterViewInit()
   │               ├─→ ThreeService.init(canvas, tokenImage)
   │               │   ├─→ Create Scene
   │               │   ├─→ Setup Camera
   │               │   ├─→ Setup Renderer
   │               │   ├─→ Setup Lights
   │               │   ├─→ Load Token 3D
   │               │   ├─→ Add Particles
   │               │   └─→ Setup Post-Processing
   │               │
   │               ├─→ ThreeService.animate()
   │               │   └─→ RAF Loop (60fps)
   │               │
   │               ├─→ setupScrollAnimations()
   │               │   └─→ GSAP ScrollTrigger
   │               │
   │               └─→ setupMouseInteractions()
   │                   ├─→ mousemove
   │                   └─→ click
```

### Interaction Utilisateur

```
User Action
    │
    ├─→ Scroll Page
    │   └─→ ScrollTrigger.onUpdate
    │       └─→ ThreeService.animateScroll(progress)
    │           ├─→ Rotate token
    │           └─→ Zoom camera
    │
    ├─→ Click on Token
    │   └─→ ThreeService.onClick()
    │       └─→ showTokenInfo()
    │           ├─→ selectedProject = equaInfo
    │           └─→ focusOnObject()
    │
    └─→ Click on Project Card
        └─→ selectProject(project)
            ├─→ selectedProject = project
            └─→ focusOnObject()
```

## 🔧 Architecture Technique

### Services

```
┌─────────────────────────────────────────────────────────┐
│                     ThreeService                         │
├─────────────────────────────────────────────────────────┤
│ • scene: THREE.Scene                                    │
│ • camera: THREE.PerspectiveCamera                       │
│ • renderer: THREE.WebGLRenderer                         │
│ • composer: EffectComposer                              │
│ • mainObject: THREE.Object3D (Token)                    │
│                                                          │
│ Methods:                                                │
│ • init(canvas, tokenImage): void                        │
│ • animate(): void                                       │
│ • animateScroll(progress): void                         │
│ • focusOnObject(position): void                         │
│ • resetCamera(): void                                   │
│ • onClick(callback): void                               │
│ • dispose(): void                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      ApiService                          │
├─────────────────────────────────────────────────────────┤
│ • apiUrl: string = 'http://localhost:8080/api'         │
│                                                          │
│ Methods:                                                │
│ • getProjects(): Observable<Project[]>                  │
│ • getProjectById(id): Observable<Project>               │
└─────────────────────────────────────────────────────────┘
```

### Modèles de Données

```
┌─────────────────────────────────────────────────────────┐
│                    Project Interface                     │
├─────────────────────────────────────────────────────────┤
│ • id: number                                            │
│ • name: string                                          │
│ • description: string                                   │
│ • modelUrl?: string                                     │
│ • category?: string                                     │
│ • imageUrl?: string                                     │
│ • features?: string[]                                   │
│ • status?: string ('Active' | 'Coming Soon')           │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Architecture 3D (Three.js)

### Scene Hierarchy

```
Scene (root)
  │
  ├── Camera (PerspectiveCamera)
  │   └── Position: (0, 0, 5)
  │
  ├── Lights
  │   ├── AmbientLight (0xffffff, 0.5)
  │   ├── DirectionalLight (0xffd700, 1) → Gold
  │   ├── PointLight (0x00d4ff, 1) → Blue
  │   └── SpotLight (0xffd700, 2) → Gold
  │
  ├── Main Object (Token EQUA)
  │   ├── CylinderGeometry (coin shape)
  │   ├── MeshStandardMaterial
  │   │   ├── map: TokenTexture (PNG)
  │   │   ├── metalness: 0.9
  │   │   ├── roughness: 0.1
  │   │   └── emissive: Gold
  │   └── Rotation: Auto + Scroll
  │
  ├── Glow Ring
  │   ├── TorusGeometry
  │   ├── MeshBasicMaterial (Gold, transparent)
  │   └── Animation: Rotate continuously
  │
  └── Particles (1000)
      ├── BufferGeometry
      ├── PointsMaterial (Gold, transparent)
      └── Animation: Slow rotation
```

### Post-Processing Pipeline

```
Renderer
    │
    └─→ EffectComposer
            │
            ├─→ RenderPass (Scene → Texture)
            │
            └─→ UnrealBloomPass
                ├── Strength: 1.5
                ├── Radius: 0.4
                └── Threshold: 0.85
                    │
                    └─→ Final Output (Canvas)
```

## 🔄 Animation Flow

### Scroll Animation

```
User Scrolls
    │
    └─→ ScrollTrigger.onUpdate(self)
            │
            ├─→ progress = self.progress (0.0 → 1.0)
            │
            └─→ ThreeService.animateScroll(progress)
                    │
                    ├─→ Token Rotation
                    │   └─→ rotation.y = progress × PI × 4
                    │
                    └─→ Camera Zoom
                        └─→ position.z = 5 + (1 - progress) × 10
                            ├─→ progress = 0 → z = 15 (far)
                            └─→ progress = 1 → z = 5 (near)
```

### Camera Focus Animation

```
Click on Object
    │
    └─→ focusOnObject(position)
            │
            └─→ GSAP.to(camera.position)
                ├─→ x = position.x + 3
                ├─→ y = position.y + 2
                ├─→ z = position.z + 3
                ├─→ duration: 1.5s
                ├─→ ease: power3.inOut
                └─→ lookAt(position)
```

## 📡 Backend Integration

### API Endpoints

```
Backend (Spring Boot)
http://localhost:8080
    │
    ├── /api/projects
    │   └── GET: List all projects
    │       Response: Project[]
    │
    └── /api/projects/{id}
        └── GET: Get project by ID
            Response: Project
```

### Error Handling

```
ApiService.getProjects()
    │
    ├─→ Success (200)
    │   └─→ projects[] → Component
    │
    └─→ Error (4xx/5xx/Network)
        └─→ Fallback to mockProjects[]
            ├─→ Token EQUA
            ├─→ Micro-prêts
            ├─→ Portefeuille
            └─→ Investissements
```

## 🎯 Performance Optimizations

### 3D Rendering

```
• WebGL Hardware Acceleration
• PixelRatio capped at 2
• Geometry reuse
• Material pooling
• RAF (60fps target)
• Frustum culling
```

### Animations

```
• GSAP optimized timeline
• GPU-accelerated transforms
• RequestAnimationFrame
• Debounced scroll events
• Lazy loading images
```

### Bundle Size

```
Angular 19 (Standalone)
├── Three.js: ~600KB
├── GSAP: ~100KB
├── Angular Core: ~300KB
└── Application: ~200KB
    Total: ~1.2MB (minified + gzipped)
```

## 🔐 Sécurité

### Frontend

```
• HTTPS only (production)
• CSP Headers
• XSS Protection
• CORS configured
• Input sanitization
• No eval()
```

### API Communication

```
HttpClient
    │
    ├─→ CORS: http://localhost:4200
    ├─→ Credentials: include
    └─→ Headers: application/json
```

## 📱 Responsive Design

```
Desktop (> 768px)
├── Full 3D experience
├── Parallax effects
└── All animations

Tablet (768px - 1024px)
├── Optimized 3D
├── Simplified particles
└── Touch gestures

Mobile (< 768px)
├── Reduced 3D complexity
├── Minimal particles
├── Touch-optimized
└── Vertical layout
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────┐      ┌────────────┐                    │
│  │   CDN      │◄─────│  Angular   │                    │
│  │  (Static)  │      │   Build    │                    │
│  └────────────┘      └────────────┘                    │
│        │                                                 │
│        ▼                                                 │
│  ┌────────────┐      ┌────────────┐                    │
│  │   Users    │─────►│   NGINX    │                    │
│  └────────────┘      └──────┬─────┘                    │
│                             │                            │
│                             ▼                            │
│                      ┌────────────┐                     │
│                      │ Spring Boot│                     │
│                      │    API     │                     │
│                      └──────┬─────┘                     │
│                             │                            │
│                             ▼                            │
│                      ┌────────────┐                     │
│                      │ PostgreSQL │                     │
│                      │  Database  │                     │
│                      └────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

## 📊 Monitoring & Analytics

```
Application
    │
    ├─→ Performance API
    │   ├── FPS monitoring
    │   ├── Load times
    │   └── Memory usage
    │
    ├─→ Error Tracking
    │   ├── Console errors
    │   ├── API failures
    │   └── 3D rendering issues
    │
    └─→ User Analytics
        ├── Page views
        ├── Interactions
        └── Scroll depth
```

---

## 🎓 Références Architecture

- **Three.js** : https://threejs.org/docs/
- **Angular 19** : https://angular.dev/
- **GSAP** : https://greensock.com/docs/
- **Spring Boot** : https://spring.io/projects/spring-boot

---

**EQUA - Architecture Immersive 3D**
*Scalable • Performante • Moderne*
