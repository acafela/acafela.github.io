---
title: "Apache Reverse Proxy 설정"
date: 2019-12-12 10:39:28 -0400
categories: Web
---

## LoadModule 주석 해제

```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

## Proxy 설정

```apache
    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass /pages http://localhost:9105/pages
    ProxyPassReverse /pages http://localhost:9105/pages

    ProxyPassMatch    ^(/.*\.json)$ http://localhost:9105/$1    # 정규표현식 사용한 매치(*.json 모두 처리)
    ProxyPassReverse  ^(/.*\.json)$ http://localhost:9105/$1
```
