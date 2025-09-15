// ======================================================================================
// Fichier maugallery.js : plugin jQuery qui va transformer les images en galerie responsive avec filtre et lightbox.

// Plus précisément, ce code définit une fonction réutilisable (un plugin jQuery) qu’on peut appliquer sur un élément de la page (par exemple ici une galerie d’images), en mélangeant les options par défaut avec celles qui ont été choisies quand on appelle la fonction.
// ======================================================================================

(function ($) {
  // ---------------Définition du plugin jQuery "mauGallery"----------------------

  $.fn.mauGallery = function (options) {
    // Fusion des options par défaut et de celles fournies par l'utilisateur
    var options = $.extend($.fn.mauGallery.defaults, options);
    // $.extend : fusionne les objets options et defaults:
    // defaults = les valeurs par défaut données par le plugin (ex: {columns: 3, showTags: true})
    // options = ce que l’utilisateur a mis (les paramètres donnés depuis script.js)

    var tagsCollection = []; // Tableau pour stocker les tags uniques trouvés

    // ---------------Application du plugin à chaque galerie trouvée :----------------------

    return this.each(function () {
      // Création du conteneur .row pour ranger les images.
      $.fn.mauGallery.methods.createRowWrapper($(this));

      // Si l’option lightBox est activée, on crée la modale/lightbox
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }

      // Activation des écouteurs d’événements
      $.fn.mauGallery.listeners(options);

      // Pour chaque élément .gallery-item
      $(this)
        .children(".gallery-item")
        .each(function (index) {
          // Rendre l’image responsive si c’est une balise <img>
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          // Déplacer l’élément dans la .row créée
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          // Envelopper l’élément dans une colonne (Bootstrap)
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);

          // Récupération du tag (catégorie) associé à l’image
          var theTag = $(this).data("gallery-tag");
          // Si on affiche les tags, qu’il est défini, et qu’il n’est pas déjà dans la liste
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag); // On ajoute le tag au tableau
          }
        });

      // Si l’option d’affichage des tags est activée, on les affiche
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      // Apparition progressive de la galerie
      $(this).fadeIn(500);
    });
  };

  //---------------Définition des options par défaut du plugin----------------------

  $.fn.mauGallery.defaults = {
    columns: 3, // Nombre de colonnes (par défaut 3)
    lightBox: true, // Active ou non la lightbox
    lightboxId: null, // ID de la modale (lightbox)
    showTags: true, // Affiche ou non les tags
    tagsPosition: "bottom", // Position des tags (haut ou bas)
    navigation: true, // Boutons précédent/suivant dans la lightbox
  };

  // ---------------Configuration des écouteurs d’événements----------------------

  $.fn.mauGallery.listeners = function (options) {
    // Quand on clique sur une image de la galerie
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        // Ouvre la lightbox avec l’image cliquée
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    // Filtrage par tag quand on clique sur un bouton de navigation
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

    // Navigation (image précédente/suivante dans la lightbox)
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  // ---------------Méthodes principales du plugin----------------------

  $.fn.mauGallery.methods = {
    // ---------------Création d'un conteneur .row pour organiser les images, seulement s’il n’existe pas déjà-----

    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    // ---------------Enveloppe un élément dans une colonne responsive----------------------

    // On enveloppe chaque image dans une colonne responsive (Bootstrap), en fonction du nombre de colonnes ou d’un objet avec les tailles (xs, sm, md, etc.).

    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        // Cas simple : nombre fixe de colonnes
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        // Cas avancé : colonnes définies par device (xs, sm, md, lg, xl)
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        // Erreur si le format des colonnes n’est pas valide
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },

    // ---------------Déplacement de chaque élément dans la .row créée----------------------

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    // ---------------Rend une image responsive si c’est une balise <img> et en leur ajoutant la classe Bootstrap .img-fluid----------------------

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    // ---------------Ouvre la lightbox et on affiche l’image cliquée dedans----------------------

    // openLightBox(element, lightboxId) {
    //   $(`#${lightboxId}`)
    //     .find(".lightboxImage")
    //     .attr("src", element.attr("src"));
    //   $(`#${lightboxId}`).modal("toggle");
    // },

    // -----------Correction du bug :conflit focus sur la lightBox et le focus sur la première image de la galerie.----------------------

    openLightBox(element, lightboxId) {
      const modal = $(`#${lightboxId}`);
      modal.find(".lightboxImage").attr("src", element.attr("src"));
      modal.attr("aria-hidden", "false"); // modale ouverte, on désactive l'attribut aria-hidden pour que le lecteur de screen reader puisse la voir.
      modal.modal("toggle");
    },

    // On gère l'événement de fermeture pour remettre aria-hidden à true:
    // Bootstrap déclenche l’événement hidden.bs.modal quand la modale se ferme, donc on peut ajouter :
    closeLightBox(lightboxId) {
      const modal = $(`#${lightboxId}`);
      modal.on("hidden.bs.modal", function () {
        $(this).attr("aria-hidden", "true"); // modale fermée ->  Cela indique aux technologies d’assistance que la modal est maintenant cachée et ne doit plus être lue ou focusée
      });
    },

    // ---------------On gère l’image précédente dans la lightbox----------------------

    prevImage() {
      let activeImage = null;
      // On cherche l’image active
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });

      // On récupère la liste des images selon le tag actif (filtrage).
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = []; // On crée un tableau pour stocker les images visibles.

      // Création de la collection d’images visibles
      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }

      let index = 0,
        next = null;

      // Trouver l’index de l’image active
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
          console.log(index); // pour vérifier que l'index est correct
        }
      });

      // Image précédente (ou dernière si aucune trouvée)
      next =
        // imagesCollection[index] || → Gardait la même image, donc rien ne changeait quand on cliquait.
        imagesCollection[index - 1] || // Correction : on soustrait 1 à l'index pour afficher l'image précédente
        imagesCollection[imagesCollection.length - 1]; // Si aucune image précédente trouvée, on affiche la dernière image (pour boucler).
      $(".lightboxImage").attr("src", $(next).attr("src")); // On change l'attribut src de l'image affichée dans la lightbox et on lui met celui de la nouvelle image.
    },

    // ---------------Gestion de l'image suivante dans la lightbox----------------------

    nextImage() {
      let activeImage = null;
      // On cherche l’image active
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });

      // On récupère la liste des images selon le tag actif (filtrage).
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = []; // On crée un tableau pour stocker les images visibles.

      // Création de la collection d’images visibles
      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }

      let index = 0,
        next = null;

      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });

      // Image suivante (ou première si aucune trouvée)

      // next = imagesCollection[index] || imagesCollection[0]; → Gardait la même image, donc rien ne changeait quand on cliquait.
      next = imagesCollection[index + 1] || imagesCollection[0]; // Correction : on ajoute 1 à l'index pour afficher l'image suivante
      $(".lightboxImage").attr("src", $(next).attr("src")); // On change l'attribut src de l'image affichée dans la lightbox et on lui met celui de la nouvelle image.
    },

    // ---------------Création de la lightbox (modale Bootstrap) avec son contenu : image + boutons précédent/suivant si navigation est activé----------------------

    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    // ---------------Affiche les tags de filtrage (catégories)----------------------

    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    // ---------------Filtre les images par tag----------------------

    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }

      // Mise à jour du tag actif
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");

      var tag = $(this).data("images-toggle");

      // Affiche/masque les images selon le tag sélectionné
      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide();
        if (tag === "all") {
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    },
  };
})(jQuery); // Fin de la fonction auto-exécutée
