# 🪙 EQUA - Finance Without Barriers

## 📋 Résumé du Projet

Application web immersive 3D pour l'écosystème de microfinance décentralisée EQUA, développée dans le cadre du projet intégré de 4ème année à ESPRIT.

### 🎯 Objectif

Créer une plateforme de microfinance décentralisée qui tokenise l'argent et les actifs pour offrir :
- 💰 Prêts accessibles
- 💳 Épargne sécurisée
- 💸 Paiements instantanés
- 📈 Investissements tokenisés
- 🔄 Transferts P2P

### 🌟 Caractéristiques Uniques

1. **Conformité Réglementaire** : Partenariat avec la BCT (Banque Centrale de Tunisie)
2. **Stabilité** : Token adossé à des institutions financières
3. **Inclusion** : Interface accessible aux populations non bancarisées
4. **Technologie** : Blockchain avec smart contracts
5. **Expérience** : Interface 3D immersive type Igloo.inc

## 📊 Données du Projet (PDF)

### Problème
- 37% seulement de la population tunisienne a accès aux services bancaires
- 2.5-3.5 millions d'adultes exclus du système financier formel
- Les cryptomonnaies existantes ne répondent pas aux besoins de microfinance

### Solution EQUA
- Token EQUA pegged 1:1 avec le TND initialement
- Prix dynamique basé sur l'offre et la demande
- Récompenses pour les validateurs de réseau
- Investissements en actifs tokenisés (immobilier, actions)

### Architecture Technique
- **Frontend** : Angular 19, Three.js, GSAP
- **Backend** : Spring Boot 3, Spring Data JPA
- **Base de données** : PostgreSQL/MySQL
- **Blockchain** : Smart contracts pour automatisation

## 🎨 Fonctionnalités Frontend Implémentées

### ✅ Scène 3D Immersive
- Canvas fullscreen avec Three.js
- Token EQUA en 3D avec votre image PNG
- Effets de post-processing (Bloom)
- Particules animées en arrière-plan
- Éclairage cinématique (4 sources de lumière)

### ✅ Animations au Scroll
- GSAP ScrollTrigger intégré
- Rotation du token basée sur le défilement
- Zoom de caméra progressif
- Animations des sections

### ✅ Interactions
- Clic sur le token pour afficher les infos
- Overlay avec détails des projets
- Animation de caméra vers l'objet
- Navigation fluide

### ✅ Sections
1. **Hero** : Introduction avec titre animé
2. **About** : 4 caractéristiques principales
3. **Tokenomics** : Modèle économique détaillé
4. **Projects** : 4 solutions de l'écosystème
5. **Stats** : Statistiques d'impact
6. **CTA** : Appel à l'action
7. **Footer** : Navigation et liens

### ✅ Design
- Thème sombre professionnel
- Palette or (#FFD700) et bleu (#00D4FF)
- Typographie Syne (Google Fonts)
- 100% responsive (desktop, tablette, mobile)
- Effet de lueur et bloom

## 📁 Structure du Projet

```
Frontend/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── project.model.ts          # Interface Project
│   │   ├── pages/
│   │   │   └── home/
│   │   │       ├── home.component.ts     # Composant principal
│   │   │       ├── home.component.html   # Template HTML
│   │   │       └── home.component.scss   # Styles
│   │   ├── services/
│   │   │   ├── api.service.ts            # Appels API backend
│   │   │   └── three.service.ts          # Gestion scène 3D
│   │   ├── app.component.ts              # Composant racine
│   │   ├── app.config.ts                 # Configuration
│   │   └── app.routes.ts                 # Routes
│   ├── assets/
│   │   ├── images/
│   │   │   └── equa-coin.png            # Votre token en PNG
│   │   └── models/                       # Modèles 3D (.glb/.gltf)
│   ├── environments/
│   │   ├── environment.ts                # Config développement
│   │   └── environment.prod.ts           # Config production
│   ├── index.html                        # HTML principal
│   ├── main.ts                           # Point d'entrée
│   └── styles.scss                       # Styles globaux
├── angular.json                          # Config Angular
├── package.json                          # Dépendances npm
├── tsconfig.json                         # Config TypeScript
├── README.md                             # Documentation complète
├── START.md                              # Guide de démarrage rapide
├── BACKEND-GUIDE.md                      # Guide backend Spring Boot
└── PROJET-EQUA.md                        # Ce fichier
```

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+
- npm ou yarn
- Un navigateur moderne (Chrome, Firefox, Edge)

### Étapes

1. **Installer les dépendances**
```powershell
npm install
```

2. **Lancer l'application**
```powershell
npm start
```

3. **Ouvrir dans le navigateur**
```
http://localhost:4200
```

## 🔌 Connexion Backend

### Option 1 : Sans Backend (Mock Data)
L'application fonctionne avec des données de démonstration intégrées.

### Option 2 : Avec Backend Spring Boot
1. Suivez le guide dans `BACKEND-GUIDE.md`
2. Lancez le backend sur le port 8080
3. L'application se connectera automatiquement

### API Endpoints Attendus
```
GET  /api/projects          # Liste des projets
GET  /api/projects/{id}     # Détail d'un projet
```

## 📐 Architecture Frontend

### Composants Principaux

1. **ThreeService** (`three.service.ts`)
   - Initialisation de la scène 3D
   - Gestion du token 3D
   - Post-processing (Bloom)
   - Animations et interactions
   - Gestion de la caméra

2. **ApiService** (`api.service.ts`)
   - Communication avec le backend
   - Récupération des projets
   - Gestion des erreurs

3. **HomeComponent** (`home.component.ts`)
   - Orchestration de la page principale
   - Intégration Three.js + GSAP
   - Gestion des interactions utilisateur
   - Affichage des overlays

### Technologies Utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| Angular | 19.0.0 | Framework frontend |
| Three.js | 0.160.0 | Rendu 3D WebGL |
| GSAP | 3.12.5 | Animations |
| TypeScript | 5.5.2 | Langage |
| SCSS | - | Styles |

## 🎮 Interactions Utilisateur

### Desktop
- **Scroll** : Rotation du token + zoom caméra
- **Clic sur token** : Affiche les informations EQUA
- **Clic sur cartes** : Affiche les détails des projets
- **Hover sur boutons** : Effets de lueur

### Mobile
- **Scroll** : Mêmes animations adaptées
- **Tap** : Remplace les clics
- **Interface responsive** : Adaptation automatique

## 📊 Tokenomics EQUA (Implémenté dans l'UI)

### Parité Initiale
```
1 EQUA = 1 TND
```

### Prix Dynamique
```
P = (Demande Totale / Offre Totale) × Prix de Base
```

### Récompenses Nœuds
- 1 token par transaction validée
- 0.3 tokens → offre globale
- 0.7 tokens → validateur

### Investissements
- Actifs tokenisés (immobilier, actions)
- Valeur dynamique liée aux actifs réels

## 🎯 Fonctionnalités du Système (Backend à implémenter)

### FR-01 : Authentification
- Inscription et connexion sécurisées
- Gestion de profil utilisateur

### FR-02 : Wallet Digital
- Portefeuille personnel
- Solde en temps réel
- Transactions blockchain

### FR-03 : Micro-prêts
- Demande de prêts
- Émission automatique via smart contracts
- Suivi des remboursements

### FR-04 : Épargne
- Dépôts et retraits
- Protection par tokens stables

### FR-05 : Historique
- Toutes les transactions
- Traçabilité blockchain

### FR-06 : Investissements
- Accès aux actifs tokenisés
- Suivi des performances

## 🔒 Sécurité

### Frontend
- ✅ HTTPS obligatoire en production
- ✅ Validation des entrées
- ✅ Protection XSS
- ✅ CORS configuré

### Backend (à implémenter)
- JWT Authentication
- Chiffrement end-to-end
- Rate limiting
- Audit logs

## 📈 Métriques d'Impact (UI intégrée)

- 📊 2.5M+ adultes non bancarisés ciblés
- 📊 37% taux d'inclusion actuel
- 📊 ~0% frais de transaction
- 📊 100% transparence blockchain

## 🌍 Déploiement

### Frontend
```powershell
npm run build
```
→ Déployer le dossier `dist/` sur un serveur web

### Plateformes suggérées
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

## 📚 Documentation Supplémentaire

- `README.md` : Documentation technique complète
- `START.md` : Guide de démarrage rapide
- `BACKEND-GUIDE.md` : Création du backend Spring Boot

## 👥 Équipe

**Projet Intégré 4ème Année - ESPRIT**
- Année académique : 2025-2026
- Encadré par : [Nom de l'encadrant]

## 📄 Licence

© 2025-2026 EQUA. Tous droits réservés.

## 🎓 Références

- [EquaReport.pdf] : Document complet du projet
- [Igloo.inc](https://igloo.inc) : Inspiration design immersif
- [Three.js](https://threejs.org) : Documentation 3D
- [GSAP](https://greensock.com) : Documentation animations

---

## ✨ Points Forts de l'Implémentation

### ✅ Respect du Cahier des Charges
- Application immersive 3D type Igloo.inc
- Three.js avec post-processing Bloom
- GSAP ScrollTrigger pour animations
- Token EQUA en 3D intégré
- Architecture Angular 19 moderne
- API Spring Boot compatible

### ✅ Qualité du Code
- TypeScript strict
- Composants standalone (Angular 19)
- Services réutilisables
- Styles SCSS modulaires
- Code commenté

### ✅ Expérience Utilisateur
- Chargement avec loader animé
- Animations fluides 60fps
- Responsive design
- Accessibilité
- Performance optimisée

### ✅ Documentation
- README complet
- Guide de démarrage
- Guide backend
- Code commenté
- Structure claire

---

**🚀 Projet prêt pour la démonstration et le développement !**

*EQUA - Finance Without Barriers*
*Democratizing Access to Financial Services*
