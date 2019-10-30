---
title: "Headless Chrome, Puppteer를 활용한 웹 페이지 스크린 캡쳐"
date: 2019-10-30 10:39:28 -0400
categories: Web
---

## 명령어로 Headless Chrome 실행

아래 명령어는 https://acafela.github.io에 접속해서 해당 페이지를 캡쳐합니다.
++Windows 10, Chrome 78.0++ 에서 테스트 했습니다.

```powershell
cd C:\Program Files (x86)\Google\Chrome\Application
.\chrome.exe --headless --screenshot=C:\Users\hwang\Downloads\test1.png --window-size=1000,1000 --default-background-color=0 https://acafela.github.io --virtual-time-budget=1000
```

## Pupeteer 라이브러리 사용

아래 코드는 http://localhost:9105/formtest.html에 접속해서 셀렉트 박스 선택값을 변경한 후
웹 페이지를 C:/Users/hwang/vscode-ws/PlayGround/screenshot.png에 저장한다.

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let response = await page.goto('http://localhost:9105/formtest.html', {waitUntil : "networkidle0" })
                            .then(() => page.select('#selMemberNo', '07730063'))
                            .then(() => page.select('#selBranch', 'RKT01'))
                            .then(() => page.select('#selSrchMonth', '11'));

    page.screenshot({path: 'C:/Users/hwang/vscode-ws/PlayGround/screenshot.png'})


    await browser.close();
})();
```
