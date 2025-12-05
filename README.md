# Portfolio Étudiant BUT Informatique

Ce projet est un template de portfolio statique (HTML/CSS/JS) conçu pour être simple, performant et accessible. Il ne nécessite aucune installation complexe (pas de Node.js, pas de base de données).

## 📁 Structure du projet

```
/
├── index.html              # Page d'accueil (Hero, Parcours, Projet Pro)
├── contact.html            # Page de contact
├── realisations.html       # Grille des projets (filtrable)
├── apprentissage.html      # Portfolio de compétences (Niveau 2)
├── assets/                 # Vos fichiers médias
│   ├── images/             # Mettez vos captures d'écran ici
│   ├── videos/             # Mettez vos vidéos de démo ici
│   └── cv.pdf              # Votre CV (à ajouter)
├── css/
│   └── styles.css          # Tous les styles du site
├── js/
│   ├── main.js             # Scripts globaux (thème, animations)
│   └── filters.js          # Script de filtrage pour la page réalisations
└── projets/
    └── projet-modele.html  # Modèle à dupliquer pour chaque nouveau projet
```

## 🚀 Comment utiliser ce template

### 1. Remplir le contenu
Le site utilise des **placeholders** visuels sous la forme `[[ ... ]]`.
Vous devez ouvrir chaque fichier HTML et remplacer ces textes par vos propres informations.

**Exemple dans `index.html` :**
```html
<h1>[[NOM COMPLET]]</h1>
<!-- Devient -->
<h1>Jean Dupont</h1>
```

Cherchez également les commentaires `<!-- TODO: ... -->` qui vous donnent des conseils sur le contenu attendu.

### 2. Ajouter vos projets
Pour ajouter un nouveau projet au portfolio :

1.  Allez dans le dossier `projets/`.
2.  Dupliquez le fichier `projet-modele.html`.
3.  Renommez la copie (ex: `site-e-commerce.html`).
4.  Ouvrez ce nouveau fichier et remplissez les sections (Contexte, Méthodes, etc.).
5.  Ajoutez vos images dans `assets/images/` et mettez à jour les balises `<img>`.
6.  **Important :** Retournez sur `realisations.html` et dupliquez une `<article class="card project-card">` pour créer le lien vers votre nouvelle page.

### 3. Portfolio d'Apprentissage
La page `apprentissage.html` est structurée pour valider les compétences du BUT.
Pour chaque compétence, remplacez les textes et assurez-vous de lier vers les projets qui servent de preuves.

### 4. Personnalisation (Optionnel)
- **Couleurs :** Ouvrez `css/styles.css` et modifiez les variables `--color-primary` et `--color-accent` au début du fichier.
- **Favicon :** Ajoutez une image `favicon.ico` à la racine.

## 🌍 Déploiement sur GitHub Pages

1.  Créez un nouveau repository sur GitHub (ex: `portfolio`).
2.  Poussez tous les fichiers de ce dossier sur la branche `main`.
3.  Allez dans les **Settings** du repository -> **Pages**.
4.  Dans "Build and deployment", choisissez **Source: Deploy from a branch**.
5.  Sélectionnez la branche `main` et le dossier `/ (root)`.
6.  Cliquez sur **Save**. Votre site sera en ligne quelques minutes plus tard !

## 📅 Échéances (Rappel)
- **Structure prête :** Semaine du 10 novembre.
- **Partie Valorisation terminée :** 19 décembre 2025.

---
*Ce site respecte les normes d'accessibilité WCAG 2.1 AA et les bonnes pratiques de performance web.*
