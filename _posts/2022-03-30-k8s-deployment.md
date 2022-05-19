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

- A : Deployment는 Pod에 생성 정보(template, selector, replicas)를 가지고 있습니다.  
Depolyment는 Pod를 생성을 직접 하지 않고 __이를 대신할 ReplicaSet을 만듭니다.__ ReplicaSet에는 Deployment의 Pod 생성에 필요한 정보들이 전달 됩니다.
- B : ReplicaSet은 template에 명시된 Pod를 replicas 갯수만큼 생성합니다.  
Pod 생성시에 명시된 라벨과 함께, 자신의 Pod를 구분하기 위한 추가적인 라벨을 붙여 줍니다(pod-template-hash)
- C : Service는 selector를 통해서 Pod와 연결 되고, 연결된 Pod 들은 Service에 의해서 로드밸런싱 됩니다.
- D : 신규 버전 이미지로 Deployment를 업데이트 하게 되면, 새로운 ReplicaSet이 만들어 집니다.  
배포 방식에 따라서 신규, 이전 ReplicaSet의 replicas 숫자가 조정되며, 최종적으로 이전 버전 ReplicaSet(그림에서 D)의 replicas는 0으로 조정 되고 연결된 Pod들은 삭제 됩니다.  
유지할 ReplicaSet의 숫자는 Deployment에 명시 할 수 있습니다(revistionHistoryLimit, 기본 값은 10)

감사합니다.