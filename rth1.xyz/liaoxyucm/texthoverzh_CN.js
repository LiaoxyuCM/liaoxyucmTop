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

	register("old_website_link", " a", "liaoxyucm.github.io", "我的旧网站");
	register("bilibili_profile_link", " a", "space.bilibili.com/3546720162023654", "哔哩哔哩");
	register("weibo_profile_link", " a", "weibo.com/coderliaoxyucm", "微博");
	register("github_profile_link", " a", "github.com/LiaoxyuCM", "Github");
	register("afdian_profile_link", " a", "https://afdian.com/a/LiaoxyuCM", "Buy me a coffee (5块钱一个月)");
	register("readmore_jisgreen", "", "https://jisgreen-encryption{$rthSuffix}", "更多信息");
	register("yybh_link", " a", "https://yybh{$rthSuffix}", "纪失科技 (跑路了)");
	register("zh_link", " a", "https://zhkj.vvvv.ee", "众和科技");
});
