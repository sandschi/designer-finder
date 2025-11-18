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

    const addDesigner = async (designer) => {
        try {
            const response = await fetch(`${API_URL}/designers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(designer)
            });
            if (!response.ok) throw new Error('Failed to add designer');
            const newDesigner = await response.json();
            setDesigners(prev => [...prev, newDesigner]);
            return newDesigner;
        } catch (err) {
            console.error('Error adding designer:', err);
            throw err;
        }
    };

    const removeDesigner = async (id) => {
        try {
            const response = await fetch(`${API_URL}/designers/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete designer');
            setDesigners(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error('Error removing designer:', err);
            throw err;
        }
    };

    const value = {
        designers,
        addDesigner,
        removeDesigner,
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
