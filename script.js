// JS script to open the hamburger menu 

function toggleMenu() {
    const menu = document.querySelector(".menu-links"); //target elements and use it
    const icon = document.querySelector(".hamburger-icon"); 
    menu.classList.toggle("open"); //targets menu and open it 
    icon.classList.toggle("open"); // when clicking its going to add/remove open class 
}

// Scroll animation for pixel trail effect
document.addEventListener('DOMContentLoaded', function() {
    const contentArea = document.querySelector('.content-area');
    let scrollTimeout;

    // Add scroll event listener for pixel trail animation
    window.addEventListener('scroll', function() {
        if (contentArea) {
            contentArea.classList.add('scrolling');
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Remove scrolling class after animation
            scrollTimeout = setTimeout(() => {
                contentArea.classList.remove('scrolling');
            }, 800);
        }
    });

    // Album switching functionality for music section
    const albumThumbs = document.querySelectorAll('.album-thumb-item');
    const largeAlbumCover = document.getElementById('large-cover');
    const albumTracks = document.querySelectorAll('.album-tracks');

    // Album data mapping
    const albumData = {
        'songs-about-jane': {
            cover: './assets/songs-about-jane.webp',
            alt: 'Songs About Jane - Maroon 5'
        },
        'heavier-things': {
            cover: './assets/heavier-things.jpg',
            alt: 'Heavier Things - John Mayer'
        },
        'room-for-squares': {
            cover: './assets/room-for-squares.jpeg',
            alt: 'Room for Squares - John Mayer'
        }
    };

    // Set initial active state
    if (albumThumbs.length > 0) {
        albumThumbs[0].classList.add('active');
    }

    // Add click event listeners to album thumbnails
    albumThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const albumKey = this.getAttribute('data-album');
            
            // Remove active class from all thumbnails
            albumThumbs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Hide all track lists
            albumTracks.forEach(tracks => tracks.classList.remove('active'));
            
            // Show selected album's track list
            const selectedTracks = document.getElementById(albumKey + '-tracks');
            if (selectedTracks) {
                selectedTracks.classList.add('active');
            }
            
            // Update large album cover
            if (albumData[albumKey] && largeAlbumCover) {
                largeAlbumCover.src = albumData[albumKey].cover;
                largeAlbumCover.alt = albumData[albumKey].alt;
            }
        });
    });
});