---
layout: post
title: Fiddler Mac 지원(Beta), Mac Fiddler 인증서 설치
date: 2020-04-21
categories: [기타]
---

최근에 ```"Fiddler News - Fiddler now on Mac 🍎 & Linux 🐧"``` 제목의 메일을 받았습니다.  
Windows에서는 웹개발할때 Fiddler를 유용하게 사용해왔습니다. 그러나 Mac에서는 Mono Framework 통해 실행하고 사용하는데 불편함이 있어 사용안했는데(버벅거리고.. 화면깨지고..) 반가운 내용이여서 내용 읽어보고 베타버전 설치해서 사용해봤습니다.  
Mac, Linux에서 사용가능한 새로운 Fiddler 이름은 **Fiddler Everywhere** 인것 같습니다.  

## 설치하기

Fiddler Everywhere 베타 버전 다운로드 페이지(https://www.telerik.com/download/fiddler-everywhere)
Mac에서 웹 디버깅 하기 한결 수월할것 같습니다. 기존에 비해 UI도 예뻐졌네요.  
HTTPS 트래픽 캡쳐를 위해서 Fiddler 인증서 설치가 필요합니다.  
Fiddler 인증서 설치는 필요하면 아래 내용 참고하시면 되겠습니다.  

## Mac Fiddler 인증서 설치

HTTPS 트래픽 캡쳐를 위해서 Fiddler 인증서 설치가 필요합니다.

1. Setting > HTTPS > Decrypt HTTPS traffic 체크 & Export root certificate to Desktop 클릭  
![Mac Fiddler 인증서 설치](/assets/capture/mac-fiddler-cert-install1.png)

2. Desktop 인증서 파일 클릭  
![Mac Fiddler 인증서 설치](/assets/capture/mac-fiddler-cert-install2.png)

3. 인증서 목록에서 DO_NOT_TRUST_FiddlerRoot Trsut > Always Trust로 변경  
![Mac Fiddler 인증서 설치](/assets/capture/mac-fiddler-cert-install4.png)

4. HTTPS URL 접속해 캡쳐 테스트  
![Mac Fiddler 인증서 설치](/assets/capture/mac-fiddler-cert-install3.png)
