// @ts-nocheck
import React, { useEffect, useState } from 'react';

function ParticleBackground() {
    const [particles, setParticles] = useState([]);
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const createParticles = () => {
            const newParticles = [];
            // More floating particles
            for (let i = 0; i < 25; i++) {
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    animationDelay: Math.random() * 8,
                    size: Math.random() * 4 + 2,
                    type: 'float',
                    speed: Math.random() * 4 + 6,
                });
            }

            // Add orbiting particles
            for (let i = 25; i < 35; i++) {
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    animationDelay: Math.random() * 10,
                    size: Math.random() * 3 + 1,
                    type: 'orbit',
                    speed: Math.random() * 15 + 10,
                });
            }

            setParticles(newParticles);
        };

        const createStars = () => {
            const newStars = [];
            for (let i = 0; i < 50; i++) {
                newStars.push({
                    id: i,
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    animationDelay: Math.random() * 3,
                    size: Math.random() * 2 + 1,
                });
            }
            setStars(newStars);
        };

        createParticles();
        createStars();
    }, []);

    return (
        <>
            {/* Twinkling stars */}
            <div className="stars">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDelay: `${star.animationDelay}s`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                        }}
                    />
                ))}
            </div>

            {/* Floating particles */}
            <div className="particles">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className={`particle ${particle.type}`}
                        style={{
                            left: `${particle.left}%`,
                            top: particle.type === 'orbit' ? `${particle.top}%` : 'auto',
                            animationDelay: `${particle.animationDelay}s`,
                            animationDuration: `${particle.speed}s`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}

export default ParticleBackground;