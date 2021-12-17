---
layout: post
title: "Prometheus, Grafana로 Spring Boot(+Custom metrics) 모니터링 하기"
date: 2021-11-29 00:00:00 +0900
categories: Prometheus SpringBoot
---

## 순서
1. Prometheus 설치
2. Spring Boot Sample 앱 만들기  
  2.1 actuator 설정  
  2.2 Custom metric 생성  
3. Prometheus target 설정
4. Grafana 설치
5. Grafana 대시보드 구성  
  5.1 Datasource 설정
  5.2 패널 생성