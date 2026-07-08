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
    '/profile'
  ];

  // Check if current path matches exact paths or starts with /user/ (for UserDashboard/Profile)
  const shouldShowGlow = glowPaths.includes(location.pathname) || location.pathname.startsWith('/user/');

  useEffect(() => {
    if (!shouldShowGlow) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'mouse-glow-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.1) 0%,
        rgba(${glowColor}, 0.05) 20%,
        rgba(${glowColor}, 0.02) 40%,
        transparent 60%
      );
      z-index: 9998;
      opacity: 0;
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current) return;
      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out'
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
