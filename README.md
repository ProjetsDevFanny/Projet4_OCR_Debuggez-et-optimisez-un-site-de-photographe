## Projet 4 — Nina Carducci (OpenClassrooms)

Site vitrine d'une photographe professionnelle. Projet focalisé sur le débogage, l'optimisation des performances (Lighthouse), l'accessibilité et le SEO d'un site HTML/CSS/JS existant.

## Démo / Déploiement

- **Lien de production**: à venir (déploiement non encore effectué)
  - Exemples d'options: GitHub Pages, Netlify ou Vercel

## Captures d’écran

### Aperçu du site (Desktop)

![Capture d’écran du site Nina Carducci](assets/images/Docs_readme/screenshot_carducci_desktop.png)

### Rapports Lighthouse

- **Avant optimisations**

![Lighthouse avant (Desktop)](assets/images/Docs_readme/Stats_Lighthouse_desktop_avant.png)

- **Après optimisations**

![Lighthouse après (Desktop)](assets/images/Docs_readme/Stats_Lighthouse_desktop_apres.png)

## Objectifs pédagogiques

- Identifier et corriger des bugs front-end
- Améliorer les performances (chargement, rendu, assets)
- Renforcer l’accessibilité (WCAG) et le SEO
- Mettre en place de bonnes pratiques HTML, CSS et JS

## Améliorations apportées

### Performance

- **Images optimisées**: conversion en WebP, déclinaisons responsives (420/600/900/1400) pour le slider et la galerie
  - **Gain de poids**: 29,4 MB → 456,09 kB (soit **98,5% de réduction** sur 15 images)
- **Ressources minifiées**: utilisation de `bootstrap.min.css`, `bootstrap.bundle.min.js`, `style.min.css` lorsque pertinent
- **Réduction du poids**: suppression d'assets non utilisés et priorisation des ressources critiques
- **Rendu initial amélioré**: ajustements de l'ordre de chargement des scripts/styles

### Accessibilité

- **Attributs `alt` significatifs** sur les images
- **Hiérarchie des titres** revue pour la sémantique
- **Contrastes** vérifiés et améliorés

### SEO

- **Balises meta** (title, description) pertinentes et uniques
- **Structure sémantique** clarifiée (sections, headings)
- **Attribut `lang`**, favicons et ressources correctement référencés

### Qualité / JS & CSS

- **Scripts**: ordre de chargement revu, jQuery/Bootstrap non bloquants

## Lancer le projet en local

1. Cloner ce dépôt
2. Ouvrir `index.html` dans le navigateur
   - Recommandé: utiliser une extension type « Live Server » pour auto-reload
3. Aucun build nécessaire (projet statique HTML/CSS/JS)

## Outils et versions clés

- HTML5 / CSS3 / JavaScript (ES6+)
- Bootstrap (inclus dans `assets/bootstrap`)
- jQuery 3.6.4 (`assets/jquery-3.6.4.min.js`)

## Crédits

- Photos: auteurs crédités dans les fichiers d’images (Unsplash, etc.)
- Projet pédagogique: OpenClassrooms — Parcours Développeur Web (Projet 4)
