export const urlSearchParams = new URLSearchParams(window.location.search);

export const sourceURL = base64Convert(
  decodeURIComponent(urlSearchParams.get('source')?.replaceAll("+", "%2B") ?? ''),
  'decode'
);

// https://stackoverflow.com/a/8943487
export const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|)])/ig;

export function base64Convert(text, mode = 'encode') {
  if (mode === 'encode') {
    return btoa(encodeURIComponent(text));
  } else if (mode === 'decode') {
    try {
      const urlDecoded = decodeURIComponent(text); 
      return decodeURIComponent(atob(urlDecoded));
    } catch (e) {
      console.error("Base64 decode failed:", e);
      return null;
    }
  } else {
    throw new Error("Accept only 'encode' or 'decode'.");
  }
}