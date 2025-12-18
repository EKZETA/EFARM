/**
 * Component Loader
 * Dynamically loads HTML components into the page
 */

(function () {
  "use strict";

  // Configuration
  const COMPONENTS_DIR = "./components/";
  const COMPONENT_SELECTOR = "[data-component]";

  /**
   * Load a single component
   * @param {HTMLElement} element - Element with data-component attribute
   * @returns {Promise} - Resolves when component is loaded
   */
  async function loadComponent(element) {
    const componentName = element.getAttribute("data-component");
    const componentPath = `${COMPONENTS_DIR}${componentName}.html`;

    try {
      const response = await fetch(componentPath);

      if (!response.ok) {
        throw new Error(
          `Failed to load component: ${componentName} (${response.status})`
        );
      }

      const html = await response.text();
      element.outerHTML = html;

      console.log(`✓ Loaded component: ${componentName}`);
    } catch (error) {
      console.error(`✗ Error loading component ${componentName}:`, error);
      element.innerHTML = `<div style="color: red; padding: 20px;">Error loading ${componentName} component</div>`;
    }
  }

  /**
   * Load all components on the page
   */
  async function loadAllComponents() {
    const componentElements = document.querySelectorAll(COMPONENT_SELECTOR);

    if (componentElements.length === 0) {
      console.warn("No components found to load");
      return;
    }

    console.log(`Loading ${componentElements.length} components...`);

    // Load all components in parallel
    const loadPromises = Array.from(componentElements).map(loadComponent);

    try {
      await Promise.all(loadPromises);
      console.log("✓ All components loaded successfully");

      // Dispatch custom event when all components are loaded
      const event = new CustomEvent("componentsLoaded");
      document.dispatchEvent(event);
    } catch (error) {
      console.error("✗ Error loading components:", error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAllComponents);
  } else {
    loadAllComponents();
  }
})();
