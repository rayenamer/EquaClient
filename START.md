# 🚀 Guide de Démarrage Rapide - EQUA Frontend

## Installation et Lancement

### 1. Installer les dépendances

Ouvrez PowerShell ou le terminal dans le dossier Frontend et exécutez :

```powershell
npm install
```

Cette commande va installer toutes les dépendances nécessaires :
- Angular 19
- Three.js (pour la 3D)
- GSAP (pour les animations)
- TypeScript
- Et toutes les autres dépendances

⏱️ **Temps d'installation** : 2-5 minutes (selon votre connexion internet)

### 2. Vérifier l'installation

Une fois l'installation terminée, vous devriez voir un dossier `node_modules` créé.

### 3. Lancer l'application

```powershell
npm start
```

ou

```powershell
ng serve
```

L'application va compiler et se lancer. Vous verrez quelque chose comme :

```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

### 4. Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur :

```
http://localhost:4200
```

🎉 **Vous devriez voir l'application EQUA avec le token 3D animé !**

## 🎮 Interactions

Une fois l'application lancée :

1. **Scroll** : Faites défiler la page pour voir le token tourner et la caméra zoomer
2. **Clic sur le token** : Cliquez sur le token 3D pour afficher les informations EQUA
3. **Clic sur les cartes projets** : Cliquez sur n'importe quelle carte de projet pour voir les détails
4. **Navigation** : Explorez les différentes sections (Hero, About, Tokenomics, Projects, Stats)

## 🔧 Commandes Utiles

### Démarrage
```powershell
npm start
```

### Build de production
```powershell
npm run build
```

### Tests
```powershell
npm test
```

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

## 🐛 Problèmes Courants

### Port 4200 déjà utilisé
Si le port 4200 est déjà utilisé, lancez sur un autre port :
```powershell
ng serve --port 4300
```

### Erreur "ng: command not found"
Installez Angular CLI globalement :
```powershell
npm install -g @angular/cli
```

### Erreurs de compilation TypeScript
Essayez de supprimer `node_modules` et réinstaller :
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## 📡 Connexion au Backend

L'application est configurée pour se connecter à un backend Spring Boot sur :
```
http://localhost:8080/api
```

Si le backend n'est pas lancé, l'application utilisera des données de démonstration (mock data).

### Pour lancer le backend (séparé) :

1. Allez dans le dossier backend (à créer séparément)
2. Lancez avec Maven :
```bash
./mvnw spring-boot:run
```

## 🎨 Personnalisation

### Changer les couleurs
Modifiez `src/styles.scss` - section `:root`

### Changer le contenu
Modifiez `src/app/pages/home/home.component.html`

### Ajouter des modèles 3D
Placez vos fichiers `.glb` ou `.gltf` dans `src/assets/models/`

## 📱 Responsive

L'application est responsive et fonctionne sur :
- 💻 Desktop (optimal)
- 📱 Tablettes
- 📱 Mobiles

## ⚡ Performances

Pour de meilleures performances :
- Utilisez Chrome ou Firefox
- Activez l'accélération matérielle dans votre navigateur
- Fermez les autres onglets gourmands en ressources

## 🎓 En Savoir Plus

- [Documentation Angular](https://angular.dev)
- [Documentation Three.js](https://threejs.org/docs)
- [Documentation GSAP](https://greensock.com/docs)

---

**Bon développement ! 🚀**

*Projet EQUA - Finance Without Barriers*
