/**
 * Formats a 10-digit phone number as (XXX) XXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
    if (!value) return value;

    // Clean the input to only numbers
    const phoneNumber = value.replace(/[^\d]/g, "");

    // Limit to 10 digits
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

/**
 * Validates if a phone number string (formatted or unformatted) has exactly 10 digits
 */
export function isValidCanadianPhone(value: string): boolean {
    if (!value) return false;
    const digits = value.replace(/[^\d]/g, "");
    return digits.length === 10;
}
