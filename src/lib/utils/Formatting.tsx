

/**
 * Helper function to sanitize a string
 * @param string 
 * @param options 
 * @returns 
 */
export const sanitizeString = (
    string: string,
    options: {
        allowNumbers?: boolean;
        allowSpecialChars?: boolean;
        capitalize: boolean;
    }
) => {
    
    let sanitizedString = (string || '').toString();
    
    if (!options.allowNumbers) {
        sanitizedString = sanitizedString.replace(/[0-9]/g, '');
    } 

    if (!options.allowSpecialChars) {
        sanitizedString = sanitizedString.replace(/[^a-zA-Z0-9\s]/g, '');
    } 

    if (options.capitalize) {
        sanitizedString = sanitizedString.toUpperCase();
    }

    return sanitizedString;
};