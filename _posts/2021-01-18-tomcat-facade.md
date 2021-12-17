---
layout: post
title: "Tomcat의 RequestFacade, ResponseFacade 클래스 - 안전하게 Request, Response 전달하기"
date: 2021-01-18
categories: [Tomcat]
sitemap :
  lastmod : 2021-12-16
---

톰캣이 어떤 목적으로 Request, Response 전달에 Facade 클래스를 사용하고 있는지, 톰캣의 관련 주요 클래스, 인터페이스와 코드를 살펴보겠습니다.

## HttpServlet doXXX 메소드

톰캣은 서블릿 개발자에게 doXXX 메소드를 통해 HttpServletRequest, HttpServletResponse 인터페이스를 제공합니다.  
이 글에서 살펴볼 인터페이스 구현 클래스는 2가지 입니다. "`org.apache.catalina.connector.Request`, `org.apache.catalina.connector.Response`" 와 "`org.apache.catalina.connector.RequestFacade`, `org.apache.catalina.connector.ResponseFacade`" 입니다.  

![tomcat-facade-class-diagram](/assets/capture/tomcat-facade.png)

이 중에서 doXXX 메소드를 통해 우리에게 실제 전달 되는 클래스는 Facade 클래스들 입니다.

## 어떤 목적으로 Facade 클래스를 사용하고 있을까?

`org.apache.catalina.connector.Request`, `org.apache.catalina.connector.Response` 클래스는 `recycle()`, `getConnector()`, `getContext()` 와 같은 <u>외부에서 사용되면 안되는</u> public 메소드 들이 존재합니다.  
만약에 이 클래스들이 그대로 전달 된다면 서블릿 개발자는 HttpServletRequest, HttpServletResponse를 다운캐스팅해 public 메소드를 호출 할 수 있을것 입니다.  
이 때문에 Facade 클래스를  Request, Response 클래스에 대한 __접근 제어 목적__ 으로 사용하고 있습니다.  
RequestFacade, ResponseFacade는 __서블릿 개발자가 접근해도 안전한 메소드만을 정의해뒀기 때문에 이 facade 클래스를 통해서 안전하게 Request, Response를 전달__ 할 수 있습니다.  

## 톰캣의 관련 주요 코드

> 실제 톰캣 코드를 통해 어떤 식으로 Facade 클래스를 사용하고 있는지 살펴 보겠습니다.  
> Tomcat 10.1 버전의 코드 입니다.

RequestFacade 클래스는 생성자에서 Request 객체를 전달 받아 레퍼런스에 할당하고  
모든 메소드는 내부에서 래핑된 Request의 메소드를 호출하는것으로 위임합니다.

- Request 클래스 `getRequest()` 메소드 : Request 인스턴스가 아닌 __RequestFacade 인스턴스를 생성해__ 리턴

  ```java
  public HttpServletRequest getRequest() {
    if (facade == null) {
      facade = new RequestFacade(this);
    }
    if (applicationRequest == null) {
      applicationRequest = facade;
    }
    return applicationRequest;
  }
  ```

- RequestFacade 생성자에서는 Request 객체를 전달 받아 레퍼런스에 할당

  ```java
  protected Request request = null;
  ...
  public RequestFacade(Request request) {
    this.request = request;
  }
  ```

- RequestFacade ex) getAttribute 메소드 : __모든 메소드들이 아래와 같이 래핑된 request의 메소드를 호출 하는것으로 위임__

  ```java
  public Object getAttribute(String name) {

    if (request == null) {
      throw new IllegalStateException(
                      sm.getString("requestFacade.nullRequest"));
    }

    return request.getAttribute(name);
  }
  ```

ResponseFacade 클래스에도 같은 방식이 적용됩니다!

## 콘솔에 찍어보기

- 전달되는 HttpServletRequest, HttpServletResponse의 클래스를 찍어보면  

  ```java
  @GetMapping("/")
  public String test(HttpServletRequest request, HttpServletResponse response) {
    System.out.println(request.getClass());
    System.out.println(response.getClass());
    return "test"
  }
  ```
  <!-- ![tomcat-facade-class-diagram](/assets/capture/tomcat-facade-3.png) -->

- `org.apache.catalina.connector.Request, org.apache.catalina.connector.Response` 클래스가 아닌
  파사드 클래스 `org.apache.catalina.connector.RequestFacade, org.apache.catalina.connector.ResponseFacade` 가 전달 되고 있음을 확인 할 수 있습니다.
  
  ![tomcat-facade-class-diagram](/assets/capture/tomcat-facade-2.png)

## 마무리
톰캣 코드의 Facade 클래스를 살펴봤습니다.  
참고하여 메소드 사용을 제한해야 하는데 접근 제어자(private or default)를 사용 할 수 없는 상황일때 이와 유사한 방법으로 해결 할 수 있을 것 같습니다.

## 참고

- [톰캣 소스](https://github.com/apache/tomcat){:target="_blank"}
- [org.apache.catalina.connector 패키지 문서](https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/connector/package-summary.html){:target="_blank"}

감사합니다 👍