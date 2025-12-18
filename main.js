document.addEventListener("DOMContentLoaded", () => {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".accordion-item").forEach((acc) => {
        acc.classList.remove("active");
        const icon = acc.querySelector(".accordion-icon");
        if (icon) icon.innerHTML = "&plus;";
      });

      if (!isActive) {
        item.classList.add("active");
        const icon = item.querySelector(".accordion-icon");
        if (icon) icon.innerHTML = "&minus;";
      }
    });
  });

  const serviceHeaders = document.querySelectorAll(".service-header");

  serviceHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".service-item").forEach((service) => {
        service.classList.remove("active");
        const toggle = service.querySelector(".service-toggle");
        if (toggle) toggle.innerHTML = "+";
      });

      if (!isActive) {
        item.classList.add("active");
        const toggle = item.querySelector(".service-toggle");
        if (toggle) toggle.innerHTML = "−";
      }
    });
  });

  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      if (href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
          
          targetSection.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  const btnContact = document.querySelector(".btn-contact");
  if (btnContact) {
    btnContact.addEventListener("click", () => {
      window.location.href = "contact.html";
    });
  }

  const btnSolutions = document.querySelector(".btn-solutions");
  if (btnSolutions) {
    btnSolutions.addEventListener("click", () => {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector(".email-input");
      const email = emailInput.value;
      const submitBtn = newsletterForm.querySelector(".btn-subscribe");

      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        showNotification(data.message, response.ok ? "success" : "error");

        if (response.ok) {
          emailInput.value = "";
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred. Please try again later.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        showNotification(data.message, response.ok ? "success" : "error");

        if (response.ok) {
          contactForm.reset();
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred. Please try again later.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  function showNotification(message, type = "success") {
    const existingNotif = document.querySelector(".custom-notification");
    if (existingNotif) {
      existingNotif.remove();
    }

    const notification = document.createElement("div");
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === "success" ? "✓" : "✕"}</span>
        <span class="notification-message">${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      closeNotification(notification);
    });

    setTimeout(() => {
      closeNotification(notification);
    }, 5000);
  }

  function closeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
});