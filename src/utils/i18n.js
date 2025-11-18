// Internationalization strings
export const translations = {
    de: {
        // Header
        appTitle: 'Web Designer Finder',
        appSubtitle: 'Finde den nächsten Webdesigner für den Kunden',
        manageDesigners: 'Designer verwalten',

        // Designer Modal
        modalTitle: 'Designer verwalten',
        designerName: 'Designer Name',
        designerNamePlaceholder: 'Max Mustermann',
        address: 'Adresse',
        addressPlaceholder: 'Canettistraße 5, 1100 Wien',
        addDesigner: 'Designer hinzufügen',
        verifyingAddress: 'Adresse wird überprüft...',
        currentDesigners: 'Aktuelle Designer',
        noDesignersYet: 'Noch keine Designer hinzugefügt',
        removeDesigner: 'Designer entfernen',

        // Search Tab
        findDesigner: 'Designer finden',
        findDesignerSubtitle: 'Gib die Kundenadresse ein, um den nächsten Designer zu finden',
        customerAddress: 'Kundenadresse',
        customerAddressPlaceholder: 'Canettistraße 5, 1100 Wien',
        findClosestDesigner: 'Nächsten Designer finden',
        searching: 'Suche läuft...',

        // Search Results
        searchResults: 'Suchergebnisse',
        driveTime: 'Fahrzeit:',
        distance: 'Entfernung:',
        closest: 'Am nächsten',

        // Errors
        fillAllFields: 'Bitte alle Felder ausfüllen',
        addressNotFound: 'Adresse konnte nicht gefunden werden. Bitte versuche ein anderes Format.',
        errorOccurred: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
        enterCustomerAddress: 'Bitte gib eine Kundenadresse ein',
        noDesignersAvailable: 'Keine Designer verfügbar. Bitte füge zuerst Designer hinzu.',
        noRoutesCalculated: 'Konnte keine Routen zu Designern berechnen. Bitte versuche es erneut.',
        onlyAustria: 'DWD nur in Österreich verfügbar',

        // Footer
        poweredBy: 'Powered by Sandro',
    },
    en: {
        // Header
        appTitle: 'Web Designer Finder',
        appSubtitle: 'Find the closest web designer to your customers',
        manageDesigners: 'Manage Designers',

        // Designer Modal
        modalTitle: 'Manage Designers',
        designerName: 'Designer Name',
        designerNamePlaceholder: 'John Doe',
        address: 'Address',
        addressPlaceholder: '123 Main St, Vienna, Austria',
        addDesigner: 'Add Designer',
        verifyingAddress: 'Verifying Address...',
        currentDesigners: 'Current Designers',
        noDesignersYet: 'No designers added yet',
        removeDesigner: 'Remove designer',

        // Search Tab
        findDesigner: 'Find Designer',
        findDesignerSubtitle: 'Enter customer address to find the closest designer',
        customerAddress: 'Customer Address',
        customerAddressPlaceholder: 'Canettistraße 5, 1100 Wien',
        findClosestDesigner: 'Find Closest Designer',
        searching: 'Searching...',

        // Search Results
        searchResults: 'Search Results',
        driveTime: 'Drive Time:',
        distance: 'Distance:',
        closest: 'Closest',

        // Errors
        fillAllFields: 'Please fill in all fields',
        addressNotFound: 'Could not find the address. Please try a different format.',
        errorOccurred: 'An error occurred. Please try again.',
        enterCustomerAddress: 'Please enter a customer address',
        noDesignersAvailable: 'No designers available. Please add designers first.',
        noRoutesCalculated: 'Could not calculate routes to any designers. Please try again.',
        onlyAustria: 'DWD only available in Austria',

        // Footer
        poweredBy: 'Powered by Sandro',
    }
};

export function getTranslation(lang, key) {
    return translations[lang]?.[key] || translations['en'][key] || key;
}
