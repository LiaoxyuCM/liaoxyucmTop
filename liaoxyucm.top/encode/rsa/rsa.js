function safeShowtoast(content, type="success", duration=2000) {
	if (showToast) {
		showToast(content, type, duration)
	}
}
// 生成 RSA-OAEP 密钥对（支持加密解密）
async function generateRSAKeyPair() {
	const keyPair = await window.crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 2048,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: "SHA-256",
		},
		true,
		["encrypt", "decrypt"]
	);
	const privateKeyBuffer = await window.crypto.subtle.exportKey(
		"pkcs8",
		keyPair.privateKey
	);
	const privateKeyPem = bufferToPem(privateKeyBuffer, "PRIVATE KEY");
	const publicKeyBuffer = await window.crypto.subtle.exportKey(
		"spki",
		keyPair.publicKey
	);
	const publicKeyPem = bufferToPem(publicKeyBuffer, "PUBLIC KEY");
	return {
		privateKey: privateKeyPem,
		publicKey: publicKeyPem,
	};
}
function bufferToPem(buffer, label) {
	const uint8Array = new Uint8Array(buffer);
	let binary = "";
	uint8Array.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	const base64 = window.btoa(binary);
	const lines = base64.match(/.{1,64}/g);
	return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}
// PEM 转 ArrayBuffer
function pemToBuffer(pem) {
	const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
	const binary = window.atob(b64);
	const buffer = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		buffer[i] = binary.charCodeAt(i);
	}
	return buffer.buffer;
}
// 导入公钥
async function importPublicKey(pem) {
	return window.crypto.subtle.importKey(
		"spki",
		pemToBuffer(pem),
		{ name: "RSA-OAEP", hash: "SHA-256" },
		false,
		["encrypt"]
	);
}
// 导入私钥
async function importPrivateKey(pem) {
	return window.crypto.subtle.importKey(
		"pkcs8",
		pemToBuffer(pem),
		{ name: "RSA-OAEP", hash: "SHA-256" },
		false,
		["decrypt"]
	);
}
document.addEventListener("DOMContentLoaded", () => {
	const pub = document.querySelector(".public");
	const priv = document.querySelector(".private");
	const input = document.querySelector(".input");
	const output = document.querySelector(".output");
	const btn = document.querySelector(".revbtn");
	const encBtn = document.querySelector(".encbtn");
	const decBtn = document.querySelector(".decbtn");

	// 生成密钥对
	async function reveal() {
		btn.textContent = "请稍等";
		btn.disabled = true;
		let result = await generateRSAKeyPair();
		btn.textContent = "生成密钥";
		btn.disabled = false;
		safeShowtoast("生成成功");
		pub.value = result.publicKey;
		priv.value = result.privateKey;
	}
	// 加密
	async function encrypt() {
		if (!pub.value.trim()) {
			safeShowtoast("请先生成或填写公钥", "error");
			return;
		}
		if (!input.value) {
			safeShowtoast("请输入要加密的文本", "error");
			return;
		}
		try {
			encBtn.textContent = "加密中";
			encBtn.disabled = true;
			const publicKey = await importPublicKey(pub.value);
			const encoded = new TextEncoder().encode(input.value);
			const encrypted = await window.crypto.subtle.encrypt(
				{ name: "RSA-OAEP" },
				publicKey,
				encoded
			);
			// 转为 Base64 方便显示
			const bytes = new Uint8Array(encrypted);
			let binary = "";
			bytes.forEach((b) => (binary += String.fromCharCode(b)));
			output.value = window.btoa(binary);
		} catch (e) {
			safeShowtoast("加密失败: " + e.message, "error");
		} finally {
			encBtn.textContent = "加密";
			encBtn.disabled = false;
		}
	}
	// 解密
	async function decrypt() {
		if (!priv.value.trim()) {
			safeShowtoast("请先生成或填写私钥", "error");
			return;
		}
		if (!input.value) {
			safeShowtoast("请输入要解密的 Base64 密文", "error");
			return;
		}
		try {
			decBtn.textContent = "解密中";
			decBtn.disabled = true;
			const privateKey = await importPrivateKey(priv.value);
			const binary = window.atob(input.value.trim());
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			const decrypted = await window.crypto.subtle.decrypt(
				{ name: "RSA-OAEP" },
				privateKey,
				bytes.buffer
			);
			output.value = new TextDecoder().decode(decrypted);
		} catch (e) {
			safeShowtoast("解密失败: " + e.message, "error");
		} finally {
			decBtn.textContent = "解密";
			decBtn.disabled = false;
		}
	}
	btn.addEventListener("click", reveal);
	encBtn.addEventListener("click", encrypt);
	decBtn.addEventListener("click", decrypt);
	async function copyrs() {
		try {
			await navigator.clipboard.writeText(output.value);
			safeShowtoast("已复制");
		} catch(e) {
			safeShowtoast("复制失败 - 请升级至新版浏览器", "error");
		}
	}
	document.querySelector(".copybtn").addEventListener("click", copyrs);

	safeShowtoast("所有组件加载成功");
});