import React from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import { NetworkScene3D } from './NetworkScene3D';
import './Hero.css';

export const Hero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="hero-section" id="hero" aria-label="Hero Section">
      <div className="container hero-container">
        {/* Editorial Content */}
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Personal Identity Header */}
          <motion.div variants={itemVariants} className="hero-identity-header">
            <span className="hero-name-label">Ramesh C</span>
            <span className="hero-role-divider">•</span>
            <span className="hero-role-label">Software Engineer</span>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-specialisms-row">
            <span>Backend Engineering</span>
            <span className="bullet-sep">|</span>
            <span>Automation</span>
            <span className="bullet-sep">|</span>
            <span>Applied AI</span>
          </motion.div>

          {/* Dominant Headline */}
          <motion.h1 variants={itemVariants} className="hero-heading">
            Building systems that{' '}
            <span className="hero-heading-accent">make complex work simpler.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p variants={itemVariants} className="hero-description">
            I develop Python-based backend services, API-driven products, and workflow automation across healthcare, mobility, hospitality, and AI-powered applications.
          </motion.p>

          {/* Primary & Secondary Actions */}
          <motion.div variants={itemVariants} className="hero-actions">
            <a href="#projects" className="btn btn-primary hero-btn">
              <span>Explore My Work</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-secondary hero-btn">
              <Mail size={16} />
              <span>Get In Touch</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Systems Architecture Visualizer */}
        <motion.div
          className="hero-3d-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-3d-frame">
            <NetworkScene3D />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
