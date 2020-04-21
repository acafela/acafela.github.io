---
layout: post
title: Salesforce SAML SSO 설정하기
date: 2020-04-11 10:39:28 +0900
categories: Salesforce SAML SSO
---

POC로 개발한 IdP 서버를 사용해 Salesforce와 SAML SSO를 할일이 있었습니다.  
Salesforce를 써본적이 없어 Salesforce 설정 할때 조금 헤맸었습니다.  
이 게시글에서는 Salesforce SAML SSO 설정 방법을 설명합니다. 

### 1. 메인화면 상단 [Setup] 클릭 설정화면 이동

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture1.png)

### 2. [Settings > Identity > Single Sign-On Settings] 이동 [Edit] 버튼 클릭

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture2.png)

### 3. [SAML Enabled] 체크 후 [Save] 버튼 클릭

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture3.png)

### 4. [New] 버튼 클릭 SAML SSO 설정 값 추가

  > _제공받은 메타데이터 XML 파일이 있다면 [New From Metadata File] 클릭해 간편히 설정 가능(그리고 5번 건너뛰시면 됩니다.)_

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture4.png)

### 5. SSO 설정 값 입력 [Save] 버튼 클릭

  > _현재 화면의 설정 값(SAML)에 대한 상세한 설명은 별도로 게시할 생각입니다._

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture5.png)

### 6. [Company Settings > My Domain] Authentication Configuration [Edit] 클릭
  
  > _우선 My Domain 등록이 되어 있어야 진행 할 수 있습니다.[(My Domain 등록하기)](https://help.salesforce.com/articleView?id=domain_name_define.htm&type=5){:target="_blank"}_

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture6.png)

### 7. Authentication Service에서 5번 항목에서 설정한 SSO 설정 체크 후 [Save]

  ![Salesforce SAML SSO 설정화면 캡쳐](/assets/capture/salesforce-saml-sso-capture7.png)

### 8. 테스트

  https://{yourdomainname}.my.salesforce.com 접속해서 설정된 IdP Login URL로 리다이렉트 되는지 확인합니다.

## Reference

  - [자습서: Salesforce와 Azure Active Directory SSO(Single Sign-On) 연결](https://docs.microsoft.com/ko-kr/azure/active-directory/saas-apps/salesforce-tutorial){:target="_blank"}
  - [Configure SAML Settings for Single Sign-On](https://help.salesforce.com/articleView?id=sso_saml.htm&type=5){:target="_blank"}