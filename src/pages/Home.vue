<template>
  <div>
    <!-- Hero Section -->
    <div class="d-flex justify-content-center align-items-center hero-section">
      <div class="text-center bg-secondary bg-opacity-75 text-white p-5 rounded-4" style="max-width: min(90%, 600px); margin: 0 auto; backdrop-filter: blur(8px);">
        <h1 class="fw-bold mb-4 display-4">Healthy Pathway</h1>
        <p class="lead mb-4">
          Empowering Migrant Communities Through<br />
          Healthcare & Support
        </p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/register" class="btn btn-primary btn-lg">Join Now</router-link>
          <router-link to="/login" class="btn btn-outline-light btn-lg">Login</router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Our Services</h2>
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-hospital"></i>
              </div>
              <h3>Find a Doctor</h3>
              <p>Search for GPs who speak your language and accept new patients nearby</p>
              <div class="mt-3">
                <router-link to="/doctor-rating" class="btn btn-outline-primary">View Doctors</router-link>
                <small class="d-block mt-2 text-muted">Login required for ratings</small>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-translate"></i>
              </div>
              <h3>Multilingual Resources</h3>
              <p>Access translated health guides and vaccine information</p>
              <div class="mt-3">
                <router-link to="/health-articles" class="btn btn-outline-primary">Read More</router-link>
                <small class="d-block mt-2 text-muted">Browse health articles</small>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-chat-dots"></i>
              </div>
              <h3>Health Consultation</h3>
              <p>Submit anonymous health questions and get professional answers</p>
              <div class="mt-3">
                <router-link to="/consultation" class="btn btn-outline-primary">Get Started</router-link>
                <small class="d-block mt-2 text-muted">Free preview available</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h2 class="section-title">Our Mission</h2>
            <p class="mission-text">
              We ensure equitable healthcare access for migrants through multilingual resources,
              culturally appropriate support, and community-driven education. We are committed to:
            </p>
            <ul class="mission-list">
              <li><i class="bi bi-check-circle-fill"></i> Eliminating Language Barriers</li>
              <li><i class="bi bi-check-circle-fill"></i> Providing Culturally Sensitive Care</li>
              <li><i class="bi bi-check-circle-fill"></i> Building Supportive Communities</li>
            </ul>
          </div>
          <div class="col-md-6">
            <div class="mission-image">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?fit=crop&w=800" 
                   alt="Healthcare Services" class="img-fluid rounded-3 shadow">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section text-center">
      <div class="container">
        <div class="row g-4">
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <h3 class="stat-number">5000+</h3>
              <p class="stat-label">Registered Users</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <h3 class="stat-number">100+</h3>
              <p class="stat-label">Partner Doctors</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <h3 class="stat-number">10+</h3>
              <p class="stat-label">Languages</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <h3 class="stat-number">98%</h3>
              <p class="stat-label">User Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h2 class="section-title">Get in Touch</h2>
            <p class="contact-text">
              Have questions about our services? Need help with an appointment? 
              We're here to help! Send us a message and we'll get back to you as soon as possible.
            </p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="bi bi-envelope-fill text-primary"></i>
                <span>info@healthypathway.com</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-telephone-fill text-primary"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-clock-fill text-primary"></i>
                <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="contact-card">
              <h5 class="mb-4">Send us a Message</h5>
              <router-link to="/contact" class="btn btn-primary btn-lg">
                <i class="bi bi-chat-dots me-2"></i>
                Contact Us
              </router-link>
              <p class="mt-3 text-muted">
                <small>Get email confirmations with PDF attachments for appointments</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('https://images.unsplash.com/photo-1588776814546-ec7dca2d0c85?fit=crop&w=1200') no-repeat center center;
  background-size: cover;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.features-section {
  padding: 5rem 0;
  background-color: var(--bs-light);
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.mission-section {
  padding: 6rem 0;
  background-color: white;
  position: relative;
}

.mission-text {
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  color: var(--bs-gray-700);
}

.mission-list {
  list-style: none;
  padding: 0;
}

.mission-list li {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--bs-gray-700);
}

.mission-list i {
  color: var(--bs-primary);
  font-size: 1.25rem;
}

.mission-image img {
  width: 100%;
  height: auto;
  border-radius: 1rem;
}

.stats-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #2563eb 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
}

.stat-card {
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 1.15rem;
  opacity: 0.95;
  font-weight: 500;
}

.contact-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.contact-text {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.contact-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  width: 24px;
}

.contact-card {
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contact-card .btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: 50px;
}

/* 全局居中样式 */
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f8f9fa;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Extra small devices (phones, less than 576px) */
@media (max-width: 575.98px) {
  .hero-section > div {
    margin: 1rem;
    padding: 2rem !important;
  }

  .hero-title {
    font-size: 2rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .mission-text {
    font-size: 1rem;
  }

  .mission-list li {
    font-size: 1rem;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .hero-section > div {
    margin: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .hero-title {
    font-size: 3rem;
  }

  .container {
    max-width: 95%;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .container {
    max-width: 960px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
  .container {
    max-width: 1140px;
  }
}

/* XXL devices (larger desktops, 1400px to 2000px) */
@media (min-width: 1400px) and (max-width: 1999px) {
  .container {
    max-width: 1320px;
  }
  
  .hero-section > div {
    max-width: 800px !important;
  }

  .feature-card {
    padding: 3rem;
  }

  .mission-section .container,
  .features-section .container {
    max-width: 1320px;
    margin: 0 auto;
  }
  
  .section-title {
    font-size: 3rem;
  }

  .mission-text {
    font-size: 1.4rem;
  }

  .mission-list li {
    font-size: 1.25rem;
  }

  .stat-number {
    font-size: 3.5rem;
  }

  .stat-label {
    font-size: 1.25rem;
  }
}

/* Ultra wide screens (above 2000px) */
@media (min-width: 2000px) {
  .container {
    max-width: 1800px;
  }
  
  .hero-section > div {
    max-width: 1000px !important;
  }

  .hero-section {
    min-height: 70vh;
  }

  .feature-card {
    padding: 4rem;
  }

  .mission-section .container,
  .features-section .container {
    max-width: 1800px;
    margin: 0 auto;
  }
  
  .section-title {
    font-size: 3.5rem;
  }

  .mission-text {
    font-size: 1.6rem;
    max-width: 800px;
  }

  .mission-list {
    max-width: 800px;
  }

  .mission-list li {
    font-size: 1.4rem;
  }

  .stat-number {
    font-size: 4rem;
  }

  .stat-label {
    font-size: 1.5rem;
  }

  .row {
    max-width: 1800px;
    margin: 0 auto;
  }
}
</style>