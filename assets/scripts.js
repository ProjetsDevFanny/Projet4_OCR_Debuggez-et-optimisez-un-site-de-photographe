// ======================================================================================
// Fichier script.js : script qui va charger le plugin maugallery.js et appliquer la fonction .mauGallery() à l'élément .gallery.

// Quand la page est prête ($(document).ready), on applique la fonction .mauGallery() à l'élément .gallery.
// Cette fonction est définie dans le fichier maugallery.js.

//========================================================================================

// Quand le DOM (page HTML) est entièrement chargé
$(document).ready(function () {
  // On initialise la galerie sur l'élément qui a la classe .gallery
  $(".gallery").mauGallery({
    // Définition du nombre de colonnes selon la taille d'écran (Bootstrap grid)
    columns: {
      xs: 1, // petits écrans (téléphones)
      sm: 2, // écrans un peu plus grands
      md: 3, // écrans moyens
      lg: 3, // grands écrans
      xl: 3, // très grands écrans
    },
    // ... options ...
    lightBox: true, // active l'agrandissement des images (lightbox)
    lightboxId: "myAwesomeLightbox", // id du modal qui sera créé pour le lightbox
    showTags: true, // affiche les filtres (tags) au-dessus ou en-dessous
    tagsPosition: "top", // position de la barre de tags ("top" ou "bottom")
    // navigation: true, // ou false pour désactiver les boutons précédent/suivant -> déjà mentionné à ligne 32 du fichier maugallery.js
  });
});
