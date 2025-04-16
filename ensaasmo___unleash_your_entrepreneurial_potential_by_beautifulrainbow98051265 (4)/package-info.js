/**
 * Package Information Handler
 * This script manages the package information for users based on their purchased package
 */

// Function to store package information in session storage
function storePackageInfo(packageName) {
    // Determine if this is a professional package
    const isProfessional = packageName.toLowerCase().includes('professional');

    // Store the package name and its features
    const packageInfo = {
        name: packageName,
        // Number of key development areas based on package
        keyDevelopmentAreas: isProfessional ? 7 : 3,
        // Whether the user has access to premium resources
        hasPremiumAccess: isProfessional,
        // Store the timestamp for when the package was purchased
        purchaseDate: new Date().toISOString()
    };

    // Store in session storage
    sessionStorage.setItem('packageInfo', JSON.stringify(packageInfo));

    return packageInfo;
}

// Function to get package information from session storage
function getPackageInfo() {
    const packageInfoJSON = sessionStorage.getItem('packageInfo');

    if (packageInfoJSON) {
        return JSON.parse(packageInfoJSON);
    }

    // Default to Foundation package if no package info is found
    return {
        name: 'Foundation Package',
        keyDevelopmentAreas: 3,
        purchaseDate: new Date().toISOString()
    };
}

// Function to get the number of key development areas based on the package
function getKeyDevelopmentAreasCount() {
    const packageInfo = getPackageInfo();
    return packageInfo.keyDevelopmentAreas;
}

// Function to check if the user has premium access
function hasPremiumAccess() {
    const packageInfo = getPackageInfo();
    return packageInfo.hasPremiumAccess || false;
}

// Function to store user information in session storage
function storeUserInfo(userInfo) {
    // Store the user information
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    return userInfo;
}

// Function to get user information from session storage
function getUserInfo() {
    const userInfoJSON = sessionStorage.getItem('userInfo');

    if (userInfoJSON) {
        return JSON.parse(userInfoJSON);
    }

    // Default to generic user info if none is found
    return {
        fullName: 'Aspiring Entrepreneur',
        email: '',
        phone: '',
        state: '',
        lga: ''
    };
}
