document.addEventListener('DOMContentLoaded', function() {

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

  // Smooth fast mouse wheel scroll
  let isScrolling = false;
  window.addEventListener('wheel', function(e) {
    e.preventDefault();

    if (!isScrolling) {
      isScrolling = true;
      const delta = e.deltaY * 5; // Smooth fast scroll
      window.scrollBy({
        top: delta,
        behavior: 'auto'
      });

      requestAnimationFrame(() => {
        isScrolling = false;
      });
    }
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

  // POLAROID IMAGES - ALL FRIENDS IMAGES (including new PNG files)
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
    './friends/IMG_4745.HEIC.JPEG',
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
  const totalPolaroids = revolvingPolaroids.length;
  const angleStep = 360 / totalPolaroids;

  // Process all polaroids immediately without delays
  revolvingPolaroids.forEach((polaroid, index) => {
    if (friendsImages[index]) {
      // Create image div
      const imageDiv = document.createElement('div');
      imageDiv.className = 'polaroid-image';
      imageDiv.style.backgroundImage = `url('${friendsImages[index]}')`;

      polaroid.appendChild(imageDiv);

      // Set animation delay for rotation spacing
      const delay = (index * (18 / totalPolaroids));
      polaroid.style.animationDelay = `${delay}s`;

      // Force immediate visibility
      polaroid.style.opacity = '0.6';
      polaroid.style.visibility = 'visible';
      polaroid.style.display = 'block';

      // Check if image fails to load and hide if needed
      const testImg = new Image();
      testImg.onerror = function() {
        console.error('Failed to load:', friendsImages[index]);
        polaroid.style.display = 'none';
      };
      testImg.src = friendsImages[index];
    } else {
      // Hide polaroids without images
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
      if (e.target === projectDetailsModal) {
        projectDetailsModal.classList.remove('active');
      }
    });
  }


});