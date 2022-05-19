---
layout: post
title: "Kubernetes - Deployment, ReplicaSet"
date: 2022-03-30 00:00:00 +0900
categories: Monitoring
tags: [Kubernetes]
preview_image: /assets/capture/k8s-deployment.png
---

Deployment를 통해 ReplicaSet을 생성하고 ReplicaSet이 명시된 Pod 갯수를 유지하는 흐름에 대한 설명입니다.

## Deployment & ReplicaSet

![kubernetes-deployment](/assets/capture/k8s-deployment.png)

각 단계별 설명

### [ A ] Deployment가 replicaSet을 생성 합니다
- Deployment는 template, selector, replicas 가 선언 되어 있습니다.
  - template : 생성할 Pod에 붙을 label, 실행할 컨테이너 정보 정의
  - selector : deployment가 관리할 Pod를 찾을 방법 정의
  - replicas : 생성할 Podd의 갯수 정의
- Depolyment는 Pod를 생성을 직접 하지 않고 이를 __ReplicaSet을 통하여 처리 합니다.__ 

### [ B ] ReplicaSet이 Pod를 실행 시킵니다
- Deployment가 생성되거나 업데이트 되면 deployment가 소유하는 replicaSet이 만들어 집니다.
- ReplicaSet은 정의된 pod를 replicas 갯수만큼 실행합니다
- ReplicaSet은 생성시에 정의된 라벨과 함께, 각 replicaSet을 구분하기 위한 추가적인 라벨(*pod-template-hash*)을 붙여 줍니다.
- ReplicaSet이 소유하는 Pod에는 *pod-template-hash* 라벨이 붙고, 이를 통해서 소유하고 있는 pod를 구분 할 수 있습니다.

### [ C ] Service selector와 일치하는 Pod들이 연결 됩니다
- Service는 *app: demo-app* 라벨이 붙은 Pod를 찾습니다.
- 연결된 Pod 집합은 service에 의해서 로드밸런싱 됩니다.

### [ D ] 이전 버전의 replicaSet
- Deployment를 업데이트 하게 되면, 새로운 ReplicaSet이 만들어 집니다.
- 배포 방식에 따라서 신규, 이전 ReplicaSet의 replicas 숫자가 조정되며, 최종적으로 이전 버전 ReplicaSet(그림에서 D)의 replicas는 0으로 조정 되고 연결된 Pod들은 삭제 됩니다.
- 유지할 ReplicaSet의 숫자는 Deployment에 명시 할 수 있습니다(revistionHistoryLimit, 기본 값은 10)

감사합니다.