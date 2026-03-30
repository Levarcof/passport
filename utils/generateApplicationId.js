/**
 * Generates a unique Application ID in the format: PS-YYYY-XXXX
 * Example: PS-2026-8392
 */
export const generateApplicationId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `PS-${year}-${random}`;
};
