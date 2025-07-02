/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {

  document.addEventListener('DOMContentLoaded', function() {
    // Function to set padding-top dynamically
    function adjustPadding() {
      const gridImage = document.querySelector('.cc-grid-item .product-item__image');
      const featuredImage = document.querySelector('.product-item--featured-image--custom .product-item__image');
      
      if (gridImage && featuredImage) {
        const imageHeight = gridImage.offsetHeight;
        featuredImage.style.paddingTop = `${imageHeight}px`;
      }
    }

    adjustPadding();
    window.addEventListener('resize', adjustPadding);
  });
  
  // Call the function to check orientation
  document.addEventListener("DOMContentLoaded", () => {
    function checkOrientation() {
        var element = document.querySelector('.pdp-media-item-1');
        if (element) {
            var rect = element.getBoundingClientRect();
            var isLandscape = rect.width > rect.height;

            if (isLandscape) {
                console.log('Landscape');
            } else {
                console.log('Portrait');
            }
        }
    }
    checkOrientation();
  });

  // PDP overlay frame
  document.addEventListener("DOMContentLoaded", function () {
    // Function to determine if an element is landscape
    function isLandscape(el) {
        const rect = el.getBoundingClientRect();
        return rect.width > rect.height;
    }

    // Function to update the hidden input and image overlay
    function updateImageOverlay(newImageUrl) {
        const frameInput = document.getElementById("frame_image_input");
        const imageOverlay = document.querySelector(".pdp-media-item-1 .pdp-image-overlay");

        if (frameInput) {
            frameInput.value = newImageUrl;
        }

        if (imageOverlay) {
            imageOverlay.style.backgroundImage = `url('${newImageUrl}')`;
        }
    }

    // Listen for changes on frame option radio buttons
    document.querySelectorAll("input[type='radio'][name='properties[Frame]']").forEach(radio => {
        radio.addEventListener("change", function () {
            const mediaItem = document.querySelector(".pdp-media-item-1");
            if (!mediaItem) return;

            const landscape = isLandscape(mediaItem);

            const newFrameImage = landscape
                ? this.getAttribute("data-frame-image-landscape")
                : this.getAttribute("data-frame-image");

            if (newFrameImage) {
                updateImageOverlay(newFrameImage);
            }
        });
    });

    // Run on initial page load (in case a default frame is selected)
    const initialRadio = document.querySelector("input[type='radio'][name='properties[Frame]']:checked");
    const mediaItem = document.querySelector(".pdp-media-item-1");
    if (initialRadio && mediaItem) {
        const landscape = isLandscape(mediaItem);
        const initialFrameImage = landscape
            ? initialRadio.getAttribute("data-frame-image-landscape")
            : initialRadio.getAttribute("data-frame-image");

        if (initialFrameImage) {
            updateImageOverlay(initialFrameImage);
        }
    }
  });


  document.addEventListener("DOMContentLoaded", function () {
    const productPhoto = document.querySelector(".product__photo");

    if (productPhoto) {
        productPhoto.addEventListener("mousemove", function (e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;

            this.style.transformOrigin = `${x}% ${y}%`;
            this.style.transform = "scale(2)"; // Adjust zoom level
        });

        productPhoto.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
            this.style.transformOrigin = "center";
        });
    }
  });

  // retail price variant price change
  document.addEventListener("DOMContentLoaded", function () {
    const variantSelector = document.querySelector("[name='id']");
    const retailPriceElement = document.getElementById("retail-price");
  
    if (variantSelector && retailPriceElement) {
      variantSelector.addEventListener("change", function () {
        const selectedVariantId = this.value;
  
        fetch(window.location.pathname + `.js`)
          .then(response => response.json())
          .then(data => {
            const variant = data.variants.find(v => v.id == selectedVariantId);
            let rrpPrice = null;
  
            // Check variant metafield first
            if (variant && variant.metafields?.custom?.rrp_price) {
              rrpPrice = variant.metafields.custom.rrp_price;
            } 
            // Fallback to product metafield
            else if (data.metafields?.custom?.rrp_price) {
              rrpPrice = data.metafields.custom.rrp_price;
            }
  
            // Format and display price
            if (rrpPrice !== null) {
              let formattedPrice = Shopify.formatMoney(rrpPrice * 100); // Convert to cents
              retailPriceElement.innerHTML = formattedPrice;
            } else {
              retailPriceElement.innerHTML = "No RRP Price"; // Fallback message
            }
          })
          .catch(error => console.error("Error fetching variant data:", error));
      });
    }
  });
  
  // remove glazing 
  document.addEventListener("DOMContentLoaded", function () {
    const sizeOptions = document.querySelectorAll('.selector-wrapper[data-option-position="1"] ul.select-popout__list li');
    const glazingWrapper = document.querySelector('.selector-wrapper[data-option-position="2"]');
    const glazingOptions = glazingWrapper ? glazingWrapper.querySelectorAll("ul.select-popout__list li") : null;
  
    if (sizeOptions.length > 0 && glazingOptions) {
      sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
          const selectedSize = this.textContent.trim().toLowerCase();
  
          if (selectedSize.startsWith("x-large") || selectedSize.startsWith("xl")) {
            glazingOptions.forEach(glaze => {
              const glazeText = glaze.textContent.trim().toLowerCase();
              if (glazeText !== "clear acrylic") {
                glaze.style.display = "none"; // Hide non-Clear Acrylic options
              } else {
                glaze.style.display = "block"; // Show Clear Acrylic
              }
            });
          } else {
            // Show all glazing options if size is NOT XL
            glazingOptions.forEach(glaze => {
              glaze.style.display = "block";
            });
          }
        });
      });
    }
  });

  // Auto-select glazing based on size
  document.addEventListener('DOMContentLoaded', function () {
    const sizeOptions = document.querySelectorAll('.selector-1 .select-popout__item');
    const glazingOptions = document.querySelectorAll('.selector-2 .select-popout__item .select-popout__option');
  
    sizeOptions.forEach(sizeOption => {
      sizeOption.addEventListener('click', function () {
        const selectedSize = this.textContent.trim().toLowerCase();
  
        if (selectedSize.includes('xl') || selectedSize.includes('x-large')) {
          const clearAcrylicOption = Array.from(glazingOptions).find(opt =>
            opt.getAttribute('data-value') === 'Clear Acrylic'
          );
  
          if (clearAcrylicOption) {
            clearAcrylicOption.click();
          }
        }
      });
    });
  });


  // capture price and add it to cart button
  document.addEventListener("DOMContentLoaded", function () {
    const priceElement = document.querySelector('[data-product-price]');
    const addToCartText = document.querySelector('[data-add-to-cart-text]');

    function updateCartText() {
        if (priceElement && addToCartText) {
            const price = priceElement.textContent.trim();
            addToCartText.innerHTML = `Add to cart &nbsp; (${price})`;
        }
    }

    // Initial update
    updateCartText();

    // Watch for price changes (e.g., on variant change)
    const observer = new MutationObserver(updateCartText);
    if (priceElement) {
        observer.observe(priceElement, { childList: true, subtree: true });
    }
    });


  // PDP frames load more
  document.addEventListener("DOMContentLoaded", function () {
    let items = document.querySelectorAll(".pdp-frame-options ul li");
    let loadMoreBtn = document.getElementById("loadMore");
    let itemsPerClick = 4;
    let initialCount = 4;

    // Sort the items based on data-frame-order
    const sortedItems = Array.from(items).sort((a, b) => {
        return a.getAttribute('data-frame-order') - b.getAttribute('data-frame-order');
    });

    // Re-order the items in the DOM without removing them
    const parent = document.querySelector(".pdp-frame-options ul ");
    sortedItems.forEach(item => parent.appendChild(item)); // Re-append items in sorted order

    function showItems(count) {
        sortedItems.forEach((item, index) => {
            item.style.display = index < count ? "block" : "none";
        });
    }

    function isAllVisible() {
        return Array.from(sortedItems).every(item => item.style.display === "block");
    }

    // Show initial items
    showItems(initialCount);

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (isAllVisible()) {
                // Collapse back to initial
                showItems(initialCount);
                loadMoreBtn.textContent = "See More Frame Options";
            } else {
                // Show all
                showItems(sortedItems.length);
                loadMoreBtn.textContent = "See Less Frame Options";
            }
        });

        // Set initial label
        if (sortedItems.length <= initialCount) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.textContent = "See More Frame Options";
        }
    }
});



  /* Auto-focus .product__images when clicking a .pdp-frame-options li */
  document.addEventListener("DOMContentLoaded", function () {
    const frameOptions = document.querySelectorAll(".pdp-frame-options li");
    const productImagesSection = document.querySelector(".product__images");
    const firstSlide = document.querySelector(".product__slide");

    if (frameOptions.length > 0 && productImagesSection && firstSlide) {
      frameOptions.forEach((option) => {
        option.addEventListener("click", function () {
          // Step 1: Scroll to product image section vertically
          window.scrollTo({
            top: productImagesSection.offsetTop,
            behavior: "smooth"
          });

          // Step 2: Scroll horizontally to the first slide
          // Find the nearest scrollable container
          const scrollContainer = firstSlide.parentElement;

          scrollContainer.scrollTo({
            left: firstSlide.offsetLeft,
            behavior: "smooth"
          });
        });
      });
    }
  });


  // Copy section from /pages/frames-sizing to .product-modal #size-chart-copy
  document.addEventListener("DOMContentLoaded", function () {
    fetch("/pages/frames-sizing")
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let frameGuides = doc.querySelectorAll(".frame-guides-column");
            let sizeChartCopy = document.querySelector(".product-modal #size-chart-copy");
            
            if (frameGuides.length > 0 && sizeChartCopy) {
                sizeChartCopy.innerHTML = "";
                frameGuides.forEach(guide => {
                    sizeChartCopy.innerHTML += guide.outerHTML;
                });
            }
        })
        .catch(error => console.error("Error fetching frame guides:", error));
  });

  // Copy section from /pages/glazing to .product-modal #size-chart-copy
  document.addEventListener("DOMContentLoaded", function () {
    fetch("/pages/glazing")
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let glazingGuides = doc.querySelectorAll(".accordion-group");
            let glazingChartCopy = document.querySelector(".product-modal #glazing-chart-copy");
            
            if (glazingGuides.length > 0 && glazingChartCopy) {
                glazingChartCopy.innerHTML = "";
                glazingGuides.forEach(guide => {
                  glazingChartCopy.innerHTML += guide.outerHTML;
                });
            }
        })
        .catch(error => console.error("Error fetching glazing guides:", error));
  });  

  //VIP account
  document.addEventListener("DOMContentLoaded", function () {
    // Set return_to to the current page URL
    document.getElementById("return_to").value = window.location.pathname;
  });

  /*
  document.addEventListener("DOMContentLoaded", function () {
    const returnInput = document.querySelector('form[action="/account/login"] input[name="return_url"]');
    if (returnInput) {
      returnInput.value = "/";
    }
  });
  */

  document.addEventListener("DOMContentLoaded", function () {
    const returnInput = document.querySelector('form[action="/account/login"] input[name="return_url"]');
    const referrer = document.referrer;

    // Only override if it's a valid internal page and not from /account
    if (
      returnInput &&
      referrer &&
      referrer.includes(window.location.hostname) &&
      !referrer.includes('/account')
    ) {
      try {
        const returnPath = new URL(referrer).pathname + new URL(referrer).search;
        returnInput.value = returnPath;
      } catch (e) {
        // fallback to homepage on any error
        returnInput.value = "/";
      }
    }
  });
  

  // hover expand text
  document.addEventListener("DOMContentLoaded", function () {
    const hoverElements = document.querySelectorAll(".show_text_hover");

    function collapseAll() {
        hoverElements.forEach((hoverElement) => {
            const content = hoverElement.querySelector(".column__content");
            const heading = hoverElement.querySelector(".column__heading");
            if (content && heading) {
                content.style.height = `${heading.offsetHeight + 42}px`;
            }
        });
    }

    hoverElements.forEach((hoverElement) => {
        const content = hoverElement.querySelector(".column__content");
        const heading = hoverElement.querySelector(".column__heading");

        if (content && heading) {
            const defaultHeight = heading.offsetHeight + 42;
            content.style.height = `${defaultHeight}px`;

            function expandContent() {
                collapseAll(); // Collapse others
                content.style.height = `${content.scrollHeight}px`;
            }

            function collapseContent() {
                content.style.height = `${defaultHeight}px`;
            }

            // Hover for Desktop
            hoverElement.addEventListener("mouseenter", expandContent);
            hoverElement.addEventListener("mouseleave", collapseContent);

            // Touch for Mobile
            hoverElement.addEventListener("touchstart", function (e) {
                if (content.style.height === `${defaultHeight}px`) {
                    expandContent();
                } else {
                    collapseContent();
                }
                e.stopPropagation(); // Prevents event bubbling
            });
        }
    });

    // Collapse when tapping outside
    document.addEventListener("touchstart", function (e) {
        if (!e.target.closest(".show_text_hover")) {
            collapseAll();
        }
    });
  });

  // announcement bar close button
  document.addEventListener("DOMContentLoaded", function () {
    const announcementWrapper = document.querySelector(".announcement__wrapper");

    if (!announcementWrapper) return; // Exit if no announcement bar exists

    // Check if the session storage has a flag to hide it
    if (sessionStorage.getItem("announcement_closed")) {
        announcementWrapper.style.display = "none";
        return;
    }

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("announcement-close");
    closeButton.setAttribute("aria-label", "Close announcement");

    // Append close button to the wrapper
    announcementWrapper.appendChild(closeButton);

    // Click event to hide announcement and set session storage
    closeButton.addEventListener("click", function () {
        announcementWrapper.style.display = "none";
        sessionStorage.setItem("announcement_closed", "true");
    });
  });

// Target external links to open in a new tab
  document.addEventListener('DOMContentLoaded', function () {
    const currentHost = window.location.hostname;
    const links = document.querySelectorAll('a[href]');
  
    links.forEach(link => {
      const linkHost = new URL(link.href, window.location.origin).hostname;
  
      if (linkHost !== currentHost) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // recommended for security
      }
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    var checkbox = document.querySelector('input#acceptance');
    if (checkbox && !checkbox.checked) {
      checkbox.checked = true;

      // Optionally, trigger a change event if needed for validation logic
      checkbox.dispatchEvent(new Event('change'));
    }
  });

  //okendo Quiz header menu
  document.addEventListener("DOMContentLoaded", function() {
    // Find the .menu__item <a> with data-handle="find-your-perfect-artwork"
    var menuItem = document.querySelector('.header__menu .menu__item a[data-handle="find-your-perfect-artwork"]');
    var footerItem = document.querySelector('.footer__quicklinks li[data-handle="find-your-perfect-artwork"] a');

    var with_find_artwork = document.querySelector('.with_find_artwork .hero__button > a');
    
    // Find all .sliderow <span> elements with data-handle="find-your-perfect-artwork"
    var slideruleItems = document.querySelectorAll('.sliderow span[data-handle="find-your-perfect-artwork"]');
    
    // Function to set the onclick attribute
    function setOnClickAttribute(element) {
      if (element) {
        element.setAttribute('onclick', "okeConnectApi.showQuiz('967341a4-a196-4235-852e-7aab36465070', '5467224c-78f8-4480-83b8-391873ddf89a', { fullScreen: true })");
      }
    }
  
    // Apply onclick to the menuItem
    setOnClickAttribute(menuItem);

    setOnClickAttribute(footerItem);

    // Apply onclick to the section with_find_artwork
    setOnClickAttribute(with_find_artwork);
  
    // Apply onclick to all matching slideruleItems
    slideruleItems.forEach(function(item) {
      setOnClickAttribute(item);
    });
  }); 
  
  /* Character counter for textarea - order notes
  document.addEventListener('DOMContentLoaded', function () {
    var textarea = document.getElementById('note');
    var counter = document.getElementById('charCounter');

    function updateCharCount() {
      counter.textContent = textarea.value.length + ' / 999';
    }

    // Initialize counter on page load
    updateCharCount();

    // Update counter on input
    textarea.addEventListener('input', updateCharCount);
  });*/

  // pull-down-refresh
  if (window.innerWidth <= 1180) {
    let touchStartY = 0;
    let isPulling = false;
    const threshold = 80; // Pull distance in pixels

    const refreshIndicator = document.getElementById('pull-down-refresh');

    document.addEventListener('touchstart', function (e) {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!isPulling) return;

      const touchCurrentY = e.touches[0].clientY;
      const pullDistance = touchCurrentY - touchStartY;

      if (pullDistance > 10) {
        refreshIndicator.style.display = 'block';
      }

      if (pullDistance > threshold) {
        isPulling = false;
        location.reload(); // Full page reload
      }
    }, { passive: true });

    document.addEventListener('touchend', function () {
      isPulling = false;
      refreshIndicator.style.display = 'none';
    });
  }


})();
