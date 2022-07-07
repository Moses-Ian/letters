module.exports = {
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`;
  },
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },
	format_url: url => {
		return url
			.replace('http://', '')
			.replace('https://', '')
			.replace('www.', '')
			.split('/')[0]
			.split('?')[0];
	},

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
	sanitize(input, config={upper:false, lower:false}) {
		let output = input.trim();
		if (config.lower)
			output = output.toLowerCase();
		if (config.upper)
			output = output.toUpperCase();
		return output;
	}


}