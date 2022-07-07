export function sanitize(input, config={upper:false, lower:false}) {
	let output = input.trim();
	if (config.lower)
		output = output.toLowerCase();
	if (config.upper)
		output = output.toUpperCase();
	return output;
};

export function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};