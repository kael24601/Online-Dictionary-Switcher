// ==UserScript==
// @name          在线英语词典切换器 / English Online Dictionary Switcher
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   在辞典网站左侧显示一个快速切换列表，节省「另开辞典页面」和「输入关键词」的动作及时间，提高查询效率。
// @author        Me
// @icon          https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org

// @match         *://www.oxfordlearnersdictionaries.com/definition/english/*
// @match         *://www.freecollocation.com/search?word=*
// @match         *://dictionary.cambridge.org/dictionary/english-chinese-simplified/*
// @match         *://www.ldoceonline.com/dictionary/*
// @match         *://www.collinsdictionary.com/dictionary/english/*
// @match         *://www.macmillandictionary.com/dictionary/*
// @match         *://chambers.co.uk/search/?query=*
// @match         *://www.merriam-webster.com/dictionary/*
// @match         *://www.ahdictionary.com/word/search.html?q=*
// @match         *://www.britannica.com/dictionary/*
// @match         *://www.thefreedictionary.com/*
// @match         *://en.wiktionary.org/wiki/*
// @match         *://www.vocabulary.com/dictionary/*
// @match         *://www.dictionary.com/browse/*
// @match         *://www.thesaurus.com/browse/*
// @match         *://www.etymonline.com/search?q=*
// @match         *://www.urbandictionary.com/define.php?term=*

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
		name: "Oxford",
		dicUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/",
		keyName: "",
		testUrl: /https:\/\/www.oxfordlearnersdictionaries.com\/definition\/english\/*/,
	},
	{
		name: "Oxford Collocations",
		dicUrl: "https://www.freecollocation.com/search?word=",
		keyName: "word",
		testUrl: /http:\/\/www.freecollocation.com\/search.*/,
	},
	{
		name: "Cambridge",
		dicUrl: "https://dictionary.cambridge.org/dictionary/english-chinese-simplified/",
		keyName: "",
		testUrl: /https:\/\/dictionary.cambridge.org\/dictionary\/english-chinese-simplified\/*/,
	},
	{
		name: "Longman",
		dicUrl: "https://www.ldoceonline.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.ldoceonline.com\/dictionary\/*/,
	},
	{
		name: "Collins",
		dicUrl: "https://www.collinsdictionary.com/dictionary/english/",
		keyName: "",
		testUrl: /https:\/\/www.collinsdictionary.com\/dictionary\/english\/*/,
	},
	{
		name: "Macmillan",
		dicUrl: "https://www.macmillandictionary.com/dictionary/british/",
		keyName: "",
		testUrl: /https:\/\/www.macmillandictionary.com\/dictionary\/british\/*/,
	},
	{
		name: "Chambers",
		dicUrl: "https://chambers.co.uk/search/?query=",
		keyName: "query",
		testUrl: /https:\/\/chambers.co.uk\/search\/.*/,
	},
	{
		name: "Merriam-Webster",
		dicUrl: "https://www.merriam-webster.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.merriam-webster.com\/dictionary\/*/,
	},
	{
		name: "American Heritage",
		dicUrl: "https://www.ahdictionary.com/word/search.html?q=",
		keyName: "q",
		testUrl: /https:\/\/www.ahdictionary.com\/word\/search.html.*/,
	},
	{
		name: "Britannica",
		dicUrl: "https://www.britannica.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.britannica.com\/dictionary\/*/,
	},
	{
		name: "freedict",
		dicUrl: "https://www.thefreedictionary.com/",
		keyName: "",
		testUrl: /https:\/\/www.thefreedictionary.com\/*/,
	},
	{
		name: "Wiktionary",
		dicUrl: "https://en.wiktionary.org/wiki/",
		keyName: "",
		testUrl: /https:\/\/en.wiktionary.org\/wiki\/*/,
	},
	{
		name: "Vocabulary",
		dicUrl: "https://www.vocabulary.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.vocabulary.com\/dictionary\/*/,
	},
	{
		name: "Dictionary",
		dicUrl: "https://www.dictionary.com/browse/",
		keyName: "",
		testUrl: /https:\/\/www.dictionary.com\/browse\/*/,
	},
	{
		name: "thesaurus",
		dicUrl: "https://www.thesaurus.com/browse/",
		keyName: "",
		testUrl: /https:\/\/www.thesaurus.com\/browse\/*/,
	},
	{
		name: "Etymonline",
		dicUrl: "https://www.etymonline.com/search?q=",
		keyName: "q",
		testUrl: /https:\/\/www.etymonline.com\/search.*/,
	},
	{
		name: "Urbandict",
		dicUrl: "https://www.urbandictionary.com/define.php?term=",
		keyName: "term",
		testUrl: /https:\/\/www.urbandictionary.com\/define.php.*/,
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