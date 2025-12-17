<template><div><h1 id="线程池监控" tabindex="-1"><a class="header-anchor" href="#线程池监控"><span>线程池监控</span></a></h1>
<h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景"><span>背景</span></a></h2>
<p>系统时不时会出现短暂的响应慢，甚至偶尔超时，但监控面板上的CPU、内存、磁盘IO全都很正常。</p>
<p>排查发现: 订单服务的线程池悄悄&quot;罢工&quot;了 —— 核心线程全被占满，任务队列塞爆，新请求全部被拒绝，这种情况在常规监控中完全无法被发现！</p>
<p>解决方案: 引入线程池监控工具，支持动态伸缩，异常预警。</p>
<p>链路流程如下:</p>
<p>web请求-&gt;监控拦截器-&gt;线程池是否健康</p>
<ul>
<li>良好 实时数据</li>
<li>警告 告警推送</li>
<li>危险 自动扩容</li>
</ul>
<h2 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h2>
<h3 id="_1、引入坐标" tabindex="-1"><a class="header-anchor" href="#_1、引入坐标"><span>1、引入坐标</span></a></h3>
<div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-xml"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>cn.lovecyy&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>pool-monitor-starter&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>${version}&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2、application-yml" tabindex="-1"><a class="header-anchor" href="#_2、application-yml"><span>2、application.yml</span></a></h3>
<div class="language-yml line-numbers-mode" data-highlighter="shiki" data-ext="yml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">relaxed</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  thread-pool</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    monitor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #是否开启池监控</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      monitorEnabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #预警阈值 超过则通知</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      alertThreshold</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">80</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      alertChannels</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">email</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> #通知方式 可自行选择处理</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      monitorIntervalMills</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">10000</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> #监控频率 毫秒单位</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      adjustPoolNumEnabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">true</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> #是否开启池自动伸缩</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      #若阈值低于20% 且收缩空闲间隔超过，则将池恢复原池大小</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      idleRatioMaxThreshold</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">20</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> # 收缩阈值 低于20</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      idleRatioIntervalMills</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">60000</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> #收缩空闲间隔 毫秒单位</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      adjustPoolMaxinumThreshold</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">100</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> #最大扩展池大小</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、配置监控" tabindex="-1"><a class="header-anchor" href="#_3、配置监控"><span>3、配置监控</span></a></h3>
<blockquote>
<p>增加 @ThreadPoolMonitor自定义注解,name不设置默认取bean名称</p>
</blockquote>
<p>目前仅支持 ThreadPoolExecutor、ThreadPoolTaskExecutor线程池监控</p>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">ThreadPoolMonitor</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "测试线程池"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ThreadPoolExecutor</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> testThreadPool</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		ThreadPoolExecutor</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> orderProcessExecutor </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> ThreadPoolExecutor</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 核心线程数</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66">				5</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 最大线程数</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66">				60</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> TimeUnit</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">SECONDS</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 空闲线程存活时间</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> LinkedBlockingQueue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">200</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 工作队列</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">				new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> NamedThreadFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"order-process-"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> false</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> ThreadPoolExecutor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">CallerRunsPolicy</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"> // 拒绝策略</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> orderProcessExecutor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4、单元测试" tabindex="-1"><a class="header-anchor" href="#_4、单元测试"><span>4、单元测试</span></a></h3>
<blockquote>
<p>正常使用线程池即可</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">for</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">&#x3C;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 1000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">++</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">			PoolOrder</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> poolOrder </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> PoolOrder</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">			poolOrder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">setUsername</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"username"</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> i);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">			CompletableFuture</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">supplyAsync</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(() </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// 处理订单逻辑</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">			return</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> doProcessOrder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(order);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		}, testThreadPool);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="扩展说明" tabindex="-1"><a class="header-anchor" href="#扩展说明"><span>扩展说明</span></a></h2>
<h3 id="_1、获取池信息" tabindex="-1"><a class="header-anchor" href="#_1、获取池信息"><span>1、获取池信息</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ThreadPoolTaskMonitor</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> monitor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     * 获取当前池状态</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">     */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">GetMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/stats"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> List</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">&#x3C;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">ThreadPoolStats</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">></span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getAllStats</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B"> monitor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getAllPoolStats</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">   /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    * 获取周期内池平均趋势统计</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">GetMapping</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"/trend"</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> Map</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">&#x3C;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> ThreadPoolTrend</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">></span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> getAllTrends</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">		Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> ThreadPoolTrend</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF">></span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> trends </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> HashMap</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">		monitor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getAllPoolStats</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">forEach</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(stats </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">			trends</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">put</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">stats</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getPoolName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(), </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">monitor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getTrend</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">stats</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">getPoolName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		});</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> trends</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2、自定义通知" tabindex="-1"><a class="header-anchor" href="#_2、自定义通知"><span>2、自定义通知</span></a></h3>
<blockquote>
<p>实现AlertService注册成bean即可,默认的如下，不做任何处理</p>
</blockquote>
<div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-java"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B">Bean</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">	public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B"> AlertService</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> defaultAlertService</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">		return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> (finalMsg</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> channels) </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD">-></span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">            //通知渠道根据yml配置的，多个，分割。</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">			// log.info("线程池告警,通知渠道:{},消息:{}",channels,finalMsg);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">		}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">	}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、监控面版指标" tabindex="-1"><a class="header-anchor" href="#_3、监控面版指标"><span>3、监控面版指标</span></a></h3>
<p>监控面板展示的关键指标：</p>
<table>
<thead>
<tr>
<th>指标名称</th>
<th>健康值</th>
<th>警告值</th>
<th>危险值</th>
<th>当前值</th>
</tr>
</thead>
<tbody>
<tr>
<td>活跃线程数</td>
<td>&lt;70%</td>
<td>70%-85%</td>
<td>&gt;85%</td>
<td>56%</td>
</tr>
<tr>
<td>队列使用率</td>
<td>&lt;60%</td>
<td>60%-80%</td>
<td>&gt;80%</td>
<td>23%</td>
</tr>
<tr>
<td>任务完成率</td>
<td>&gt;95%</td>
<td>85%-95%</td>
<td>&lt;85%</td>
<td>99.8%</td>
</tr>
<tr>
<td>拒绝任务数</td>
<td>0</td>
<td>&lt;10</td>
<td>≥10</td>
<td>0</td>
</tr>
<tr>
<td>平均执行时间</td>
<td>&lt;300ms</td>
<td>300ms-800ms</td>
<td>&gt;800ms</td>
<td>78ms</td>
</tr>
</tbody>
</table>
<h3 id="_4、线程池预热" tabindex="-1"><a class="header-anchor" href="#_4、线程池预热"><span>4、线程池预热</span></a></h3>
<p>通过监控分析,可以了解到不同时间段，线程池的紧张状态。</p>
<p>针对这种情况，我们可以进行峰值提前预热，将线程池扩大。</p>
<p>解决方案:</p>
<p>开发一个定时任务，进行线程池的自动伸缩。<br>
可以合理的调整高峰、次高峰、低峰时候的合理线程数。</p>
<p>代码实现:</p>
<p>获取ThreadPoolTaskMonitor的bean对象，从里面根据名称查询到线程池，调用对应方法调整池参数;</p>
</div></template>


