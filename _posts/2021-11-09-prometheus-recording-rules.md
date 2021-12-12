---
layout: post
title: "Prometheus recording rules 살펴보기(예제)"
date: 2021-08-02 00:00:00 +0900
categories: Prometheus RecordingRules
---

## Recoring Rule

Recording rule을 사용하면 미리 계산된 쿼리 결과를 새로운 시계열 데이터로 저장 할 수 있습니다.  
샘플수가 너무 많아 쿼리 실행이 느리거나, 아에 실행이 안되는 경우(_query.max-samples_ 카운트 초과)  
매번 원본 데이터에 쿼리를 수행하는 것이 아닌 Recording rule로 미리 계산된 데이터에 쿼리를 수행하면 쿼리 성능을 개선할 수 있습니다.(사용되는 샘플 갯수를 확 줄일 수 있다!)  
대시보드를 구성하는 경우 일정 시간 마다 동일한 쿼리 반복하는데, 이때에도 유용하게 사용 될 수 있습니다.

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
  _SUCCESS: rules found_ 확인

  ![check-rules](/assets/capture/check-rules.png)

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

- 설정 후 웹 화면에서 rule 확인 가능(__path : /rules__)  
  상태, 마지막 실행 시간, 소요 시간 등 확인 가능  
  ![rules-web](/assets/capture/rules-web.png)

## Recording Rule으로 생성된 데이터 사용

- recording rule로 생성된 _job:requests:rate1m_ 사용  
  다른 시계열 데이터와 동일하게 쿼리에서 사용 가능
  ![rules-graph](/assets/capture/rules-graph.png)

## 참고

- https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
- https://prometheus.io/docs/practices/rules/#recording-rules