---
layout: post
title: "Tomcat의 RequestFacade, ResponseFacade 클래스 - 안전하게 Request, Response 전달하기"
date: 2021-01-18 10:39:28 +0900
categories: Facade Tomcat
---

톰캣 소스를 보다 RequestFacade, ResponseFacade 클래스를 보고 어떻게 사용되었지? 보다가 정리한 내용입니다.  

톰캣은 서블릿 개발자에게 doXXX 메소드를 통해 HttpServletRequest, HttpServletResponse 인터페이스를 제공합니다.  
톰캣 내부에 각각을 구현한 클래스는 _org.apache.catalina.connector.Request, org.apache.catalina.connector.Response_ 입니다.  
Request, Response 클래스는 recycle(), getConnector(), getContext() 와 같은 외부에서 사용되면 안되는 public 메소드 들이 존재합니다.  
만약에 이 클래스들이 그대로 전달 된다면 서블릿 개발자는 HttpServletRequest, HttpServletResponse를 다운캐스팅해 public 메소드를 호출 할 수 있을것 입니다.  
__이 때문에 파사드(facade) 클래스 RequestFacade, ResponseFacade를 Request, Response 클래스에 대한 접근 제어 목적으로 사용하고 있습니다.__  

RequestFacade, ResponseFacade 도 마찬가지로 HttpServletRequest, HttpServletResponse 구현 클래스이며  
__서블릿 개발자가 접근해도 안전한 메소드만을 정의해뒀기 때문에 이 facade 클래스를 통해서 안전하게 Request, Response를 전달__ 할 수 있습니다.
  
- 클래스 다이어그램
  
  ![tomcat-facade-class-diagram](/assets/capture/tomcat-facade.png)

  
### 톰캣의 관련 주요 코드

RequestFacade 클래스는 생성자에서 Request 객체를 전달 받아 레퍼런스에 할당하고  
모든 메소드는 내부에서 래핑된 Request의 메소드를 호출하는것으로 위임합니다.

- Request 클래스 getRequest 메소드 : Request 인스턴스가 아닌 __RequestFacade 인스턴스를 생성해__ 리턴
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
<p></p>
- RequestFacade 생성자에서는 Request 객체를 전달 받아 레퍼런스에 할당
```java
    protected Request request = null;
    ...
    public RequestFacade(Request request) {
        this.request = request;
    }
```
<p></p>
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

ResponseFacade 클래스에도 같은 방식이 적용된다.