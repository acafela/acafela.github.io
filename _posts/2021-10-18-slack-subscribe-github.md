---
layout: post
title: "Slack + GitHub 연동하기 (Slack GitHub 구독, 알림받기)"
date: 2021-10-18 00:00:00 +0900
categories: [Slack, GitHub]
---

GitHub를 Slack에 연동해서 여러 이벤트(`issues`, `pulls`, `commits`...)에 대한 알림을 받을 수 있습니다.  
Slack에 GitHub 앱을 추가하고 GitHub Repository를 구독하는 방법에 대해 살펴보겠습니다.

## 순서

1. Slack용 GitHub 앱 추가
2. Slack용 GitHub 앱 계정 연결
3. GitHub Repository 구독
4. 알림 테스트
5. GitHub 이벤트 별 구독/구독취소 방법

## Slack용 GitHub 앱 추가

Slack에서 GitHub 앱을 검색 합니다  
Add 버튼을 클릭하고 GitHub 앱을 추가 합니다.

![search-github-app](/assets/capture/slack-subscribe-github/search-github-app.png){:width="75%"}

GitHub 앱에서 권한을 요청합니다. Allow를 선택 합니다.

![allow-permission](/assets/capture/slack-subscribe-github/allow-permission.png){:width="40%"}

Apps 목록에 GitHub가 추가 됩니다.

![installed-github-app](/assets/capture/slack-subscribe-github/installed-github-app.png){:width="75%"}


## Slack용 GitHub 앱 계정 연결

계정 연결을 위해서 슬랙 메세지 창에 아래 명령어를 입력 합니다.

```bash
/github signin
```

1. `Connect GitHub account` 를 선택하고 Github에 로그인 하면 Verification Code 가 화면에 나타납니다.
2. `Enter code` 를 선택해 code 를 입력합니다.

![github-signin](/assets/capture/slack-subscribe-github/github-signin.png){:width="75%"}

![verificaton-code](/assets/capture/slack-subscribe-github/verification-code.png){:width="50%"}

Verfication Code 입력을 완료하면 "✅ Sucess! ..." 메세지를 확인 할 수 있습니다.

![github-signin-success](/assets/capture/slack-subscribe-github/github-signin-success.png){:width="75%"}

## GitHub Repository 구독

계정 연결까지 완료했으면 이제 알림 받을 Repository를 구독 하면 됩니다.  
__알림 받기 원하는 채널__ 로 이동 하고 아래 명령어를 입력합니다.

```bash
# 제가 테스트한 경우는 /github subscribe acafela/slack-test
/github subscribe {소유자}/{저장소}
```

Repository에 앱 설치가 안되어 있다고 메세지가 나타납니다. `Install GitHub App` 버튼을 클릭합니다.  

![install-github-app-to-repo](/assets/capture/slack-subscribe-github/install-github-app-to-repo.png){:width="75%"}

알림을 받을 Repository를 선택하고 Install 합니다.

![select-repo](/assets/capture/slack-subscribe-github/select-repo.png){:width="40%"}

Repository를 구독했다고 메세지가 나타나면 성공입니다.

![subscribe-ok](/assets/capture/slack-subscribe-github/subscribe-ok.png){:width="75%"}

## 알림 테스트

이제 알림이 잘 오는지 테스트를 위해 커밋을 해보겠습니다.  
커밋 메세지와 함께 _1 new commit pused to main by acafela_ 메세지를 확인 할 수 있습니다!

![commit-noti](/assets/capture/slack-subscribe-github/commit-noti.png){:width="75%"}

## GitHub 이벤트 별 구독/구독취소 방법

기본 값으로 `issues, pulls, commits, releases, deployments` 이벤트가 활성화 되어 있습니다.  
추가적인 이벤트 `reviews, comments, branches` 활성화를 위해서는 아래 명령어를 사용하면 됩니다.

```bash
/github subscribe {소유자}/{저장소} {이벤트명}
```

![subscribe-optional-ok](/assets/capture/slack-subscribe-github/subscribe-optional-ok.png){:width="75%"}

반대로 특정 이벤트 비활성화는 `unsubscribe` 명령어를 사용하면 됩니다.

```bash
/github unsubscribe {소유자}/{저장소} {이벤트명}
```

![unsubscribe-ok](/assets/capture/slack-subscribe-github/unsubscribe-ok.png){:width="75%"}

감사합니다 😀