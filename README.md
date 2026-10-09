# LANDSRAAD // Cartographie Holosphérique 3D

Application interactive de navigation stellaire 3D et tableau de bord tactique du Haut Conseil du Landsraad dans l'univers de Dune (Three.js, React, Tailwind CSS).

---

## 🚀 Déploiement sur GitHub Pages (Sans page blanche)

Pour héberger ce projet sur GitHub Pages sans rencontrer le problème d'écran blanc, deux options simples sont configurées :

### Option 1 : Déploiement automatique via GitHub Actions (Recommandé)
Le fichier de workflow `.github/workflows/deploy.yml` est déjà inclus dans le dépôt.

1. Poussez votre code sur votre dépôt GitHub (`main` ou `master`).
2. Sur GitHub, rendez-vous dans l'onglet **Settings** > **Pages**.
3. Dans la section **Build and deployment** :
   - Sous **Source**, choisissez **GitHub Actions**.
4. GitHub va automatiquement compiler le projet (`npm run build`) et déployer le dossier `dist/` sur `https://<nom-utilisateur>.github.io/<nom-du-repo>/`.

---

### Option 2 : Déploiement en une commande avec `gh-pages`
Si vous préférez déployer manuellement depuis votre machine :

```bash
# Installe les dépendances si ce n'est pas déjà fait
npm install

# Compile et publie directement sur la branche gh-pages de votre dépôt GitHub
npm run deploy
```

Ensuite, dans **Settings** > **Pages**, vérifiez que la source est bien configurée sur la branche `gh-pages` / `root`.

---

## 🛠️ Corrections apportées pour éliminer l'écran blanc sur GitHub
1. **Chemins relatifs (`base: './'`)** : `vite.config.ts` génère désormais des chemins relatifs pour les scripts et feuilles de style, évitant les erreurs 404 sur les sous-dossiers de dépôts GitHub Pages (`/<nom-du-repo>/assets/...`).
2. **Support Jekyll désactivé (`.nojekyll`)** : Présence du fichier `.nojekyll` dans `public/` pour empêcher GitHub Pages d'ignorer les répertoires ou fichiers spécifiques générés par Vite.
3. **Gestion d'erreur WebGL (`ErrorBoundary`)** : En cas d'incompatibilité matérielle ou d'absence de WebGL sur la machine du visiteur, un écran tactique affiche l'explication et un bouton de réinitialisation plutôt qu'une page blanche vide.
4. **Redirection propre (`404.html`)** : Prise en charge des routes ou rafraîchissements GitHub Pages sans casser l'URL du dépôt.

---

## 💻 Développement local

```bash
# Lancer le serveur de développement
npm run dev

# Tester la compilation de production
npm run build
```
