import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './LandingPage.css';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false); // Close menu after clicking a link
    };

    const navLinks = document.querySelectorAll('.nav_links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  useEffect(() => {
    // ScrollReveal animations
    const ScrollReveal = require('scrollreveal').default;

    const sr = ScrollReveal({
      distance: "50px",
      duration: 1000,
      reset: true
    });

    sr.reveal(".header_image img", {
      origin: "right",
    });

    sr.reveal(".header_content h1", {
      delay: 500
    });

    sr.reveal(".header_content .section_description", {
      delay: 1000
    });

    sr.reveal(".header_content .header_btn", {
      delay: 1500
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignUpLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="landing-page">
      <nav>
        <div className="nav_header">
          <div className="logo nav_logo">
            <img src="/images/khabar.svg" alt="shodaighor logo" className="header_logo_img" />
            <a href="#">
              <span className="shodai">Shodai</span><span className="ghor">Ghor</span>
            </a>
          </div>
          <div className="nav_menu_btn" id="menu-btn" onClick={toggleMenu}>
            <span><i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i></span>
          </div>
        </div>
        <ul className={`nav_links ${isMenuOpen ? 'open' : ''}`} id="nav-links">
          <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#chatbot" onClick={() => setIsMenuOpen(false)}>Chatbot</a></li>
          <li><a href="#donation" onClick={() => setIsMenuOpen(false)}>Donation</a></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact Us</a></li>
        </ul>
        <div className="nav_btn">
          <button className="btn" onClick={handleSignUpLogin}>Sign up/ Log in</button>
        </div>
      </nav>

      <header className="section_container header_container" id="home">
        <div className="header_image">
          <img src="/images/OBJECTS (5).svg" alt="food" />
        </div>
        <div className="header_content">
          <h1>সদাই দিলে সুখ পাবেন,<span>অপচয় করলে ক্ষুধা বাড়াবেন।</span></h1>
          <p className="section_description">
            Welcome to Shodai Ghor! 🌱 We believe that every meal counts. Join us in our mission to reduce food wastage and create a sustainable future. Together, we can make a difference by making mindful choices about food. Let's start saving today, for a better tomorrow.
          </p>
          {/* Removed "Get Started" button */}
        </div>
      </header>

      <section className="section_container" id="chatbot">
        <div className="section-inner">
          <h2>Chatbot Section</h2>
          <p className="chatbot-description">Here you can interact with our chatbot Cheffy !!.</p>
          <div className="chatbot_images">
            <img src="/images/Screenshot 2024-08-30 032905.png" alt="Chatbot Interface 1" />
            <img src="/images/Screenshot 2024-08-30 033003.png" alt="Chatbot Interface 2" />
          </div>
        </div>
      </section>

      <section className="section_container" id="donation">
        <div className="section-inner">
          <h2>Donation</h2>
          <p>Learn how you can donate food ingredients to help those in need. Our donation process is simple and transparent:</p>
          <ul>
            <li>Step 1: Choose the ingredients you wish to donate.</li>
            <li>Step 2: Send request to arrange a pickup or drop-off.</li>
          </ul>
          <div className="donation_images">
            <img src="/images/Screenshot 2024-08-30 100608.png" alt="donation Interface 1" />
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="section-inner">
          <h2>Contact Us</h2>
          <p>Get in touch with us for more information:</p>
          <ul>
            <li><a href="mailto:kinsomerance2004@gmail.com">kinsomerance2004@gmail.com</a></li>
            <li><a href="mailto:jubairalbaky12@gmail.com">jubairalbaky12@gmail.com</a></li>
            <li><a href="mailto:zaramrsd@gmail.com">zaramrsd@gmail.com</a></li>
            <li><a href="mailto:njc3981@gmail.com">njc3981@gmail.com</a></li>
            <li><a href="mailto:shodaighor@gmail.com">shodaighor@gmail.com</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;