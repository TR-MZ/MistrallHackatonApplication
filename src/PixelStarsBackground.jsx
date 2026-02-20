import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
// Generate a fixed set of particles outside the component to satisfy React pure function rules
// and avoid recalculating or causing effect loops.
const generateParticles = () => {
    const numParticles = 40; // Dense enough but performant
    const items = [];
    const colors = ['#FF7000', '#FFCC00', '#444444']; // Orange, Yellow, Dark Grey
    const shapes = ['square', 'plus'];

    for (let i = 0; i < numParticles; i++) {
        items.push({
            id: i,
            x: Math.random() * 100, // percentage string
            y: Math.random() * 100,
            size: Math.random() * 4 + 2, // 2px to 6px
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            duration: Math.random() * 20 + 20, // 20s to 40s to drift top
            delay: Math.random() * -40, // Start at different progress points
            opacitySpeed: Math.random() * 2 + 1, // Twinkle speed
        });
    }
    return items;
};

const INITIAL_PARTICLES = generateParticles();

// eslint-disable-next-line
function PixelStarsBackground({ isLocked }) {
    const [, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1000,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [particles] = useState(INITIAL_PARTICLES);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100%',
                overflow: 'hidden',
                zIndex: -1, // Strictly Behind the terminal
                pointerEvents: 'none', // Don't block scroll/clicks
            }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        width: p.shape === 'square' ? p.size : 'auto',
                        height: p.shape === 'square' ? p.size : 'auto',
                        backgroundColor: p.shape === 'square' ? p.color : 'transparent',
                        color: p.color,
                        fontSize: `${p.size * 2}px`,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.1, // Base very low opacity
                    }}
                    initial={{ y: `${p.y}vh` }}
                    animate={{
                        y: isLocked ? undefined : [`${p.y}vh`, '-10vh'], // Pause Drift upwards
                        opacity: [0.1, 0.4, 0.1], // Keep Twinkling
                    }}
                    transition={{
                        y: {
                            duration: p.duration,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: p.delay,
                        },
                        opacity: {
                            duration: p.opacitySpeed,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        },
                    }}
                >
                    {p.shape === 'plus' ? '+' : ''}
                </motion.div>
            ))}

            {/* Left Wireframe - True 3D CSS Cube */}
            <div
                style={{
                    position: 'absolute',
                    left: '5vw',
                    top: '25vh',
                    width: '20vw',
                    height: '20vw',
                    perspective: '800px', // Establish 3D space
                    pointerEvents: 'none',
                }}
            >
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                >
                    {/* Standard 6 faces of a cube, drawn as wireframes */}
                    {[
                        { transform: 'translateZ(10vw)' }, // Front
                        { transform: 'rotateY(180deg) translateZ(10vw)' }, // Back
                        { transform: 'rotateY(90deg) translateZ(10vw)' }, // Right
                        { transform: 'rotateY(-90deg) translateZ(10vw)' }, // Left
                        { transform: 'rotateX(90deg) translateZ(10vw)' }, // Top
                        { transform: 'rotateX(-90deg) translateZ(10vw)' }, // Bottom
                    ].map((faceStyle, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: '2px dashed rgba(255, 112, 0, 0.4)', // Mistral Orange
                                ...faceStyle,
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Right Wireframe - True 3D CSS Cube */}
            <div
                style={{
                    position: 'absolute',
                    right: '5vw',
                    top: '40vh',
                    width: '15vw',
                    height: '15vw',
                    perspective: '800px',
                    pointerEvents: 'none',
                }}
            >
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateX: [360, 0], rotateY: [0, 360], rotateZ: [0, 360] }}
                    transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                >
                    {/* Standard 6 faces of a cube, drawn as wireframes */}
                    {[
                        { transform: 'translateZ(7.5vw)' }, // Front
                        { transform: 'rotateY(180deg) translateZ(7.5vw)' }, // Back
                        { transform: 'rotateY(90deg) translateZ(7.5vw)' }, // Right
                        { transform: 'rotateY(-90deg) translateZ(7.5vw)' }, // Left
                        { transform: 'rotateX(90deg) translateZ(7.5vw)' }, // Top
                        { transform: 'rotateX(-90deg) translateZ(7.5vw)' }, // Bottom
                    ].map((faceStyle, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: '1px solid rgba(255, 204, 0, 0.3)', // Mistral Yellow
                                ...faceStyle,
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default PixelStarsBackground;
