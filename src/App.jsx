// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './App.css';

import trophyImg from './assets/trophy.png';
import terminalImg from './assets/terminal.png';
import PixelStarsBackground from './PixelStarsBackground';

const ASCII_ART = `███╗   ███╗██╗███████╗████████╗██████╗  █████╗ ██╗         ██╗    ██╗██╗    ██╗    
████╗ ████║██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║         ██║    ██║██║    ██║    
██╔████╔██║██║███████╗   ██║   ██████╔╝███████║██║         ██║ █╗ ██║██║ █╗ ██║    
██║╚██╔╝██║██║╚════██║   ██║   ██╔══██╗██╔══██║██║         ██║███╗██║██║███╗██║    
██║ ╚═╝ ██║██║███████║   ██║   ██║  ██║██║  ██║███████╗    ╚███╔███╔╝╚███╔███╔╝    
╚═╝     ╚═╝╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝     ╚══╝╚══╝  ╚══╝╚══╝     
                                                                                   
██╗  ██╗ █████╗  ██████╗██╗  ██╗ █████╗ ████████╗██╗  ██╗ ██████╗ ███╗   ██╗       
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗╚══██╔══╝██║  ██║██╔═══██╗████╗  ██║       
███████║███████║██║     █████╔╝ ███████║   ██║   ███████║██║   ██║██╔██╗ ██║       
██╔══██║██╔══██║██║     ██╔═██╗ ██╔══██║   ██║   ██╔══██║██║   ██║██║╚██╗██║       
██║  ██║██║  ██║╚██████╗██║  ██╗██║  ██║   ██║   ██║  ██║╚██████╔╝██║ ╚████║       
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝       
                                                                                   
 ▄▄▄  ▄▄▄▄  ▄▄▄▄  ▄▄    ▄▄  ▄▄▄▄  ▄▄▄ ▄▄▄▄▄▄ ▄▄  ▄▄▄  ▄▄  ▄▄ 
██▀██ ██▄█▀ ██▄█▀ ██    ██ ██▀▀▀ ██▀██  ██   ██ ██▀██ ███▄██ 
██▀██ ██    ██    ██▄▄▄ ██ ▀████ ██▀██  ██   ██ ▀███▀ ██ ▀██`;

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

  const commandText = "./analyze_applicant --id xavier_jara --extract motivation";
  const cmdLength = commandText.length;

  const [typedCommand, setTypedCommand] = useState("");
  const [commandFinished, setCommandFinished] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showBottomPrompt, setShowBottomPrompt] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [sequenceDone, setSequenceDone] = useState(false);

  // Lock global scroll when progress bar starts, and unlock when expansion is done
  useEffect(() => {
    if (showProgressBar && !sequenceDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // restore scrolling
    }
  }, [showProgressBar, sequenceDone]);

  // 1. Scroll-based Typing
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (commandFinished) return; // Don't reverse if already finished typing

      if (v < 0.25) {
        let count = Math.floor((v / 0.25) * cmdLength);
        setTypedCommand(commandText.substring(0, count));
      } else {
        setTypedCommand(commandText);
        setCommandFinished(true); // Trigger auto-load
      }
    });
  }, [scrollYProgress, cmdLength, commandFinished]);

  // 2. Sequential Terminal Sequence
  useEffect(() => {
    if (commandFinished && progressStep < 20) {
      // Step A: Wait then show the bar at 0%
      const startTimeout = setTimeout(() => {
        setShowProgressBar(true);

        // Wait briefly so the user sees the empty bar before it fills
        setTimeout(() => {
          const interval = setInterval(() => {
            setProgressStep(prev => {
              if (prev >= 19) {
                clearInterval(interval);

                // Step B: Loading finished, wait then show bottom prompt
                setTimeout(() => {
                  setShowBottomPrompt(true);

                  // Step C: Prompt shown, wait final delay then expand
                  setTimeout(() => {
                    setIsExpanding(true);
                    // Step D: Unlock scroll after the expansion transition completes
                    setTimeout(() => {
                      setSequenceDone(true);
                    }, 1200);
                  }, 1200); // Final delay before site entrance

                }, 800); // Delay before second root@ appears

                return 20;
              }
              return prev + 1;
            });
          }, 1300 / 20);
        }, 500); // 500ms delay before filling starts

      }, 800); // 800ms initial wait before bar text appears

      return () => clearTimeout(startTimeout);
    }
  }, [commandFinished]); // Only run once when command finishes

  return (
    <div className="magic-section-wrapper" ref={sectionRef}>
      <PixelStarsBackground isLocked={showProgressBar && !sequenceDone} />
      <div className="sticky-terminal-container" style={{ zIndex: 10 }}>

        {/* The terminal window container that scales up drastically */}
        <motion.div
          className="terminal-window"
          animate={{
            scale: isExpanding ? 25 : 1,
            opacity: isExpanding ? 0 : 1
          }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: "center center" }}
        >
          {/* Original Terminal Content */}
          <div className="terminal-inner">
            <div className="terminal-history">
              <pre className="ascii-art">{ASCII_ART}</pre>

              <div className="terminal-info">
                <p>NAME:     <span className="highlight-dark-orange">Xavier Jara</span></p>
                <p>AGE:      <span className="highlight-dark-orange">18</span></p>
                <p>TERMINAL: <span className="highlight-dark-orange">Lycée Sainte Marie Antony</span></p>
              </div>

              <div className="terminal-prompt-line">
                <span className="user-host">root@mistral:~$</span>
                <span className="typed-cmd">{typedCommand}</span>
                {!showBottomPrompt && <span className="blinking-cursor"></span>}
              </div>

              {/* Fake Loading Progress */}
              <div className="terminal-progress-area">
                {(commandFinished && showProgressBar) && (
                  <div className="progress-bar-text" style={{ marginTop: '2rem' }}>
                    <span style={{ color: 'var(--terminal-text)' }}>Processing dependencies... </span>
                    <span style={{ color: 'var(--text-main)' }}>[</span>
                    <span style={{ color: 'var(--mistral-orange)' }}>{"#".repeat(progressStep)}</span>
                    <span style={{ color: 'var(--mistral-border)' }}>{"-".repeat(20 - progressStep)}</span>
                    <span style={{ color: 'var(--text-main)' }}>]</span>
                    <span style={{ color: 'var(--terminal-text)' }}>  {progressStep.toString().padStart(2, ' ')}/20</span>
                  </div>
                )}
                {progressStep === 20 && (
                  <div className="progress-bar-text success-msg" style={{ marginTop: '1rem', color: '#FFCC00', fontWeight: 'bold' }}>
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
              <div className="terminal-prompt-line" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <span className="user-host">root@mistral:~$</span>
                <span className="blinking-cursor"></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Global Scroll Hint if user isn't scrolling initially */}
        <motion.div
          className="global-scroll-hint"
          animate={{ opacity: (typedCommand === "" && !commandFinished) ? 1 : 0 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ position: "absolute", bottom: "5%" }}
        >
          (scroll down to initialize protocol)
        </motion.div>

        {/* Orange Section Transition Content */}
        <motion.div
          className="why-apply-content"
          animate={{
            opacity: isExpanding ? 1 : 0,
            scale: isExpanding ? 1 : 0.8,
            y: isExpanding ? 0 : 40
          }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          style={{
            pointerEvents: isExpanding ? 'auto' : 'none',
            position: 'absolute',
            zIndex: 10
          }}
        >
          <div className="whitish-container" style={{ backgroundColor: '#FF7000', color: '#FAFAFA' }}>
            <div className="why-header">
              <img src={trophyImg} alt="Trophy" className="trophy-icon-dark" style={{ filter: 'brightness(0) invert(1)' }} />
              <h2 style={{ color: '#FAFAFA' }}>Why I want to apply</h2>
            </div>
            <div className="why-body-text" style={{ color: '#FAFAFA' }}>
              <p>I am driven by pushing the limits of AI and building performant, scalable solutions.</p>
              <p>Combining Mistral's state-of-the-art open models with my passion for engineering and design forms the ultimate challenge.</p>
              <p className="orange-shimmer" style={{ color: '#FAFAFA', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>&gt; I'm ready to hack.</p>
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
        <span className="pixel-text muted">&gt; {date}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="link-btn">$&gt; view_project</button>
      </div>
    </motion.div>
  );
}

export default App;
