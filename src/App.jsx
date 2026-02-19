import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import './App.css';

import profileImg from './assets/profile.png';
import trophyImg from './assets/trophy.png';
import terminalImg from './assets/terminal.png';

function App() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const timelineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="app-container" ref={containerRef}>

      {/* 1. Hero Section (Fixed in background) */}
      <section className="section hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <img src={profileImg} alt="Xavier Jara" className="profile-img" />
          <h1 className="site-title">MISTRAL WORLDWIDE HACKATHON</h1>

          <div className="pixel-text">
            <p><span className="terminal-prompt">root@mistral:~$</span> ./applicant --info</p>
            <p><span className="terminal-accent">name:</span> xavier jara</p>
            <p><span className="terminal-accent">age:</span> 18</p>
            <p><span className="terminal-accent">status:</span> ready_to_build<span className="blinking-cursor"></span></p>
          </div>
        </motion.div>
      </section>

      {/* 2. Why Apply Section (Scrolling overlay, colored orange) */}
      <section className="section scrolling-section why-apply-section">
        <motion.div
          className="why-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="why-header">
            <img src={trophyImg} alt="Trophy" className="trophy-icon" />
            <h2>Why I want to apply</h2>
          </div>
          <div className="why-body pixel-text">
            <p>&gt; I am driven by pushing the limits of AI and building performant, scalable solutions.</p>
            <p>&gt; Combining Mistral's state-of-the-art open models with my passion for engineering and design forms the ultimate challenge.</p>
            <p>&gt; Executing ./hack.sh ... <span className="blinking-cursor"></span></p>
          </div>
        </motion.div>
      </section>

      {/* 3. Timeline / Projects Section 1 */}
      <section className="section scrolling-section timeline-section">
        <div className="timeline-container">
          {/* Animated vertical line */}
          <div className="timeline-track">
            <motion.div className="timeline-fill" style={{ height: timelineHeight }} />
          </div>

          <ProjectCard
            image={terminalImg}
            title="Latest AI Project"
            date="2026-10-15"
            description="[LOG] Developed a high-performance LLM agent interface with cutting-edge tools. Deployed successfully."
          />
        </div>
      </section>

      {/* 4. Timeline / Projects Section 2 */}
      <section className="section scrolling-section timeline-section">
        <div className="timeline-container">
          <div className="timeline-track">
            <motion.div className="timeline-fill" style={{ height: timelineHeight }} />
          </div>

          <ProjectCard
            image={terminalImg}
            title="Previous Open Source"
            date="2026-07-22"
            description="[LOG] Contributed to core machine learning repositories and optimized inference speeds by 40%."
            inverted
          />
        </div>
      </section>

    </div>
  );
}

function ProjectCard({ image, title, date, description, inverted }) {
  return (
    <motion.div
      className={`project-card ${inverted ? 'inverted' : ''}`}
      initial={{ x: inverted ? 100 : -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      viewport={{ once: false, margin: "-100px" }}
    >
      <div className="project-image-container">
        <img src={image} alt="Project" />
      </div>
      <div className="project-info">
        <span className="pixel-text" style={{ color: 'var(--text-muted)' }}>&gt; {date}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="link-btn">$&gt; view_project</button>
      </div>
    </motion.div>
  );
}

export default App;
