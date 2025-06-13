// Scratch Card JavaScript
class ScratchCard {
    constructor() {
        this.canvas = document.getElementById("scratchCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.isDrawing = false;
        this.scratchedPercent = 0;
        this.celebrationTriggered = false;
        
        this.init();
    }

    init() {
        // Set canvas dimensions
        this.canvas.width = 400;
        this.canvas.height = 250;
        
        // Create the scratchable layer
        this.createScratchLayer();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set canvas to erase mode
        this.ctx.globalCompositeOperation = "destination-out";
    }

    createScratchLayer() {
        // Reset composite operation to draw the scratch layer
        this.ctx.globalCompositeOperation = "source-over";
        
        // Create metallic silver gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(0.25, '#d3d3d3');
        gradient.addColorStop(0.5, '#c0c0c0');
        gradient.addColorStop(0.75, '#b8b8b8');
        gradient.addColorStop(1, '#e8e8e8');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add subtle texture with dots
        this.addTexture();
        
        // Add scratch instructions text
        this.addScratchText();
        
        // Reset to erase mode
        this.ctx.globalCompositeOperation = "destination-out";
    }

    addTexture() {
        // Add random light spots for metallic texture
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 100; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 2 + 0.5,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
        
        // Add darker spots for depth
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 50; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 1.5,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    addScratchText() {
        // Main scratch text
        this.ctx.fillStyle = '#888888';
        this.ctx.font = 'bold 28px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add text shadow effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillText('Scratch Here', this.canvas.width / 2 + 2, this.canvas.height / 2 - 18);
        
        this.ctx.fillStyle = '#666666';
        this.ctx.fillText('Scratch Here', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        // Subtitle
        this.ctx.font = '18px Georgia';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillText('to reveal your surprise', this.canvas.width / 2 + 1, this.canvas.height / 2 + 16);
        
        this.ctx.fillStyle = '#777777';
        this.ctx.fillText('to reveal your surprise', this.canvas.width / 2, this.canvas.height / 2 + 15);
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
        this.canvas.addEventListener("mouseup", () => this.stopDrawing());
        this.canvas.addEventListener("mousemove", (e) => this.scratch(e));
        this.canvas.addEventListener("mouseleave", () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.startDrawing(e);
        });
        
        this.canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
        
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            this.scratch(e);
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.scratch(e);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x, y;
        
        if (e.touches && e.touches[0]) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.offsetX !== undefined ? e.offsetX : e.clientX - rect.left;
            y = e.offsetY !== undefined ? e.offsetY : e.clientY - rect.top;
        }
        
        return { x, y };
    }

    scratch(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        // Create brush stroke
        this.ctx.beginPath();
        this.ctx.arc(coords.x, coords.y, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Check scratch percentage periodically
        if (Math.random() < 0.1) { // Check 10% of the time for performance
            this.checkScratchPercentage();
        }
    }

    checkScratchPercentage() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        const totalPixels = this.canvas.width * this.canvas.height;
        
        // Count transparent pixels (alpha channel = 0)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }
        
        this.scratchedPercent = (transparentPixels / totalPixels) * 100;
        
        // Trigger celebration when 30% is scratched
        if (this.scratchedPercent > 30 && !this.celebrationTriggered) {
            this.triggerCelebration();
        }
    }

    triggerCelebration() {
        this.celebrationTriggered = true;
        
        // Smoothly fade out the canvas
        this.fadeOutCanvas();
        
        // Create celebration effects
        setTimeout(() => {
            this.createCelebrationHearts();
            this.addSparkleEffect();
        }, 500);
    }

    fadeOutCanvas() {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
            opacity -= 0.05;
            this.canvas.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(fadeInterval);
                this.canvas.style.display = 'none';
            }
        }, 50);
    }

    createCelebrationHearts() {
        const container = document.getElementById('celebrationContainer');
        const heartCount = 15;
        
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                this.createSingleHeart(container);
            }, i * 200);
        }
    }

    createSingleHeart(container) {
        const heart = document.createElement('div');
        heart.className = 'celebration-heart float-up';
        
        // Random horizontal position
        const randomX = Math.random() * (window.innerWidth - 50);
        heart.style.left = randomX + 'px';
        heart.style.top = window.innerHeight + 'px';
        
        // Random animation duration
        const duration = 2.5 + Math.random() * 1.5;
        heart.style.animationDuration = duration + 's';
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (container.contains(heart)) {
                container.removeChild(heart);
            }
        }, duration * 1000);
    }

    addSparkleEffect() {
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach(sparkle => {
            sparkle.style.animationDuration = '0.5s';
            sparkle.style.background = '#ffd700';
        });
        
        // Add additional sparkle elements around the card
        this.createSparklesAroundCard();
    }

    createSparklesAroundCard() {
        const card = document.querySelector('.scratch-card');
        const cardRect = card.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'absolute';
            sparkle.style.zIndex = '1000';
            
            // Position around the card
            const angle = (i / 8) * Math.PI * 2;
            const radius = 150;
            const x = cardRect.left + cardRect.width / 2 + Math.cos(angle) * radius;
            const y = cardRect.top + cardRect.height / 2 + Math.sin(angle) * radius;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.animationDuration = '2s';
            sparkle.style.animationDelay = (i * 0.2) + 's';
            
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 4000);
        }
    }
}

// Initialize the scratch card when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ScratchCard();
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to the main title
    const title = document.querySelector('.main-title');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.style.transform = 'scale(1.05)';
            title.style.transition = 'transform 0.3s ease';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.transform = 'scale(1)';
        });
    }
    
    // Add subtle animations to background hearts on scroll/mouse move
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        const bgHearts = document.querySelectorAll('.bg-hearts .heart');
        bgHearts.forEach((heart, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            heart.style.transform = `rotate(-45deg) translate(${x}px, ${y}px)`;
        });
    });
});