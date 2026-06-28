export default function unwaste_compile(str, uniqueResult = true) {
    let chars = [];
    let cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cells_used = [true, false, false, false, false, false, false, false, false, false];
    let result = "";
    if (uniqueResult) {
        result += "0#";
    }
    str.split("").forEach((chr) => {
        chars.push(chr.charCodeAt(0));
    });
    let lastMostCloseIndex = 0;
    let snippet = "";
    let lastSnippet = "";
    let snippetCnt = 1;
    let mostCloseIdxType = ".";
    function handleSnippet() {
        if (result.endsWith(lastSnippet)) {
            result = result.slice(0, -lastSnippet.length);
            snippetCnt += 1;
        }
        if (lastSnippet.length == 1 && snippetCnt <= 7) {
            result += lastSnippet.repeat(snippetCnt);
        }
        else {
            let binSnippetCnt = snippetCnt.toString(2).split("");
            let last = binSnippetCnt.pop();
            result += "[".repeat(binSnippetCnt.length);
            binSnippetCnt.forEach((car) => {
                if (car == "1") {
                    result += lastSnippet + "]";
                }
                else {
                    result += "]";
                }
            });
            if (last == "1") {
                result += lastSnippet;
            }
        }
    }
    chars.forEach((num) => {
        snippet = "";
        if (num == 10) {
            snippet += ":";
        }
        else {
            // find the most close number in these cells
            let cellIndex = 0;
            let mostClose = Number.MAX_VALUE;
            let mostCloseIndex = 0;
            cells.forEach((cellnum) => {
                if (Math.abs(cellnum - num) < Math.abs(mostClose)) {
                    mostClose = cellnum - num;
                    mostCloseIndex = cellIndex;
                    mostCloseIdxType = ".";
                }
                if (!isNaN(parseInt(String.fromCharCode(num)))) {
                    const charnum = parseInt(String.fromCharCode(num));
                    if (Math.abs(cellnum - charnum) < Math.abs(mostClose)) {
                        mostClose = cellnum - charnum;
                        mostCloseIndex = cellIndex;
                        mostCloseIdxType = "%";
                    }
                }
                cellIndex += 1;
            });
            if (lastMostCloseIndex != mostCloseIndex) {
                snippet += String(mostCloseIndex);
                if (uniqueResult && (!cells_used[mostCloseIndex])) {
                    cells_used[mostCloseIndex] = true;
                    snippet += "#";
                }
            }
            lastMostCloseIndex = mostCloseIndex;
            const opr = mostClose > 0 ? "-" : "+";
            let numa = Math.abs(mostClose);
            if (numa <= 7) {
                snippet += opr.repeat(numa);
            }
            else {
                let snuma = numa.toString(2).split("");
                let last = snuma.pop();
                snippet += "[".repeat(snuma.length);
                snuma.forEach((car) => {
                    if (car == "1") {
                        snippet += opr + "]";
                    }
                    else {
                        snippet += "]";
                    }
                });
                if (last == "1") {
                    snippet += opr;
                }
            }
            cells[mostCloseIndex] = mostCloseIdxType == "." ? num : parseInt(String.fromCharCode(num));
            snippet += mostCloseIdxType;
        }
        if (snippet == lastSnippet) {
            snippetCnt += 1;
        }
        else {
            if (lastSnippet != "") {
                handleSnippet();
            }
            snippetCnt = 1;
            lastSnippet = snippet;
        }
    });
    handleSnippet();
    return result;
}
//# sourceMappingURL=unwaste.js.map