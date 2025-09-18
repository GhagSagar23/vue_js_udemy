/**
 * Simple Component Loader for HTML
 * Usage: loadComponent('journey', 'journey-container');
 */

async function loadComponent(componentName, containerId) {
  try {
    const response = await fetch(`profile_components/${componentName}/${componentName}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
    
    // Load component CSS if not already loaded
    const cssId = `${componentName}-css`;
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = `profile_components/${componentName}/${componentName}.css`;
      document.head.appendChild(link);
    }
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
  }
}

// Load all components on page load
document.addEventListener('DOMContentLoaded', function() {
  loadComponent('navigation', 'navigation-container');
  loadComponent('journey', 'journey-container');
  loadComponent('experience', 'experience-container');
  loadComponent('tech_stack', 'tech-stack-container');
  loadComponent('achievements', 'achievements-container');
});