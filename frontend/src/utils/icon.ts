/**
 * Zwraca bezpieczny do wyświetlenia pojedynczy znak ikony (obsługuje emoji wielobajtowe).
 * Chroni przed przypadkami, gdy pole ikony zawiera dłuższy tekst (stare dane, błędny input) —
 * zamiast przelewać się poza kontener, zawsze pokazujemy dokładnie jeden "grapheme".
 */
export const getDisplayIcon = (icon: string | undefined, fallback: string): string => {
  if (!icon) return fallback;
  const chars = Array.from(icon.trim());
  return chars.length > 0 ? chars[0] : fallback;
};
