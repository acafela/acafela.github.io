---
layout: post
title: "Headless Chrome, Puppeteer를 활용한 웹 페이지 스크린 캡쳐"
date: 2019-10-30
categories: [NodeJS]
tags: [NodeJS]
sitemap :
  lastmod : 2021-12-16
---

웹 페이지 스크린 캡처를 위해서 Headless Chrome을 직접 실행하거나  
Node.js 라이브러리 Puppeteer를 사용 할 수 있습니다.

## 명령어로 Headless Chrome 실행

아래 명령어는 [https://acafela.github.io](https://acafela.github.io) 에 접속해서 해당 페이지를 캡쳐합니다.  
*Chrome 78.0* 에서 테스트 했습니다.

```powershell
cd C:\Program Files (x86)\Google\Chrome\Application
.\chrome.exe --headless --screenshot=C:\Users\hwang\Downloads\test1.png --window-size=1000,1000 --default-background-color=0 https://acafela.github.io --virtual-time-budget=1000
```

## Node.js Puppeteer 라이브러리 사용

아래 코드는 http://localhost:9105/formtest.html에 접속해서 셀렉트 박스 선택값을 변경한 후  
웹 페이지를 C:/Users/hwang/vscode-ws/PlayGround/screenshot.png에 저장합니다.

```javascript
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:9105/formtest.html', { waitUntil: "networkidle0" }
    await page.screenshot({ path: 'C:/Users/hwang/vscode-ws/PlayGround/screenshot.png' });
    await browser.close();
})();
```