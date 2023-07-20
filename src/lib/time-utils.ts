export function prettyFormatTime(time: string | number): string {
	const uploadTime = new Date(time);
	const currentTime = new Date();
	const diff = currentTime - uploadTime;
	if (diff <= 1000 * 60 * 60) {
		return ` ${Math.round(diff / 1000 / 60)} minutes ago`;
	}
	if (diff <= 1000 * 60 * 60 * 24) {
		return ` ${Math.round(diff / 1000 / 60 / 60)} hours ago`;
	}
	return time;
}
