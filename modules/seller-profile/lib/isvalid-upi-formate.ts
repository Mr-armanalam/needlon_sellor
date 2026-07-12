export function isValidUpiFormat(upiId:string) {
    if (!upiId) return false;

    // Regex logic: 2-256 alphanumeric characters/dots/hyphens before @, 2-64 characters after @
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    return upiRegex.test(upiId.trim());
}
