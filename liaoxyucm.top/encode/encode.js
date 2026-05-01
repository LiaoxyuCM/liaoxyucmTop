const jisgreen_encryption_type = {
	"encryption": {
		"JisGreen": ["JisGren", "JisGreen", "JisGreeen"],
		"JiShi": ["JiSi", "JiShi", "JiShhi"],
		"JisKotlin": ["JisKotin", "JisKotlin", "JisKootlin"],
		"JisMua": ["JisMa", "JisMua", "JisMuua"],
		"ExcuseBox": ["ExcuseBx", "ExcuseBox", "ExcuseBoox"],
		"Xxx": ["Xx", "Xxx", "Xxxx"],
		"YYBH": ["YBH", "YYBH", "YYYBH"],
		"LTFH": ["LTF", "LTFH", "LTFHH"],
		"BJWX": ["BJW", "BJWX", "BJWXX"],
		"JisRmb": ["JisRb", "JisRmb", "JisRmmb"],
		"JisBo": ["JisB", "JisBo", "JisBoo"],
		"JisW": ["Jis", "JisW", "JisWw"],
		"JisSkyline": ["JisSkylne", "JisSkyline", "JisSkyliine"],
		"Reallove": ["Realove", "Reallove", "Realllove"],
		"N1010": ["0", "1", "."]
	},
	"decryption": {
		"JisGreen": [/JisGren/g, /JisGreen/g, /JisGreeen/g],
		"JiShi": [/JiSi/g, /JiShi/g, /JiShhi/g],
		"JisKotlin": [/JisKotin/g, /JisKotlin/g, /JisKootlin/g],
		"JisMua": [/JisMa/g, /JisMua/g, /JisMuua/g],
		"ExcuseBox": [/ExcuseBx/g, /ExcuseBox/g, /ExcuseBoox/g],
		"Xxx": [/Xx/g, /Xxx/g, /Xxxx/g],
		"YYBH": [/YBH/g, /YYBH/g, /YYYBH/g],
		"LTFH": [/LTF/g, /LTFH/g, /LTFHH/g],
		"BJWX": [/BJW/g, /BJWX/g, /BJWXX/g],
		"JisRmb": [/JisRb/g, /JisRmb/g, /JisRmmb/g],
		"JisBo": [/JisB/g, /JisBo/g, /JisBoo/g],
		"JisW": [/Jis/g, /JisW/g, /JisWw/g],
		"JisSkyline": [/JisSkylne/g, /JisSkyline/g, /JisSkyliine/g],
		"Reallove": [/Realove/g, /Reallove/g, /Realllove/g],
		"N1010": [/0/g, /1/g, /\./g]
	}
}


const jisgreen_encrypt = (original_text, type = "JisGreen") => {
	let l = ""
	for (let i of original_text){
		l += i.charCodeAt(0).toString(2) + " "
	}
	l =  l.replace(/ /g, jisgreen_encryption_type["encryption"][type][2]).replace(/1/g, jisgreen_encryption_type["encryption"][type][1]).replace(/0/g, jisgreen_encryption_type["encryption"][type][0])
	return l
}

const jisgreen_decrypt = (original_text, type = "JisGreen") => {
	let l = original_text.replace(jisgreen_encryption_type["decryption"][type][2], " ").replace(jisgreen_encryption_type["decryption"][type][1], "1").replace(jisgreen_encryption_type["decryption"][type][0], "0").slice(0, -1)

	j = l.split(" ")

	let res = ""
	for (let element of j){
		res += String.fromCharCode(parseInt(element, 2))
	}
	return res
}

const utf8ToBase64 = (str) => {
	const bytes = new TextEncoder().encode(str);
	const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
	return btoa(binString);
}

const base64ToUtf8 = (base64) => {
	const binString = atob(base64);
	const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

const jis2_encrypt = (original_text, zero_width_required = true) => {
	const zero_width = '\u200B';
	function insertBetween(str){
		return str.split('').map(ch=>zero_width+ch).join('')+zero_width;
	}
	const raw = original_text;
	const b64 = utf8ToBase64(raw);
	const rev = b64.split('').reverse().join('');
	const part1 = zero_width_required ? insertBetween('[JIS2]' ) : "[JIS2]";
	const part2 = zero_width_required ? insertBetween('abcdefghijklmnopqrstuvwxyz') : 'abcdefghijklmnopqrstuvwxyz';
	const part3 = zero_width_required ? insertBetween('@jisgreen#kotlinbox') : '@jisgreen#kotlinbox';
	let out = part1+(zero_width_required ? insertBetween(rev) : rev)+part2+part3;
	if(out.length>1000){
		out = out.slice(0,1000)+(zero_width_required ?  out.slice(1000).replaceAll(zero_width,'') : out.slice(1000));
	}
	return out
}

const jis2_decrypt = (encrypted_text) => {
	try {
		const zero_width = '\u200B';

		const withoutZ = encrypted_text.replaceAll(zero_width, '');
		const part1 = '[JIS2]';
		const part2 = 'abcdefghijklmnopqrstuvwxyz';
		const part3 = '@jisgreen#kotlinbox';
		let base64Part = withoutZ;
		if (base64Part.startsWith(part1)) {
			base64Part = base64Part.slice(part1.length);
		}
		if (base64Part.endsWith(part3)) {
			base64Part = base64Part.slice(0, -part3.length);
		}
		if (base64Part.endsWith(part2)) {
			base64Part = base64Part.slice(0, -part2.length);
		}
		const reversedBase64 = base64Part.split('').reverse().join('');
		let validBase64 = reversedBase64;
		while (validBase64.length % 4 !== 0) {
			validBase64 += '=';
		}

		const decoded = base64ToUtf8(validBase64);
		return decoded;
	} catch (e) {
		return "JIS2 Syntax Error"
	}
};



function urlEnc(s) { return encodeURIComponent(s); }
function urlDec(s) { try { return decodeURIComponent(s); } catch { return 'URL 格式错误'; } }

function getHashFunc(hashmethod) {
	return async(s) => {
		const msg = new TextEncoder().encode(s);
		const hash = await crypto.subtle.digest(hashmethod, msg);
		return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');

	}
}

function offsetEncrypt(str) {
	return str.split('').map(c => {
		return String.fromCharCode(c.charCodeAt(0) + 1);
	}).join('');
}
function offsetDecrypt(str) {
	return str.split('').map(c => {
		return String.fromCharCode(c.charCodeAt(0) - 1);
	}).join('');
}
function reverseStr(str) {
	return str.split('').reverse().join('');
}

function decodeDataUrl(g) {
	const base64 = g.replace(/^data:text\/plain;base64,/, "");
	return base64ToUtf8(base64);
}

function encodeBase16(str) {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(str);
	return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function decodeBase16(hex) {
	if (hex.length % 2 !== 0) return "十六进制字符串无效";
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i/2] = parseInt(hex.substring(i, i+2), 16);
	}
	return new TextDecoder().decode(bytes);
}

let lvqichonglist = ["吕","齐","冲","其"]
let lvqichongcodedict = {
	"0": [0, 0],
	"1": [0, 1],
	"2": [0, 2],
	"3": [0, 3],
	"4": [1, 0],
	"5": [1, 1],
	"6": [1, 2],
	"7": [1, 3],
	"8": [2, 0],
	"9": [2, 1],
	"a": [2, 2],
	"b": [2, 3],
	"c": [3, 0],
	"d": [3, 1],
	"e": [3, 2],
	"f": [3, 3],
}

const lqcreverseDict = {};
for (const [hexChar, [idx1, idx2]] of Object.entries(lvqichongcodedict)) {
	const key = lvqichonglist[idx1] + lvqichonglist[idx2];
	lqcreverseDict[key] = hexChar;
}

function lvQiChongEncode(s) {
	let base16ed_text = encodeBase16(s);
	let result = "";
	base16ed_text.split('').forEach((c) => {
		result += lvqichonglist[lvqichongcodedict[c][0]]+lvqichonglist[lvqichongcodedict[c][1]]
	})
	return result
}

function lvQiChongDecode(encodedStr) {
	if (encodedStr.length % 2 !== 0) {
		return "解密失败：密文长度无效";
	}

	let hexStr = "";
	for (let i = 0; i < encodedStr.length; i += 2) {
		const pair = encodedStr.substring(i, i + 2);
		const hexChar = lqcreverseDict[pair];
		if (!hexChar) {
			return "解密失败：包含无效密文字符";
		}
		hexStr += hexChar;
	}

	return decodeBase16(hexStr);
}

function cardShuffle(s) {
	if ( s === "" ) { return "" }
	else {
		let toggle = true;
		let ars = "";
		let brs = "";
		s.split('').forEach((c)=> {
			if (toggle) { ars += c }
			else { brs += c }
			toggle = !toggle
		})
		return ars + brs
	}
}

function cardUnshuffle(s) {
	if (s === "") return "";
	const mid = Math.ceil(s.length / 2);
	const ars = s.slice(0, mid);
	const brs = s.slice(mid);
	let result = "";
	for (let i = 0; i < mid; i++) {
		if (i < ars.length) result += ars[i];
		if (i < brs.length) result += brs[i];
	}
	return result;
}

let bchoo = { //这名字乱起的哈哈
	"b64": {
		"en": utf8ToBase64,
		"de": base64ToUtf8,
		"is_hash": false
	},
	"b16": {
		"en": encodeBase16,
		"de": decodeBase16,
		"is_hash": false
	},
	"url": {
		"en": urlEnc,
		"de": urlDec,
		"is_hash": false
	},
	"sha1": {
		"en": getHashFunc("SHA-1"),
		"de": (_) => {return "哈希无法被解密"},
		"is_hash": true
	},
	"sha256": {
		"en": getHashFunc("SHA-256"),
		"de": (_) => {return "哈希无法被解密"},
		"is_hash": true
	},
	"sha512": {
		"en": getHashFunc("SHA-512"),
		"de": (_) => {return "哈希无法被解密"},
		"is_hash": true
	},
	"off": {
		"en": offsetEncrypt,
		"de": offsetDecrypt,
		"is_hash": false
	},
	"jge": {
		"en": jisgreen_encrypt,
		"de": jisgreen_decrypt,
		"is_hash": false,
		"custom_text": "JGE, JisGreen Encryption 是2025年11月的项目，现已停更。\n该加密效果不理想，密文长度甚至比明文长度高出52~137倍\n变体JisSkyline是66~171倍"
	},
	"jis2": {
		"en": jis2_encrypt,
		"de": jis2_decrypt,
		"is_hash": false,
		"custom_text": "此为纪青（陈青陌）在开发KotlinBox时自创的加密算法，请支持他\n庆幸的是，我还有JIS2加密实现的留档"
	},
	"lvqichong": {
		"en": lvQiChongEncode,
		"de": lvQiChongDecode,
		"is_hash": false,
		"custom_text": "吕齐冲是我们班的同学，而吕齐冲加解密是自创的Base16的变体"
	},
	"reverse": {
		"en": reverseStr,
		"de": reverseStr,
		"is_hash": false
	},
	"cardshuffle": {
		"en": cardShuffle,
		"de": cardUnshuffle,
		"is_hash": false,
		"custom_text": "原文内容数量过小或字符种数过少，效果就不理想\n该加密适用于代码和文章"
	},
	"dataurl": {
		"en": (g) => {return "data:text/plain;base64," + utf8ToBase64(g)},
		"de": decodeDataUrl,
		"is_hash": false
	}
}

function isAsyncFunction(fn) {
  return fn?.constructor?.name === 'AsyncFunction';
}

let setmethod = "b64";

function method(mtd) {
	setmethod = mtd;
	document.querySelectorAll(".method").forEach(e => e.classList.remove("selected"));
	document.querySelector(`.mtd-${mtd}`).classList.add("selected");
	document.querySelector(".output").placeholder = bchoo[mtd]["custom_text"] ? bchoo[mtd]["custom_text"] : (bchoo[mtd]["is_hash"] ? "注意：此为哈希散列，无法被解密" : "结果将显示在这里" )
}

document.addEventListener("DOMContentLoaded", () => {
	const encrypt = document.querySelector(".encrypt")
	const decrypt = document.querySelector(".decrypt")
	const copy_result = document.querySelector(".copy_rs")
	const clearall = document.querySelector(".clear")
	const switcher = document.querySelector(".switch")
	const inputElem = document.querySelector(".input")
	const output = document.querySelector(".output")

	encrypt.addEventListener("click", async () => {
		const input = inputElem.value
		const cf = bchoo[setmethod]["en"]
		if (cf) {
			let l = isAsyncFunction(cf) ? await cf(input) : cf(input)
			output.value = l
		} else {
			output.value = "无效方式"
		}
	})


	decrypt.addEventListener("click", async () => {
		const input = inputElem.value
		const cf = bchoo[setmethod]["de"]
		if (cf) {
			let l = isAsyncFunction(cf) ? await cf(input) : cf(input)
			output.value = l
		} else {
			output.value = "无效方式"
		}
		
	})
	
	copy_result.addEventListener("click", async () => {
		await navigator.clipboard.writeText(output.value);
	})

	switcher.addEventListener("click", async () => {
		const inputval = inputElem.value;
		inputElem.value = document.querySelector(".output").value;
		output.value = inputval;
	})
	clearall.addEventListener("click", async () => {
		inputElem.value = "";
		output.value = "";
	})
});