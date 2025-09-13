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

    // Drag and Drop functionality for block items
    const blockItems = document.querySelectorAll('.block-item');
    const blockGrid = document.querySelector('.block-grid');
    
    let draggedElement = null;
    let draggedClone = null;
    let placeholder = null;
    
    blockItems.forEach(block => {
        block.draggable = true;
        
        block.addEventListener('dragstart', function(e) {
            draggedElement = this;
            
            // Create a visual clone that follows the cursor
            draggedClone = this.cloneNode(true);
            draggedClone.style.position = 'fixed';
            draggedClone.style.pointerEvents = 'none';
            draggedClone.style.opacity = '0.8';
            draggedClone.style.zIndex = '9999';
            draggedClone.style.width = this.offsetWidth + 'px';
            draggedClone.style.height = this.offsetHeight + 'px';
            draggedClone.style.transform = 'scale(1.1)';
            document.body.appendChild(draggedClone);
            
            // Create placeholder
            placeholder = document.createElement('div');
            placeholder.className = 'block-placeholder';
            placeholder.style.width = this.offsetWidth + 'px';
            placeholder.style.height = this.offsetHeight + 'px';
            placeholder.style.border = '2px dashed #d4a574';
            placeholder.style.borderRadius = '3px';
            placeholder.style.background = 'rgba(212, 165, 116, 0.1)';
            
            // Hide the original element
            setTimeout(() => {
                this.style.opacity = '0.3';
            }, 0);
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setDragImage(new Image(), 0, 0); // Hide default drag image
        });
        
        block.addEventListener('dragend', function(e) {
            this.style.opacity = '';
            
            // Remove clone and placeholder
            if (draggedClone && draggedClone.parentNode) {
                draggedClone.parentNode.removeChild(draggedClone);
            }
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            draggedElement = null;
            draggedClone = null;
            placeholder = null;
        });
        
        block.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            if (draggedElement && draggedElement !== this) {
                const afterElement = getDragAfterElement(blockGrid, e.clientX, e.clientY);
                if (afterElement == null) {
                    blockGrid.appendChild(placeholder);
                } else {
                    blockGrid.insertBefore(placeholder, afterElement);
                }
            }
            
            return false;
        });
        
        block.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            if (draggedElement && draggedElement !== this) {
                const allBlocks = [...blockGrid.querySelectorAll('.block-item:not(.block-placeholder)')];
                const draggedIndex = allBlocks.indexOf(draggedElement);
                const targetIndex = allBlocks.indexOf(this);
                
                if (draggedIndex < targetIndex) {
                    this.parentNode.insertBefore(draggedElement, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedElement, this);
                }
            }
            
            return false;
        });
    });
    
    // Update clone position during drag
    document.addEventListener('dragover', function(e) {
        if (draggedClone) {
            draggedClone.style.left = (e.clientX - draggedClone.offsetWidth / 2) + 'px';
            draggedClone.style.top = (e.clientY - draggedClone.offsetHeight / 2) + 'px';
        }
    });
    
    // Helper function to determine where to insert element
    function getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.block-item:not(.dragging):not(.block-placeholder)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offsetX = x - box.left - box.width / 2;
            const offsetY = y - box.top - box.height / 2;
            
            if (offsetY < 0 && offsetY > closest.offsetY) {
                return { offsetY: offsetY, offsetX: offsetX, element: child };
            } else if (offsetY === 0 && offsetX < 0 && offsetX > closest.offsetX) {
                return { offsetY: offsetY, offsetX: offsetX, element: child };
            } else {
                return closest;
            }
        }, { offsetY: Number.NEGATIVE_INFINITY, offsetX: Number.NEGATIVE_INFINITY }).element;
    }
});