class ProgressBarController {
  constructor() {
    this.counterElement = document.getElementById("percentageCounter");
    this.progressRing = document.getElementById("progressRing");
    this.progressCard = document.querySelector(".progress-card");
    this.progressContainer = document.querySelector(".progress-bar-container");
    this.progressCircle = document.querySelector(".inner_progress_circle");
    
    // Progress configuration
    this.targetProgress = 57; // Target percentage (can be made configurable)
    this.currentProgress = 0;
    this.animationDuration = 2000; // 2 seconds
    this.isAnimating = false;
    this.animationFrame = null;
    
    // Debug: Check if elements are found
    console.log('Elements found:', {
      counter: !!this.counterElement,
      ring: !!this.progressRing,
      card: !!this.progressCard,
      container: !!this.progressContainer,
      circle: !!this.progressCircle
    });
    
    this.init();
  }

  init() {
    // Initialize the progress bar at the target percentage (completed state)
    this.updateProgress(this.targetProgress);
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Use the card for hover detection for better user experience
    const hoverTarget = this.progressCard || this.progressContainer;
    if (hoverTarget) {
      hoverTarget.addEventListener('mouseenter', () => this.startHoverAnimation());
      hoverTarget.addEventListener('mouseleave', () => this.resetProgress());
    } else {
      console.error('No hover target found');
    }
  }

  startHoverAnimation() {
    if (this.isAnimating) return;
    
    console.log('Starting hover animation');
    this.isAnimating = true;
    
    // Start animation from 0% to target percentage
    const startTime = performance.now();
    const startProgress = 0;
    const targetProgress = this.targetProgress;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);
      
      // Use easeOutCubic for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startProgress + (targetProgress - startProgress) * eased;
      
      this.updateProgress(currentValue);
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        console.log('Hover animation complete');
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  resetProgress() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.isAnimating = false;
    console.log('Resetting to completed state');
    
    // Animate back to the completed percentage (target) smoothly
    const startTime = performance.now();
    const startProgress = this.currentProgress;
    const targetProgress = this.targetProgress; // Reset to completed state
    const resetDuration = 800; // Faster reset animation

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / resetDuration, 1);
      
      // Use easeInCubic for reset animation
      const eased = progress * progress * progress;
      const currentValue = startProgress + (targetProgress - startProgress) * eased;
      
      this.updateProgress(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  updateProgress(percentage) {
    this.currentProgress = percentage;
    
    // Update counter text with smooth interpolation
    const displayValue = Math.round(percentage);
    this.counterElement.textContent = `${displayValue}%`;
    
    // Update progress ring in the mask (this controls the visible progress)
    if (this.progressRing) {
      // The progressRing has pathLength="100" and starts with stroke-dashoffset="100"
      // For percentage progress, we set offset to (100 - percentage)
      this.progressRing.setAttribute("stroke-dashoffset", 100 - percentage);
    }
    
    // Update main progress circle (this is what's actually visible through the mask)
    if (this.progressCircle) {
      // The inner_progress_circle has pathLength="64", so we need to scale our percentage
      const scaledProgress = (percentage / 100) * 64;
      const dashArray = `${scaledProgress} ${64 - scaledProgress}`;
      this.progressCircle.setAttribute("stroke-dasharray", dashArray);
    }
  }

  // Method to change target progress dynamically
  setTargetProgress(newTarget) {
    this.targetProgress = Math.max(0, Math.min(100, newTarget));
  }
}

// Initialize the progress bar controller
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressBarController = new ProgressBarController();
  });
} else {
  window.progressBarController = new ProgressBarController();
}
