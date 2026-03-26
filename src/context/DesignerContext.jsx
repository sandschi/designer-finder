import { createContext, useContext, useState, useEffect } from 'react';

const DesignerContext = createContext();

// Use relative path /api in production (proxied by nginx), localhost for dev
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export function DesignerProvider({ children }) {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load designers from backend on mount
    useEffect(() => {
        fetchDesigners();
    }, []);

    const fetchDesigners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/designers`);
            if (!response.ok) throw new Error('Failed to fetch designers');
            const data = await response.json();
            setDesigners(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching designers:', err);
            setError('Failed to load designers');
        } finally {
            setLoading(false);
        }
    };

    const value = {
        designers,
        loading,
        error,
        refreshDesigners: fetchDesigners
    };

    return (
        <DesignerContext.Provider value={value}>
            {children}
        </DesignerContext.Provider>
    );
}

export function useDesigners() {
    const context = useContext(DesignerContext);
    if (!context) {
        throw new Error('useDesigners must be used within DesignerProvider');
    }
    return context;
}
