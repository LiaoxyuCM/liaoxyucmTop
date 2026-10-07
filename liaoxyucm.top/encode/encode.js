const jisgreen_encryption_type = {
	encryption: {
		JisGreen: ["JisGren", "JisGreen", "JisGreeen"],
		JiShi: ["JiSi", "JiShi", "JiShhi"],
		JisKotlin: ["JisKotin", "JisKotlin", "JisKootlin"],
		JisMua: ["JisMa", "JisMua", "JisMuua"],
		ExcuseBox: ["ExcuseBx", "ExcuseBox", "ExcuseBoox"],
		Xxx: ["Xx", "Xxx", "Xxxx"],
		YYBH: ["YBH", "YYBH", "YYYBH"],
		LTFH: ["LTF", "LTFH", "LTFHH"],
		BJWX: ["BJW", "BJWX", "BJWXX"],
		JisRmb: ["JisRb", "JisRmb", "JisRmmb"],
		JisBo: ["JisB", "JisBo", "JisBoo"],
		JisW: ["Jis", "JisW", "JisWw"],
		JisSkyline: ["JisSkylne", "JisSkyline", "JisSkyliine"],
		Reallove: ["Realove", "Reallove", "Realllove"],
		N1010: ["0", "1", "."]
	},
	decryption: {
		JisGreen: [/JisGren/g, /JisGreen/g, /JisGreeen/g],
		JiShi: [/JiSi/g, /JiShi/g, /JiShhi/g],
		JisKotlin: [/JisKotin/g, /JisKotlin/g, /JisKootlin/g],
		JisMua: [/JisMa/g, /JisMua/g, /JisMuua/g],
		ExcuseBox: [/ExcuseBx/g, /ExcuseBox/g, /ExcuseBoox/g],
		Xxx: [/Xx/g, /Xxx/g, /Xxxx/g],
		YYBH: [/YBH/g, /YYBH/g, /YYYBH/g],
		LTFH: [/LTF/g, /LTFH/g, /LTFHH/g],
		BJWX: [/BJW/g, /BJWX/g, /BJWXX/g],
		JisRmb: [/JisRb/g, /JisRmb/g, /JisRmmb/g],
		JisBo: [/JisB/g, /JisBo/g, /JisBoo/g],
		JisW: [/Jis/g, /JisW/g, /JisWw/g],
		JisSkyline: [/JisSkylne/g, /JisSkyline/g, /JisSkyliine/g],
		Reallove: [/Realove/g, /Reallove/g, /Realllove/g],
		N1010: [/0/g, /1/g, /\./g]
	}
}


const jisgreen_encrypt = (original_text, type = "JisGreen") => {
	let l = ""
	for (let i of original_text){
		l += i.charCodeAt(0).toString(2) + " "
	}
	l =  l.replace(/ /g, jisgreen_encryption_type.encryption[type][2]).replace(/1/g, jisgreen_encryption_type.encryption[type][1]).replace(/0/g, jisgreen_encryption_type.encryption[type][0])
	return l
}

const jisgreen_decrypt = (original_text, type = "JisGreen") => {
	let l = original_text.replace(jisgreen_encryption_type.decryption[type][2], " ").replace(jisgreen_encryption_type.decryption[type][1], "1").replace(jisgreen_encryption_type.decryption[type][0], "0").slice(0, -1)

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
	const part1 = zero_width_required ? insertBetween('[JIS2]') : "[JIS2]";
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
		throw new Error("JIS2语法错误");
	}
};

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
	if (hex.length % 2 !== 0) {
		throw new Error("十六进制字符串无效");
	}
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i/2] = parseInt(hex.substring(i, i+2), 16);
	}
	return new TextDecoder().decode(bytes);
}

function encodeUnicode(str) {
    let strsplit = "";
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        strsplit += '\\u' + char.toString(16).padStart(4, '0');
    }
    return strsplit;
}

function decodeUnicode(str) {
    try {
        return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
    } catch (e) {
        throw new Error("无效数据");
    }
}

const youlist = ["又","双","叒","叕"]
const youcodedict = {
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

const youreverseDict = {};
for (const [hexChar, [idx1, idx2]] of Object.entries(youcodedict)) {
	const key = youlist[idx1] + youlist[idx2];
	youreverseDict[key] = hexChar;
}

function youEncode(s) {
	let base16ed_text = encodeBase16(s);
	let result = "";
	base16ed_text.split('').forEach((c) => {
		result += youlist[youcodedict[c][0]]+youlist[youcodedict[c][1]]
	})
	return result
}

function youDecode(encodedStr) {
	if (encodedStr.length % 2 !== 0) {
		throw new Error("密文长度无效 (预期为偶数)");
	}

	let hexStr = "";
	for (let i = 0; i < encodedStr.length; i += 2) {
		const pair = encodedStr.substring(i, i + 2);
		const hexChar = youreverseDict[pair];
		if (!hexChar) {
			throw new Error("包含无效密文字符");
		}
		hexStr += hexChar;
	}

	return decodeBase16(hexStr);
}

function cardShuffle(s) {
	if (s === "") return "";
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

function card2dShuffle(s) {
	if (s === "") return "";
	const mid = Math.ceil(s.length / 2);
	const ars = s.slice(0, mid);
	const brs = s.slice(mid);
	return cardShuffle(cardShuffle(ars) + cardShuffle(brs));
}

function card2dUnshuffle(s) {
	if (s === "") return "";
	nS = cardUnshuffle(s);
	const mid = Math.ceil(s.length / 2);
	const ars = nS.slice(0, mid);
	const brs = nS.slice(mid);
	return cardUnshuffle(ars) + cardUnshuffle(brs)
}

let bchoo = { //这名字乱起的哈哈
	b64: {
		en: utf8ToBase64,
		de: base64ToUtf8
	},
	b16: {
		en: encodeBase16,
		de: decodeBase16
	},
	url: {
		en: encodeURIComponent,
		de: decodeURIComponent
	},
	dataurl: {
		en: (g) => "data:text/plain;base64," + utf8ToBase64(g),
		de: decodeDataUrl
	},
	unicode: {
		en: encodeUnicode,
		de: decodeUnicode
	},
	sha1: {
		en: getHashFunc("SHA-1"),
		is_hash: true
	},
	sha256: {
		en: getHashFunc("SHA-256"),
		is_hash: true
	},
	sha384: {
		en: getHashFunc("SHA-384"),
		is_hash: true
	},
	sha512: {
		en: getHashFunc("SHA-512"),
		is_hash: true
	},
	off: {
		en: offsetEncrypt,
		de: offsetDecrypt,
		custom_text: "凯撒加密，但偏移的是ASCII码"
	},
	jge: {
		en: jisgreen_encrypt,
		de: jisgreen_decrypt,
		custom_text: "JGE, JisGreen Encryption 是2025年11月的项目，现已停更。\n该加密效果不理想，密文长度甚至比明文长度高出52~137倍\n变体JisSkyline是66~171倍\n体验完整版 (老古董页面, 若页面已被删除请到本站的gh备份仓库里找): https://liaoxyucm{$rthSuffix}/JisGreenEncryption/"
	},
	jis2: {
		en: jis2_encrypt,
		de: jis2_decrypt,
		custom_text: "此为纪青在开发KotlinBox时自创的加密算法，请支持他\n庆幸的是，我还有JIS2加密实现的留档"
	},
	you: {
		en: youEncode,
		de: youDecode
	},
	reverse: {
		en: reverseStr,
		de: reverseStr
	},
	cardshuffle: {
		en: cardShuffle,
		de: cardUnshuffle,
		custom_text: "原文内容数量过小或字符种数过少，效果就不理想\n该加密适用于代码和文章"
	},
	card2dshuffle: {
		en: card2dShuffle,
		de: card2dUnshuffle,
		custom_text: "洗牌算法的二维加强版"
	}
}

////////////////////===================////////////////////

function isAsyncFunction(fn) {
  return fn?.constructor?.name === 'AsyncFunction';
}

let setmethod = "b64";

function method(mtd, thisElem) {
	setmethod = mtd;
	document.querySelector(".method.selected").classList.remove("selected");
	thisElem.classList.add("selected");
	document.querySelector(".output").placeholder = bchoo[mtd].custom_text || (bchoo[mtd].is_hash ? "注意：此为哈希散列，无法被解密" : "结果将显示在这里" )
}

function safeShowtoast(content, type="success", duration=2000) {
	if (showToast) {
		showToast(content, type, duration)
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const encode = document.querySelector(".encode");
	const decode = document.querySelector(".decode");
	const copy_result = document.querySelector(".copy_rs");
	const clearall = document.querySelector(".clear");
	const switcher = document.querySelector(".switch");
	const inputElem = document.querySelector(".input");
	const output = document.querySelector(".output");
	const methods = document.querySelectorAll(".method");

	methods.forEach((mtd) => {
		mtd.addEventListener("click", () => {
			method(mtd.dataset.algo, mtd)
		})
	})

	encode.addEventListener("click", async () => {
		const input = inputElem.value
		const cf = bchoo[setmethod].en
		if (cf) {
			output.value = isAsyncFunction(cf) ? await cf(input) : cf(input)
		} else {
			safeShowtoast("无效方式", "error");
			output.value = "无效方式"
		}
	})


	decode.addEventListener("click", async () => {
		const input = inputElem.value
		const cf = bchoo[setmethod].is_hash ? () => {safeShowtoast("哈希散列的数据无法被解密", "error"); return ""} : bchoo[setmethod].de
		if (cf) {
			try {
				output.value = isAsyncFunction(cf) ? await cf(input) : cf(input)
			} catch (e) {
				safeShowtoast(e, "error")
			}
		} else {
			safeShowtoast("无效方式", "error");
			output.value = "无效方式"
		}		
	})
	
	copy_result.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(output.value);
			safeShowtoast("已复制");
		} catch(e) {
			safeShowtoast("复制失败 - 请升级至新版浏览器", "error");
		}
	})

	switcher.addEventListener("click", async () => {
		const inputval = inputElem.value;
		inputElem.value = output.value;
		output.value = inputval;
	})
	clearall.addEventListener("click", async () => {
		inputElem.value = "";
		output.value = "";
	})

	safeShowtoast("所有组件加载成功");
});