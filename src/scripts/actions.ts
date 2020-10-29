export function isEmpty(field: string): boolean {
	if (field == undefined || field == null) return true;
	const quantSpaces = field.length - field.replace(" ", "").length;
	return quantSpaces == field.length;
}

export function justify(
	str: string,
	width: number,
	fillChar: string = " ",
	side: "left" | "right" = "left"
): string {
	if (str.length >= width) return str;

	const missingLength = width - str.length;

	let toFit = fillChar.repeat(missingLength).substr(0, missingLength);

	if (side == "right") return toFit + str;
	else return str + toFit;
}
