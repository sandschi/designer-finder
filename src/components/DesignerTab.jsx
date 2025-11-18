import { useState } from 'react';
import { useDesigners } from '../context/DesignerContext';
import { geocodeAddress } from '../utils/geo';
import { UserPlus, Trash2, MapPin, Loader } from 'lucide-react';

export default function DesignerTab() {
    const { designers, addDesigner, removeDesigner } = useDesigners();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !address.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const coords = await geocodeAddress(address);

            if (!coords) {
                setError('Could not find the address. Please try a different format.');
                setLoading(false);
                return;
            }

            addDesigner({
                name: name.trim(),
                address: address.trim(),
                coords,
                displayAddress: coords.displayName
            });

            setName('');
            setAddress('');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="designer-tab">
            <div className="tab-header">
                <h2>Designer Management</h2>
                <p>Add and manage your web designers</p>
            </div>

            <form className="designer-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Designer Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, Berlin, Germany"
                        disabled={loading}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader className="icon spinner" />
                            Verifying Address...
                        </>
                    ) : (
                        <>
                            <UserPlus className="icon" />
                            Add Designer
                        </>
                    )}
                </button>
            </form>

            <div className="designers-list">
                <h3>Current Designers ({designers.length})</h3>

                {designers.length === 0 ? (
                    <div className="empty-state">
                        <MapPin className="empty-icon" />
                        <p>No designers added yet</p>
                    </div>
                ) : (
                    <div className="designer-cards">
                        {designers.map((designer) => (
                            <div key={designer.id} className="designer-card">
                                <div className="designer-info">
                                    <h4>{designer.name}</h4>
                                    <p className="designer-address">
                                        <MapPin className="icon-small" />
                                        {designer.displayAddress || designer.address}
                                    </p>
                                </div>
                                <button
                                    className="btn-delete"
                                    onClick={() => removeDesigner(designer.id)}
                                    title="Remove designer"
                                >
                                    <Trash2 className="icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
