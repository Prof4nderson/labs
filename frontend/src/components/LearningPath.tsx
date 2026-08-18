import React, { useState, useEffect } from 'react';

export function LearningPath() {
    const modules = [
        { id: 'docker', title: 'Fundamentos de Docker e Containers' },
        { id: 'flexbox', title: 'Layouts Modernos com CSS FlexBox' },
        { id: 'sql', title: 'Consultas e Modelagem SQL' },
        { id: 'secops', title: 'Introdução a SecOps e Boas Práticas' },
    ];

    const [progress, setProgress] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const savedProgress: { [key: string]: boolean } = {};
        modules.forEach(m => {
            savedProgress[m.id] = localStorage.getItem(`path_${m.id}`) === 'true';
        });
        setProgress(savedProgress);
    }, []);

    const handleToggle = (id: string) => {
        const newState = !progress[id];
        const updated = { ...progress, [id]: newState };
        setProgress(updated);
        localStorage.setItem(`path_${id}`, String(newState));
    };

    const checkedCount = Object.values(progress).filter(Boolean).length;
    const percentage = Math.round((checkedCount / modules.length) * 100) || 0;

    return (
        <div style={styles.container}>
            <h2>Trilha de Desenvolvimento & DevOps</h2>
            <div style={{ marginBottom: '16px' }}>
                <span>Progresso Geral: <strong>{percentage}%</strong></span>
                <div style={styles.barContainer}>
                    <div style={{ ...styles.barFill, width: `${percentage}%` }}></div>
                </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {modules.map(m => (
                    <li key={m.id} style={{ margin: '10px 0' }}>
                        <label style={{ cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={!!progress[m.id]} 
                                onChange={() => handleToggle(m.id)}
                                style={{ marginRight: '8px' }}
                            />
                            <strong>Módulo:</strong> {m.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: { background: '#121216', border: '1px solid #2a2a35', borderRadius: '12px', padding: '24px', color: '#f1f1f6', maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif' },
    barContainer: { background: '#22222d', borderRadius: '6px', height: '10px', overflow: 'hidden', marginTop: '6px' },
    barFill: { background: 'linear-gradient(90deg, #4f46e5, #9333ea)', height: '100%', transition: 'width 0.4s ease' }
} satisfies Record<string, React.CSSProperties>;
