# LANDSRAAD // Cartographie Holosphérique 3D

Application interactive de cartographie stellaire 3D et tableau de bord tactique du Haut Conseil du Landsraad dans l'univers de Dune (Three.js, React, Tailwind CSS).

---

## 🚀 Guide de Déploiement sur GitHub Pages (Résolution de la page blanche)

Si vous avez rencontré un écran blanc sur GitHub Pages, voici la configuration prête à l'emploi. Vous avez le choix entre **3 méthodes** simples :

### Méthode 1 : Déploiement instantané depuis le dossier `/docs` (Recommandé & Le plus rapide)

Le dossier `/docs` contient déjà l'application entièrement pré-compilée et prête pour GitHub Pages :

1. Poussez votre code sur GitHub :
   ```bash
   git add .
   git commit -m "Déploiement Landsraad"
   git push origin main
   ```
2. Sur votre dépôt GitHub, allez dans **Settings** > **Pages** (dans le menu de gauche).
3. Sous **Build and deployment** :
   * **Source** : laissez `Deploy from a branch`
   * **Branch** : sélectionnez `main` (ou `master`)
   * **Folder** : sélectionnez `/docs` *(important ! Ne laissez pas `/ (root)` car la racine contient les sources non compilées)*
4. Cliquez sur **Save**.
5. Votre application sera accessible sans page blanche sur : `https://<votre-pseudo>.github.io/<votre-depot>/`

*(Remarque : Même si vous laissez par erreur `/ (root)`, un script de redirection automatique détecte GitHub Pages et renvoie automatiquement vers `/docs/` avec écran de chargement holographique).*

---

### Méthode 2 : Déploiement automatique via GitHub Actions

Le workflow automatisé `.github/workflows/deploy.yml` est déjà configuré à la racine du dépôt :

1. Sur votre dépôt GitHub, allez dans **Settings** > **Pages**.
2. Sous **Build and deployment** :
   * **Source** : sélectionnez **GitHub Actions**
3. À chaque `git push` sur `main`, GitHub exécutera automatiquement le build et publiera le site en production.

---

### Méthode 3 : Déploiement direct via la commande `npm run deploy`

Un script `gh-pages` est intégré :

```bash
npm run deploy
```
Cette commande compile le projet et publie directement les fichiers vers la branche `gh-pages` de votre dépôt.

---

## 🛠️ Développement local

```bash
# Installation des dépendances
npm install

# Démarrage du serveur local (port 3000)
npm run dev

# Compilation pour la production (génère dist/ et docs/)
npm run build
```
