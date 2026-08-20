const register = (klass, selector_suffix, link, desc) => {
	const container = document.querySelector(`.${klass}`);
	const text = document.querySelector(`.${klass}${selector_suffix}`);
	container.addEventListener("mouseenter", () => {
		text.textContent = link;
	});
	container.addEventListener("mouseleave", () => {
		text.textContent = desc;
	});
};
document.addEventListener("DOMContentLoaded", () => {
	
	register("old_website_link", " a", "liaoxyucm.github.io", "My old website");
	register("bilibili_profile_link", " a", "space.bilibili.com/3546720162023654", "Bilibili");
	register("weibo_profile_link", " a", "weibo.com/coderliaoxyucm", "Weibo");
	register("github_profile_link", " a", "github.com/LiaoxyuCM", "Github");
	register("afdian_profile_link", " a", "https://afdian.com/a/LiaoxyuCM", "Buy me a coffee (5 RMB/mo)");
	register("readmore_jisgreen", "", "https://jisgreen-encryption{$rthSuffix}", "Read More");
	register("yybh_link", " a", "https://yybh{$rthSuffix}", "JiShi Tech (Ran Away)");
	register("zh_link", " a", "https://zhkj.vvvv.ee", "ZH Tech");
});
