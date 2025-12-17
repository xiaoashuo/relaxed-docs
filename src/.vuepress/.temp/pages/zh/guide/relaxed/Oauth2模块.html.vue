<template><div><h1 id="oauth2的基本使用" tabindex="-1"><a class="header-anchor" href="#oauth2的基本使用"><span>Oauth2的基本使用</span></a></h1>
<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2>
<p>参考: <a href="http://www.ballcat.cn/guide/security/oauth2.html#%E6%8E%88%E6%9D%83%E8%AE%B8%E5%8F%AF" target="_blank" rel="noopener noreferrer">http://www.ballcat.cn/guide/security/oauth2.html#授权许可</a></p>
<p>这里只摘抄了部分文档，以便大家粗略了解 OAuth2 的 4 种授权类型。</p>
<p>更多内容可阅读 <a href="https://datatracker.ietf.org/doc/html/rfc6749" target="_blank" rel="noopener noreferrer">OAuth2 RFC6749open in new window</a>，中文翻译参看 <a href="https://www.bookstack.cn/read/RFC6749.zh-cn/SUMMARY.md" target="_blank" rel="noopener noreferrer">RFC6749 中文open in new window</a>。</p>
<p>OAuth 2.0 是一种授权协议。</p>
<p>在 OAuth 2.0 协议中，客户端在请求受保护的资源时，会通过一个 access token（一个代表特定的作用域、生命周期以及其他访问属性的字符串）来作为凭证，access token 由授权服务器在资源所有者认可的情况下颁发给第三方客户端。</p>
<p>先扔一张 OAuth 2.0 的 4 中授权许可的总结表格，防止下面文章太长不看：</p>
<figure><img src="https://hccake-img.oss-cn-shanghai.aliyuncs.com/md-source/OAuth2.png" alt="OAuth2" tabindex="0" loading="lazy"><figcaption>OAuth2</figcaption></figure>
<h2 id="角色" tabindex="-1"><a class="header-anchor" href="#角色"><span>角色</span></a></h2>
<p>OAuth 中定义了 4 种角色：</p>
<ul>
<li><strong>资源所有者</strong> <code v-pre>resource owner</code>：</li>
</ul>
<p>能够授予对受保护资源的访问权的实体。 当资源所有者是人时，它被称为 end-user。</p>
<ul>
<li>
<p><strong>资源服务器</strong> <code v-pre>reosource server</code>：</p>
<p>存放受保护资源的服务器，能够通过 access token 来请求和响应这些受保护的资源。</p>
</li>
<li>
<p><strong>客户端</strong> <code v-pre>client</code>：</p>
<p>请求受保护资源的的一方就可以被看作一个客户端。（这个客户端只是一个概念，具体实现可以是服务器，应用程序，或者 Html 网页 等等，一个资源服务器在请求另一个资源服务器的受保护资源时，其也被视为一个客户端）</p>
</li>
<li>
<p><strong>授权服务器</strong> <code v-pre>authorization server</code>：</p>
<p>当客户端成功通过认证后，向其颁发 token 的服务器</p>
</li>
</ul>
<h2 id="协议流程" tabindex="-1"><a class="header-anchor" href="#协议流程"><span>协议流程</span></a></h2>
<p>整体的协议流程大致可以抽象为下图所示，实际的执行流程，根据不同的授权方式，会各有不同。</p>
<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-text"><span class="line"><span>     +--------+                               +---------------+</span></span>
<span class="line"><span>     |        |--(A)- Authorization Request ->|   Resource    |</span></span>
<span class="line"><span>     |        |                               |     Owner     |</span></span>
<span class="line"><span>     |        |&#x3C;-(B)-- Authorization Grant ---|               |</span></span>
<span class="line"><span>     |        |                               +---------------+</span></span>
<span class="line"><span>     |        |</span></span>
<span class="line"><span>     |        |                               +---------------+</span></span>
<span class="line"><span>     |        |--(C)-- Authorization Grant -->| Authorization |</span></span>
<span class="line"><span>     | Client |                               |     Server    |</span></span>
<span class="line"><span>     |        |&#x3C;-(D)----- Access Token -------|               |</span></span>
<span class="line"><span>     |        |                               +---------------+</span></span>
<span class="line"><span>     |        |</span></span>
<span class="line"><span>     |        |                               +---------------+</span></span>
<span class="line"><span>     |        |--(E)----- Access Token ------>|    Resource   |</span></span>
<span class="line"><span>     |        |                               |     Server    |</span></span>
<span class="line"><span>     |        |&#x3C;-(F)--- Protected Resource ---|               |</span></span>
<span class="line"><span>     +--------+                               +---------------+</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>(A) 客户端向资源所有者请求授权。 授权请求可以直接向资源所有者发出(例如密码模式，资源所有者会直接将自己的用户名密码授予给客户端)，但是推荐客户端经由授权服务器作为中转向资源所有者发出(例如授权码模式)</li>
<li>(B) 客户端收到授权许可，这是一个代表资源所有者的授权的凭据，使用本规范中定义的四种许可类型之一或者使用扩展许可类型表示。授权许可类型取决于客户端请求授权所使用的方法以及授权服务器支持的类型。</li>
<li>(C) 客户端与授权服务器进行身份认证并出示授权许可来请求 access token 。</li>
<li>(D) 授权服务器验证客户端以及授权许可，如果授权许可有效，则发出 access token 。</li>
<li>(E) 客户端向资源服务器请求受保护的资源，并携带 access token 以进行身份验证。</li>
<li>(F) 资源服务器验证 access token ，如果有效，则返回其请求的受保护资源。</li>
</ul>
<h2 id="授权许可" tabindex="-1"><a class="header-anchor" href="#授权许可"><span>授权许可</span></a></h2>
<p>授权许可是一个代表资源所有者授权（访问受保护资源）的凭据，客户端用它来获取访问令牌。</p>
<p>OAuth 定义了四种许可类型——授权码、隐式许可、资源所有者密码凭据和客户端凭据——以及用于定义其他类型的可扩展性机制。</p>
<h3 id="授权码-authorization-code" tabindex="-1"><a class="header-anchor" href="#授权码-authorization-code"><span>授权码 Authorization Code</span></a></h3>
<p>grant_type：code</p>
<p>授权码许可类型中，客户端不会直接向资源所有者申请授权，而是通过授权服务中介处理的。整个流程基于重定向，要求客户端必须能够与资源所有者的用户代理（通常是 web 浏览器）进行交互并能够接收来自授权服务器的传入请求（通过重定向）。</p>
<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-text"><span class="line"><span>     +----------+</span></span>
<span class="line"><span>     | Resource |</span></span>
<span class="line"><span>     |   Owner  |</span></span>
<span class="line"><span>     |          |</span></span>
<span class="line"><span>     +----------+</span></span>
<span class="line"><span>          ^</span></span>
<span class="line"><span>          |</span></span>
<span class="line"><span>         (B)</span></span>
<span class="line"><span>     +----|-----+          Client Identifier      +---------------+</span></span>
<span class="line"><span>     |         -+----(A)-- &#x26; Redirection URI ---->|               |</span></span>
<span class="line"><span>     |  User-   |                                 | Authorization |</span></span>
<span class="line"><span>     |  Agent  -+----(B)-- User authenticates --->|     Server    |</span></span>
<span class="line"><span>     |          |                                 |               |</span></span>
<span class="line"><span>     |         -+----(C)-- Authorization Code ---&#x3C;|               |</span></span>
<span class="line"><span>     +-|----|---+                                 +---------------+</span></span>
<span class="line"><span>       |    |                                         ^      v</span></span>
<span class="line"><span>      (A)  (C)                                        |      |</span></span>
<span class="line"><span>       |    |                                         |      |</span></span>
<span class="line"><span>       ^    v                                         |      |</span></span>
<span class="line"><span>     +---------+                                      |      |</span></span>
<span class="line"><span>     |         |>---(D)-- Authorization Code ---------'      |</span></span>
<span class="line"><span>     |  Client |          &#x26; Redirection URI                  |</span></span>
<span class="line"><span>     |         |                                             |</span></span>
<span class="line"><span>     |         |&#x3C;---(E)----- Access Token -------------------'</span></span>
<span class="line"><span>     +---------+       (w/ Optional Refresh Token)</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     						授权码流程图</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注：说明步骤（A）、（B）和（C）的直线因为通过用户代理而被分为两部分。</p>
<ul>
<li>（A）客户端通过将资源所有者的用户代理定向到授权端点来启动流程。 客户端包括其客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后将用户代理发送回该重定向URI。</li>
<li>（B）授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。</li>
<li>（C）假设资源所有者授予访问权，授权服务器使用先前提供的重定向URI(在请求中或在客户端注册期间提供)将用户代理重定向回客户端。 重定向URI的参数中包括一个授权代码和前面客户机提供的任何本地状态。</li>
<li>（D）客户端通过包含上一步中收到的授权码从授权服务器的令牌端点请求 access token。当发起请求时，客户端与授权服务器进行身份验证。客户端包含用于获得授权码的重定向URI来用于验证。</li>
<li>（E）授权服务器对客户端进行身份验证，验证授权代码，并确保接收的重定向URI与在步骤（C）中用于重定向（资源所有者的用户代理）到客户端的URI相匹配。如果通过，授权服务器响应返回 access token 与可选的 refresh token</li>
</ul>
<h4 id="授权请求" tabindex="-1"><a class="header-anchor" href="#授权请求"><span>授权请求</span></a></h4>
<p>客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>response_type</td>
<td>是</td>
<td>值必须是 &quot;code&quot;</td>
</tr>
<tr>
<td>client_id</td>
<td>是</td>
<td>客户端标识</td>
</tr>
<tr>
<td>redirect_uri</td>
<td>否</td>
<td>重定向地址，如果客户端在授权服务器中注册时已提供则可不传</td>
</tr>
<tr>
<td>scope</td>
<td>否</td>
<td>请求访问的范围。</td>
</tr>
<tr>
<td>state</td>
<td>否</td>
<td>推荐携带此值，用于防止跨站请求伪造</td>
</tr>
</tbody>
</table>
<p>请求示例：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">GET</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> /authorize?response_type=code&#x26;client_id=s6BhdRkqt3&#x26;state=xyz&#x26;redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Host</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> server.example.com</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器验证该请求，确保所有需要的参数已提交且有效。如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过经由其他方式确定批准）。</p>
<p>当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。</p>
<h4 id="授权响应" tabindex="-1"><a class="header-anchor" href="#授权响应"><span>授权响应</span></a></h4>
<p>如果资源所有者许可访问请求，授权服务器颁发授权码，通过向重定向URI的查询部分添加下列参数传递授权码至客户端：</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>code</td>
<td>是</td>
<td>授权码必须在颁发后很快过期以减小泄露风险。推荐的最长的授权码生命周期是10分钟。客户端不能使用授权码超过一次。如果一个授权码被使用一次以上，授权服务器必须拒绝该请求并应该撤销（如可能）先前发出的基于该授权码的所有令牌。授权码与客户端标识和重定向URI绑定。</td>
</tr>
<tr>
<td>state</td>
<td>否</td>
<td>当授权请求携带此参数时则必传，值原封不动回传</td>
</tr>
</tbody>
</table>
<p>例如，授权服务器通过发送以下HTTP响应重定向用户代理：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 302</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Found</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Location</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&#x26;state=xyz</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。</p>
<h4 id="访问令牌请求" tabindex="-1"><a class="header-anchor" href="#访问令牌请求"><span>访问令牌请求</span></a></h4>
<p>客户端发起向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 &quot;application/x-www-form-urlencoded&quot;，并在其请求体中需要包含以下参数：</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>grant_type</td>
<td>是</td>
<td>值必须是 &quot;authorization_code&quot;</td>
</tr>
<tr>
<td>code</td>
<td>是</td>
<td>值为上一步从授权服务器中收到的授权码</td>
</tr>
<tr>
<td>redirect_uri</td>
<td>是</td>
<td>如果授权请求中携带了redirect_uri参数，则这里的值必须其相同</td>
</tr>
<tr>
<td>client_id</td>
<td>是</td>
<td>如果客户端没有和授权服务器进行过 Client Credentials 的身份验证，则必须携带</td>
</tr>
</tbody>
</table>
<p>如果客户端类型为机密或客户端颁发了客户端凭据(或分配了其他认证要求)，则客户端必须向授权服务器进行 Client Credentials 的身份验证。</p>
<p>例如：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">POST</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> /token </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Host</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> server.example.com</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Authorization</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/x-www-form-urlencoded</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">grant_type=authorization_code&#x26;code=SplxlOBeZQQYbYS6WxSbIA</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">     &#x26;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">redirect_uri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须：</p>
<ul>
<li>要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，</li>
<li>若包括了客户端身份验证，验证客户端身份，</li>
<li>确保授权码颁发给了通过身份验证的机密客户端，或者如果客户端是公开的，确保代码颁发给了请求中的&quot;client_id&quot;，</li>
<li>验证授权码是有效的，并</li>
<li>确保给出了 &quot;redirect_uri&quot; 参数，若 &quot;redirect_uri&quot; 参数包含在初始授权请求中，确保它们的值是相同的。</li>
</ul>
<h4 id="访问令牌响应" tabindex="-1"><a class="header-anchor" href="#访问令牌响应"><span>访问令牌响应</span></a></h4>
<p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。</p>
<p>成功响应示例：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> OK</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/json;charset=UTF-8</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Cache-Control</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-store</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Pragma</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-cache</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "access_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"2YotnFZFEjr1zCsicMWpAA"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "token_type"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "expires_in"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3600</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "refresh_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"tGzv3JOkF0XG5Qx2TlKWIA"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "example_parameter"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example_value"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="隐式授权-implicit" tabindex="-1"><a class="header-anchor" href="#隐式授权-implicit"><span>隐式授权 Implicit</span></a></h3>
<p>grant_type：implicit</p>
<p>隐式授权是为用如 JavaScript 等脚本语言在浏览器种实现的客户端而优化的一种简化的授权码流程。在隐式授权流程种，不再给客户端办法授权码，而是直接给客户端颁发一个 access token。</p>
<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-text"><span class="line"><span>     +----------+</span></span>
<span class="line"><span>     | Resource |</span></span>
<span class="line"><span>     |  Owner   |</span></span>
<span class="line"><span>     |          |</span></span>
<span class="line"><span>     +----------+</span></span>
<span class="line"><span>          ^</span></span>
<span class="line"><span>          |</span></span>
<span class="line"><span>         (B)</span></span>
<span class="line"><span>     +----|-----+          Client Identifier     +---------------+</span></span>
<span class="line"><span>     |         -+----(A)-- &#x26; Redirection URI --->|               |</span></span>
<span class="line"><span>     |  User-   |                                | Authorization |</span></span>
<span class="line"><span>     |  Agent  -|----(B)-- User authenticates -->|     Server    |</span></span>
<span class="line"><span>     |          |                                |               |</span></span>
<span class="line"><span>     |          |&#x3C;---(C)--- Redirection URI ----&#x3C;|               |</span></span>
<span class="line"><span>     |          |          with Access Token     +---------------+</span></span>
<span class="line"><span>     |          |            in Fragment</span></span>
<span class="line"><span>     |          |                                +---------------+</span></span>
<span class="line"><span>     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |</span></span>
<span class="line"><span>     |          |          without Fragment      |     Client    |</span></span>
<span class="line"><span>     |          |                                |    Resource   |</span></span>
<span class="line"><span>     |     (F)  |&#x3C;---(E)------- Script ---------&#x3C;|               |</span></span>
<span class="line"><span>     |          |                                +---------------+</span></span>
<span class="line"><span>     +-|--------+</span></span>
<span class="line"><span>       |    |</span></span>
<span class="line"><span>      (A)  (G) Access Token</span></span>
<span class="line"><span>       |    |</span></span>
<span class="line"><span>       ^    v</span></span>
<span class="line"><span>     +---------+</span></span>
<span class="line"><span>     |         |</span></span>
<span class="line"><span>     |  Client |</span></span>
<span class="line"><span>     |         |</span></span>
<span class="line"><span>     +---------+</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>(A) 客户端通过将资源所有者的用户代理定向到授权端点来启动流程。 客户端包括其客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后将用户代理发送回该重定向URI。</li>
<li>(B) 授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。</li>
<li>(C) 假设资源所有者授予访问权，授权服务器使用先前提供的重定向URI(在请求中或在客户端注册期间提供)将用户代理重定向回客户端。 <strong>重定向URI 的 Hash</strong> 中将包含 access token。</li>
<li>(D) 用户代理遵循重定向指令，向 web-hosted 的客户端资源发出请求（根据 [RFC2616]，URI 中的 Hash 部分不会携带在请求 URI 中携带）。用户代理将 Hash 中的参数取出并保存。</li>
<li>(E) web-hosted 的客户端资源返回一个web页面(通常是一个带有嵌入式脚本的HTML文档)，该页面能够访问完整的重定向URI，包括用户代理保留的片段，并提取片段中包含的访问令牌(和其他参数)。</li>
<li>(F) 用户代理在本地执行由 web-hosted 的客户端资源提供的脚本，从而提取访问令牌。</li>
<li>(G) 用户代理将访问令牌传递给客户端。</li>
</ul>
<blockquote>
<p>(D) (E) 为非必选步骤，主要用于当用户代理不支持在 response header 的 Location 属性中包含 Hash 片段时，通过返回一个内嵌 javascript 的 html 页面，页面内引导用户点击按钮跳转向 redirect_url</p>
</blockquote>
<h4 id="授权请求-1" tabindex="-1"><a class="header-anchor" href="#授权请求-1"><span>授权请求</span></a></h4>
<p>客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>response_type</td>
<td>是</td>
<td>值必须是 &quot;token&quot;</td>
</tr>
<tr>
<td>client_id</td>
<td>是</td>
<td>客户端标识</td>
</tr>
<tr>
<td>redirect_uri</td>
<td>否</td>
<td>重定向地址，如果客户端在授权服务器中注册时已提供则可不传</td>
</tr>
<tr>
<td>scope</td>
<td>否</td>
<td>请求访问的范围。</td>
</tr>
<tr>
<td>state</td>
<td>否</td>
<td>推荐携带此值，用于防止跨站请求伪造</td>
</tr>
</tbody>
</table>
<p>请求示例：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">GET</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> /authorize?response_type=token&#x26;client_id=s6BhdRkqt3&#x26;state=xyz&#x26;redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Host</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> server.example.com</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器验证该请求，确保所有需要的参数已提交且有效。授权服务器必须验证它将访问令牌重定向到的重定向URI与客户端注册的重定向URI匹配。</p>
<p>如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过经由其他方式确定批准）。</p>
<p>当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。</p>
<h4 id="授权响应-1" tabindex="-1"><a class="header-anchor" href="#授权响应-1"><span>授权响应</span></a></h4>
<p>如果资源所有者许可访问请求，授权服务器直接颁发访问令牌，通过向重定向URI的 Hash 部分添加下列参数传递 access token 至客户端：</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>access_token</td>
<td>是</td>
<td>授权服务器颁发的访问令牌。</td>
</tr>
<tr>
<td>token_type</td>
<td>是</td>
<td>颁发的令牌的类型，其值是大小写不敏感的。（一般是 Bearer）</td>
</tr>
<tr>
<td>expires_in</td>
<td>否</td>
<td>推荐的。以秒为单位的访问令牌生命周期。例如，值&quot;3600&quot;表示访问令牌将在从生成响应时的1小时后到期。如果省略，则授权服务器应该通过其他方式提供过期时间，或者记录默认值。</td>
</tr>
<tr>
<td>scope</td>
<td>否</td>
<td>若与客户端请求的 scope 范围相同则可以不传，否则必需返回此值。</td>
</tr>
<tr>
<td>state</td>
<td>否</td>
<td>当授权请求携带此参数时则必传，值原封不动回传</td>
</tr>
</tbody>
</table>
<p>例如，授权服务器通过发送以下HTTP响应重定向用户代理：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 302</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Found</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Location</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA&#x26;state=xyz&#x26;token_type=example&#x26;expires_in=3600</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>开发人员应注意，一些用户代理不支持在HTTP&quot;Location&quot;HTTP响应标头字段中包含片段组成部分。这些客户端需要使用除了3xx重定向响应以外的其他方法来重定向客户端——-例如，返回一个HTML页面，其中包含一个具有链接到重定向URI的动作的&quot;继续&quot;按钮。</p>
<p>客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。</p>
<h3 id="资源所有者密码凭证-resource-owner-password-credentials" tabindex="-1"><a class="header-anchor" href="#资源所有者密码凭证-resource-owner-password-credentials"><span>资源所有者密码凭证 Resource Owner Password Credentials</span></a></h3>
<p>grant_type：password</p>
<p>资源所有者密码凭据许可类型适合于资源所有者与客户端具有信任关系的情况，如设备操作系统或高级特权应用。当启用这种许可类型时授权服务器应该特别关照且只有当其他流程都不可用时才可以。</p>
<p>这种许可类型适合于能够获得资源所有者凭据（用户名和密码，通常使用交互的形式）的客户端。通过转换已存储的凭据至访问令牌，它也用于迁移现存的使用如HTTP基本或摘要身份验证的直接身份验证方案的客户端至OAuth。</p>
<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-text"><span class="line"><span>     +----------+</span></span>
<span class="line"><span>     | Resource |</span></span>
<span class="line"><span>     |  Owner   |</span></span>
<span class="line"><span>     |          |</span></span>
<span class="line"><span>     +----------+</span></span>
<span class="line"><span>          v</span></span>
<span class="line"><span>          |    Resource Owner</span></span>
<span class="line"><span>         (A) Password Credentials</span></span>
<span class="line"><span>          |</span></span>
<span class="line"><span>          v</span></span>
<span class="line"><span>     +---------+                                  +---------------+</span></span>
<span class="line"><span>     |         |>--(B)---- Resource Owner ------->|               |</span></span>
<span class="line"><span>     |         |         Password Credentials     | Authorization |</span></span>
<span class="line"><span>     | Client  |                                  |     Server    |</span></span>
<span class="line"><span>     |         |&#x3C;--(C)---- Access Token ---------&#x3C;|               |</span></span>
<span class="line"><span>     |         |    (w/ Optional Refresh Token)   |               |</span></span>
<span class="line"><span>     +---------+                                  +---------------+</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>(A) 资源所有者提供给客户端它的用户名和密码。</li>
<li>(B) 通过包含从资源所有者处接收到的凭据，客户端从授权服务器的令牌端点请求访问令牌。当发起请求时，客户端与授权服务器进行身份验证。</li>
<li>(C) 授权服务器对客户端进行身份验证，验证资源所有者的凭证，如果有效，颁发访问令牌。</li>
</ul>
<h4 id="授权请求和响应" tabindex="-1"><a class="header-anchor" href="#授权请求和响应"><span>授权请求和响应</span></a></h4>
<p>客户端获取资源所有者凭据 (用户名/密码) 的方法超出了本规范的范围。 一旦获得了访问令牌，客户端必须丢弃凭据。</p>
<h4 id="访问令牌请求-1" tabindex="-1"><a class="header-anchor" href="#访问令牌请求-1"><span>访问令牌请求</span></a></h4>
<p>客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 &quot;application/x-www-form-urlencoded&quot;，并在其请求体中需要包含以下参数：</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>grant_type</td>
<td>是</td>
<td>值必须是 &quot;password&quot;</td>
</tr>
<tr>
<td>username</td>
<td>是</td>
<td>资源所有者的用户名。</td>
</tr>
<tr>
<td>password</td>
<td>是</td>
<td>资源所有者的密码。</td>
</tr>
<tr>
<td>scope</td>
<td>是</td>
<td>请求访问的范围</td>
</tr>
</tbody>
</table>
<p>如果客户端类型是机密的或客户端被颁发了客户端凭据，则客户端必须要与授权服务器进行身份验证（request header 中携带 Authorization，值为 Base64(clientId:clientSecret) ）。</p>
<p>例如：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">POST</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> /token </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Host</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> server.example.com</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Authorization</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/x-www-form-urlencoded</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">grant_type=password&#x26;username=johndoe&#x26;password=A3ddj3w</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须：</p>
<ul>
<li>要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，</li>
<li>若包括了客户端身份验证，验证客户端身份</li>
<li>使用它现有的密码验证算法验证资源所有者的密码凭据。</li>
</ul>
<p>由于这种访问令牌请求使用了资源所有者的密码，授权服务器必须保护端点防止暴力攻击（例如，使用速率限制或生成警报）。</p>
<h4 id="访问令牌响应-1" tabindex="-1"><a class="header-anchor" href="#访问令牌响应-1"><span>访问令牌响应</span></a></h4>
<p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。 一个成功响应的示例如下:</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> OK</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/json;charset=UTF-8</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Cache-Control</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-store</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Pragma</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-cache</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "access_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"2YotnFZFEjr1zCsicMWpAA"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "token_type"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "expires_in"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3600</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "refresh_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"tGzv3JOkF0XG5Qx2TlKWIA"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "example_parameter"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example_value"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端凭证-client-credentials" tabindex="-1"><a class="header-anchor" href="#客户端凭证-client-credentials"><span>客户端凭证 Client Credentials</span></a></h3>
<p>grant_type: client_credentials</p>
<p>当客户端请求访问它所控制的，或者事先与授权服务器协商（所采用的方法超出了本规范的范围）的其他资源所有者的受保护资源，客户端可以只使用它的客户端凭据（或者其他受支持的身份验证方法）请求访问令牌。</p>
<p>客户端凭据许可类型必须只能由机密客户端使用。</p>
<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-text"><span class="line"><span>     +---------+                                  +---------------+</span></span>
<span class="line"><span>     |         |                                  |               |</span></span>
<span class="line"><span>     |         |>--(A)- Client Authentication --->| Authorization |</span></span>
<span class="line"><span>     | Client  |                                  |     Server    |</span></span>
<span class="line"><span>     |         |&#x3C;--(B)---- Access Token ---------&#x3C;|               |</span></span>
<span class="line"><span>     |         |                                  |               |</span></span>
<span class="line"><span>     +---------+                                  +---------------+</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>（A）客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。</li>
<li>（B）授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。</li>
</ul>
<h4 id="授权请求和响应-1" tabindex="-1"><a class="header-anchor" href="#授权请求和响应-1"><span>授权请求和响应</span></a></h4>
<p>由于客户端身份验证被用作授权许可，所以不需要其他授权请求。</p>
<h4 id="访问令牌请求-2" tabindex="-1"><a class="header-anchor" href="#访问令牌请求-2"><span>访问令牌请求</span></a></h4>
<p>客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 &quot;application/x-www-form-urlencoded&quot;，并在其请求体中需要包含以下参数：</p>
<table>
<thead>
<tr>
<th>参数</th>
<th>必传</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>grant_type</td>
<td>是</td>
<td>值必须是 &quot;client_credentials&quot;</td>
</tr>
<tr>
<td>scope</td>
<td>是</td>
<td>请求访问的范围</td>
</tr>
</tbody>
</table>
<p>一个请求示例如下：</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">POST</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> /token </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Host</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> server.example.com</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Authorization</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/x-www-form-urlencoded</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">grant_type=client_credentials</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须验证客户端身份。</p>
<h4 id="访问令牌响应-2" tabindex="-1"><a class="header-anchor" href="#访问令牌响应-2"><span>访问令牌响应</span></a></h4>
<p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌，但并不包含刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。</p>
<p>一个成功响应的示例如下:</p>
<div class="language-http line-numbers-mode" data-highlighter="shiki" data-ext="http" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-http"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">HTTP</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> OK</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Content-Type</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> application/json;charset=UTF-8</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Cache-Control</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-store</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">Pragma</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> no-cache</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "access_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"2YotnFZFEjr1zCsicMWpAA"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "token_type"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "expires_in"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3600</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "example_parameter"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"example_value"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="一、授权服务器" tabindex="-1"><a class="header-anchor" href="#一、授权服务器"><span>一、授权服务器</span></a></h2>
<h3 id="_1-依赖引入" tabindex="-1"><a class="header-anchor" href="#_1-依赖引入"><span>1.依赖引入</span></a></h3>
<div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-xml"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>cn.lovecyy&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>relaxed-auth&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>${version}&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置客户端信息" tabindex="-1"><a class="header-anchor" href="#_2-配置客户端信息"><span>2.配置客户端信息</span></a></h3>
<blockquote>
<p>默认是jdbc形式,参见<code v-pre>oauth_client_details</code>，演示使用内存模式</p>
</blockquote>
<ul>
<li><strong>InmemoryOauth2ClientConfigurer</strong></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RequiredArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> InmemoryOauth2ClientConfigurer</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> OAuth2ClientConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> configure</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">ClientDetailsServiceConfigurer</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> clients</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		clients</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">inMemory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">withClient</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"admin"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置client_id</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">secret</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">PasswordUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"admin123456"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">))</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置client_secret</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">accessTokenValiditySeconds</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3600</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置访问token的有效期</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">refreshTokenValiditySeconds</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">864000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置刷新token的有效期</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">redirectUris</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"http://www.baidu.com"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置redirect_uri，用于授权成功后跳转</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">scopes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"server"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置申请的权限范围</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authorizedGrantTypes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"authorization_code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"password"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"refresh_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">autoApprove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置grant_type，表示授权类型</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">resourceIds</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"test-server"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"tes"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">and</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">withClient</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"resource"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置client_id</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">secret</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">PasswordUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"resource"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">))</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置client_secret</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">accessTokenValiditySeconds</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3600</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置访问token的有效期</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">refreshTokenValiditySeconds</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">864000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置刷新token的有效期</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">redirectUris</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"http://www.baidu.com"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置redirect_uri，用于授权成功后跳转</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">scopes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"server"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置申请的权限范围</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authorizedGrantTypes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"authorization_code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"password"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"refresh_token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">autoApprove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置grant_type，表示授权类型</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>客户端Bean注册</strong></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> OAuth2ClientConfigurer</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> oAuth2ClientConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InmemoryOauth2ClientConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-配置令牌存储" tabindex="-1"><a class="header-anchor" href="#_3-配置令牌存储"><span>3.配置令牌存储</span></a></h3>
<blockquote>
<p>建议使用redis，jdbc或jwt形式，默认采用内存模式</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	/**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * 令牌存储</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@return</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> TokenStore</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> tokenStore</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InMemoryTokenStore</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-配置token增强-可选" tabindex="-1"><a class="header-anchor" href="#_4-配置token增强-可选"><span>4.配置Token增强(可选)</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	/**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * 配置token增强 可以附加扩展信息</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ExtendTokenEnhancer</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> extendTokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ExtendTokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ExtendTokenEnhancer</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> TokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> OAuth2AccessToken</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> enhance</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">OAuth2AccessToken</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> oAuth2AccessToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">OAuth2Authentication</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> oAuth2Authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Object</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">info</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> HashMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;>();</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		info</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">put</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"enhance"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"enhance info"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		((DefaultOAuth2AccessToken) oAuth2AccessToken).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setAdditionalInformation</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(info);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> oAuth2AccessToken;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-配置用户信息服务" tabindex="-1"><a class="header-anchor" href="#_5-配置用户信息服务"><span>5.配置用户信息服务</span></a></h3>
<blockquote>
<p>继承UserDetailsService</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RequiredArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Service</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserService</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">User</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">PostConstruct</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> initData</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> password</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> PasswordUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"123456"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		userList </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;>();</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"macro"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"admin"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"andy"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"client"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"mark"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"client"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> username</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UsernameNotFoundException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">User</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">findUserList</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">stream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">filter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(user </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> user</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(username))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">collect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">Collectors</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">toList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">CollectionUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isEmpty</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(findUserList)) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			User</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> user</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> findUserList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			User</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> user1</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> ObjectUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">cloneByStream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(user);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> user1;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> UsernameNotFoundException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"用户名或密码错误"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-开启授权服务器" tabindex="-1"><a class="header-anchor" href="#_6-开启授权服务器"><span>6.开启授权服务器</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">EnableOauth2AuthorizationServer</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">SpringBootApplication</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthDemoApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[] </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">args</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		SpringApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">run</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthDemoApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, args);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、资源服务器" tabindex="-1"><a class="header-anchor" href="#二、资源服务器"><span>二、资源服务器</span></a></h2>
<h3 id="_1-依赖引入-1" tabindex="-1"><a class="header-anchor" href="#_1-依赖引入-1"><span>1.依赖引入</span></a></h3>
<div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-xml"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">   &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>cn.lovecyy&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>relaxed-resource&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>${version}&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  &#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-application-yml" tabindex="-1"><a class="header-anchor" href="#_2-application-yml"><span>2.application.yml</span></a></h3>
<blockquote>
<p>若授权服务器和资源服务器在同一项目,则只需要配置<code v-pre>extension</code></p>
</blockquote>
<div class="language-yml line-numbers-mode" data-highlighter="shiki" data-ext="yml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yml"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">#指定授权服务器地址</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">auth-server-address</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">localhost:9401</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">security</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  oauth2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    client</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      client-id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">admin</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      client-secret</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">admin123456</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      access-token-uri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">http://${auth-server-address}/oauth/token</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      user-authorization-uri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">http://${auth-server-address}/oauth/authorize</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    resource</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #自省token地址</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      token-info-uri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">http://${auth-server-address}/oauth/check_token</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    extension</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #资源服务标识</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      resourceId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">order</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #忽略鉴权url</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      ignoreUrls</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">/user/**</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-开启资源服务器" tabindex="-1"><a class="header-anchor" href="#_3-开启资源服务器"><span>3.开启资源服务器</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">EnableOauth2ResourceServer</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">SpringBootApplication</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthDemoApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[] </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">args</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		SpringApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">run</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthDemoApplication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, args);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、使用方式" tabindex="-1"><a class="header-anchor" href="#三、使用方式"><span>三、使用方式</span></a></h2>
<blockquote>
<p>访问Token请求，若请求参数包含client_id，则走<code v-pre>ClientCredentialsTokenEndpointFilter</code>   否则走<code v-pre>BasicAuthenticationFilter</code></p>
</blockquote>
<h3 id="_1-授权码模式" tabindex="-1"><a class="header-anchor" href="#_1-授权码模式"><span>1.授权码模式</span></a></h3>
<blockquote>
<p>grant_type=authorization_code</p>
</blockquote>
<ul>
<li>
<p>启动授权服务器；</p>
</li>
<li>
<p>在浏览器访问该地址进行登录授权：<a href="http://localhost:9401/oauth/authorize?response_type=code&amp;client_id=admin&amp;redirect_uri=http://www.baidu.com&amp;scope=all&amp;state=normal" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/authorize?response_type=code&amp;client_id=admin&amp;redirect_uri=http://www.baidu.com&amp;scope=all&amp;state=normal</a></p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/授权码登录.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
<li>
<p>输入账号密码进行登录操作：</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/确认授权页.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
<li>
<p>之后会浏览器会带着授权码跳转到我们指定的路径：</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">https://www.baidu.com/?code</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">=eTsADY</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x26;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">state</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">normal</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>
<p>使用授权码请求该地址获取访问令牌：<a href="http://localhost:9401/oauth/token" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/token</a></p>
</li>
<li>
<p>使用Basic认证通过client_id和client_secret构造一个Authorization头信息；</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/Basic认证.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
<li>
<p>在body中添加以下参数信息，通过POST请求获取访问令牌；</p>
</li>
</ul>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/授权码模式.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h3 id="_2-密码模式" tabindex="-1"><a class="header-anchor" href="#_2-密码模式"><span>2.密码模式</span></a></h3>
<blockquote>
<p>grant_type=password</p>
</blockquote>
<ul>
<li>
<p>使用密码请求该地址获取访问令牌：<a href="http://localhost:9401/oauth/token" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/token</a></p>
</li>
<li>
<p>使用Basic认证通过client_id和client_secret构造一个Authorization头信息，</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/Basic认证.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>若客户端请求没有Basic Auth 则直接在请求头输入如下参数</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">Authorization</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Basic</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> dWk6dWk</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">dWk6dWk计算方式如下</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(clientId</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">clientSecret)</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=></span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">byte</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">[] key</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=></span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> String</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">Base64</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encodeBase64</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(key)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>在body中添加以下参数信息，通过POST请求获取访问令牌；</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/密码模式.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<ul>
<li>
<p>在请求头中添加访问令牌，访问需要登录认证的接口进行测试，发现已经可以成功访问：<a href="http://localhost:9401/user/getCurrentUser" target="_blank" rel="noopener noreferrer">http://localhost:9401/user/getCurrentUser</a></p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/访问接口.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<h3 id="_3-implicit-简化模式" tabindex="-1"><a class="header-anchor" href="#_3-implicit-简化模式"><span>3.Implicit（简化模式）</span></a></h3>
<blockquote>
<p>grant_type=implicit</p>
</blockquote>
<ul>
<li>
<p>直接浏览器发起请求 <a href="http://localhost:9401/oauth/authorize?response_type=token&amp;client_id=admin&amp;redirect_uri=http://www.baidu.com&amp;scope=server&amp;state=normal" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/authorize?response_type=token&amp;client_id=admin&amp;redirect_uri=http://www.baidu.com&amp;scope=server&amp;state=normal</a></p>
</li>
<li>
<p>会在重定向url#hash带上accesss_token</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/简化模式.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<h3 id="_4-客户端凭证" tabindex="-1"><a class="header-anchor" href="#_4-客户端凭证"><span>4.客户端凭证</span></a></h3>
<blockquote>
<p>grant_type=client_credentials</p>
</blockquote>
<ul>
<li>
<p>使用客户端凭证请求该地址获取访问令牌：<a href="http://localhost:9401/oauth/token" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/token</a></p>
</li>
<li>
<p>使用Basic认证通过client_id和client_secret构造一个Authorization头信息，</p>
</li>
</ul>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/Basic认证.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>
<p>在body中添加以下参数信息，通过POST请求获取访问令牌；</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/客户端模式.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<h3 id="_5-刷新token" tabindex="-1"><a class="header-anchor" href="#_5-刷新token"><span>5.刷新Token</span></a></h3>
<blockquote>
<p>grant_type=refresh_token</p>
</blockquote>
<ul>
<li>
<p>使用客户端凭证请求该地址获取访问令牌：<a href="http://localhost:9401/oauth/token" target="_blank" rel="noopener noreferrer">http://localhost:9401/oauth/token</a></p>
</li>
<li>
<p>使用Basic认证通过client_id和client_secret构造一个Authorization头信息，</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/Basic认证.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<ul>
<li>
<p>在body中添加以下参数信息，通过POST请求获取访问令牌；</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220726164212.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</li>
</ul>
<h1 id="附" tabindex="-1"><a class="header-anchor" href="#附"><span>附:</span></a></h1>
<h2 id="一、附带sql" tabindex="-1"><a class="header-anchor" href="#一、附带sql"><span>一、附带sql</span></a></h2>
<h3 id="_1-oauth-client-details" tabindex="-1"><a class="header-anchor" href="#_1-oauth-client-details"><span>1.oauth_client_details</span></a></h3>
<p>授权码 主要操作<code v-pre>oauth_client_details</code>表的类是<code v-pre>JdbcClientDetailsService.java</code></p>
<div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-sql"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DROP</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> TABLE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> IF</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> EXISTS</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> `oauth_client_details`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> TABLE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> `</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">oauth_client_details</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">` (</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `client_id`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NOT NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> COMMENT </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'客户端标识'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `resource_ids`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> COMMENT </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'接入资源列表'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `client_secret`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> COMMENT </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'客户端秘钥'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `scope`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authorized_grant_types`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `web_server_redirect_uri`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authorities`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `access_token_validity`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">11</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `refresh_token_validity`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">11</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `additional_information`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> longtext,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `create_time`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> timestamp</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NOT NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> CURRENT_TIMESTAMP </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">ON UPDATE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> CURRENT_TIMESTAMP,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `archived`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> tinyint</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">4</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `trusted`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> tinyint</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">4</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `autoapprove`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> varchar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">  PRIMARY KEY</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">`client_id`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">USING</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BTREE</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) ENGINE</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">InnoDB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> CHARSET</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">utf8 ROW_FORMAT</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DYNAMIC</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> COMMENT</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'接入客户端信息'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>字段名</th>
<th>类型</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>client_id</td>
<td>varchar</td>
<td>主键,必须唯一,不能为空. 用于唯一标识每一个客户端(client);</td>
</tr>
<tr>
<td>resource_ids</td>
<td>varchar</td>
<td>客户端所能访问的资源id集合,多个资源时用逗号(,),如果没设置，就是对所有的Resource Server都有访问权限。</td>
</tr>
<tr>
<td>client_secret</td>
<td>varchar</td>
<td>用于指定客户端(client)的访问密匙</td>
</tr>
<tr>
<td>scope</td>
<td>varchar</td>
<td>指定客户端申请的权限范围,可选值包括read,write,trust,all(可自定义）;若有多个权限范围用逗号(,)分隔,@EnableGlobalMethodSecurity(prePostEnabled = true)启用方法级权限控制</td>
</tr>
<tr>
<td>authorized_grant_types</td>
<td>varchar</td>
<td>然后在方法上注解标识@PreAuthorize(&quot;#oauth2.hasScope('read')&quot;)就是5种授权模式：authorization_code,password,refresh_token,implicit,client_credentials, 若支持多个grant_type用逗号(,)分隔,</td>
</tr>
<tr>
<td>web_server_redirect_uri</td>
<td>varchar</td>
<td>重定向地址，在oauth中会校验</td>
</tr>
<tr>
<td>authorities</td>
<td>varchar</td>
<td>指定客户端所拥有的权限值,可选, 若有多个权限值,用逗号(,)分隔。若授权模式中不需要账户密码的建议设；若授权模式需要账户密码的，可以不设立</td>
</tr>
<tr>
<td>access_token_validity</td>
<td>int</td>
<td>设定客户端的access_token的有效时间值(单位:秒) 【默认12小时】</td>
</tr>
<tr>
<td>refresh_token_validity</td>
<td>int</td>
<td>设定客户端的refresh_token的有效时间值(单位:秒）【默认30天】</td>
</tr>
<tr>
<td>additional_information</td>
<td>longtext</td>
<td>可以额外附带的信息，若赋值，则需要json规范</td>
</tr>
<tr>
<td>create_time</td>
<td>timestamp</td>
<td>数据的创建时间,精确到秒,由数据库在插入数据时取当前系统时间自动生成(扩展字段)</td>
</tr>
<tr>
<td>archived</td>
<td>tinyint</td>
<td>标识是否存档，默认为0</td>
</tr>
<tr>
<td>trusted</td>
<td>tinyint</td>
<td>标识是否受信任，默认0（0-不信任，1-信任）</td>
</tr>
<tr>
<td>autoapprove</td>
<td>varchar</td>
<td>设置用户是否自动Approval操作，通常只在authorization_code 模式有效</td>
</tr>
</tbody>
</table>
<h3 id="_2-oauth-code" tabindex="-1"><a class="header-anchor" href="#_2-oauth-code"><span>2.oauth_code</span></a></h3>
<p>支持授权码获取accessToken</p>
<div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-sql"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> TABLE</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> IF</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NOT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> EXISTS</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> `oauth_code`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `code`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authentication`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BLOB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">ENGINE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> InnoDB</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> CHARACTER</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> SET</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> utf8;</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-oauth-access-token" tabindex="-1"><a class="header-anchor" href="#_3-oauth-access-token"><span>3.oauth_access_token</span></a></h3>
<p>对<code v-pre>oauth_client_token</code>表的主要操作在<code v-pre>JdbcClientTokenServices.java</code>，实际上未使用到</p>
<div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-sql"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> TABLE</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> IF</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NOT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> EXISTS</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> `oauth_access_token`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `token_id`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `token`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BLOB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authentication_id`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">128</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NOT NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `user_name`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `client_id`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authentication`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BLOB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `refresh_token`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">  PRIMARY KEY</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">`authentication_id`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">ENGINE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> InnoDB</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> CHARACTER</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> SET</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> utf8;</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>字段名</th>
<th>类型</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>token_id</td>
<td>varchar</td>
<td>从服务器端获取到的access_token的值.</td>
</tr>
<tr>
<td>token</td>
<td>BLOB</td>
<td>这是一个二进制的字段, 存储的数据OAuth2AccessToken.java对象序列化后的二进制数据.</td>
</tr>
<tr>
<td>authentication_id</td>
<td>varchar</td>
<td>该字段具有唯一性, 是根据当前的username(如果有),client_id与scope通过MD5加密生成的. 具体实现请参考DefaultClientKeyGenerator.java类.</td>
</tr>
<tr>
<td>user_name</td>
<td>varchar</td>
<td>登录时的用户名</td>
</tr>
<tr>
<td>client_id</td>
<td>varchar</td>
<td>主键,必须唯一,不能为空. 用于唯一标识每一个客户端(client);</td>
</tr>
<tr>
<td>authentication</td>
<td>varchar</td>
<td>存储将OAuth2Authentication.java对象序列化后的二进制数据.</td>
</tr>
<tr>
<td>refresh_token</td>
<td>varchar</td>
<td>该字段的值是将refresh_token的值通过MD5加密后存储的.</td>
</tr>
</tbody>
</table>
<h3 id="_4-oauth-refresh-token" tabindex="-1"><a class="header-anchor" href="#_4-oauth-refresh-token"><span>4.oauth_refresh_token</span></a></h3>
<div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-sql"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> TABLE</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> IF</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NOT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> EXISTS</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> `oauth_refresh_token`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `token_id`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> VARCHAR</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">256</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `token`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BLOB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  `authentication`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> BLOB </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">NULL</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> NULL</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">ENGINE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> InnoDB</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">DEFAULT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> CHARACTER</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> SET</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> utf8;</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>字段名</th>
<th>类型</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>token_id</td>
<td>varchar</td>
<td>从服务器端获取到的access_token的值.</td>
</tr>
<tr>
<td>token</td>
<td>BLOB</td>
<td>这是一个二进制的字段, 存储的数据OAuth2AccessToken.java对象序列化后的二进制数据.</td>
</tr>
<tr>
<td>authentication</td>
<td>varchar</td>
<td>存储将OAuth2Authentication.java对象序列化后的二进制数据.</td>
</tr>
</tbody>
</table>
<h2 id="二、扩展授权服务器" tabindex="-1"><a class="header-anchor" href="#二、扩展授权服务器"><span>二、扩展授权服务器</span></a></h2>
<h3 id="内置扩展器" tabindex="-1"><a class="header-anchor" href="#内置扩展器"><span>内置扩展器</span></a></h3>
<h4 id="实现扩展用户信息服务" tabindex="-1"><a class="header-anchor" href="#实现扩展用户信息服务"><span>实现扩展用户信息服务</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RequiredArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Service</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserService</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ExtendUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">User</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">PostConstruct</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> initData</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> password</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> PasswordUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"123456"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		userList </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;>();</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"macro"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"admin"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"andy"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"client"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"mark"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"client"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> username</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UsernameNotFoundException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">User</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">findUserList</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">stream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">filter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(user </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> user</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(username))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">collect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">Collectors</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">toList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">CollectionUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isEmpty</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(findUserList)) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			User</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> user</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> findUserList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			User</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> user1</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> ObjectUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">cloneByStream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(user);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> user1;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> UsernameNotFoundException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"用户名或密码错误"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> loginByMobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> mobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> password</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> PasswordUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">encode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"123456"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"macro"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, password, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthorityUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">commaSeparatedStringToAuthorityList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"admin"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="验证码登录" tabindex="-1"><a class="header-anchor" href="#验证码登录"><span>验证码登录</span></a></h4>
<blockquote>
<p>请求授权类型 grant_type = captcha</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Component</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomCaptchaValidator</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CaptchaValidator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> validate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Map</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		// 取出验证码</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> validateCode</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		Assert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isTrue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">StrUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isNotBlank</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(validateCode), </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"验证码不能为空"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    </span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> validateCodeKey</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "CAPTCHA:"</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> uuid;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		// 从缓存取出正确的验证码和用户输入的验证码比对</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> correctValidateCode</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> CACHE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(validateCodeKey);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">StrUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isEmpty</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(correctValidateCode)) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"验证码已过期"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">validateCode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(correctValidateCode)) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"您输入的验证码不正确"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		// 验证码验证通过，删除 Redis 的验证码</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		CACHE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">remove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(validateCodeKey);</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		// 移除后续无用参数</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">remove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="手机号登录" tabindex="-1"><a class="header-anchor" href="#手机号登录"><span>手机号登录</span></a></h4>
<blockquote>
<p>请求授权类型 grant_type = sms_code</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Component</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomSmsCodeValidator</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> SmsCodeValidator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> authenticate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> mobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> code</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">code</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"666666"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)) { </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 666666 是后门，因为短信收费，正式环境删除这个if分支</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// 短信验证码key前缀</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> codeKey</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "SMS_CODE:"</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> mobile;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// 根据验证码key获取验证码</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> correctCode</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> ""</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// 验证码比对</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">StrUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isBlank</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(correctCode) </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">||</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> !</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">code</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(correctCode)) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"验证码不正确"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			}</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// 比对成功删除缓存的验证码</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// ...del</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="拓展扩展器" tabindex="-1"><a class="header-anchor" href="#拓展扩展器"><span>拓展扩展器</span></a></h3>
<h4 id="_1-创建认证token" tabindex="-1"><a class="header-anchor" href="#_1-创建认证token"><span>1.创建认证Token</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomAuthenticationToken</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AbstractAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> long</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> serialVersionUID </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 550L</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Object</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> principal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Object</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Object</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> principal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Object</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">((Collection) </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">principal</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> principal;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> credentials;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">false</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Object</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> principal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Object</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			Collection</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">?</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> GrantedAuthority</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">authorities</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(authorities);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">principal</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> principal;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> credentials;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Object</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getCredentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Object</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getPrincipal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">principal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> setAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">boolean</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> isAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> IllegalArgumentException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		Assert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isTrue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">isAuthenticated,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">				"Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">false</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> eraseCredentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">eraseCredentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">credentials</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-创建令牌授予者" tabindex="-1"><a class="header-anchor" href="#_2-创建令牌授予者"><span>2.创建令牌授予者</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomTokenGranter</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AbstractTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	/**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * 声明授权者 CustomTokenGranter 支持授权模式 custom_code 根据接口传值 grant_type = custom_code 的值匹配到此授权者</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * 匹配逻辑详见下面的两个方法</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 *</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@see</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> CompositeTokenGranter#grant(String, TokenRequest)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@see</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> AbstractTokenGranter#grant(String, TokenRequest)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">	 */</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> GRANT_TYPE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "custom_code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthenticationManager</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationServerTokenServices</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			ClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> clientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">OAuth2RequestFactory</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> requestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			AuthenticationManager</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(tokenServices, clientDetailsService, requestFactory, GRANT_TYPE);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> authenticationManager;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	protected</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> OAuth2Authentication</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getOAuth2Authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">ClientDetails</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> client</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">TokenRequest</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> tokenRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> LinkedHashMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">tokenRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getRequestParameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> mobile</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"mobile"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 手机号</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> code</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 短信验证码</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		parameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">remove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		Authentication</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userAuth</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(mobile, code);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		((AbstractAuthenticationToken) userAuth).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setDetails</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(parameters);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		try</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			userAuth </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authenticate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(userAuth);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		catch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AccountStatusException</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getMessage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		catch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">BadCredentialsException</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getMessage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (userAuth </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">!=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> &#x26;&#x26;</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userAuth</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isAuthenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			OAuth2Request</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> storedOAuth2Request</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getRequestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">createOAuth2Request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(client, tokenRequest);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> OAuth2Authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(storedOAuth2Request, userAuth);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			throw</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> InvalidGrantException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"Could not authenticate user: "</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> mobile);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-创建认证提供者" tabindex="-1"><a class="header-anchor" href="#_3-创建认证提供者"><span>3.创建认证提供者</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">/**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  * 自定义认证逻辑</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  *</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Data</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomAuthenticationProvider</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthenticationProvider</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetailsService</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Authentication</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> authenticate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Authentication</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthenticationException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		CustomAuthenticationToken</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> authenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (CustomAuthenticationToken) authentication;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> mobile</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (String) </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getPrincipal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> code</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (String) </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getCredentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> //自定义提取信息方式</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">UserDetails</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userDetails</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> ((ExtendUserDetailsService) userDetailsService).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loginByMobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(mobile);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		CustomAuthenticationToken</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> result</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(userDetails, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getCredentials</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> HashSet</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;>());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		result</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setDetails</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getDetails</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> result;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> boolean</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> supports</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">?</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> CustomAuthenticationToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">isAssignableFrom</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(authentication);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4.注册认证提供者</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>	@Bean</span></span>
<span class="line"><span>	public CustomAuthenticationProvider CustomAuthenticationProvider(UserDetailsService userDetailsService) {</span></span>
<span class="line"><span>		CustomAuthenticationProvider provider = new CustomAuthenticationProvider(userDetailsService);</span></span>
<span class="line"><span>		return provider;</span></span>
<span class="line"><span>	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_5-注册自定义令牌授予者" tabindex="-1"><a class="header-anchor" href="#_5-注册自定义令牌授予者"><span>5.注册自定义令牌授予者</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">ConditionalOnMissingBean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> TokenGrantBuilder</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> tokenGrantBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Autowired</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">required</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> false</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">) </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">CaptchaValidator</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> captchaValidator) {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		// 添加验证码授权模式授权者</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		TokenGranterProvider</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> captchaTokenGranter </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CaptchaTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">				endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getOAuth2RequestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">				captchaValidator)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">        </span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">CustomTokenGranter</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> customTokenGranter </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">				endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getOAuth2RequestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> authenticationManager)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">TokenGranterProvider</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenGranterProviderList </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		tokenGranterProviderList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(captchaTokenGranter);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">       tokenGranterProviderList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(customTokenGranter);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		TokenGrantBuilder</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenGrantBuilder </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> TokenGrantBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> tokenGranterProviderList)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> tokenGrantBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、退出端点构造" tabindex="-1"><a class="header-anchor" href="#三、退出端点构造"><span>三、退出端点构造</span></a></h2>
<h3 id="_1-jwt形式" tabindex="-1"><a class="header-anchor" href="#_1-jwt形式"><span>1.JWT形式</span></a></h3>
<p>JWT最大的一个优势在于它是<strong>无状态</strong>的，自身包含了认证鉴权所需要的所有信息，服务器端无需对其存储，从而给服务器减少了存储开销。</p>
<p>但是无状态引出的问题也是可想而知的，它无法作废未过期的JWT。</p>
<p>首先明确一点JWT失效的唯一途径就是等过期，就是说不借助外力的情况下，无法达到某些场景下需要主动使JWT失效的目的。而外力则是在服务器端存储着JWT的状态，在请求资源时添加判断逻辑，这与JWT特性无状态是相互矛盾的存在。但是，你要知道如果你选择走上了JWT这条路，那就没得选了。</p>
<p>以下就JWT在某些场景需要失效的简单方案整理如下：</p>
<h4 id="_1-白名单方式" tabindex="-1"><a class="header-anchor" href="#_1-白名单方式"><span><strong>1. 白名单方式</strong></span></a></h4>
<p>认证通过时，把JWT缓存到Redis，注销时，从缓存移除JWT。请求资源添加判断JWT在缓存中是否存在，不存在拒绝访问。这种方式和cookie/session机制中的会话失效删除session基本一致。</p>
<h4 id="_2-黑名单方式" tabindex="-1"><a class="header-anchor" href="#_2-黑名单方式"><span><strong>2. 黑名单方式</strong></span></a></h4>
<p>注销登录时，缓存JWT至Redis，且缓存有效时间设置为JWT的有效期，请求资源时判断是否存在缓存的黑名单中，存在则拒绝访问。</p>
<p>白名单和黑名单的实现逻辑差不多，黑名单不需每次登录都将JWT缓存，仅仅在某些特殊场景下需要缓存JWT，给服务器带来的压力要远远小于白名单的方式。</p>
<h5 id="实现方案" tabindex="-1"><a class="header-anchor" href="#实现方案"><span>实现方案：</span></a></h5>
<p>1.调用退出登录接口  <code v-pre>/oauth/logout</code></p>
<p>2.将JWT缓存到Redis的黑名单，可以将JWT载体中的jti作为唯一标识</p>
<p>3.判定请求头的JWT是否在黑名单内做对应的处理</p>
<p>JWT解析的结构如下：</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220726172350.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>既然有这么个字段能作为JWT的唯一标识，从JWT解析出jti之后将其存储到黑名单中作为判别依据，</p>
<p>相较于存储完整的JWT字符串减少了存储开销。</p>
<p>另外我们只需保证JWT在其有效期内用户登出后失效就可以了，</p>
<p>JWT有效期过了黑名单也就没有存在的必要，所以我们这里还需要设置黑名单的过期时间，不然黑名单的数量会无休止的越来越多，这是我们不想看到的。</p>
<ul>
<li><strong>AuthController.java</strong></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Api</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">tags</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "认证中心"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RestController</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RequestMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">AllArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthController</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> RedisTemplate</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> redisTemplate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">DeleteMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/logout"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> R</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> logout</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">HttpServletRequest</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> payload</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getHeader</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">JWT_PAYLOAD_KEY</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        JSONObject</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> jsonObject</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> JSONUtil</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">parseObj</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(payload);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> jti</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> jsonObject</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getStr</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"jti"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// JWT唯一标识</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        long</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> exp</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> jsonObject</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getLong</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"exp"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// JWT过期时间戳(单位:秒)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        long</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> currentTimeSeconds</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">currentTimeMillis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">() </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 1000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (exp </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">&#x3C;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> currentTimeSeconds) { </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// token已过期</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">            return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> R</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">ok</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">ResultCode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">INVALID_TOKEN_OR_EXPIRED</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        }</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        redisTemplate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">opsForValue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">AuthConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">TOKEN_BLACKLIST_PREFIX</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> jti, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, (exp </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> currentTimeSeconds), </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">TimeUnit</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SECONDS</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> R</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">ok</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>AuthRequestFilter.java</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthRequestFilter</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> OncePerRequestFilter</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Ordered</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">  private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> RedisTemplate</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> redisTemplate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">  public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> doFilter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">ServletRequest</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">ServletResponse</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> response</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">FilterChain</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> chain</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> IOException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ServletException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>}</p>
<p>@Override<br>
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {<br>
String token = request.getHeaders(AuthConstants.JWT_TOKEN_HEADER);<br>
if (StrUtil.isBlank(token)) {<br>
chain.doFilter(request,response);<br>
return;<br>
}<br>
token = token.replace(AuthConstants.JWT_TOKEN_PREFIX, Strings.EMPTY);<br>
JWSObject jwsObject = JWSObject.parse(token);<br>
String payload = jwsObject.getPayload().toString();</p>
<pre><code>  // 黑名单token(登出、修改密码)校验
  JSONObject jsonObject = JSONUtil.parseObj(payload);
  String jti = jsonObject.getStr(&quot;jti&quot;); // JWT唯一标识

  Boolean isBlack = redisTemplate.hasKey(AuthConstants.TOKEN_BLACKLIST_PREFIX + jti);
  if (isBlack) {

      response.setStatusCode(HttpStatus.OK);
      response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
      response.setHeader(&quot;Access-Control-Allow-Origin&quot;, &quot;*&quot;);
      response.setHeader(&quot;Cache-Control&quot;, &quot;no-cache&quot;);
      String body = JSONUtil.toJsonStr(R.failed(ResultCode.INVALID_TOKEN_OR_EXPIRED));
      ServletUtils.renderString(response,body);
      return;
  }



  chain.doFilter(request,response);
</code></pre>
<p>}</p>
<p>@Override<br>
public int getOrder() {<br>
return 0;<br>
}<br>
}</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_2-redis形式" tabindex="-1"><a class="header-anchor" href="#_2-redis形式"><span>2.Redis形式</span></a></h3>
<ul>
<li><strong>AuthController.java</strong></li>
</ul>
<p>​```java<br>
@RestController<br>
@RequestMapping(&quot;/oauth&quot;)<br>
@RequiredArgsConstructor</p>
<p>public class AuthController {</p>
<pre><code>private final TokenStore tokenStore;

private final ApplicationEventPublisher publisher;

/**
 * 退出token
 * @param authHeader Authorization
 */
@DeleteMapping(&quot;/logout&quot;)
public R&lt;Void&gt; logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
	if (StrUtil.isBlank(authHeader)) {
		return R.failed(SysResultCode.FORBIDDEN, &quot;退出失败，token 为空&quot;);
	}

	String tokenValue = authHeader.replace(OAuth2AccessToken.BEARER_TYPE, StrUtil.EMPTY).trim();
	OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue);
	if (accessToken == null || StrUtil.isBlank(accessToken.getValue())) {
		return R.failed(SysResultCode.FORBIDDEN, &quot;退出失败，token 无效&quot;);
	}

	OAuth2Authentication auth2Authentication = tokenStore.readAuthentication(accessToken);

	// 清空access token
	tokenStore.removeAccessToken(accessToken);
	// 清空 refresh token
	OAuth2RefreshToken refreshToken = accessToken.getRefreshToken();
	if (refreshToken!=null){
		tokenStore.removeRefreshToken(refreshToken);
	}
	// 发布用户登出事件
	//publisher.publishEvent(new LogoutSuccessEvent(auth2Authentication));

	return R.ok();
}
</code></pre>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>##  四、授权码模式页面定制</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 登录页面重定制</span></span>
<span class="line"><span></span></span>
<span class="line"><span>默认的登录页面，如下图：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![img](https://pics2.baidu.com/feed/314e251f95cad1c8136caadb6d7af703cb3d51c1.png?token=7f9dca6be98bb5c62ea0889115d76e7b)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何定制?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.定制页面</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![img](https://pics0.baidu.com/feed/9e3df8dcd100baa17da1146b59542918c9fc2e1b.png?token=b5e844a5adf80ada60489b231582ba03)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用thymeleaf进行渲染。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.定义跳转接口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>```java</span></span>
<span class="line"><span>@ApiOperation(value = "表单登录跳转页面")@GetMapping("/oauth/login")public String loginPage(Model model){    //返回跳转页面   </span></span>
<span class="line"><span>  return "oauth-login";}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3.Spring Security 中配置</p>
<ul>
<li>loginProcessingUrl：这个是定义的form表单提交的url。</li>
<li>loginPage：这个是定义跳转登录页面的url。</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> configure</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">HttpSecurity</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> http) throws Exception {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		http</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">csrf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">disable</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">formLogin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loginPage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth/login"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loginProcessingUrl</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/form/login"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">and</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authorizeRequests</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">antMatchers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(AUTHORIZE_ENDPOINT_PATH)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">				.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authenticated</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4.查看效果</p>
<figure><img src="https://pics4.baidu.com/feed/908fa0ec08fa513d42f37fbb2a29c5f1b3fbd9cc.png?token=66021a4d978ae8501c5819eb9ac55431" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h4 id="授权页面重定制" tabindex="-1"><a class="header-anchor" href="#授权页面重定制"><span>授权页面重定制</span></a></h4>
<p>默认的授权页面什么熊样，如下图:</p>
<figure><img src="https://pics7.baidu.com/feed/2934349b033b5bb55573043d2f974533b700bc1f.png?token=1437346ae67ce04fcbf81d1e67d12210" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>1.定制页面</p>
<figure><img src="https://pics1.baidu.com/feed/eaf81a4c510fd9f96ad388f73c6944202934a433.png?token=c3e1d103b0ed5f0822620aa31370ae2a" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>2.定义接口跳转</p>
<p>授权页面的跳转接口url：/oauth/confirm_access，这个接口定义在org.springframework.security.oauth2.provider.endpoint.WhitelabelApprovalEndpoint中，如下：</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">RequestMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth/confirm_access"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ModelAndView</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getAccessConfirmation</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Map</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">&#x3C;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> Object</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> HttpServletRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> request) throws Exception {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> approvalContent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> createTemplate</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> request)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getAttribute</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"_csrf"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> !=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">			model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">put</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"_csrf"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getAttribute</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"_csrf"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		View</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> approvalView </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> View</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> String</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getContentType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				return</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "text/html"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> render</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Map</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">?</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">HttpServletRequest</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> request</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">HttpServletResponse</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> response</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">				response</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setContentType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getContentType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">				response</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getWriter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">append</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(approvalContent);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ModelAndView</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(approvalView</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> model)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>自定义也很简单，只需要模仿这个接口自定义一个将其覆盖即可.</p>
<p>注意：@SessionAttributes(&quot;authorizationRequest&quot;)这个注解一定要标注，授权请求信息是存储在session中。</p>
<p>3.修改默认映射地址</p>
<p>若不修改映射地址 ，则无需执行此步骤</p>
<p>默认的跳转接口是：/oauth/confirm_access 若想变动则需要进行如下配置</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> configure</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationServerEndpointsConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		//授权页面url</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pathMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth/confirm_access"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"custom/confirm_access"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    }</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按照上述3个步骤即可轻松的实现授权页面自定义，效果如下</p>
<figure><img src="https://pics6.baidu.com/feed/a8ec8a13632762d08f2e9654bda898f0503dc693.png?token=7d816da7d148f406b86c1f4dcb32e4d3" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h4 id="异常页面重定制" tabindex="-1"><a class="header-anchor" href="#异常页面重定制"><span>异常页面重定制</span></a></h4>
<p>异常页面什么意思呢?授权码的请求url如下</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">http</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">//localhost:9001/blog-auth-server/oauth/authorize?client_id=mugu&#x26;response_type=code&#x26;scope=all&#x26;redirect_uri=http://www.baidu.com</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>假设我将的租户id(client_id)修改成数据库中不存在的值，那么将会触犯异常页面，页面如下：</p>
<figure><img src="https://pics7.baidu.com/feed/c8ea15ce36d3d53905d13f2428c3795a342ab033.png?token=56f14401fd246335ac0529d2e968ea03" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>这个异常页面是不是不太符合系统的要求，肯定是要自定义的。</p>
<p>1.定制页面</p>
<figure><img src="https://pics4.baidu.com/feed/77c6a7efce1b9d16da381294e99a24858d546412.png?token=09b553af186a75f9d1bbeafe6f00426b" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>2.定义跳转地址</p>
<p>这个跳转的接口的逻辑在AuthorizationEndpoint中</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ModelAndView</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> handleException</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Exception</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> e</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ServletWebRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> webRequest) throws Exception {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		ResponseEntity</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">OAuth2Exception</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> translate </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getExceptionTranslator</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">translate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(e);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		webRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getResponse</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setStatus</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">translate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getStatusCode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		if</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> (e </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">instanceof</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> ClientAuthenticationException </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">||</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> e </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">instanceof</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> RedirectMismatchException) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ModelAndView</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(errorPage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> Collections</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">singletonMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"error"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">translate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getBody</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">())</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		AuthorizationRequest</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> authorizationRequest </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		try</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">			authorizationRequest </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getAuthorizationRequestForError</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(webRequest)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> requestedRedirectParam </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> authorizationRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getRequestParameters</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">OAuth2Utils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">REDIRECT_URI</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> requestedRedirect </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> redirectResolver</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">resolveRedirect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(requestedRedirectParam,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">					getClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadClientByClientId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authorizationRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getClientId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">			authorizationRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setRedirectUri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(requestedRedirect);</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> redirect </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getUnsuccessfulRedirect</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(authorizationRequest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> translate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getBody</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> authorizationRequest</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">					.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getResponseTypes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">contains</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"token"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ModelAndView</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> RedirectView</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(redirect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> false</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> false</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">))</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		catch</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">OAuth2Exception</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> ex</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// If an AuthorizationRequest cannot be created from the incoming parameters it must be</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// an error. OAuth2Exception can be handled this way. Other exceptions will generate a standard 500</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// response.</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ModelAndView</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(errorPage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> Collections</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">singletonMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"error"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">translate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getBody</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">())</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此只需要重新定义一个接口进行跳转即可，如下：</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">ApiOperation</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">value</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "处理授权异常的跳转页面"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">GetMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth/error"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> String</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> error</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Model</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> model){    </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">return</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "oauth-error"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>3.修改默认的映射地址</p>
<p>若不修改映射地址 ，则无需执行此步骤</p>
<p>默认的映射地址为/oauth/error，修改也很简单，只需要在OAuth2的认证服务的配置类：继承AuthorizationServerConfigurerAdapter的配置中修改一下配置</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> configure</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationServerEndpointsConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">		//授权页面url</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pathMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/oauth/error"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"custom/error"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    }</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按照上述3个步骤即可轻松的实现异常页面自定义，效果如下：</p>
<figure><img src="https://pics5.baidu.com/feed/96dda144ad345982e21da35917b0a1a7caef8430.png?token=0764967356509c142d772c03e249c3f8" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="五、多用户体系刷新模式" tabindex="-1"><a class="header-anchor" href="#五、多用户体系刷新模式"><span>五、多用户体系刷新模式</span></a></h2>
<p>如果只是针对一种用户体系以及一种认证方式(用户名/手机号/openid)的话，比如<code v-pre>验证码</code> 模式的扩展，就不需要对<code v-pre>刷新模式</code>做调整。</p>
<p>但是如果是多用户体系或者多种认证方式，就必须做些调整来适配。</p>
<h3 id="_1-原理" tabindex="-1"><a class="header-anchor" href="#_1-原理"><span>1. 原理</span></a></h3>
<p><code v-pre>刷新模式</code> 时序图如下，相较于密码模式还只是 <code v-pre>Granter</code> 和 <code v-pre>Provider</code>的变动。</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220729113135.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>着重说一下刷新模式的认证提供者 <code v-pre>PreAuthenticatedAuthenticationProvider</code> ，其 authenticate() 认证方法只做<strong>用户状态校验</strong>，check() 方法调用 AccountStatusUserDetailsChecker#check(UserDetails)。</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220729113159.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>注意 下<code v-pre>this.preAuthenticatedUserDetailsService.loadUserDetails((PreAuthenticatedAuthenticationToken)authentication);</code> 的 <code v-pre>preAuthenticatedUserDetailsService</code> 用户服务。</p>
<p>在没有进行授权模式扩展的时候，是下面这样设置的</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220729113219.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>然后在 <code v-pre>AuthorizationServerEndpointsConfigurer#addUserDetailsService(DefaultTokenServices,UserDetailsService)</code> 构造 <code v-pre>PreAuthenticatedAuthenticationProvider</code> 里设置了 <code v-pre>UserDetailService</code>用户服务。</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220729113256.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>这样在多用户体系认证下问题可想而知，用户分别有系统用户和会员用户，这里固定成一个用户服务肯定是行不通的。</p>
<h3 id="_2-实战" tabindex="-1"><a class="header-anchor" href="#_2-实战"><span>2.实战</span></a></h3>
<p>首先我们清楚一个 OAuth2 客户端基本对应的是一个用户体系</p>
<table>
<thead>
<tr>
<th>OAuth2 客户端名称</th>
<th>OAuth2 客户端ID</th>
<th>用户体系</th>
</tr>
</thead>
<tbody>
<tr>
<td>管理系统</td>
<td>admin</td>
<td>系统用户</td>
</tr>
<tr>
<td>移动端</td>
<td>client</td>
<td>会员用户</td>
</tr>
</tbody>
</table>
<p>那就有一个很简单有效的思路，可以在系统内部维护一个如上表的映射关系 Map，然后根据传递的客户端ID去选择用户体系或刷新模式。</p>
<h4 id="思路1" tabindex="-1"><a class="header-anchor" href="#思路1"><span>思路1：</span></a></h4>
<h5 id="_1-创建provider指定用户体系" tabindex="-1"><a class="header-anchor" href="#_1-创建provider指定用户体系"><span>1.创建provider指定用户体系</span></a></h5>
<p>扩展授权模式创建 <code v-pre>Provider</code> 时可以指定具体的用户服务 <code v-pre>UserDetailService</code>，就如下面这样：</p>
<figure><img src="https://cdn.jsdelivr.net/gh/xiaoashuo/pics/oauth2/20220729113315.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h5 id="_2-刷新模式指定客户体系调用" tabindex="-1"><a class="header-anchor" href="#_2-刷新模式指定客户体系调用"><span>2.刷新模式指定客户体系调用</span></a></h5>
<p>你可以为每个授权模式扩展新增对应的刷新模式，但是这样的话比较麻烦，本文的实现方案核心图的是简单有效，所以这里使用的另一种方案，重新设置<code v-pre>PreAuthenticatedAuthenticationProvider</code> 的 preAuthenticatedUserDetailsService 属性，让其有判断选择用户体系和认证方式的能力。</p>
<p>新增的 PreAuthenticatedUserDetailsService 可根据客户端和认证方式选择UserDetailService 和方法获取用户信息 UserDetail</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">/**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> * 刷新token再次认证 UserDetailsService</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> *</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@author</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> &#x3C;a href="mailto:xianrui0365@163.com">xianrui&#x3C;/a></span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> * @date 2021/10/2</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">NoArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> PreAuthenticatedUserDetailsService</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Authentication</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthenticationUserDetailsService</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF">>,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> InitializingBean</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * 客户端ID和用户服务 UserDetailService 的映射</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     *</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@see</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> com.youlai.auth.security.config.AuthorizationServerConfig#tokenServices(AuthorizationServerEndpointsConfigurer)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     */</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetailsService</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> PreAuthenticatedUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">Map</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">UserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">> </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">userDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        Assert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">notNull</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(userDetailsServiceMap, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"userDetailsService cannot be null."</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">userDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> userDetailsServiceMap;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> afterPropertiesSet</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        Assert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">notNull</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">userDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"UserDetailsService must be set"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * 重写PreAuthenticatedAuthenticationProvider 的 preAuthenticatedUserDetailsService 属性，可根据客户端和认证方式选择用户服务 UserDetailService 获取用户信息 UserDetail</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     *</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@param</span><span style="--shiki-light:#383A42;--shiki-light-font-style:italic;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authentication</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@return</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * </span><span style="--shiki-light:#A626A4;--shiki-light-font-style:italic;--shiki-dark:#C678DD;--shiki-dark-font-style:italic">@throws</span><span style="--shiki-light:#C18401;--shiki-light-font-style:italic;--shiki-dark:#E5C07B;--shiki-dark-font-style:italic"> UsernameNotFoundException</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> loadUserDetails</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UsernameNotFoundException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> clientId</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> RequestUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getOAuth2ClientId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 获取认证方式，默认是用户名 username</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        AuthenticationMethodEnum</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> authenticationMethodEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> AuthenticationMethodEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getByValue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">RequestUtils</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getAuthenticationMethod</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        UserDetailsService</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(clientId);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">clientId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SecurityConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">APP_CLIENT_ID</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">            // 移动端的用户体系是会员，认证方式是通过手机号 mobile 认证</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">            MemberUserDetailsServiceImpl</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> memberUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (MemberUserDetailsServiceImpl) userDetailsService;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">            switch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (authenticationMethodEnum) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                case</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> MOBILE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                    return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> memberUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadUserByMobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                default:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                    return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> memberUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        }  </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">else</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">clientId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">equals</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SecurityConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">ADMIN_CLIENT_ID</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">            // 管理系统的用户体系是系统用户，认证方式通过用户名 username 认证</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">            switch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (authenticationMethodEnum) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                default:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">                    return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">            }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">            return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AuthorizationServerConfig 配置重新设置 PreAuthenticatedAuthenticationProvider 的 preAuthenticatedUserDetailsService 属性值</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * 配置授权（authorization）以及令牌（token）的访问端点和令牌服务(token services)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> configure</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationServerEndpointsConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // Token增强</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        TokenEnhancerChain</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenEnhancerChain </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> TokenEnhancerChain</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">TokenEnhancer</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenEnhancers </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">jwtAccessTokenConverter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancerChain</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setTokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(tokenEnhancers);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 获取原有默认授权模式(授权码模式、密码模式、客户端模式、简化模式)的授权者</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">TokenGranter</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> granterList </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">Arrays</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">asList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">())</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 添加验证码授权模式授权者</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        granterList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CaptchaTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(), </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">                endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getOAuth2RequestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(), authenticationManager, stringRedisTemplate</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        ));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 添加手机短信验证码授权模式的授权者</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        granterList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> SmsCodeTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(), </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(),</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">                endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getOAuth2RequestFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(), authenticationManager</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        ));</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        CompositeTokenGranter</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> compositeTokenGranter </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CompositeTokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(granterList)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">        endpoints</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">authenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(authenticationManager)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">accessTokenConverter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">jwtAccessTokenConverter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">())</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(tokenEnhancerChain)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenGranter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(compositeTokenGranter)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">                /** refresh token有两种使用方式：重复使用(true)、非重复使用(false)，默认为true</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">                 *  1 重复使用：access token过期刷新时， refresh token过期时间未改变，仍以初次生成的时间为准</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">                 *  2 非重复使用：access token过期刷新时， refresh token过期时间延续，在refresh token有效期内刷新便永不失效达到无需再次登录的目的</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">                 */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">reuseRefreshTokens</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">                .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(endpoints))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">        ;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> DefaultTokenServices</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationServerEndpointsConfigurer</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> endpoints) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        TokenEnhancerChain</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenEnhancerChain </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> TokenEnhancerChain</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">TokenEnhancer</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenEnhancers </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ArrayList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">jwtAccessTokenConverter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenEnhancerChain</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setTokenEnhancers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(tokenEnhancers);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        DefaultTokenServices</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> tokenServices </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> DefaultTokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setTokenStore</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">endpoints</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTokenStore</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setSupportRefreshToken</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setClientDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(clientDetailsService);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setTokenEnhancer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(tokenEnhancerChain);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 多用户体系下，刷新token再次认证客户端ID和 UserDetailService 的映射Map</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetailsService</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> clientUserDetailsServiceMap </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> HashMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        clientUserDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">put</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SecurityConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">ADMIN_CLIENT_ID</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, sysUserDetailsService);</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 管理系统客户端</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        clientUserDetailsServiceMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">put</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SecurityConstants</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">APP_CLIENT_ID</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, memberUserDetailsService);</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // Android/IOS/H5 移动客户端</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 重新设置PreAuthenticatedAuthenticationProvider#preAuthenticatedUserDetailsService 能够根据客户端ID和认证方式区分用户体系获取认证用户信息</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">        PreAuthenticatedAuthenticationProvider</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> provider </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> PreAuthenticatedAuthenticationProvider</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        provider</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setPreAuthenticatedUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> PreAuthenticatedUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;>(clientUserDetailsServiceMap));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">        tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setAuthenticationManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ProviderManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">Arrays</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">asList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(provider)));</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">        return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> tokenServices</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">    }</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="思路2" tabindex="-1"><a class="header-anchor" href="#思路2"><span>思路2：</span></a></h4>
<h5 id="_1-注册授权信息处理" tabindex="-1"><a class="header-anchor" href="#_1-注册授权信息处理"><span>1.注册授权信息处理</span></a></h5>
<blockquote>
<p>支持多用户授权体系刷新模式，默认注册 password与sms_code 模式</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AuthorizationInfoHandle</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> authorizationInfoHandle</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> AuthorizationInfoHandle</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">grantType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"password"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> RetriveUserFunction</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			public</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> &#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> retrive</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">					UserDetailsService</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">				String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loadUserByUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(name);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">grantType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"sms_code"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> RetriveUserFunction</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			public</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> &#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> extends</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserDetails</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> retrive</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">T</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">					UserDetailsService</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic"> userDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">				String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> authentication</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">				ExtendUserDetailsService</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> extendUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (ExtendUserDetailsService) userDetailsService;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> extendUserDetailsService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">loginByMobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(name);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">			}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		});</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-注册-userdetailservice代理" tabindex="-1"><a class="header-anchor" href="#_2-注册-userdetailservice代理"><span>2.注册 <code v-pre>UserDetailService</code>代理</span></a></h5>
<blockquote>
<p>注:若不注册此代理 则多用户体系不生效</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> UserService</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> userService</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">AuthorizationInfoHandle</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> authorizationInfoHandle){</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> ProxyFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">create</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">UserService</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> PreMethodInterceptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(authorizationInfoHandle));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


