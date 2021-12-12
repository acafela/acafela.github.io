---
layout: post
title: "HTTP Cache"
date: 2021-11-10
categories: HTTP Cache
sitemap :
  lastmod : 2021-11-10
---

HTTP Cache에 대한 정리

## Cache-Control 헤더

### no-cache 지시자
마치 전혀 캐싱을 사용하지 않을것 같지만 아닙니다.  
컨텐츠는 캐시 될 수 있으나, 모든 요청 마다 원 서버에 캐시가 유효한지 확인 해야 한다는 의미입니다.  
다시 말하면 컨텐츠는 브라우저 캐시 리소스 저장소에 저장되고, 이것을 사용하기 전 유효성 검사에서 유효하다 라고 판단된 경우에만 사용 됩니다.  
https://httpwg.org/specs/rfc7234.html#cache-request-directive.no-cache

### no-store 지시자
요청에 어떤 응답도 저장해서는 안된다는 의미 입니다.  
RFC에 "MUST NOT store"라고 설명되어 있습니다.  
https://httpwg.org/specs/rfc7234.html#cache-request-directive.no-store

## 


## 참고
- https://httpwg.org/specs/rfc7234.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
