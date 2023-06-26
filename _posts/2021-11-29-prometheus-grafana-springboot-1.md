---
layout: post
title: "Prometheus, Grafana로 Spring Boot(+Custom metrics) 모니터링 하기 - 1"
date: 2021-11-29 00:00:00 +0900
categories: Monitoring
tags: [모니터링, Prometheus, Grafana, SpringBoot]
preview_image: /assets/capture/prometheus/actuator-metrics.png
---

Prometheus + Grafana 으로 Spring Boot 어플리케이션을 모니터링 할 수 있는 환경을 구성해보고 Custom Metric 생성 하는 방법도 살펴보겠습니다.

## 순서

1. __Prometheus 설치__
2. __Spring Boot Sample 앱 만들기__
3. __Prometheus target 설정__
4. Grafana 설치 [(다음글)](/monitoring/2021/11/28/prometheus-grafana-springboot-2.html)
5. Grafana 대시보드 구성 [(다음글)](/monitoring/2021/11/28/prometheus-grafana-springboot-2.html)

## Prometheus 설치

> 공식 문서에 도커를 사용하여 설치하는 방법이 안내되어 있습니다. 이 부분을 참고하여 설치 하겠습니다.  
> [https://prometheus.io/docs/prometheus/latest/installation/#using-docker](https://prometheus.io/docs/prometheus/latest/installation/#using-docker){:target="_blank"}  

### prometheus.yml 파일 작성

편한 경로에 prometheus.yml 파일을 생성하고 아래 내용을 작성합니다.  
뒤에서 설정 수정이 필요하기 때문에 자체 설정 파일을 만듭니다.  

```yaml
global:
  scrape_interval: 5s
  external_labels:
    monitor: 'my-demo-monitor'
```

### prom/prometheus 도커 실행

실행시에 prometheus.yml 파일을 bind-mount 합니다.  

```bash
docker run \
    -p 9090:9090 \
    -v {생성한 prometheus.yml 파일 경로}:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

### Prometheus 실행 확인

[http://localhost:9090](http://localhost:9090) 으로 접속해 봅니다. 잘 실행되었으면 Prometheus 웹 화면에 접속이 됩니다.  
메뉴에 _Status -> Configuration_ 으로 이동하면 설정 내용을 웹에서 확인 가능합니다.

![web-config](/assets/capture/prometheus/web-config.png){:width="50%"}

다음으로 모니터링할 샘플 앱을 생성하겠습니다.

## Spring Boot Sample 앱 생성

### Dependency 추가

`spring-boot-starter-web`, `spring-boot-starter-actuator`, `micrometer-registry-prometheus` dependency를 추가 합니다.  
`actuator` 는 어플리케이션 모니터링(메트릭 수집, 헬스 체크 등), 관리를 도와주는 기능입니다. _HTTP Endpoint_ 를 제공합니다.  
`micrometer-registry-prometheus` 는 메트릭을 Prometheus가 읽을 수 있는 형태로 제공하는 역할을 합니다.

#### Gradle

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-actuator'
implementation 'io.micrometer:micrometer-registry-prometheus'
```

#### Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
<groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### application.yml 파일 수정

prometheus endpoint 노출을 위해서 application.yml 파일에 아래 내용을 추가합니다.

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "prometheus"
```

### 어플리케이션 실행해서 메트릭 확인하기

[http://localhost:8080/actuator](http://localhost:8080/actuator) 접속 _Prometheus endpoint_ 확인  
![actuator](/assets/capture/prometheus/actuator.png){:width="75%"}

Prometheus endpoint([http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus")) 접속  
메트릭 데이터 확인 👓 👓  
![actuator-metrics](/assets/capture/prometheus/actuator-metrics.png){:width="75%"}

## Custom Metric 생성

테스트 용 컨트롤러를 만들어서 /test 요청이 오면 _my_demo_count_total_ 메트릭을 증가 시킵니다.  
메트릭에는 _my_label_a, my_label_b_ 두개의 라벨이 있습니다.

```java
import io.micrometer.core.instrument.Metrics;
import io.micrometer.core.instrument.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SampleController {

    @GetMapping("/test")
    public String test() {
        List<Tag> tags = List.of(
                Tag.of("my_label_a", "A"),
                Tag.of("my_label_b", "B")
        );
        Metrics.counter("my.demo.count.total", tags).increment();
        return "test";
    }

}
```

[http://localhost:8080/test](http://localhost:8080/test) 를 몇 차례 호출하고 prometheus endpoint([http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus"))에 접속하여 추가한 메트릭 _my_demo_count_total_ 이 잘 나오는지 확인 합니다.

![custom-metrics](/assets/capture/prometheus/custom-metrics.png){:width="50%"}

## Prometheus target 설정

이제 생성한 샘플앱의 매트릭을 Prometheus가 가져갈 수 있도록 promethues target을 설정하겠습니다.

### prometheus.yml 파일에 내용 추가

_targets_ 은 ip, port를 입력하고 _metrics_path_ 는 actuator endpoint를 입력합니다.  
내용 추가 후 Prometheus를 재시작 합니다.

```yaml
scrape_configs:
  - job_name: 'prometheus'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
    - targets: ['localhost:8080']
```

### Prometheus target 확인

[http://localhost:9090/targets](http://localhost:9090/targets)에 접속해서 State 상태를 확인합니다.  
정상적이면 __UP__ 이라고 나타납니다.

![state](/assets/capture/prometheus/state.png){:width="60%"}

### 메트릭 확인

[http://localhost:9090/graph](http://localhost:9090/graph)에 접속해서 생성했던 메트릭을 조회해 봅니다.

![graph](/assets/capture/prometheus/graph.png){:width="60%"}

Grafana 설치 & 대시보드 구성은 다음 글에서 이어서 보실 수 있습니다.     
다음글 : [Prometheus, Grafana로 Spring Boot(+Custom metrics) 모니터링 하기 - 2](/monitoring/2021/11/28/prometheus-grafana-springboot-2.html){:target="_blank"}