// Geocoding and routing utilities using OpenStreetMap services

/**
 * Geocode an address to coordinates using Nominatim
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lon: number, countryCode: string} | null>}
 */
export async function geocodeAddress(address) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'WebDesignerFinder/1.0'
                }
            }
        );

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name,
                countryCode: data[0].address?.country_code?.toLowerCase()
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Get route information between two points using OSRM
 * @param {object} start - {lat, lon}
 * @param {object} end - {lat, lon}
 * @returns {Promise<{duration: number, distance: number} | null>}
 */
export async function getRoute(start, end) {
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`
        );

        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            return {
                duration: data.routes[0].duration, // in seconds
                distance: data.routes[0].distance  // in meters
            };
        }

        return null;
    } catch (error) {
        console.error('Routing error:', error);
        return null;
    }
}

/**
 * Format duration in seconds to human-readable format
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Format distance in meters to human-readable format
 * @param {number} meters
 * @returns {string}
 */
export function formatDistance(meters) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
}
