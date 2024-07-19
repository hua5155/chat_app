export function scrollToBottom(element: HTMLElement | null | string) {
	if (element === null) {
		return;
	}

	if (typeof element === 'string') {
		document.getElementById(element)?.scroll({
			top: document.getElementById(element)!.scrollHeight
		});
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
