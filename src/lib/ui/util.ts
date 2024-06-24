export function scrollToBottom(element: HTMLElement | null) {
	if (element === null) {
		return;
	}

	element.scroll({
		top: element.scrollHeight
	});
}
