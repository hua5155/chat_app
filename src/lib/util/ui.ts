export function scrollToBottom(element: HTMLElement | null) {
	if (element === null) {
		return;
	}

	element.scroll({
		top: element.scrollHeight
	});
}

export function setFocus(element: HTMLElement | null | string) {
	if (element === null) {
		return;
	}

	if (typeof element === 'string') {
		document.getElementById(element)?.focus();
		return;
	}

	element.focus();
}
