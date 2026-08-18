import React, { useState, useEffect } from 'react';

export function PollWidget() {
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState({ labs: 12, games: 25, code: 8 });
    const [selectedOption, setSelectedOption] = useState('');

    const POLL_DATA_KEY = 'poll_votes_data';
    const HAS_VOTED_KEY = 'user_has_voted';

    useEffect(() => {
        const savedVotes = localStorage.getItem(POLL_DATA_KEY);
        if (savedVotes) {
            setVotes(JSON.parse(savedVotes));
        }
        if (localStorage.getItem(HAS_VOTED_KEY)) {
            setHasVoted(true);
        }
    }, []);

    const handleVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOption) return alert('Selecione uma opção!');

        const updatedVotes = { ...votes, [selectedOption]: votes[selectedOption as keyof typeof votes] + 1 };
        setVotes(updatedVotes);
        localStorage.setItem(POLL_DATA_KEY, JSON.stringify(updatedVotes));
        localStorage.setItem(HAS_VOTED_KEY, 'true');
        setHasVoted(true);
    };

    const total = votes.labs + votes.games + votes.code;
    const getPercentage = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100));

    return (
        <div style={styles.container}>
            <h3>Qual é o seu laboratório ou jogo favorito?</h3>
            {!hasVoted ? (
                <form onSubmit={handleVote}>
                    <label style={styles.option}>
                        <input type="radio" name="poll" value="labs" onChange={(e) => setSelectedOption(e.target.value)} /> Laboratórios Visuais
                    </label>
                    <label style={styles.option}>
                        <input type="radio" name="poll" value="games" onChange={(e) => setSelectedOption(e.target.value)} /> Minijogos
                    </label>
                    <label style={styles.option}>
                        <input type="radio" name="poll" value="code" onChange={(e) => setSelectedOption(e.target.value)} /> Desafios de Código
                    </label>
                    <button type="submit" style={styles.button}>Votar</button>
                </form>
            ) : (
                <div>
                    <h4>Resultados da Enquete</h4>
                    <div>
                        <span>Labs Visuais: <strong>{getPercentage(votes.labs)}%</strong></span>
                        <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${getPercentage(votes.labs)}%` }}></div></div>
                    </div>
                    <div>
                        <span>Minijogos: <strong>{getPercentage(votes.games)}%</strong></span>
                        <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${getPercentage(votes.games)}%` }}></div></div>
                    </div>
                    <div>
                        <span>Desafios: <strong>{getPercentage(votes.code)}%</strong></span>
                        <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${getPercentage(votes.code)}%` }}></div></div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { background: '#121216', border: '1px solid #2a2a35', borderRadius: '12px', padding: '24px', color: '#f1f1f6', maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif' },
    option: { display: 'block', margin: '12px 0', cursor: 'pointer' },
    button: { background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    barContainer: { background: '#22222d', borderRadius: '6px', height: '10px', overflow: 'hidden', marginTop: '6px', marginBottom: '14px' },
    barFill: { background: 'linear-gradient(90deg, #4f46e5, #9333ea)', height: '100%', transition: 'width 0.4s ease' }
} satisfies Record<string, React.CSSProperties>;
