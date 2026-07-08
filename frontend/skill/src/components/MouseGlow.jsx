import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const MouseGlow = ({ glowColor = '132, 0, 255' }) => {
  const location = useLocation();
  const spotlightRef = useRef(null);

  // Define which paths should have the glow effect
  const glowPaths = [
    '/dashboard',
    '/find-skills',
    '/requests',
    '/friends',
    '/schedule',
    '/reviews',
    '/profile',
    '/matches',
    '/credits'
  ];

  // Check if current path matches exact paths or starts with /user/ (for UserDashboard/Profile)
  const shouldShowGlow = glowPaths.includes(location.pathname) || location.pathname.startsWith('/user/');

  useEffect(() => {
    if (!shouldShowGlow) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'mouse-glow-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 20%,
        rgba(${glowColor}, 0.04) 40%,
        rgba(${glowColor}, 0.01) 60%,
        transparent 80%
      );
      z-index: 9998;
      opacity: 0;
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          left: e.clientX,
          top: e.clientY,
          opacity: 1,
          duration: 0.1,
          ease: 'power2.out'
        });
      }

      // Update all glowing cards
      const cards = document.querySelectorAll('.glow-card-wrapper');
      const spotlightRadius = 300;
      const proximity = spotlightRadius * 0.5;
      const fadeDistance = spotlightRadius * 0.75;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate relative coordinates for the gradient
        const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
        const relativeY = ((e.clientY - rect.top) / rect.height) * 100;

        // Calculate distance from center to determine intensity
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(rect.width, rect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        card.style.setProperty('--glow-x', `${relativeX}%`);
        card.style.setProperty('--glow-y', `${relativeY}%`);
        card.style.setProperty('--glow-intensity', glowIntensity.toString());
      });
    };

    const handleMouseLeave = () => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Reset card glows
      const cards = document.querySelectorAll('.glow-card-wrapper');
      cards.forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (spotlightRef.current && spotlightRef.current.parentNode) {
        spotlightRef.current.parentNode.removeChild(spotlightRef.current);
      }
      spotlightRef.current = null;
    };
  }, [shouldShowGlow, glowColor]);

  return null;
};

export default MouseGlow;
