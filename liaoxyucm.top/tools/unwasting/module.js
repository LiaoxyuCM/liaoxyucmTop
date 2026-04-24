function unwaste_compile(str) {
	let chars = [];
	let cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let result = '';
	str.split('').forEach((chr) => {
		chars.push(chr.charCodeAt(0));
	});
	let lastMostCloseIndex = 0;

	chars.forEach((num) => {
		// find the most close number in these cells
		let cellIndex = 0;
		let mostClose = Number.MAX_VALUE;
		let mostCloseIndex = 0;
		cells.forEach((cellnum) => {
			if (Math.abs(cellnum - num) < mostClose) {
				mostClose = Math.abs(cellnum - num)
				mostCloseIndex = cellIndex
			}
			cellIndex += 1;
		})
		if (lastMostCloseIndex != mostCloseIndex) {
			result += `${mostCloseIndex}`;
		};
		lastMostCloseIndex = mostCloseIndex
		

		if (cells[mostCloseIndex] > num) {

			let numa = (cells[mostCloseIndex] - num).toString(2);
			result += '['.repeat(numa.length-1);
			let snuma = numa.split('')
			let last = snuma.pop()
								
			snuma.forEach((car) => {
				if (car == '1') {
					result += '-]'
				} else {
					result += ']'
				}
			});
			if (last == '1') {
				result += '-'
			}
		} else if (cells[mostCloseIndex] < num) {
			let numa = (num - cells[mostCloseIndex]).toString(2);
			result += '['.repeat(numa.length-1);
			let snuma = numa.split('')
			let last = snuma.pop()
								
			snuma.forEach((car) => {
				if (car == '1') {
					result += '+]'
				} else {
					result += ']'
				}
			});
			if (last == '1') {
				result += '+'
			}
		};
		cells[mostCloseIndex] = num;
		result += ".";
	})
	return result;
}