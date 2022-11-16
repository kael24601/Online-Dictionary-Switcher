// ==UserScript==
// @name         在线日语词典切换器 / オンライン国語辞典切替
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   在辞典网站左侧显示一个快速切换列表，节省「另开辞典页面」和「输入关键词」的动作及时间，提高查询效率。
// @author        Me
// @icon          https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org

// @match         *://sakura-paris.org/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/*
// @match         *://kotobank.jp/gs/?q=*
// @match         *://www.weblio.jp/content/*
// @match         *://cjjc.weblio.jp/content/*
// @match         *://dictionary.goo.ne.jp/word/*
// @match         *://ja.wiktionary.org/wiki/*
// @match         *://www.japandict.com/*
// @match         *://jisho.org/search/*

// @grant         unsafeWindow
// @grant         window.onload
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-body

// @license       MIT
// ==/UserScript==

// 辞典网址配置
const urlMapping = [
	{
		name: "広辞苑無料検索",
		dicUrl: "https://sakura-paris.org/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/",
		keyName: "",
		testUrl:/https:\/\/sakura-paris.org\/dict\/%E5%BA%83%E8%BE%9E%E8%8B%91\/prefix\/*/,
	},
	{
		name: "コトバンク",
		dicUrl: "https://kotobank.jp/gs/?q=",
		keyName: "q",
		testUrl: /https:\/\/kotobank.jp\/gs\/.*/,
	},
	{
		name: "weblio",
		dicUrl: "https://www.weblio.jp/content/",
		keyName: "",
		testUrl: /https:\/\/www.weblio.jp\/content\/*/,
	},
	{
		name: "Weblio日中-中日",
		dicUrl: "https://cjjc.weblio.jp/content/",
		keyName: "",
		testUrl: /https:\/\/cjjc.weblio.jp\/content\/*/,
	},
    {
		name: "goo",
		dicUrl: "https://dictionary.goo.ne.jp/word/",
		keyName: "",
		testUrl: /https:\/\/dictionary.goo.ne.jp\/word\/*/,
	},
	{
		name: "wiktionary",
		dicUrl: "https://ja.wiktionary.org/wiki/",
		keyName: "",
		testUrl: /https:\/\/ja.wiktionary.org\/wiki\/*/,
	},
	{
		name: "japandict",
		dicUrl: "https://www.japandict.com/?s=",
		keyName: "s",
		testUrl: /https:\/\/www.japandict.com\/.*/,
	},
	{
		name: "jishuo",
		dicUrl: "https://jisho.org/search/",
		keyName: "",
		testUrl: /https:\/\/jisho.org\/search\/*/,
	},
];

// JS 获取 url 参数
function getQueryVariable(variable) {
	let query = window.location.search.substring(1);
	if (query === "") {
	    return decodeURIComponent(window.location.href.split("/").pop());
	} else {
    	let pairs = query.split("&");
    	for (let pair of pairs) {
    		let [key, value] = pair.split("=");
    		if (key === variable) {
    			return decodeURIComponent(value);
    		}
    	}
	}
	return null;
}

// 从 url 中获取搜索关键词
function getKeywords() {
	let keywords = "";
	for (let item of urlMapping) {
		if (item.testUrl.test(window.location.href)) {
			keywords = getQueryVariable(item.keyName);
			break;
		}
	}
	console.log(keywords);
	return keywords;
}

// 添加节点
function addBox() {
	// 主元素
	const dics = document.createElement("div");
	dics.id = "dic-app-box";
	dics.style = `
	    position: fixed;
		top: 120px;
		left: 12px;
		width: 78px;
		background-color: hsla(200, 40%, 96%, .8);
		font-size: 12px;
		border-radius: 6px;
		z-index: 99999;`;
	document.body.insertAdjacentElement("afterbegin", dics);

	// 标题
	let title = document.createElement("span");
	title.innerText = "在线辞典";
	title.style = `
		display: block;
		color: hsla(211, 60%, 35%, .8);
		text-align: center;
		margin-top: 10px;
		margin-bottom: 5px;
		font-size： 12px;
		font-weight: bold;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select:none;`;
	dics.appendChild(title);

	// 辞典列表
	for (let index in urlMapping) {
		let item = urlMapping[index];

		// 列表样式
		let style = `
			display: block;
			color: hsla(211, 60%, 35%, .8) !important;
			padding: 6px 8px;
			text-decoration: none;`;
		let defaultStyle = style + `
		    color: hsla(211, 60%, 35%, .8) !important;`;
		let hoverStyle = style + `
			background-color: hsla(211, 60%, 35%, .1);`;

		// 设置辞典链接
		let a = document.createElement("a");
		a.innerText = item.name;
		a.style = defaultStyle;
		a.className = "dic-a";
		a.href = item.dicUrl + getKeywords();

		// 鼠标移入&移出效果，相当于 hover
		a.onmouseenter = function() {
			this.style = hoverStyle;
		};
		a.onmouseleave = function() {
			this.style = defaultStyle;
		};
		dics.appendChild(a);
	}
}

(function() {
	"use strict";
	window.onload = addBox();
})();