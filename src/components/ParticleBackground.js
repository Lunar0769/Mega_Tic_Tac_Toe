// @ts-nocheck
import React, { useEffect, useState } from 'react';

function ParticleBackground() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const createParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 15; i++) {
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    animationDelay: Math.random() * 6,
                    size: Math.random() * 3 + 2,
                });
            }
            setParticles(newParticles);
        };

        createParticles();
    }, []);

    return (
        <div className="particles">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.animationDelay}s`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                />
            ))}
        </div>
    );
}

export default ParticleBackground;