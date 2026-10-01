document.addEventListener("DOMContentLoaded", () => {
	console.warn("[DEPRECATED] You'd better use https://newsite.liaoxyucm.top/style.css instead");
	console.log(`
感谢支持LiaoxyuCM
 _     _                              ____ __  __
| |   (_) __ _  _____  ___   _ _   _ / ___|  \\/  |
| |   | |/ _\` |/ _ \\ \\/ / | | | | | | |   | |\\/| |
| |___| | (_| | (_) >  <| |_| | |_| | |___| |  | |
|_____|_|\\__,_|\\___/_/\\_\\\\__, |\\__,_|\\____|_|  |_|
                         |___/

https://liaoxyucm.top/#
`)
	function checkHeight() {
		const container = document.querySelector('mainpage');
		
		const containerHeight = container.clientHeight;
		const browserHight = window.innerHeight; 
		if (containerHeight > browserHight) {
			container.style.top = "0";
			container.style.transform = "translate(-50%, 0)";
		} else {
			container.style.top = "50%";
			container.style.transform = "translate(-50%, -50%)";
		}
	}
	function noWechatOrQQ() {
		const userAgent = navigator.userAgent.toLowerCase();
		
		const isWechat = /micromessenger/.test(userAgent);
		const isQQ = /qq\/\d+|qzone\//.test(userAgent);
		
		if (isWechat || isQQ) {
			const tipBox = document.createElement('p');
            const title = document.body.querySelector("h1");
			tipBox.style.color = "#ff0000";

			tipBox.textContent = '我们已经检测到了你正在用微信或QQ浏览此网站，请点击右上角使用浏览器打开，谢谢';
			
			document.querySelector("mainpage").insertBefore(tipBox, title);
		}
	};

	window.addEventListener('DOMContentLoaded', noWechatOrQQ);

	checkHeight();
	window.addEventListener('resize', checkHeight);
})