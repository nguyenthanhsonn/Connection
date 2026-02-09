// src/utils/random-username.ts

/**
 * Sinh username ngẫu nhiên
 * @param prefix prefix mặc định ("user")
 * @param length số ký tự random (mặc định 6)
 */
export function generateRandomUsername(prefix = 'user', length = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}_${randomPart}`;
}

/**
 * Sinh username từ email + random
 * @param email email người dùng
 * @param length số ký tự random (mặc định 4)
 */
export function generateUsernameFromEmail(email: string, length = 4): string {
    const namePart = email.split('@')[0]; // lấy phần trước @
    return generateRandomUsername(namePart, length);
}
