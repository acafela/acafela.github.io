---
layout: post
title: Java SAML 구현 예제 (SAML IdP, SAML SP 구현)
date: 2020-05-08
categories: [SAML, Java, SSO]
tags: [인증, Java]
preview_image: /assets/capture/saml-concept.png
sitemap :
  lastmod : 2021-12-16
---

SAML(Security Assertion Markup Language)은 온라인 비즈니스 파트너 간 보안 정보를 교환하기 위한 XML 기반 프레임워크 입니다.  
Web에서 멀티 도메인간 SSO를 위해서 사용 될 수 있습니다.

![saml-concept](/assets/capture/saml-concept.png)
  
### 예제 SAML SSO 케이스 - SP-Initiated SSO : Redirect/POST Bindings

SAML 여러 사용 케이스 중 SP-Initiated SSO : Redirect/POST Bindings 테스트 가능합니다.  
전체 소스는 [링크](https://github.com/acafela/java-saml-example){:target="_blank"}에서 확인 가능합니다.  
2개의 모듈이 아래 역할을 합니다.  
- saml-example-idp : Identity Provider
- saml-example-sp : Service Provider

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

#### 4. Service provider - http://localhost:9106/user 접속

- Identity Provider 인증 페이지로 리다이렉트

#### 5. Identity Provider 인증 페이지에서 ID/PWD 입력해 로그인

- admin / admin123 or user / user123

#### 6. 인증 성공

### Service Provider 주요 클래스

- SamlAssertionConsumeFilter : Assertion consume url 처리 필터, AbstractAuthenticationProcessingFilter 확장 클래스
- SimpleSamlAssertionConsumer : SAML Response 검증 후 UserDetails 생성
- SamlSsoEntryPoint : SAML Request redirect, AuthenticationEntryPoint 구현

### Identity Provider 주요 클래스

- SamlResponseFilter : SAML Response 전달을 위한 필터

### Reference

- [OASIS Doc](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [pac4j](https://github.com/pac4j/pac4j)