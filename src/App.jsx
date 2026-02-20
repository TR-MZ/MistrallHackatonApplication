// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './App.css';

import trophyImg from './assets/trophy.png';
import terminalImg from './assets/terminal.png';
import PixelStarsBackground from './PixelStarsBackground';

const ASCII_ART = `██╗  ██╗ █████╗ ██╗   ██╗██╗███████╗██████╗          ██╗ █████╗ ██████╗  █████╗ 
╚██╗██╔╝██╔══██╗██║   ██║██║██╔════╝██╔══██╗         ██║██╔══██╗██╔══██╗██╔══██╗
 ╚███╔╝ ███████║██║   ██║██║█████╗  ██████╔╝         ██║███████║██████╔╝███████║
 ██╔██╗ ██╔══██║╚██╗ ██╔╝██║██╔══╝  ██╔══██╗    ██   ██║██╔══██║██╔══██╗██╔══██║
██╔╝ ██╗██║  ██║ ╚████╔╝ ██║███████╗██║  ██║    ╚█████╔╝██║  ██║██║  ██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝     ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
                                                                                
                                                                                                     
▄▄   ▄▄ ▄▄  ▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄   ▄▄▄  ▄▄      ▄▄ ▄▄  ▄▄▄   ▄▄▄▄ ▄▄ ▄▄  ▄▄▄ ▄▄▄▄▄▄ ▄▄ ▄▄  ▄▄▄  ▄▄  ▄▄   
██▀▄▀██ ██ ███▄▄   ██   ██▄█▄ ██▀██ ██      ██▄██ ██▀██ ██▀▀▀ ██▄█▀ ██▀██  ██   ██▄██ ██▀██ ███▄██   
██   ██ ██ ▄▄██▀   ██   ██ ██ ██▀██ ██▄▄▄   ██ ██ ██▀██ ▀████ ██ ██ ██▀██  ██   ██ ██ ▀███▀ ██ ▀██    
                                                                                                                                                       
 ▄▄▄  ▄▄▄▄  ▄▄▄▄  ▄▄    ▄▄  ▄▄▄▄  ▄▄▄ ▄▄▄▄▄▄ ▄▄  ▄▄▄  ▄▄  ▄▄                                         
██▀██ ██▄█▀ ██▄█▀ ██    ██ ██▀▀▀ ██▀██  ██   ██ ██▀██ ███▄██                                         
██▀██ ██    ██    ██▄▄▄ ██ ▀████ ██▀██  ██   ██ ▀███▀ ██ ▀██                                         `;

function App() {
  return (
    <div className="main-wrapper">
      <MagicTerminalSection />
      <TimelineSections />
    </div>
  );
}

function MagicTerminalSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Apply a spring dampening to smooth out chunky mouse wheel scrolls
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const commandText = "./analyze_applicant --id xavier_jara --extract motivation";
  const cmdLength = commandText.length;

  const [typedCommand, setTypedCommand] = useState("");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showBottomPrompt, setShowBottomPrompt] = useState(false);

  // Scroll mappings mapped tightly to raw scrollYProgress
  const typedCount = useTransform(scrollYProgress, [0, 0.3], [0, cmdLength]);
  // Offset start to 0.42 so it sits visibly at 0 for a small scroll distance
  const progressVal = useTransform(scrollYProgress, [0.42, 0.6], [0, 20]);

  useMotionValueEvent(typedCount, "change", (latest) => {
    setTypedCommand(commandText.substring(0, Math.floor(latest)));
  });

  useMotionValueEvent(progressVal, "change", (latest) => {
    setCurrentProgress(Math.floor(latest));
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowProgressBar(latest >= 0.33);
    setShowBottomPrompt(latest > 0.62);
  });

  // Terminal window expanding (slow start -> fast middle -> slow end)
  // Max scale capped at 15 to prevent Chrome GPU texture limit crash (> 8192px cutoff)
  const terminalScale = useTransform(smoothProgress, [0.7, 0.73, 0.79, 0.82], [1, 1.5, 10, 15]);
  const terminalOpacity = useTransform(smoothProgress, [0.7, 0.82], [1, 0]);

  // Orange bg fades in directly alongside terminal fading out
  const orangeBgOpacity = useTransform(smoothProgress, [0.7, 0.82], [0, 1]);

  // Container comes in slightly after
  const containerOpacity = useTransform(smoothProgress, [0.79, 0.91], [0, 1]);
  const containerScale = useTransform(smoothProgress, [0.79, 0.91], [0.8, 1]);
  const containerY = useTransform(smoothProgress, [0.79, 0.91], [40, 0]);

  return (
    <div className="magic-section-wrapper" ref={sectionRef} style={{ height: "500vh" }}>
      <div className="sticky-terminal-container" style={{ zIndex: 10 }}>
        <PixelStarsBackground isLocked={false} scrollProgress={scrollYProgress} />

        {/* Orange section transition dot background */}
        <motion.div
          className="orange-dot-bg"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
            backgroundColor: 'var(--mistral-orange)',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 2px, transparent 2px)',
            backgroundSize: '24px 24px',
            opacity: orangeBgOpacity
          }}
        />

        {/* The terminal window container that scales up drastically */}
        <motion.div
          className="terminal-window"
          style={{
            scale: terminalScale,
            opacity: terminalOpacity,
            transformOrigin: "center center",
            zIndex: 2
          }}
        >
          {/* Original Terminal Content */}
          <div className="terminal-inner">
            <div className="terminal-history">
              <pre className="ascii-art">{ASCII_ART}</pre>

              <div className="terminal-info">
                <p>NAME:     <span className="highlight-dark-orange">Xavier Jara</span></p>
                <p>AGE:      <span className="highlight-dark-orange">18</span></p>
                <p>Class: <span className="highlight-dark-orange">Terminale (Lycée Sainte Marie Antony)</span></p>
              </div>

              <div className="terminal-prompt-line">
                <span className="user-host">root@mistral:~$</span>
                <span className="typed-cmd">{typedCommand}</span>
                {!showProgressBar && <span className="blinking-cursor"></span>}
              </div>

              {/* Fake Loading Progress */}
              <div className="terminal-progress-area">
                {showProgressBar && (
                  <div className="progress-bar-text" style={{ marginTop: '4cqi' }}>
                    <span style={{ color: 'var(--terminal-text)' }}>Processing dependencies... </span>
                    <span style={{ color: 'var(--text-main)' }}>[</span>
                    <span style={{ color: 'var(--mistral-orange)' }}>{"#".repeat(currentProgress)}</span>
                    <span style={{ color: 'var(--mistral-border)' }}>{"-".repeat(20 - currentProgress)}</span>
                    <span style={{ color: 'var(--text-main)' }}>]</span>
                    <span style={{ color: 'var(--terminal-text)' }}>  {currentProgress.toString().padStart(2, ' ')}/20</span>
                  </div>
                )}
                {currentProgress === 20 && (
                  <div className="progress-bar-text success-msg" style={{ marginTop: '2cqi', fontWeight: 'bold' }}>
                    &gt; Success: Applicant data loaded. Expanding protocol...
                  </div>
                )}
              </div>
            </div>

            <div style={{ flexGrow: 1 }}></div>

            {/* Scroll Reminder inside terminal */}
            {!showBottomPrompt && (
              <div className="scroll-reminder">
                <p>[ Scroll to action ]</p>
              </div>
            )}

            {/* Bottom prompt */}
            {showBottomPrompt && (
              <div className="terminal-prompt-line" style={{ marginTop: '1cqi', marginBottom: 0 }}>
                <span className="user-host">root@mistral:~$</span>
                <span className="blinking-cursor"></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Global Scroll Hint if user isn't scrolling initially */}
        <motion.div
          className="global-scroll-hint"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
            position: "absolute", bottom: "5%", zIndex: 2
          }}
        >
          (scroll down to initialize protocol)
        </motion.div>

        {/* Orange Section Transition Content */}
        <motion.div
          className="why-apply-content"
          style={{
            opacity: containerOpacity,
            scale: containerScale,
            y: containerY,
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div className="whitish-container">
            <div className="why-header">
              <img src={trophyImg} alt="Trophy" className="trophy-icon-dark" />
              <h2>Why I want to apply</h2>
            </div>
            <div className="why-body-text">
              <p>I am driven by pushing the limits of AI and building performant, scalable solutions.</p>
              <p>Combining Mistral's state-of-the-art open models with my passion for engineering and design forms the ultimate challenge.</p>
              <p className="orange-shimmer">&gt; I'm ready to hack.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function TimelineSections() {
  const timelineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const timelineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="timeline-wrapper" ref={timelineRef}>
      <div className="timeline-global-track">
        <motion.div className="timeline-global-fill" style={{ height: timelineHeight }} />
      </div>

      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          title="Latest AI Project"
          date="2026-10-15"
          description="[LOG] Developed a high-performance LLM agent interface with cutting-edge tools. Deployed successfully."
        />
      </section>

      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          title="Previous Open Source"
          date="2026-07-22"
          description="[LOG] Contributed to core machine learning repositories and optimized inference speeds by 40%."
          inverted
        />
      </section>
    </div>
  );
}

function ProjectCard({ image, title, date, description, inverted }) {
  return (
    <motion.div
      className={`project-card ${inverted ? 'inverted' : ''} `}
      initial={{ x: inverted ? 100 : -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      viewport={{ once: false, margin: "-100px" }}
    >
      <div className="project-image-container">
        <img src={image} alt="Project" />
      </div>
      <div className="project-info">
        <span className="pixel-text muted">&gt; {date}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="link-btn">$&gt; view_project</button>
      </div>
    </motion.div>
  );
}

export default App;
