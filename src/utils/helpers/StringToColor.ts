export function nameToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  const saturation = 80;
  const lightness = 45;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
