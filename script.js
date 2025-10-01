document.addEventListener('DOMContentLoaded', function() {

  // PAGE TRANSITION ON NAVIGATION
  const links = document.querySelectorAll('a[href]:not([target="_blank"])');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
        e.preventDefault();
        document.body.classList.add('page-transition');
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });

  // CUSTOM CURSOR
  const cursor = document.createElement('div');
  cursor.classList.add('cursor-dot');
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const delay = 0.1;
    cursorX += (mouseX - cursorX) * delay;
    cursorY += (mouseY - cursorY) * delay;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const dropdown = document.getElementById('dropdownMenu');
  const contactBtn = document.getElementById('contactBtn');
  const contactPopup = document.getElementById('contactPopup');

  if (menuToggle && dropdown) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      dropdown.classList.toggle('active');
      contactPopup.classList.remove('active'); // Close contact popup
    });

    // Close menu when clicking on a link
    const dropdownLinks = dropdown.querySelectorAll('a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        dropdown.classList.remove('active');
      });
    });

    // Cursor enlargement on hover
    menuToggle.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    menuToggle.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });

    dropdownLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  // CONTACT BUTTON POPUP
  if (contactBtn && contactPopup) {
    contactBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      contactPopup.classList.toggle('active');
      dropdown.classList.remove('active'); // Close menu
      menuToggle.classList.remove('active');
    });

    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
      if (!contactPopup.contains(e.target) && e.target !== contactBtn) {
        contactPopup.classList.remove('active');
      }
    });

    // Cursor effects for contact button
    contactBtn.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    contactBtn.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  }

  // STICKY NAVIGATION ON SCROLL
  const nav = document.querySelector('.top-nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // SMOOTH SCROLL FOR ANCHOR LINKS ONLY
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const targetPosition = target.offsetTop - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Smooth and controlled wheel scrolling (only on main page, not in modals)
  window.addEventListener('wheel', function(e) {
    // Don't prevent scroll if we're in a modal
    const projectModal = document.getElementById('projectDetails');
    if (projectModal && projectModal.classList.contains('active')) {
      return; // Let the modal handle its own scrolling
    }

    e.preventDefault();

    // Very slow 0.3x speed for maximum control
    const scrollSpeed = 0.3;
    const scrollAmount = e.deltaY * scrollSpeed;

    // Use native smooth scrolling for better performance
    window.scrollBy({
      top: scrollAmount,
      behavior: 'instant' // Instant for responsiveness
    });
  }, { passive: false });

  // FADE IN ABOUT SECTION ON SCROLL
  const aboutContent = document.querySelector('.about-content');

  function checkAboutVisibility() {
    if (aboutContent) {
      const rect = aboutContent.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.75) {
        aboutContent.classList.add('visible');
      }
    }
  }

  window.addEventListener('scroll', checkAboutVisibility);
  checkAboutVisibility(); // Check on load

  // POLAROID IMAGES - ALL FRIENDS IMAGES (only confirmed working formats)
  const friendsImages = [
    './friends/IMG_0056.JPG',
    './friends/IMG_0080.JPG',
    './friends/IMG_0593.JPG',
    './friends/IMG_1249.JPG',
    './friends/IMG_1640.png',
    './friends/IMG_3909.png',
    './friends/IMG_3941.png',
    './friends/IMG_4554.png',
    './friends/IMG_4577.jpg',
    './friends/IMG_5551.png',
    './friends/IMG_5577.JPG',
    './friends/IMG_6223.jpeg',
    './friends/IMG_7001.JPG',
    './friends/IMG_8386.JPG',
    './friends/IMG_8391.JPG',
    './friends/IMG_9085.JPG'
  ];

  const myselfImage = './myself/IMG_7464_Original.jpg';

  // Set revolving polaroid images with proper spacing
  const revolvingPolaroids = document.querySelectorAll('.polaroid.revolving');

  // First, validate which images can be loaded (exclude HEIC and empty)
  const validImages = friendsImages.filter(imagePath =>
    imagePath &&
    !imagePath.includes('.HEIC') &&
    imagePath.trim() !== ''
  );

  const totalImages = validImages.length;
  let loadedCount = 0;

  // Process polaroids with validated images
  revolvingPolaroids.forEach((polaroid, index) => {
    if (index < totalImages) {
      // Preload image first to verify it loads
      const testImg = new Image();

      testImg.onload = function() {
        // Only create polaroid if image loads successfully
        const imageDiv = document.createElement('div');
        imageDiv.className = 'polaroid-image';
        imageDiv.style.backgroundImage = `url('${validImages[index]}')`;
        polaroid.appendChild(imageDiv);

        // Calculate animation delay based on index
        const animationDelay = -(index * (22 / totalImages));

        // Apply animation with negative delay to start at correct position
        polaroid.style.animation = `revolve 22s linear infinite`;
        polaroid.style.animationDelay = `${animationDelay}s`;

        // Force immediate visibility
        polaroid.style.opacity = '1';
        polaroid.style.visibility = 'visible';
        polaroid.style.display = 'block';

        loadedCount++;
      };

      testImg.onerror = function() {
        // Hide polaroid if image fails to load
        console.error('Failed to load image:', validImages[index]);
        polaroid.style.display = 'none';
      };

      testImg.src = validImages[index];
    } else {
      // Hide unused polaroids
      polaroid.style.display = 'none';
    }
  });

  // Set center polaroid image
  const centerPolaroid = document.querySelector('.polaroid.center');
  if (centerPolaroid && myselfImage) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'polaroid-image';
    imageDiv.style.backgroundImage = `url('${myselfImage}')`;
    centerPolaroid.appendChild(imageDiv);

    // Add "This is me :D" text below the image
    const captionDiv = document.createElement('div');
    captionDiv.className = 'polaroid-caption';
    captionDiv.textContent = 'This is me :D';
    centerPolaroid.appendChild(captionDiv);
  }

  // PHOTO MODAL FUNCTIONALITY
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close-modal');

  // Add click event to all polaroids
  const allPolaroids = document.querySelectorAll('.polaroid');
  allPolaroids.forEach(polaroid => {
    polaroid.addEventListener('click', function() {
      const imageDiv = this.querySelector('.polaroid-image');
      if (imageDiv) {
        const bgImage = imageDiv.style.backgroundImage;
        const imageUrl = bgImage.slice(5, -2); // Remove url(" and ")
        modal.classList.add('active');
        modalImg.src = imageUrl;
      }
    });
  });

  // Close modal when clicking close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
    });
  }

  // Close modal when clicking outside the image
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // MUSIC PAGE ALBUM INTERACTIONS
  const albumPolaroids = document.querySelectorAll('.album-polaroid');
  const albumDetails = document.getElementById('albumDetails');
  const closeDetails = document.querySelector('.close-details');

  albumPolaroids.forEach(polaroid => {
    polaroid.addEventListener('click', function() {
      const albumId = this.getAttribute('data-album');
      const allDetails = document.querySelectorAll('.album-detail-content');

      // Hide all details
      allDetails.forEach(detail => {
        detail.style.display = 'none';
      });

      // Show selected album details
      const selectedDetail = document.getElementById(albumId);
      if (selectedDetail) {
        selectedDetail.style.display = 'block';
        albumDetails.classList.add('active');
      }
    });
  });

  if (closeDetails) {
    closeDetails.addEventListener('click', function() {
      albumDetails.classList.remove('active');
    });
  }

  if (albumDetails) {
    albumDetails.addEventListener('click', function(e) {
      if (e.target === albumDetails) {
        albumDetails.classList.remove('active');
      }
    });
  }

  // PROJECTS PAGE INTERACTIONS
  const projectPolaroids = document.querySelectorAll('.project-polaroid');
  const projectDetailsModal = document.getElementById('projectDetails');
  const closeProjectModal = document.querySelector('.close-project-modal');

  projectPolaroids.forEach(polaroid => {
    polaroid.addEventListener('click', function() {
      const projectId = this.getAttribute('data-project');
      const allProjectDetails = document.querySelectorAll('.project-detail');

      // Hide all project details
      allProjectDetails.forEach(detail => {
        detail.style.display = 'none';
      });

      // Show selected project details
      const selectedProject = document.getElementById(projectId);
      if (selectedProject) {
        selectedProject.style.display = 'block';
        projectDetailsModal.classList.add('active');
      }
    });
  });

  if (closeProjectModal) {
    closeProjectModal.addEventListener('click', function() {
      projectDetailsModal.classList.remove('active');
    });
  }

  if (projectDetailsModal) {
    projectDetailsModal.addEventListener('click', function(e) {
      // Close only if clicking on the modal backdrop (not on content)
      if (e.target === projectDetailsModal) {
        projectDetailsModal.classList.remove('active');
      }
    });

    // Prevent modal from closing when clicking inside content
    const projectDetails = document.querySelectorAll('.project-detail');
    projectDetails.forEach(detail => {
      detail.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
  }

  // IMAGE GALLERY NAVIGATION
  const galleries = document.querySelectorAll('.project-images-gallery');

  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('.gallery-image');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    let currentIndex = 0;

    function showImage(index) {
      images.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
          img.classList.add('active');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    }

    // Click on image to view fullscreen
    images.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    });
  });


});