---
layout: post
title: "Prometheus, Grafana로 Spring Boot(+Custom metrics) 모니터링 하기 - 2"
date: 2021-11-29 00:00:00 +0900
categories: Monitoring
tags: [Monitoring, Prometheus, Grafana, SpringBoot]
preview_image: /assets/capture/prometheus/panel.png
---

이번 글에서는 [Prometheus, Grafana로 Spring Boot(+Custom metrics) 모니터링 하기 - 1](/monitoring/2021/11/28/prometheus-grafana-springboot-1.html) 에 이어서 Grafana 설치, 대시보드 구성을 해보겠습니다.

## 순서

1. Prometheus 설치 [(이전글)](/monitoring/2021/11/28/prometheus-grafana-springboot-1.html)
2. Spring Boot Sample 앱 만들기 [(이전글)](/monitoring/2021/11/28/prometheus-grafana-springboot-1.html)
3. Prometheus target 설정 [(이전글)](/monitoring/2021/11/28/prometheus-grafana-springboot-1.html)
4. __Grafana 설치__
5. __Grafana 대시보드 구성__

## Grafana 설치

Prometheus와 마찬가지로 Docker를 사용하여 설치 하겠습니다.

```bash
docker run -p 3000:3000 grafana/grafana
```

[http://localhost:3000](http://localhost:3000) 접속  
초기 계정은 admin/admin 입니다.

## Grafana 대시보드 구성

### Data Source 설정

우선 이전에 설치한 Prometheus를 Data source로 설정해줘야 합니다.  
  
Configration -> Data source로 이동([http://localhost:3000/datasources](http://localhost:3000/datasources)) Add data source -> Prometheus 선택  
Prometheus의 URL을 입력 합니다. Mac, Windows에서 Docker Desktop 버전을 사용중이면 _http://host.docker.internal:9090_ 를 입력 하면 됩니다.  
기타 다른 환경이면 내부 IP를 입력해줍니다.  

![grafana-datasource-1](/assets/capture/prometheus/grafana-datasource-1.png){:width="50%"}

하단 _Save & Test_ 버튼으로 저장 및 연결 테스트를 합니다.  
_"Data source is working"_ 이라고 나타나면 성공입니다.  
![grafana-datasource-2](/assets/capture/prometheus/grafana-datasource-2.png){:width="50%"}

### 신규 대시보드 만들기

Create -> Dashboard 를 선택합니다. 생성된 대시보드에서 _Add an empty panel_ 을 클릭합니다.  
JVM Heap 메모리 사용을 모니터링 할 수 있는 패널을 만들어 보겠습니다.

![panel](/assets/capture/prometheus/panel.png){:width="75%"}

_Metric browser_ 에 `sum(jvm_memory_used_bytes{area="heap"})` 을 입력합니다.  
상단위 시계 아이콘이 있는 버튼을 클릭하면 범위 지정이 가능합니다.  
Apply를 선택하면 패널 추가가 완료 됩니다.  
  
모니터링에 필요한 패널들을 추가해가면 모니터링에 사용 할 수 있는 대시보드를 구성 할 수 있습니다 👍  
