---
layout: post
title: "NTLM Over HTTP Protocol 인증"
date: 2020-06-25
categories: NTLM Windows HttpClient
sitemap : 
    lastmod : 2021-06-02
---

NTLM은 Windows 서버에서 인증을 제공하기 위한 프로토콜 중 하나 입니다.  
Challenge-Response 매커니즘 기반으로 사용자 또는 컴퓨터를 인증합니다.  
윈도우에서 보안 취약점이 있는것으로 알려진 인증 방식이지만.. 내부 Legacy 시스템과 SSO를 위해 LTLM 인증을 사용해야 할 경우가 있었습니다.

### NTLM Over HTTP Protocol

HTTP 프로토콜을 사용하는 Windows IIS, Exchange 등.. 시스템에서 NTLM 인증을 사용하기 위한 방식입니다.

### NTLM Over HTTP Protocol Authentication Flow

![Java SAML Example 인증 화면](/assets/capture/java-ntlm1.png)

### Apache HttpClient 사용해 NTLM 인증하기

- 혹시라도 NTLM 인증이 필요할 경우 apache HttpClient, spring RestTemplate 사용중 이라면 아래와 같이 설정해 NTLM 인증이 가능합니다.
- 찾아보니 Apache HttpClient 4.3.x 버전 이상이면 사용 가능합니다.

#### 코드

```java
// NTLM 관련 AuthScheme, Credentials 설정
final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
credentialsProvider.setCredentials(new AuthScope(host, port, AuthScope.ANY_REALM), new NTCredentials(usernamePassword)); 
final Registry<AuthSchemeProvider> authSchemeRegistry = RegistryBuilder.<AuthSchemeProvider>create()
                                                                        .register(AuthSchemes.NTLM, new NTLMSchemeFactory())
                                                                        .build();
final ClosableHttpClient httpClient = HttpClients.custom()
                                                  .setDefaultAuthSchemeRegistry(authSchemeRegistry)
                                                  .setDefaultCredentialsProvider(credentialsProvider)
                                                  .build();
```