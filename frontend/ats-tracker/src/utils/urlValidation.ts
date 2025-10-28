/**
 * URL Validation Utility
 * Centralized validation for URL fields across the application
 * Uses RFC 3986 compliant regex pattern matching backend Joi.uri() validation
 */

export interface UrlValidationOptions {
  allowEmpty?: boolean; // Allow empty/null URLs (for optional fields)
  requireHttps?: boolean; // Require https:// protocol
  allowedProtocols?: string[]; // Restrict to specific protocols
}

/**
 * Comprehensive URL regex pattern (RFC 3986 compliant)
 * Matches http/https URLs with optional protocol, domain, port, path, query, and fragment
 */
const URL_REGEX = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[^\s]*)?$/i;

/**
 * Validates if a string is a valid URL using regex pattern
 * @param url - The URL string to validate
 * @param options - Validation options
 * @returns true if valid, false otherwise
 */
export function isValidUrl(
  url: string | null | undefined,
  options: UrlValidationOptions = {}
): boolean {
  const {
    allowEmpty = true,
    requireHttps = false,
    allowedProtocols = ["http", "https"],
  } = options;

  // Handle empty/null/undefined values
  if (!url || url.trim() === "") {
    return allowEmpty;
  }

  const trimmedUrl = url.trim();

  // Test against URL regex pattern
  if (!URL_REGEX.test(trimmedUrl)) {
    return false;
  }

  // Check protocol requirements if URL starts with protocol
  const protocolMatch = trimmedUrl.match(/^(https?):\/\//i);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    
    // Check if protocol is in allowed list
    if (!allowedProtocols.includes(protocol)) {
      return false;
    }

    // Check for HTTPS requirement
    if (requireHttps && protocol !== "https") {
      return false;
    }
  } else if (requireHttps) {
    // If HTTPS is required but no protocol specified, it's invalid
    return false;
  }

  return true;
}

/**
 * Get a user-friendly error message for invalid URLs
 * @param fieldName - Name of the field being validated
 * @returns Error message string
 */
export function getUrlErrorMessage(fieldName: string = "URL"): string {
  return `Please enter a valid ${fieldName} (e.g., https://example.com)`;
}

/**
 * Attempts to fix common URL issues by adding protocol if missing
 * @param url - The URL string to fix
 * @returns Fixed URL string or original if already valid
 */
export function normalizeUrl(url: string | null | undefined): string {
  if (!url || url.trim() === "") {
    return "";
  }

  const trimmed = url.trim();

  // If it already has a protocol, return as-is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If it starts with //, add https:
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Otherwise, add https:// prefix
  return `https://${trimmed}`;
}

