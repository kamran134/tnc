/**
 * Recursively removes empty strings, null, undefined, and empty arrays from an object.
 * This ensures that the backend validation doesn't fail on empty optional fields.
 * 
 * @param obj - The object to clean
 * @returns A new object with empty values removed
 */
export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Skip null, undefined, empty strings
      if (value === null || value === undefined || value === '') {
        continue;
      }

      // Handle arrays
      if (Array.isArray(value)) {
        // Remove empty arrays
        if (value.length === 0) {
          continue;
        }

        // Clean each item in the array
        const cleanedArray = value
          .map((item: any) => {
            if (typeof item === 'object' && item !== null) {
              return removeEmptyFields(item);
            }
            return item;
          })
          .filter((item: any) => {
            // Remove items that are empty objects, null, undefined, or empty strings
            if (item === null || item === undefined || item === '') {
              return false;
            }
            if (typeof item === 'object' && Object.keys(item).length === 0) {
              return false;
            }
            return true;
          });

        // Only include array if it has items after cleaning
        if (cleanedArray.length > 0) {
          result[key] = cleanedArray;
        }
      }
      // Handle nested objects
      else if (typeof value === 'object') {
        const cleanedObject = removeEmptyFields(value);
        // Only include object if it has properties after cleaning
        if (Object.keys(cleanedObject).length > 0) {
          result[key] = cleanedObject;
        }
      }
      // Handle primitive values (strings, numbers, booleans)
      else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Cleans translation objects specifically.
 * Removes translations that have no meaningful content (all fields are empty).
 * 
 * @param translations - Array of translation objects
 * @returns Cleaned array of translations
 */
export function cleanTranslations<T extends { languageCode: string }>(
  translations: T[]
): T[] {
  return translations
    .map(translation => removeEmptyFields(translation) as T)
    .filter(translation => {
      // Keep translation if it has more than just languageCode
      const keys = Object.keys(translation);
      return keys.length > 1 || (keys.length === 1 && keys[0] !== 'languageCode');
    });
}
