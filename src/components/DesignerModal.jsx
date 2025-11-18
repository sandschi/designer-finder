import { useState } from 'react';
import { useDesigners } from '../context/DesignerContext';
import { useLanguage } from '../context/LanguageContext';
import { geocodeAddress } from '../utils/geo';
import { getTranslation } from '../utils/i18n';
import { UserPlus, Trash2, MapPin, Loader, X } from 'lucide-react';

export default function DesignerModal({ isOpen, onClose }) {
    const { designers, addDesigner, removeDesigner } = useDesigners();
    const { language } = useLanguage();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const t = (key) => getTranslation(language, key);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !address.trim()) {
            setError(t('fillAllFields'));
            return;
        }

        setLoading(true);

        try {
            const coords = await geocodeAddress(address);

            if (!coords) {
                setError(t('addressNotFound'));
                setLoading(false);
                return;
            }

            await addDesigner({
                name: name.trim(),
                address: address.trim(),
                coords,
                displayAddress: coords.displayName
            });

            setName('');
            setAddress('');
        } catch (err) {
            setError(t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('modalTitle')}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X className="icon" />
                    </button>
                </div>

                <div className="modal-body">
                    <form className="designer-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">{t('designerName')}</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('designerNamePlaceholder')}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">{t('address')}</label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t('addressPlaceholder')}
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="icon spinner" />
                                    {t('verifyingAddress')}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="icon" />
                                    {t('addDesigner')}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="designers-list">
                        <h3>{t('currentDesigners')} ({designers.length})</h3>

                        {designers.length === 0 ? (
                            <div className="empty-state">
                                <MapPin className="empty-icon" />
                                <p>{t('noDesignersYet')}</p>
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
                                            title={t('removeDesigner')}
                                        >
                                            <Trash2 className="icon" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
