import { useState } from 'react';
import { useDesigners } from '../context/DesignerContext';
import { useLanguage } from '../context/LanguageContext';
import { geocodeAddress, getRoute, formatDuration, formatDistance } from '../utils/geo';
import { getTranslation } from '../utils/i18n';
import { Search, MapPin, Clock, Navigation, Loader, AlertCircle } from 'lucide-react';

export default function SearchTab() {
    const { designers } = useDesigners();
    const { language } = useLanguage();
    const [customerAddress, setCustomerAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const t = (key) => getTranslation(language, key);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setResults(null);

        if (!customerAddress.trim()) {
            setError(t('enterCustomerAddress'));
            return;
        }

        if (designers.length === 0) {
            setError(t('noDesignersAvailable'));
            return;
        }

        setLoading(true);

        try {
            // Geocode customer address
            const customerCoords = await geocodeAddress(customerAddress);

            if (!customerCoords) {
                setError(t('addressNotFound'));
                setLoading(false);
                return;
            }

            // Check if address is in Austria
            if (customerCoords.countryCode !== 'at') {
                setError(t('onlyAustria'));
                setLoading(false);
                return;
            }

            // Calculate routes to all designers
            const routePromises = designers.map(async (designer) => {
                const route = await getRoute(designer.coords, customerCoords);
                return {
                    designer,
                    route,
                    error: !route
                };
            });

            const routeResults = await Promise.all(routePromises);

            // Filter out failed routes and sort by duration
            const validResults = routeResults
                .filter(r => !r.error)
                .sort((a, b) => a.route.duration - b.route.duration);

            if (validResults.length === 0) {
                setError(t('noRoutesCalculated'));
                setLoading(false);
                return;
            }

            setResults({
                customerAddress: customerCoords.displayName || customerAddress,
                designers: validResults
            });
        } catch (err) {
            console.error('Search error:', err);
            setError(t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-tab">
            <div className="tab-header">
                <h2>{t('findDesigner')}</h2>
                <p>{t('findDesignerSubtitle')}</p>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
                <div className="form-group">
                    <label htmlFor="customer-address">{t('customerAddress')}</label>
                    <input
                        id="customer-address"
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder={t('customerAddressPlaceholder')}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle className="icon-small" />
                        {error}
                    </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader className="icon spinner" />
                            {t('searching')}
                        </>
                    ) : (
                        <>
                            <Search className="icon" />
                            {t('findClosestDesigner')}
                        </>
                    )}
                </button>
            </form>

            {results && (
                <div className="search-results">
                    <div className="results-header">
                        <h3>{t('searchResults')}</h3>
                        <p className="customer-location">
                            <MapPin className="icon-small" />
                            {results.customerAddress}
                        </p>
                    </div>

                    <div className="results-list">
                        {results.designers.map(({ designer, route }, index) => (
                            <div
                                key={designer.id}
                                className={`result-card ${index === 0 ? 'closest' : ''}`}
                            >
                                {index === 0 && (
                                    <div className="badge">{t('closest')}</div>
                                )}

                                <div className="result-header">
                                    <h4>{designer.name}</h4>
                                    <div className="result-rank">#{index + 1}</div>
                                </div>

                                <div className="result-details">
                                    <div className="detail-item">
                                        <MapPin className="icon-small" />
                                        <span>{designer.displayAddress || designer.address}</span>
                                    </div>

                                    <div className="result-metrics">
                                        <div className="metric">
                                            <Clock className="icon-small" />
                                            <span className="metric-label">{t('driveTime')}</span>
                                            <span className="metric-value">{formatDuration(route.duration)}</span>
                                        </div>

                                        <div className="metric">
                                            <Navigation className="icon-small" />
                                            <span className="metric-label">{t('distance')}</span>
                                            <span className="metric-value">{formatDistance(route.distance)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
