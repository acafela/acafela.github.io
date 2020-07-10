---
layout: post
title: "Spring Boot executable jar에서 local keystore 읽지 못하는 버그 및 해결"
date: 2020-07-09 10:39:28 +0900
categories: SpringBoot Tomcat
---

로컬에서는 잘 실행 되다가 개발서버 배포 후 오류를 일으켰던 Spring Boot Embedded Tomcat 버그에 대해 정리합니다.

## 개발환경

- Spring Boot 2.1.9.RELEASE
- Gradle 4.7
- JDK 1.8

## 주요 Stack Trace

신규로 개발하고 있는 어플리케이션(SpringBoot)을 로컬에서 개발 후 개발 서버에 배포했더니 아래와 같은 로그 메세지를 남기며 실행에 실패했다.  
로컬 환경과 개발 서버 배포할때의 차이점은 __TLS(SSL) 적용, executable jar__ 를 통한 실행여부 였다.

```java
at java.security.KeyStore.load(Unknown Source) ~[na:1.8.0_202]
at org.apache.tomcat.util.security.KeyStoreUtil.load(KeyStoreUtil.java:69) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
at org.apache.tomcat.util.net.SSLUtilBase.getStore(SSLUtilBase.java:217) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
at org.apache.tomcat.util.net.SSLHostConfigCertificate.getCertificateKeystore(SSLHostConfigCertificate.java:206) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
at org.apache.tomcat.util.net.SSLUtilBase.getKeyManagers(SSLUtilBase.java:283) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
at org.apache.tomcat.util.net.SSLUtilBase.createSSLContext(SSLUtilBase.java:247) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
at org.apache.tomcat.util.net.AbstractJsseEndpoint.createSSLContext(AbstractJsseEndpoint.java:97) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
...
Description:Description:
The Tomcat connector configured to listen on port 443 failed to start. The port may already be in use or the connector may be misconfigured.
```

처음에는 포트가 이미 사용중이라는 흔한 메세지를 보고(`The port may already be in use`)  
서버에서 443 포트를 사용중인 서비스가 있는지를 찾았지만 없었고..
그 다음은 인증서 파일이나 경로가 잘못되었나 확인했는데 인증서 파일과 파일 경로에는 문제가 없었다.  
다른 문제임을 인식하고 구글링을 시작했다.
[Spring Boot 깃허브 이슈](https://github.com/spring-projects/spring-boot/issues/18505){:target="_blank"}에서 유사한 상황의 오류를 찾았고, 임베디드 톰캣 9.0.26(`tomcat-embed-core-9.0.26`)의 버그라는 것을 알게 되었다.

## 해결방법

Spring Boot embedded tomcat 버전을 9.0.27 이상을 사용하도록 설정해주면 됩니다.

```gradle
buildscript {
  ext {
    ext['tomcat.version'] = '9.0.27' //9.0.27+
  }
}
```

## Tomcat 9.0.27 Change Log 확인

어떤 문제 때문에 keystore 파일을 읽지 못했는지 [Tomcat 9.0.27 Change Log](http://tomcat.apache.org/tomcat-9.0-doc/changelog.html#Tomcat_9.0.27_(markt)){:target="_blank"}를 확인해봤다.  
Catalina 모듈 수정 내역에  
_Correct a regression introduced in 9.0.25 that prevented configuration files from being loaded from the class path._ 라는 내용이 있는데  
9.0.25에서 Class Path에 있는 파일을 읽어들이는 부분을 수정했고 이게 문제가 되어서 수정을 한것 같다.  
인증서 jks 파일이 Class Path에 있었기 때문에 제대로 못 읽어 들인것 같고, 톰캣 소스에 어떤 부분을 수정했는지 까지는 확인하지 못했지만  
깃허브 이슈, 톰캣 Change Log 덕분에 어느 부분에서 문제가 발생했는지 명확히 확인 할 수 있어서 좋았다.(~~찝찝함이 사라졌다~~)

## 전체 Stack Trace

```java
2020-07-09 15:37:43.950 ERROR 3012 --- [main] org.apache.catalina.util.LifecycleBase   : Failed to start component [Connector[HTTP/1.1-443]]

org.apache.catalina.LifecycleException: Protocol handler start failed
	at org.apache.catalina.connector.Connector.startInternal(Connector.java:1008) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:183) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.catalina.core.StandardService.addConnector(StandardService.java:227) [tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.addPreviouslyRemovedConnectors(TomcatWebServer.java:263) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.start(TomcatWebServer.java:195) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.startWebServer(ServletWebServerApplicationContext.java:297) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.finishRefresh(ServletWebServerApplicationContext.java:163) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:552) [spring-context-5.1.10.RELEASE.jar!/:5.1.10.RELEASE]
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:141) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:744) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:391) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:312) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1215) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1204) [spring-boot-2.1.9.RELEASE.jar!/:2.1.9.RELEASE]
	at authentication.saml.idp.AuthenticationSamlIdpApplication.main(AuthenticationSamlIdpApplication.java:10) [classes!/:na]
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.8.0_202]
	at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:1.8.0_202]
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:1.8.0_202]
	at java.lang.reflect.Method.invoke(Unknown Source) ~[na:1.8.0_202]
	at org.springframework.boot.loader.MainMethodRunner.run(MainMethodRunner.java:48) [authentication-saml-idp-1.0.0.jar:na]
	at org.springframework.boot.loader.Launcher.launch(Launcher.java:87) [authentication-saml-idp-1.0.0.jar:na]
	at org.springframework.boot.loader.Launcher.launch(Launcher.java:51) [authentication-saml-idp-1.0.0.jar:na]
	at org.springframework.boot.loader.JarLauncher.main(JarLauncher.java:52) [authentication-saml-idp-1.0.0.jar:na]
Caused by: java.lang.IllegalArgumentException: Stream closed
	at org.apache.tomcat.util.net.AbstractJsseEndpoint.createSSLContext(AbstractJsseEndpoint.java:99) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.AbstractJsseEndpoint.initialiseSsl(AbstractJsseEndpoint.java:71) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.NioEndpoint.bind(NioEndpoint.java:218) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.AbstractEndpoint.bindWithCleanup(AbstractEndpoint.java:1124) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.AbstractEndpoint.start(AbstractEndpoint.java:1210) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.coyote.AbstractProtocol.start(AbstractProtocol.java:585) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.catalina.connector.Connector.startInternal(Connector.java:1005) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	... 22 common frames omitted
Caused by: java.io.IOException: Stream closed
	at java.io.BufferedInputStream.getBufIfOpen(Unknown Source) ~[na:1.8.0_202]
	at java.io.BufferedInputStream.read(Unknown Source) ~[na:1.8.0_202]
	at java.io.BufferedInputStream.fill(Unknown Source) ~[na:1.8.0_202]
	at java.io.BufferedInputStream.read(Unknown Source) ~[na:1.8.0_202]
	at java.security.DigestInputStream.read(Unknown Source) ~[na:1.8.0_202]
	at java.io.DataInputStream.readInt(Unknown Source) ~[na:1.8.0_202]
	at sun.security.provider.JavaKeyStore.engineLoad(Unknown Source) ~[na:1.8.0_202]
	at sun.security.provider.JavaKeyStore$JKS.engineLoad(Unknown Source) ~[na:1.8.0_202]
	at sun.security.provider.KeyStoreDelegator.engineLoad(Unknown Source) ~[na:1.8.0_202]
	at sun.security.provider.JavaKeyStore$DualFormatJKS.engineLoad(Unknown Source) ~[na:1.8.0_202]
	at java.security.KeyStore.load(Unknown Source) ~[na:1.8.0_202]
	at org.apache.tomcat.util.security.KeyStoreUtil.load(KeyStoreUtil.java:69) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.SSLUtilBase.getStore(SSLUtilBase.java:217) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.SSLHostConfigCertificate.getCertificateKeystore(SSLHostConfigCertificate.java:206) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.SSLUtilBase.getKeyManagers(SSLUtilBase.java:283) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.SSLUtilBase.createSSLContext(SSLUtilBase.java:247) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	at org.apache.tomcat.util.net.AbstractJsseEndpoint.createSSLContext(AbstractJsseEndpoint.java:97) ~[tomcat-embed-core-9.0.26.jar!/:9.0.26]
	... 28 common frames omitted

2020-07-09 15:37:43.981  INFO 3012 --- [main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2020-07-09 15:37:43.981  INFO 3012 --- [main] ConditionEvaluationReportLoggingListener : 

Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2020-07-09 15:37:43.996 ERROR 3012 --- [main] o.s.b.d.LoggingFailureAnalysisReporter   : 

***************************
APPLICATION FAILED TO START
***************************

Description:

The Tomcat connector configured to listen on port 443 failed to start. The port may already be in use or the connector may be misconfigured.

Action:

Verify the connector's configuration, identify and stop any process that's listening on port 443, or configure this application to listen on another port.
```
