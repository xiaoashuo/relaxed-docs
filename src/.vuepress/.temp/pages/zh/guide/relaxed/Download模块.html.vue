<template><div><h1 id="download模块" tabindex="-1"><a class="header-anchor" href="#download模块"><span>Download模块</span></a></h1>
<h2 id="简言" tabindex="-1"><a class="header-anchor" href="#简言"><span>简言</span></a></h2>
<p>由于每个项目基本都有导出功能，虽然实现不复杂，但过于繁琐，</p>
<p>因此将导出部分单独抽成注解形式。以方便使用。</p>
<h2 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h2>
<h3 id="_1、引入坐标" tabindex="-1"><a class="header-anchor" href="#_1、引入坐标"><span>1、引入坐标</span></a></h3>
<div class="language-pom line-numbers-mode" data-highlighter="shiki" data-ext="pom" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-pom"><span class="line"><span>      &#x3C;dependency></span></span>
<span class="line"><span>            &#x3C;groupId>cn.lovecyy&#x3C;/groupId></span></span>
<span class="line"><span>            &#x3C;artifactId>relaxed-spring-boot-starter-download&#x3C;/artifactId></span></span>
<span class="line"><span>            &#x3C;version>${version}&#x3C;/version></span></span>
<span class="line"><span>      &#x3C;/dependency></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2、创建controller" tabindex="-1"><a class="header-anchor" href="#_2、创建controller"><span>2、创建controller</span></a></h3>
<blockquote>
<p>方法必须使用<code v-pre>@ResponseDownload</code>标注+返回值为<code v-pre>DownloadModel</code></p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">ResponseDownload</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">channel</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> DownTypeEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">LOCAL</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">GetMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"local"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> DownloadModel</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> local</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		DownloadModel</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> downloadModel </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> DownloadModel</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"D:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\\</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">test"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"123.jpg"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> downloadModel</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数解析:</p>
<h4 id="responsedownload" tabindex="-1"><a class="header-anchor" href="#responsedownload"><span>@ResponseDownload</span></a></h4>
<ul>
<li>channel 渠道LOCAL,SFTP,OSS,OTHER(自定义)默认为LOCAL</li>
</ul>
<p>​    若要支持 SFTP(参考SFTP模块文档) ，OSS（参考SFTP模块文档） 需要引入对应依赖</p>
<ul>
<li>inline 是否直接展示 默认为false</li>
<li>contentType 如果未指定，会尝试获取 如果尝试获取失败，则默认application/octet-stream</li>
<li>charset  如果下载包含中文的文本文件出现乱码，可以尝试指定编码 默认UTF-8</li>
<li>headers 响应头 数目长度必须为偶数 基数位为key 偶数位 为value</li>
</ul>
<h4 id="downloadmodel" tabindex="-1"><a class="header-anchor" href="#downloadmodel"><span>DownloadModel</span></a></h4>
<ul>
<li>fileName 文件名称 带后缀 123.png</li>
<li>fileType 文件类型 png</li>
<li>parentPath 文件父级路径 绝对路径 eg /test/123.png 此处就是/test</li>
<li>separator  文件路径分隔符 默认为系统分隔符</li>
<li>fullFilePath 文件全路径  eg /test/123.png</li>
<li>extra 额外参数 自定义处理器时可能用的到</li>
<li>downloadCallback 后置处理器 执行完之后可以做一些收尾工作</li>
</ul>
<p>3、开始使用</p>
<p>直接访问地址 即可 下载附件。</p>
<h2 id="扩展" tabindex="-1"><a class="header-anchor" href="#扩展"><span>扩展</span></a></h2>
<h3 id="_1-自定义下载处理器" tabindex="-1"><a class="header-anchor" href="#_1-自定义下载处理器"><span>1.自定义下载处理器</span></a></h3>
<p>实现<code v-pre>FileHandler</code>接口,具体实现参考<code v-pre>SftpFileHandler</code></p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">//1.自定义文件处理器 CustomDownloadHandler</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> CustomDownloadHandler</span><span style="--shiki-light:#C18401;--shiki-dark:#E06C75"> implement FileHandler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    //...省略具体实现</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">//2.手动注册</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">FileHandlerLoader</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">register</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> CustomDownloadHandler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">());</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若不想手动注册 也可在resources下的<code v-pre>META-INF.services</code><br>
下面新建一个<code v-pre>com.relaxed.common.core.util.com.relaxed.test.util.file.FileHandler</code>文件 ，内容指定具体实现类即可.</p>
<p>此种方式不支持 依赖注入 若要使用bean 需要从上下文环境获取。</p>
</div></template>


