# Token EQUA 3D — Documentation technique

Ce document décrit comment le **token EQUA qui tourne en 3D** est implémenté dans la dernière version du frontend Angular.

---

## Vue d’ensemble

Le token est une **pièce 3D** affichée dans la section « token » de la page d’accueil. Il tourne en continu autour de l’axe vertical (Y), avec un rendu type métal doré et un fond **transparent** pour laisser voir l’arrière-plan (effet letter-glitch / code) derrière le canvas.

---

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **Three.js** (~0.160) | Scène 3D, caméra, rendu WebGL, géométries (cylindre, cercles), matériaux, texture |
| **GSAP** (3.12+) | Animations (particules, anneau de fallback, scroll/mouse si utilisé plus tard) |
| **Angular** | Composant `HomeComponent`, service `ThreeService`, canvas dans le template |

---

## Architecture

```
HomeComponent (page d’accueil)
    │
    ├── Template : <canvas #canvas></canvas> dans .token-section-right
    ├── @ViewChild('canvas') canvasRef
    └── injecte ThreeService
            │
            └── ThreeService
                    ├── init(canvasRef, tokenImagePath)
                    ├── loadTokenModel(imagePath)  → pièce 3D (cylindre + faces texture)
                    ├── addParticles()             → particules dorées
                    ├── animate()                   → boucle requestAnimationFrame + rotation Y
                    └── dispose()                  → nettoyage au destroy
```

- Le **canvas** est le seul élément 3D ; il est affiché dans la colonne droite de la section token, par-dessus le fond letter-glitch.
- Toute la logique 3D (scène, caméra, objet, boucle d’animation) est centralisée dans **`ThreeService`** (`src/app/services/three.service.ts`).

---

## Intégration dans la page

### 1. Template (`home.component.html`)

La section token contient :

- Un fond **letter-glitch** en plein section (`app-letter-glitch` avec classe `token-section-glitch-full`).
- Une grille en deux colonnes :
  - **Gauche** : texte + boutons (description).
  - **Droite** : un seul élément, le **canvas** où Three.js dessine le token.

```html
<section class="token-section" id="token-section">
  <app-letter-glitch class="token-section-glitch token-section-glitch-full" ...></app-letter-glitch>
  <div class="token-section-content">
    <div class="token-section-left">...</div>
    <div class="token-section-right">
      <canvas #canvas></canvas>
    </div>
  </div>
</section>
```

Le canvas est donc **sans** élément Three.js à côté dans le HTML : tout est géré par le service.

### 2. Composant (`home.component.ts`)

- Référence au canvas avec **`@ViewChild('canvas', { static: true }) canvasRef`**.
- Dans **`ngAfterViewInit()`** :
  - chemin de l’image du token : **`/assets/images/equa-token-ref.png`** ;
  - **`this.threeService.init(this.canvasRef, tokenImagePath)`** ;
  - **`this.threeService.animate()`** pour lancer la boucle de rotation.
- Dans **`ngOnDestroy()`** : **`this.threeService.dispose()`** pour libérer la scène, le renderer et les listeners.

Aucune logique 3D n’est dans le composant : il ne fait qu’initialiser le service avec le canvas et l’image, lancer l’animation et nettoyer au destroy.

---

## Construction du token 3D (`ThreeService`)

### Scène et rendu

- **Scene** : fond `null` (transparent) + brouillard léger.
- **Camera** : `PerspectiveCamera` FOV 40, position `(0, 0, 10)`, regarde `(0, 0, 0)`.
- **Renderer** : WebGL avec **`alpha: true`** et **`setClearColor(0x000000, 0)`** pour garder le fond transparent et laisser voir le letter-glitch.
- **Post-processing** : `EffectComposer` + `RenderPass` + **`UnrealBloomPass`** sont créés mais le rendu final utilisé est **`this.renderer.render(...)`** (pas le composer), pour éviter de remplir le fond en opaque.

### Objet principal : la pièce

Le token est un **groupe** (`THREE.Group`) composé de :

1. **Tranche (cylindre)**  
   - `CylinderGeometry(radius, radius, thickness, 128)` avec `radius = 1.65`, `thickness = 0.22`.  
   - Matériau type métal doré : `MeshStandardMaterial` avec `color: 0xffd700`, `metalness`, `roughness`, `emissive` / `emissiveIntensity`.  
   - Rotation X à 90° pour mettre le cylindre « à plat » comme une pièce.

2. **Face avant**  
   - `CircleGeometry(radius, 128)` avec la **texture** chargée depuis `equa-token-ref.png`.  
   - Même style de matériau (métal + léger emissive doré), décalée en Z vers l’avant.

3. **Face arrière**  
   - Même cercle, même texture (clonée), positionnée en Z vers l’arrière et **rotation Y = π** pour afficher l’image à l’envers côté pile.

Le groupe est légèrement incliné : **`rotation.x = -0.2`**.

### Chargement de la texture

- **`THREE.TextureLoader`** charge **`/assets/images/equa-token-ref.png`**.
- Paramètres : `ClampToEdgeWrapping`, pas de flip Y, centre (0.5, 0.5).
- En cas d’échec de chargement, **`createFallbackToken()`** est appelé : pièce dorée simple + texte « EQUA » dessiné sur un canvas 2D puis appliqué en texture, et optionnellement un anneau (torus) animé avec GSAP.

### Éclairage

- Lumière ambiante.
- Plusieurs **DirectionalLight** (blanc + dorée + fill + rim) pour donner l’effet métallique et le reflet doré.

### Particules

- Environ **150 particules** (positions aléatoires dans un volume), matériau `PointsMaterial` doré, additive blending, très petites et peu opaques.
- Animation GSAP : rotation lente du nuage de particules (axe Y, durée 30 s, répétée).

---

## Animation (rotation du token)

- **`animate()`** est une boucle **`requestAnimationFrame`** qui :
  - incrémente **`this.mainObject.rotation.y`** de **`0.01`** à chaque frame (rotation continue autour de l’axe vertical) ;
  - appelle **`this.renderer.render(this.scene, this.camera)`** (sans composer pour garder le fond transparent).

C’est cette méthode qui donne l’effet « token qui tourne en 3D » en continu.

---

## Redimensionnement et nettoyage

- **`onResize()`** : récupère la taille du canvas (`getCanvasSize()`), met à jour l’aspect de la caméra, la taille du renderer et du composer (dont la résolution du bloom).  
  Un listener **`window.resize`** est enregistré dans **`init()`** et retiré dans **`dispose()`**.

- **`dispose()`** :  
  - suppression du listener resize ;  
  - annulation de la boucle d’animation (`cancelAnimationFrame`) ;  
  - parcours de la scène pour **dispose** des géométries et matériaux ;  
  - **dispose** du renderer et du composer.

---

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `src/app/services/three.service.ts` | Scène 3D, création du token (cylindre + cercles texture), lumières, particules, boucle d’animation, resize, dispose |
| `src/app/pages/home/home.component.ts` | ViewChild du canvas, `init()` + `animate()` dans `ngAfterViewInit`, `dispose()` dans `ngOnDestroy` |
| `src/app/pages/home/home.component.html` | Section token avec letter-glitch et `<canvas #canvas></canvas>` dans `.token-section-right` |
| `src/app/pages/home/home.component.scss` | Styles de `.token-section`, `.token-section-right` et du canvas (pleine taille, position absolue) |
| `public/assets/images/equa-token-ref.png` | Image utilisée comme texture des deux faces du token (à fournir dans le projet) |

---

## Résumé

- Le **token 3D** est une pièce réalisée avec **Three.js** : cylindre (tranche) + deux cercles texture (face avant/arrière) à partir de **`equa-token-ref.png`**.
- La **rotation** est une simple incrémentation de **`rotation.y`** dans la boucle **`animate()`** du **`ThreeService`**.
- L’intégration côté Angular se limite à : **un canvas** dans le template, **init + animate** au **ngAfterViewInit**, et **dispose** au **ngOnDestroy**, le reste étant encapsulé dans le service.
