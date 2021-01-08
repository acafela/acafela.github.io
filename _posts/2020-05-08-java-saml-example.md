---
layout: post
title: Java SAML 구현 예제 (SAML IdP, SAML SP 구현)
date: 2020-05-08 11:05:00 +0900
categories: SAML Java SSO
---

Single Sign On을 위한 방식 중 SAML 파일럿 프로젝트 위해 코드를 만들어 봤습니다.  
간단히 SAML 2.0 identity provider, service Provider 테스트가 필요하면 해당 예제 참고하면 좋겠습니다.  
전체 소스는 [링크](https://github.com/acafela/java-saml-example){:target="_blank"}에서 확인 가능합니다.  

### SAML 2.0 Java 예제 SSO 시나리오 - SP-Initiated SSO : Redirect/POST Bindings

SAML SSO의 여러 사용 케이스 중 [SP-Initiated SSO : Redirect/POST Bindings](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0-cd-02.html#5.1.2.SP-Initiated%20SSO:%20%20Redirect/POST%20Bindings|outline){:target="_blank"} 을 테스트 가능합니다.  
조금 더 복잡한 설정이나, 다양한 사용 케이스 테스트가 필요하면 [OpenConext/Mujina](https://github.com/OpenConext/Mujina){:target="_blank"}, [pac4j](https://github.com/pac4j/pac4j){:target="_blank"} 🙏 를 참고하시기 바랍니다.  

### 실행 환경

- Java 1.8+

### 실행 하기

#### 1. 소스 다운로드

```bash
git clone https://github.com/acafela/java-saml-example.git
cd java-saml-example
```

#### 2. Identity Provider 실행

```bash
./gradlew :saml-example-idp:bootRun
```

#### 3. Service Provider 실행

```bash
./gradlew :saml-example-sp:bootRun
```

#### 4. [http://localhost:9106/user](http://localhost:9106/user){:target="_blank"} 접속, 로그인하기 클릭

- _Identity Provider 인증 페이지로 리다이렉트 됩니다._

#### 5. Identity Provider 인증 페이지에서 ID/PWD 입력해 로그인

- 어드민 계정 ID/PWD : admin / admin123  
- 일반 사용자 계정 ID/PWD : user / user123  

  ![Java SAML Example 인증 화면](/assets/capture/java-saml-example-capture1.PNG)

#### 6. 인증 성공후 SAML Response NameID, Attributes 값 확인

- admin 계정으로 로그인 시  
  ![Java SAML Example 인증 완료 화면1](/assets/capture/java-saml-example-capture2.PNG)

- user 계정으로 로그인 시  
  ![Java SAML Example 인증 완료 화면2](/assets/capture/java-saml-example-capture3.PNG)

### Reference

- [OASIS Doc](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html){:target="_blank"}
- [OpenConext/Mujina](https://github.com/OpenConext/Mujina){:target="_blank"}
- [pac4j](https://github.com/pac4j/pac4j){:target="_blank"}
