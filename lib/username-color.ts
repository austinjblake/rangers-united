function hashString(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return hash;
}

export function generateColor(username: string) {
	const hash = hashString(username);
	const hue = hash % 360; // Use modulo to ensure hue is between 0-359
	return `hsl(${hue}, 70%, 50%)`; // Use HSL for consistent brightness
}
