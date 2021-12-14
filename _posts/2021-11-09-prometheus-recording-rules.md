---
layout: post
title: "Prometheus Rcording Rules 살펴보기 (예제)"
date: 2021-08-02 00:00:00 +0900
categories: Prometheus RecordingRules
---

_Recording rule_ 을 사용하면 미리 계산된 쿼리 결과를 새로운 시계열 데이터로 저장 할 수 있습니다.  
새롭게 생성된 시계열 데이터는 다른 데이터들 처럼 쿼리에 사용 될 수 있습니다.

## 언제 사용 될 수 있을까?

### 샘플수가 너무 많아 쿼리 실행이 느리거나, 한번의 쿼리에 사용 가능한 최대 샘플 수(_query.max-samples_ 설정 값) 초과로 쿼리 수행 자체가 막히는 경우  

- 매번 원본 데이터에 쿼리를 수행하는 것이 아닌 Recording rule로 미리 계산된 데이터에 쿼리를 수행하면 쿼리 성능 개선가능  
(사용되는 샘플 수를 확 줄일 수 있다!)  

### 대시보드를 구성하는 경우

- 일정 시간 마다 여러 패널에서 동일한 쿼리 반복할때, 반복되는 쿼리를 recording rule로 만들어두면 효율적으로 리소스를 사용 할 수 있다.

## 적용시 단점

- 설정한 정기적인 시간마다 쿼리를 수행하므로 당연히 리소스를 더 사용하게 되고
- rule로 새롭게 생성된 데이터를 저장할 저장공간도 추가로 필요함

## Recording Rule 설정하기

- rule 설정 yaml 파일 작성

  ```yaml
  groups:
  - name: test_rule # rule 그룹 이름
    interval: 1m # (Optional) rule 실행 주기 설정, 기본 값은 global.evaluation_interval
    rules:
    - record: job:requests:rate1m # rule로 생성될 시계열 데이터의 이름      
      expr: sum without (job) (rate(http_request_count_total[1m])) # 실행될 PromQL 표현식
  ```

- 생성한 rule 설정 파일이 문법적으로 문제 없는지 확인

  ```bash
  promtool check rules rules/example_rules.yml
  ```
  ![check-rules](/assets/capture/check-rules.png)
  실행 결과 - `SUCCESS: rules found` 확인

- prometheus.yml 파일에 rule 설정 파일 추가

  ```yaml
    # prometuehs.yml 파일 하단에 추가
    ...
    rule_files:
      - 'rules/example_rules.yml' # 여기서 경로는 prometuehs.yml 파일에서 상대경로
  ```

- Prometheus 설정 리로드

  ```bash
  kill -HUP {promethues proecess id}
  ```

- 설정 후 웹 화면에서 rule 확인(__path : /rules__)  
  ![rules-web](/assets/capture/rules-web.png)
  상태, 마지막 실행 시간, 소요 시간 확인 가능

## Recording Rule으로 생성된 데이터 사용

- recording rule로 생성된 _job:requests:rate1m_ 사용  
  다른 시계열 데이터와 동일하게 쿼리에서 사용 가능
  ![rules-graph](/assets/capture/rules-graph.png)

## 참고

- [https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [https://prometheus.io/docs/practices/rules/#recording-rules](https://prometheus.io/docs/practices/rules/#recording-rules)