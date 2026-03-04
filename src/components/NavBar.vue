<template>
    <nav class="navbar">
      <div class="navbar-inner">
        <router-link to="/" class="navbar-brand">
          <span class="brand-hero">HERO</span><span class="brand-war">WAR</span>
        </router-link>
  
        <div class="navbar-links">
          <router-link to="/select" class="nav-link" active-class="active">
            Sélection
          </router-link>
          <router-link to="/battle" class="nav-link" active-class="active">
            Combat
          </router-link>
          <router-link to="/best-heroes" class="nav-link" active-class="active">
            Classement
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <style scoped>
.navbar {
  background: rgba(7, 7, 14, 0.97);
  border-bottom: 1px solid #1e1e35;
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
/* Ligne décorative en bas de la navbar */
.navbar::after {
  content: '';
  display: block;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-blue) 30%, var(--accent-red) 70%, transparent);
  opacity: 0.6;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar-brand {
  font-family: 'Bebas Neue', cursive;
  font-size: 2rem;
  text-decoration: none;
  letter-spacing: 4px;
  filter: drop-shadow(0 0 8px rgba(0,212,255,0.3));
  transition: filter 0.3s;
}
.navbar-brand:hover { filter: drop-shadow(0 0 14px rgba(0,212,255,0.6)); }
.brand-hero { color: var(--accent-blue); text-shadow: 0 0 20px rgba(0,212,255,0.5); }
.brand-war  { color: var(--accent-red);  text-shadow: 0 0 20px rgba(255,58,58,0.5); }

.navbar-links { display: flex; gap: 4px; }
.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  padding: 7px 18px;
  font-family: 'Bebas Neue', cursive;
  font-size: 1rem;
  letter-spacing: 2px;
  transition: all 0.2s;
  border: 1px solid transparent;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
}
.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.04);
  border-color: var(--border-glow);
}
.nav-link.active {
  color: var(--accent-blue);
  background: rgba(0,212,255,0.08);
  border-color: rgba(0,212,255,0.3);
  text-shadow: 0 0 10px rgba(0,212,255,0.4);
}
</style>