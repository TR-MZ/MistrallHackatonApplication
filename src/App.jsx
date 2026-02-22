// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './App.css';

import trophyImg from './assets/trophy.png';
import terminalImg from './assets/terminal.png';
import PixelStarsBackground from './PixelStarsBackground';

// Auto-detect all media in each project folder
const _fluxRaw = import.meta.glob('./assets/flux/*', { eager: true, query: '?url', import: 'default' });
const _blobCanvasRaw = import.meta.glob('./assets/blob_canvas/*', { eager: true, query: '?url', import: 'default' });
const _pluginsRaw = import.meta.glob('./assets/other_studio_plugins/*', { eager: true, query: '?url', import: 'default' });
const _teachingRaw = import.meta.glob('./assets/student_teaching_app/*', { eager: true, query: '?url', import: 'default' });
const _youngerRaw = import.meta.glob('./assets/younger/*', { eager: true, query: '?url', import: 'default' });

function globToSortedUrls(raw) {
  return Object.entries(raw)
    .filter(([path]) => !path.endsWith('.DS_Store'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

const fluxImages   = globToSortedUrls(_fluxRaw);
const blobCanvasMedia  = globToSortedUrls(_blobCanvasRaw);
const pluginsMedia = globToSortedUrls(_pluginsRaw);
const teachingMedia = globToSortedUrls(_teachingRaw);
const youngerMedia  = globToSortedUrls(_youngerRaw);

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
  const containerPointerEvents = useTransform(smoothProgress, [0.79, 0.91], ["none", "auto"]);

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
                <p>Class: <span className="highlight-dark-orange">Terminale (Lycée Sainte Marie Antony) - France</span></p>
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
            pointerEvents: containerPointerEvents
          }}
        >
          <div className="whitish-container">
            <div className="why-header">
              <h2>Why DO I want to apply</h2>
            </div>
            <div className="why-body-text">
              <p>
                I have already taken part in <strong>different online programming competitions</strong>, but this is by far the one <strong>I'm most excited about</strong>.
              </p>

              <div style={{
                background: 'rgba(255, 112, 0, 0.05)',
                borderLeft: '4px solid var(--mistral-orange)',
                padding: '1.2rem',
                paddingRight: '2rem',
                margin: '1.5rem 0',
                borderRadius: '0 8px 8px 0',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span className="pixel-text" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem', color: 'var(--mistral-orange)' }}>
                    &gt; RECENT_ACHIEVEMENT
                  </span>
                  <p style={{ margin: 0, fontSize: '1.2rem' }}>
                    <strong>2nd place</strong> in the French Versailles Academic programming competition in 2025 (NSI).
                  </p>
                </div>
                <a
                  href="https://sciences-informatiques.ac-versailles.fr/IMG/pdf/palmares_des_olympiades_academiques_2025_de_nsi_ed.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--mistral-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '1.5rem',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 112, 0, 0.1)',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  title="View PDF Results"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--mistral-orange)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 112, 0, 0.1)';
                    e.currentTarget.style.color = 'var(--mistral-orange)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>

              <p>
                Participating in this hackathon would not only be a <strong>great opportunity to challenge myself</strong>, but it would also be a great way to meet other <strong style={{color: 'var(--mistral-orange)'}}>like-minded individuals</strong>.
              </p>

              <p className="orange-shimmer">&gt; Continue scrolling</p>
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
          thumbnailImage={fluxImages[0]}
          modalImages={fluxImages}
          checkerboard
          title="Latest AI Project"
          date="14/02/2026 - today"
          description="Modified then trained my own transparent VAE model for the diffusion model Flux.2 Klein, currently working on a better dataset to train a Lora for the model. I plan open sourcing my work."
          fullDescription={`<p>I recently needed a <strong>transparent image generator</strong> for a SaaS I'm making, and stumbled upon <strong>SDXL LayerDiffuse</strong>. However, this model was old, and I needed a more modern solution. So I decided to read papers about <strong style="color: var(--mistral-orange)">transparent image generation</strong> and modern <strong>VAE techniques</strong>.</p>
          <p>If you would like to test the <strong>VAE</strong> and the <strong>LoRA</strong> with your own prompt as a proof of work, you can send me an email. (I am not willing to release an incomplete model to the public.)</p>
          <p>I built this specifically for <strong style="color: var(--mistral-orange)">Flux.2 Klein</strong>, a quick but capable model that made it practical to iterate fast.</p>
          <p>I used <strong style="color: var(--mistral-orange)">Mistral 3 3B</strong> to annotate images in my dataset!</p>
                      
          <p>Next steps:
          <ul>
            <li>Improving my dataset, generating images with <strong>better quality and diversity</strong>.</li>
            <li>Retraining the LoRA on this improved dataset.</li>
            <li><strong style="color: var(--mistral-orange)">Releasing</strong> the weights and code <strong>open source</strong> to the community.</li>
          </ul>
          </p>`}
        />
      </section>

      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          modalImages={teachingMedia}
          title="Student teaching app"
          date="2025 summer break"
          description="I made an app helping me study with LLM, vLLM and vector databases. I used it to help me study by just scanning notebooks."
          fullDescription={`<p>During my two years of high school I struggled to keep my notes organised. I finally got a <strong style="color: var(--mistral-orange)">Wacom Bamboo Slate</strong> that digitises anything I write on it, and the idea for this app was born: take any note (from the slate or my paper notebooks) and transform it into a <strong>lesson, quiz, flashcards or mind map</strong>.</p>
          <p>I built most of the backend in <strong>Go</strong> and the frontend in <strong>Flutter</strong>, complete with smooth animations. The core functionality works, including <strong style="color: var(--mistral-orange)">LLM powered vector search</strong> over the content, but I never finished the quiz creation or flashcard generation features.</p>
            <p><strong>Why I stopped?</strong></p>
            <ul>
              <li>I learned about <strong>Google NotebookLM</strong>; building mine was still fun.</li>
              <li>Time was limited and a more promising project came along, this one would never have been profitable.</li>
            </ul>`}
          inverted
        />
      </section>
      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          modalImages={blobCanvasMedia}
          title="Blob Canvas - Roblox UI Plugin"
          date="2025 - Present"
          description="I built, in collaboration with a UI designer, a comprehensive UI creation tool resembling Figma, for UI game developers in Roblox Studio. Built entirely in Luau."
          fullDescription={`<p>I built with an American UI designer friend Zack, well known on the <strong>Roblox</strong> platform, <strong style="color: var(--mistral-orange)">Blob Canvas</strong> from the ground up to revolutionise how interface designers work within Roblox Studio. We wanted to give developers a true, <strong>premium Figma-like experience</strong> right inside the engine, without needing to constantly tab out.</p>
          <p>Our tool is a complete UI design plugin, where we will be implementing <strong style="color: var(--mistral-orange)">AI to generate assets</strong> and more. We will even expand it to generate <strong>3D models, skyboxes, logos</strong> and more in the future!</p>
          <p>Already <strong style="color: var(--mistral-orange)">400 users</strong> have preordered or are ready to buy it when we launch, and our announcement video showcasing the workflow has reached <strong>55k views on X</strong>, with a very positive reception from the community.</p>
          <p>You can read our <a href="https://x.com/Zac1kio/status/1960429790973808735" target="_blank" rel="noopener noreferrer" style="color: var(--mistral-orange); text-decoration: underline;">official announcement on X</a> where I show off the workflow!</p>`}
        />
      </section>

      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          modalImages={pluginsMedia}
          title="Other Roblox Studio Plugins"
          date="Luau language"
          description="Before Blob Canvas, I spent years developing workflow-enhancing plugins for the community. I've built tools that have garnered over 20,000+ total downloads."
          fullDescription={`<p>I've always been passionate about <strong>lowering the barrier to entry</strong> for Roblox developers. Over the years, I've designed and shipped several highly successful plugins that solve <strong style="color: var(--mistral-orange)">real workflow bottlenecks</strong>.</p>
          <p>My notable creations:
          <ul>
            <li><strong><a href="https://devforum.roblox.com/t/gui-editor-plus-quick-actions-what-roblox-editor-should-have-been/3632416" target="_blank" rel="noopener noreferrer" style="color: var(--mistral-orange); text-decoration: underline;">GUI Editor+</a></strong>: I was frustrated with the default tools, so I built what became the <strong>most advanced UI editor plugin</strong> of its time.</li>
            <li><strong><a href="https://devforum.roblox.com/t/scratchify-blox-v3-released-visual-scripting-for-roblox-20k-downloads/3630705/28" target="_blank" rel="noopener noreferrer" style="color: var(--mistral-orange); text-decoration: underline;">Scratchify Blox 3</a></strong>: I created this visual scripting tool to help new devs learn. It blew up to <strong style="color: var(--mistral-orange)">20k+ downloads</strong> and caught enough attention that the source was <strong>successfully acquired</strong>!</li>
            <li><strong><a href="https://devforum.roblox.com/t/blob-a-premium-ui-importing-plugin-asset-manager/2963714?page=2" target="_blank" rel="noopener noreferrer" style="color: var(--mistral-orange); text-decoration: underline;">Blob Lite</a></strong>: I designed this as a <strong>premium lightweight</strong> UI importing plugin and asset manager.</li>
          </ul>
          </p>`}
          inverted
        />
      </section>


      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          title="Other AI related projects"
          date="Post 2024 to present"
          description="A grab bag of AI experiments: invoice parsing with vision models, fine‑tuning grounding LLMs, and even a custom Connect Four neural net."
          fullDescription={`<p>I have already experimented with AI in <strong>different other projects</strong>.
            Here are some of them:
            <ul>
              <li><strong style="color: var(--mistral-orange)">Invoice to table</strong>: I used <strong>Vision Models</strong> to turn an invoice PDF into a structured table format.</li>
              <li><strong style="color: var(--mistral-orange)">LLM Grounding</strong>: I fine tuned a <strong>Qwen 2.5</strong> then <strong>3 VL</strong> for specific bounding box detection tasks in my personal project.</li>
              <li><strong style="color: var(--mistral-orange)">Connect Four AI</strong>: I trained a <strong>custom neural net</strong> to play Connect Four. It was one of my first AI projects (2024).</li>
              <li><strong style="color: var(--mistral-orange)">Neural net car steering</strong>: I built a <strong>neural network</strong> that steered cars between checkpoints, using a navigation algorithm I had written myself before I even knew A* or Dijkstra existed. The cars could also brake when an obstacle was detected ahead.</li>
              <li><strong style="color: var(--mistral-orange)">LLM game</strong>: Back in 2024, I built a <strong>survival game powered by an LLM</strong>. The model would drop you into a scenario, judge your answer, and decide your fate. (The idea was inspired from an existing discord activity)</li>
            </ul>
          </p>`}
        />
      </section>


      <section className="section normal-section">
        <ProjectCard
          image={terminalImg}
          modalImages={youngerMedia}
          title="Other projects, when I was younger"
          date="Pre vibecoding era"
          description="Long before vibe coding existed, I was already shipping apps, games, and plugins, from macOS menu bar tools in Swift to viral Roblox games on YouTube."
          fullDescription={`<p>I have always had a <strong>developer mindset</strong>, it all amplified during the <strong>COVID lockdown</strong>.</p>
          <p>The first challenge I tackled was building an app that, using the <strong>API of the website my school uses</strong> to give us homework, grades and send us emails, would preview all that data right in the <strong>macOS menu bar</strong>.</p>
          <p>After making some other <strong style="color: var(--mistral-orange)">macOS Swift apps</strong>, I got into <strong>game development</strong>, starting by making a Flappy Bird clone for Apple Watch.</p>
          <p>Then I gained some popularity on YouTube after mixing <strong>physics soft bodies</strong> and car games, you can check my channel <a href="https://www.youtube.com/@tr-mz.studios" target="_blank" rel="noopener noreferrer" style="color: var(--mistral-orange); text-decoration: underline;">here</a>.</p>
          <p>I also made a fun app for a school project in <strong style="color: var(--mistral-orange)">Swift</strong> (while other students had to learn Scratch) at age <strong>14</strong> that let you calculate your CO₂ emissions.</p>
          <p>More than that, I have also done a lot of <strong>Electronics projects</strong> with Arduinos, Esp, and STMs.</p>
          `}
          inverted
        />
      </section>
    </div>
  );
}

function isVideo(src) {
  return typeof src === 'string' && src.match(/\.(mov|mp4|webm)$/i);
}

function MediaItem({ src, alt, onClick, className, style }) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        controls
        playsInline
        onClick={onClick ? (e) => { e.stopPropagation(); } : undefined}
      />
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onClick={onClick} />;
}

function ProjectCard({ image, thumbnailImage, modalImages, checkerboard, title, date, description, inverted, fullDescription }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Modal carousel uses project-specific media; fallback to thumbnail
  const displayImages = (modalImages && modalImages.length > 0) ? modalImages : [image];
  const contentToShow = fullDescription || `<p>${description}</p>`;
  // Which image to show in the card thumbnail
  const cardThumb = thumbnailImage || image;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <motion.div
        className={`project-card ${inverted ? 'inverted' : ''}`}
        initial={{ x: inverted ? 100 : -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <div
          className={`project-image-container${checkerboard ? ' checker-container' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Black background layer */}
          {checkerboard && <div className="checker-black-layer" style={{ opacity: isHovered ? 0 : 1 }} />}
          {/* Checkerboard layer fades in on hover */}
          {checkerboard && <div className="checker-pattern-layer" style={{ opacity: isHovered ? 1 : 0 }} />}
          <img
            src={cardThumb}
            alt="Project"
          />
        </div>
        <div className="project-info">
          <span className="pixel-text muted">&gt; {date}</span>
          <h3>{title}</h3>
          <p>{description}</p>
          <button className="link-btn" onClick={() => setIsModalOpen(true)}>$&gt; view_project</button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="project-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="project-modal-header">
                <h2>{title}</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>X</button>
              </div>
              <div className="project-modal-content">
                <div className="project-modal-left">
                  <div className={`image-carousel-container${checkerboard ? ' checkerboard-bg' : ''}`}>
                    <MediaItem
                      src={displayImages[currentImageIndex]}
                      alt="Project main"
                      onClick={!isVideo(displayImages[currentImageIndex]) ? () => setIsFullscreen(true) : undefined}
                      className="carousel-image"
                      style={isVideo(displayImages[currentImageIndex]) ? { cursor: 'default' } : {}}
                    />

                    {displayImages.length > 1 && (
                      <>
                        <button className="carousel-arrow left" onClick={prevImage}>&lt;</button>
                        <button className="carousel-arrow right" onClick={nextImage}>&gt;</button>
                      </>
                    )}

                    {displayImages.length > 1 && (
                      <div className="image-counter">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    )}

                    {!isVideo(displayImages[currentImageIndex]) && (
                      <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)} title="View Fullscreen">
                        &#x26F6;
                      </button>
                    )}
                  </div>
                </div>
                <div className="project-modal-right">
                  <h3>&gt; SYSTEM_LOG: {date}</h3>
                  <div className="modal-text-content" dangerouslySetInnerHTML={{ __html: contentToShow }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fullscreen-image-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <img src={displayImages[currentImageIndex]} alt="Fullscreen" className="fullscreen-image" onClick={(e) => e.stopPropagation()} />
            <button className="close-btn fullscreen-close" onClick={() => setIsFullscreen(false)}>X</button>

            {displayImages.length > 1 && (
              <>
                <div className="image-counter fullscreen-counter">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
                <button className="carousel-arrow fullscreen-arrow left" onClick={prevImage}>&lt;</button>
                <button className="carousel-arrow fullscreen-arrow right" onClick={nextImage}>&gt;</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
