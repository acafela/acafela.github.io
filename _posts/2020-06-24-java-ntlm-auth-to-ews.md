---
layout: post
title: "Java NTLM Over HTTP Protocol 인증"
date: 2020-06-25 10:39:28 +0900
categories: NTLM Java EWS
---

NTLM은 Windows 서버에서 인증을 제공하기 위한 프로토콜 중 하나 입니다.  
Challenge-Response 매커니즘 기반으로 사용자 또는 컴퓨터를 인증합니다.  
Legacy 시스템 연동을 위해서 LTLM 인증을 사용해야 할 경우가 종종 있습니다.  
간략히 정리한 NTLM Over HTTP Protocol의 인증 흐름 보시고 Java 프로그램에서 NTLM(Over HTTP Protocol) 인증을 위한 예제 소스를 참고하시기 바랍니다.

## 배경지식

### NTLM Over HTTP Protocol

HTTP 프로토콜을 사용하는 IIS 서비스, EWS(Exchange on-premises) 같은 시스템에서 NTLM 인증을 사용하기 위한 방식입니다.

### Authentication Flow

![Java SAML Example 인증 화면](/assets/capture/java-ntlm1.png)

## Java 예제

NTLM 인증을 사용하는 EWS(Exchange on-premises) GetFolder API 호출 예제입니다.  
Apache HttpClient 4.3.x 버전 이상이 필요합니다.  
예제 소스는 테스트 할 수 있는 Exchange 서버와 계정이 있다면 바로 실행해서 테스트 가능합니다.

### 소스

```java
public class MainDrive {
	
	static String soapEnvelopeSample = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:t=\"http://schemas.microsoft.com/exchange/services/2006/types\"><soap:Header><t:RequestServerVersion Version=\"Exchange2013\"/></soap:Header><soap:Body><GetFolder xmlns=\"http://schemas.microsoft.com/exchange/services/2006/messages\" xmlns:t=\"http://schemas.microsoft.com/exchange/services/2006/types\"><FolderShape><t:BaseShape>Default</t:BaseShape></FolderShape><FolderIds><t:DistinguishedFolderId Id=\"inbox\"></t:DistinguishedFolderId></FolderIds></GetFolder></soap:Body></soap:Envelope>";

	public static void main(String[] args) throws ClientProtocolException, URISyntaxException, IOException {
		String username = "{enter username}";
		String password = "{enter passowrd}";
		String domain = "{enter domain}";
		String serviceUrl = "{enter serviceUrl}";
		ExchangeClient exchangeClient = new ExchangeClient(serviceUrl, username, password, domain);
		exchangeClient.sendRequest(soapEnvelopeSample);
	}
	
	static class ExchangeClient {
		
		private String serviceUrl;
		private String username;
		private String password;
		private String domain;
		
	    private CloseableHttpClient httpClient;
	    private RequestConfig requestConfig;
	    private HttpClientConnectionManager connectionManager;
	    private SSLConnectionSocketFactory socketFactory;

		public ExchangeClient(String serviceUrl, String username, String password, String domain) {
			this.serviceUrl = serviceUrl;
			this.username = username;
			this.password = password;
			this.domain = domain;
			try {
				_init();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		private void _init() throws KeyManagementException, NoSuchAlgorithmException{

	         SSLContext context = SSLContexts.custom().useTLS().build();

	         X509TrustManager trustManager = new X509TrustManager() {
				public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
				public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
				public X509Certificate[] getAcceptedIssuers() {
					return new X509Certificate[0];
				}
	         };
	         X509TrustManager[] trusterManagers = new X509TrustManager[]{ trustManager };
	         context.init(null, trusterManagers, new SecureRandom());
	         
	         socketFactory = new SSLConnectionSocketFactory(context, SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
	         Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
																		                 .register("http", PlainConnectionSocketFactory.INSTANCE)
																		                 .register("https", socketFactory)
																		                 .build();
	         connectionManager = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
	         requestConfig = RequestConfig.custom().setSocketTimeout(10000)
	     		    								.setConnectTimeout(10000)
	     		    								.setProxyPreferredAuthSchemes(Arrays.asList(AuthSchemes.NTLM))
	     		    								.setTargetPreferredAuthSchemes(Arrays.asList(AuthSchemes.NTLM))
	     		    								.build();
		}
		
		private InputStream sendRequest(String requestBody) throws URISyntaxException, ClientProtocolException, IOException {
			    StringEntity requestEntity = new StringEntity(requestBody, "UTF-8");
	        requestEntity.setContentType("text/xml; charset=utf-8");
	        
	        URI uri = new URI(serviceUrl);
	        
	        HttpPost httpPost = new HttpPost(uri);
	        httpPost.setEntity(requestEntity);
	        
	        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
	        credentialsProvider.setCredentials(new AuthScope(uri.getHost(), uri.getPort(), AuthScope.ANY_REALM), new NTCredentials(username, password, uri.getHost(), domain));
	        
	        HttpClientBuilder builder = HttpClients.custom();
	        builder.setDefaultRequestConfig(requestConfig);
	        builder.setConnectionManager(connectionManager);
	        
	        Registry<AuthSchemeProvider> authSchemeRegistry = RegistryBuilder.<AuthSchemeProvider>create()
																					                .register(AuthSchemes.NTLM, new NTLMSchemeFactory())
																					                .build();
	        
	        builder.setDefaultAuthSchemeRegistry(authSchemeRegistry);
	        
	        httpClient = builder.setDefaultCredentialsProvider(credentialsProvider).build();

	        HttpResponse response = httpClient.execute(httpPost);
	        StatusLine statusLine = response.getStatusLine();
	        
	        System.out.println("Status Code : " + statusLine.getStatusCode());
	        
	        HttpEntity responseEntity = response.getEntity();
	        return responseEntity.getContent();
		}
	}
}
```
