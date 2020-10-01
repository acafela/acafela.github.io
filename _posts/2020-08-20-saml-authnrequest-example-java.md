---
layout: post
title: Java SAML Request 예제
date: 2020-08-20 00:00:00 +0000
categories: SAML SAMLRequest AuthnReuqest
---

Java OpenSAML 사용해서 AuthnReuqest 생성하는 예제 입니다.  
SAML SP-Initiated Flow에서 AuthnReuqest는 *Service Provider -> Identity Provider*로 전송 됩니다.

## Example

[OpenSAML2](https://wiki.shibboleth.net/confluence/display/OpenSAML/OSTwoUserManual){:target="_blank"} 사용해 AuthnRequest를 생성합니다.

### Dependency

Gradle 또는 Maven OpenSAML Dependency 설정

#### Gradle

```gradle
compile group: 'org.opensaml', name: 'opensaml', version: '2.6.4'
```

#### Maven

```xml
<dependency>
    <groupId>org.opensaml</groupId>
    <artifactId>opensaml</artifactId>
    <version>2.6.4</version>
</dependency>
```

### Source

#### AuthnRequest 만들고, 출력 해보기

전체 소스 올리는게 테스트 할때 편할것 같아 전체 소스를 올립니다.  
소스에 대한 설명은 주석으로 달아놨습니다.

**실제 Spring 프로젝트에 적용하기 위한 Spring Security 에 적용한 샘플 보기**

- [SamlSsoEntryPoint.java](https://github.com/acafela/java-saml-example/blob/master/saml-example-sp/src/main/java/saml/example/sp/SamlSsoEntryPoint.java){:target="_blank"}
- [WebSecurityConfigurer.java](https://github.com/acafela/java-saml-example/blob/master/saml-example-sp/src/main/java/saml/example/sp/WebSecurityConfigurer.java){:target="_blank"}

```java
package saml.example.sp;

import org.joda.time.DateTime;
import org.opensaml.Configuration;
import org.opensaml.DefaultBootstrap;
import org.opensaml.common.SAMLObject;
import org.opensaml.common.SAMLVersion;
import org.opensaml.common.xml.SAMLConstants;
import org.opensaml.saml2.core.AuthnRequest;
import org.opensaml.saml2.core.Issuer;
import org.opensaml.saml2.core.NameIDType;
import org.opensaml.xml.ConfigurationException;
import org.opensaml.xml.XMLObjectBuilderFactory;
import org.opensaml.xml.io.Marshaller;
import org.opensaml.xml.io.MarshallerFactory;
import org.opensaml.xml.io.MarshallingException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSSerializer;

import javax.xml.namespace.QName;
import java.util.UUID;

public class Main {

    static String issuerUrl = "https://acafela.github.io";   // Issuer element value로 사용할 값 입력
    static String acsUrl = "https://acafela.github.io/acs";  // ACS URL 입력

    public static void main(String[] args) {
        try {
            // OpenSAML Library 초기화
            DefaultBootstrap.bootstrap();
            // Issuer 생성
            Issuer issuer = buildIssuer(issuerUrl);
            // AuthnRequest 생성
            AuthnRequest authnRequest = buildAuthnRequest(acsUrl, SAMLConstants.SAML2_POST_BINDING_URI, issuer);
            // 생성한 AuthnRequest 찍어보기 위해 String으로 변경
            String authnRequestTxt = samlObjectToString(authnRequest);
            // AutnRquest Console 출력
            System.out.println(authnRequestTxt);
        } catch (ConfigurationException e) {
            System.err.println("OpenSAML 초기 설정 실패");
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    static <T> T buildSAMLObject(final Class<T> objectClass, QName qName) {
        XMLObjectBuilderFactory builderFactory = Configuration.getBuilderFactory();
        return (T) builderFactory.getBuilder(qName).buildObject(qName);
    }

    // AuthnRequest 관련 추가 설정은 이 메소드 수정
    static AuthnRequest buildAuthnRequest(String acsUrl, String protocolBinding, Issuer issuer) {
        AuthnRequest authnRequest = buildSAMLObject(AuthnRequest.class, AuthnRequest.DEFAULT_ELEMENT_NAME);
        authnRequest.setIsPassive(true);
        authnRequest.setVersion(SAMLVersion.VERSION_20);
        authnRequest.setAssertionConsumerServiceURL(acsUrl);
        authnRequest.setProtocolBinding(protocolBinding);
        authnRequest.setIssuer(issuer);
        authnRequest.setIssueInstant(new DateTime());
        authnRequest.setID(UUID.randomUUID().toString());
        return authnRequest;
    }

    static Issuer buildIssuer(String issuingEntityName) {
        Issuer issuer = buildSAMLObject(Issuer.class, Issuer.DEFAULT_ELEMENT_NAME);
        issuer.setValue(issuingEntityName);
        issuer.setFormat(NameIDType.ENTITY);
        return issuer;
    }

    static String samlObjectToString(SAMLObject object) {
        try {
            Element ele = samlObjectToElement(object);
            return elementToString(ele);
        } catch (MarshallingException | IllegalArgumentException e) {
            e.printStackTrace();
            return "";
        }
    }

    static org.w3c.dom.Element samlObjectToElement(SAMLObject object) throws MarshallingException {
        org.w3c.dom.Element element = null;
        try {
            MarshallerFactory unMarshallerFactory = Configuration.getMarshallerFactory();
            Marshaller marshaller = unMarshallerFactory.getMarshaller(object);
            element = marshaller.marshall(object);
        } catch (ClassCastException e) {
            throw new IllegalArgumentException("The class does not implement the interface XMLObject", e);
        }
        return element;
    }

    static String elementToString(org.w3c.dom.Element ele) {
        Document document = ele.getOwnerDocument();
        DOMImplementationLS domImplLS = (DOMImplementationLS) document.getImplementation();
        LSSerializer serializer = domImplLS.createLSSerializer();
        return serializer.writeToString(ele);
    }

}
```

### 실행 결과

결과 확인을 위해서 SAMLObject 문자열로 만들어놨기 때문에 콘솔에 아래와 같이 출력되는걸 확인 할 수 있습니다.

```xml
<?xml version="1.0" encoding="UTF-16"?>
<saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" 
    AssertionConsumerServiceURL="https://acafela.github.io/acs" 
    ID="f30aa770-0423-44da-ae5a-f78dfc457b8a" 
    IsPassive="true" 
    IssueInstant="2020-08-20T00:18:51.314Z" 
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
    Version="2.0">
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" 
        Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">
        https://acafela.github.io
    </saml2:Issuer>
</saml2p:AuthnRequest>
```

#### Reference

- [OpenSAML](https://wiki.shibboleth.net/confluence/display/OpenSAML/OSTwoUsrManJavaWriteToXML){:target="_blank"}
- [SAML Core, OASIS](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf){:target="_blank"}
