---
layout: post
title: "Apache Reverse Proxy 설정"
date: 2019-12-12
categories: [Apache]
sitemap :
  lastmod : 2021-12-16
---

Apache에서 지원하는 Reverse Proxy 설정하는 방법입니다.

## LoadModule 주석 해제

우선 Proxy 관련한 모듈 사용을 위해 아래 라인의 주석을 해제해 줍니다.

```shell
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

## Proxy 설정

### 1. ProxyPass 사용 프록시 설정

URL(/api)에 대해 http://localhost:9105/api/v10 로 요청 넘기기

```shell
<VirtualHost *:80>
  ProxyPass /api http://localhost:9105/api/v10
  ProxyPassReverse /api http://localhost:9105/api/v10
</VirtualHost>
```

### 2. ProxyPassMatch 사용 프록시 설정

URL(.json으로 끝나는)에 대해 http://localhost:9105 로 요청 넘기기

```shell
<VirtualHost *:80>
  ProxyPassMatch ^(/.*\.json)$ http://localhost:9105/$1
  ProxyPassReverse ^(/.*\.json)$ http://localhost:9105/$1
</VirtualHost>
```
