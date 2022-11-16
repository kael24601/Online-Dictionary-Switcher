// ==UserScript==
// @name         在线德语词典切换器 / Online Deutsch-Wörterbuch Switcher
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   在辞典网站左侧显示一个快速切换列表，节省「另开辞典页面」和「输入关键词」的动作及时间，提高查询效率。
// @author        Me
// @icon          https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org

// @match         *://www.duden.de/suchen/dudenonline/*
// @match         *://www.duden.de/rechtschreibung/*
// @match         *://de.pons.com/%C3%BCbersetzung/deutsch-als-fremdsprache/*
// @match         *://de.langenscheidt.com/deutsch-chinesisch/*
// @match         *://de.thefreedictionary.com/*
// @match         *://de.wiktionary.org/wiki/*
// @match         *://corpora.uni-leipzig.de/de/res?corpusId=deu_news_2021&word=*
// @match         *://www.dwds.de/wb/*
// @match         *://www.openthesaurus.de/synonyme/*
// @match         *://www.collinsdictionary.com/dictionary/german-english/*
// @match         *://dict.leo.org/%E5%BE%B7%E8%AF%AD-%E6%B1%89%E8%AF%AD/*
// @match         *://www.godic.net/dicts/de/*

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
		name: "Duden",
		dicUrl: "https://www.duden.de/rechtschreibung/",
		keyName: "",
		testUrl: /https:\/\/www.duden.de\/rechtschreibung\/*/,
	},
	{
		name: "Pons",
		dicUrl: "https://de.pons.com/%C3%BCbersetzung/deutsch-als-fremdsprache/",
		keyName: "",
		testUrl: /https:\/\/de.pons.com\/%C3%BCbersetzung\/deutsch-als-fremdsprache\/*/,
	},
	{
		name: "Langenscheidt",
		dicUrl: "https://de.langenscheidt.com/deutsch-chinesisch/",
		keyName: "",
	    testUrl: /https:\/\/de.langenscheidt.com\/deutsch-chinesisch\/*/,
	},
	{
		name: "Thefree Dictionary",
		dicUrl: "https://de.thefreedictionary.com/",
		keyName: "",
		testUrl: /https:\/\/de.thefreedictionary.com\/*/,
	},
	{
		name: "Wiktionary",
		dicUrl: "https://de.wiktionary.org/wiki/",
		keyName: "",
		testUrl: /https:\/\/de.wiktionary.org\/wiki\/*/,
	},
	{
		name: "Leipzig",
		dicUrl: "https://corpora.uni-leipzig.de/de/res?corpusId=deu_news_2021&word=",
		keyName: "corpusId=deu_news_2021&word",
		testUrl: /https:\/\/corpora.uni-leipzig.de\/de\/res.*/,
	},
	{
		name: "Dwds",
		dicUrl: "https://www.dwds.de/wb/",
		keyName: "",
		testUrl: /https:\/\/www.dwds.de\/wb\/*/,
	},
	{
		name: "Open Thesaurus",
		dicUrl: "https://www.openthesaurus.de/synonyme/",
		keyName: "",
	    testUrl: /https:\/\/www.openthesaurus.de\/synonyme\/*/,
	},
	{
		name: "Collins",
		dicUrl: "https://www.collinsdictionary.com/dictionary/german-english/",
		keyName: "",
	    testUrl: /https:\/\/www.collinsdictionary.com\/dictionary\/german-english\/*/,
	},
	{
		name: "LEO",
		dicUrl: "https://dict.leo.org/%E5%BE%B7%E8%AF%AD-%E6%B1%89%E8%AF%AD/",
		keyName: "",
	    testUrl: /https:\/\/dict.leo.org\/%E5%BE%B7%E8%AF%AD-%E6%B1%89%E8%AF%AD\/*/,
	},
	{
		name: "德语助手",
		dicUrl: "http://www.godic.net/dicts/de/",
		keyName: "",
		testUrl: /http:\/\/www.godic.net\/dicts\/de\/*/,
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