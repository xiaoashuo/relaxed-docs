# XXL-JOB模块

官方地址: https://www.xuxueli.com/xxl-job

当前使用版本: 2.2.0

## 概述

基于分布式调度平台客户端进行二次封装。

核心功能点:

+ 插拔式配置

+ 日志无感输出到xxl-admin控制台

+ 支持追踪式id，便捷问题排查。

  traceId生成规则=jobId(任务id)-uuid(无符号)

## 使用方式

### 1.引入pom

```xml
        <!--xxl job相关-->
        <dependency>
            <groupId>com.lovecyy</groupId>
            <artifactId>relaxed-spring-boot-starter-job</artifactId>
            <version>${version}</version>
        </dependency>
```

### 2.启用xxl

```java
@EnableXxlJob
@MapperScan(basePackages = "org.example.**.mapper")
@SpringBootApplication(scanBasePackages = {"org.example","com.relaxed"})
public class TaskApplication implements ApplicationRunner {
    public static void main(String[] args) {
        SpringApplication.run(TaskApplication.class,args);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        //因为采用非Web模式启动，1.0需加入如下代码，不然会导致启动后立马关闭，2.0可以忽略，若发现同样情况，打开即可
       while (true){
           Thread.sleep(100);
       }
    }
}
```

### 3.配置yml

```yml
#xxl job配置如下
xxl:
  job:
    admin:
      addresses: http://127.0.0.1:9190/xxl-job-admin
    executor:
      appname: xxl-job-test
      ip:
      port: 50013
      # 执行器运行日志文件存储磁盘路径 [选填] ：需要对该路径拥有读写权限；为空则使用默认路径；
      logpath: /data/applogs/xxl-job/jobhandler
      # 执行器日志文件保存天数 [选填] ： 过期日志自动清理, 限制值大于等于3时生效; 否则, 如-1, 关闭自动清理功能；
      logretentiondays: 30
    #缺省配置 默认已经填充  
    log:
      #拦截日志前缀
      log-prefix: XXL-
      #appender名称
      name: logXXl
      #是否启用appender配置,默认开启
      enabled: true
      #最小拦截级别 TRACE INFO WARN ERROR  
      min-level: INFO  
      #扫描包
      includePackages:
      #忽略包
      excludePackages:

```

### 4.测试job

```java
@Slf4j
@Component
public class LogXxlJob {

	@XxlJob("testLogPrint")
	public ReturnT<String> testLogPrint(String params) {

		log.info("当前执行任务名称:testLogPrint");
		log.info("XXL-这是一条双appender日志");
		// 异常日志示例
		try {
			throw new RuntimeException("测试异常");
		}
		catch (Exception e) {
			log.error("XXL-发生错误", e);
		}
		return new ReturnT<>("执行成功");
	}
}

```

启动项目，调度日志。

即可发现XXL-开头前缀日志被同步输出到xxl-admin的日志平台上。

且trace_id自动被输出。

## 附:

### 多线程情况线程切换导致traceId丢失

问题：xxl-job任务内若涉及多线程执行任务，由于线程池策略，线程切换可能导致traceId丢失。

解决方案:

#### 1.装饰线程

将任务线程通过`com.relaxed.admin.core.thread.MdcTaskDecorator`类进行装饰。

```java
	/**
	 * mdc 任务解码器
	 * @author yakir
	 */
	@Bean
	public TaskDecorator mdcTaskDecorator() {
		return new MdcTaskDecorator();
	}
```

**MdcTaskDecorator.java**

```
public class MdcTaskDecorator implements TaskDecorator {

	@Override
	public Runnable decorate(Runnable runnable) {
		Map<String, String> contextMap = MDC.getCopyOfContextMap();
		return () -> {
			Map<String, String> old = MDC.getCopyOfContextMap();
			try {
				// 现在：@Async线程上下文！
				// 恢复Web线程上下文的MDC数据
				if (MapUtil.isNotEmpty(contextMap)) {
					MDC.setContextMap(contextMap);
				}
				runnable.run();
			}
			finally {
				if (old==null){
					MDC.clear();
				}else{
					MDC.setContextMap(old);
				}

			}
		};
	}

}
```

#### 2.配置线程池

```java
@Configuration(proxyBeanMethods = false)
public class ThreadPoolConfig {
	// 核心线程池大小
	private int corePoolSize = 12;

	// 最大可创建的线程数
	private int maxPoolSize = 36;

	// 队列最大长度
	private int queueCapacity = 1000;

	// 线程池维护线程所允许的空闲时间
	private int keepAliveSeconds = 300;

	/**
	 * 线程池自定义
	 * @author yakir
	 * @return org.springframework.boot.task.TaskExecutorCustomizer
	 */
	@Bean
	public TaskExecutorCustomizer taskExecutorCustomizerExtend() {
		return (executor) -> {
			executor.setThreadNamePrefix("task-");
			executor.setMaxPoolSize(maxPoolSize);
			executor.setCorePoolSize(corePoolSize);
			executor.setQueueCapacity(queueCapacity);
			executor.setKeepAliveSeconds(keepAliveSeconds);
			// 线程池对拒绝任务(无线程可用)的处理策略
			executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
		};
	}

}

```

使用此线程池，执行的任务traceId会被同步传递。

### 配置方式添加appender

**配置logback-spring.xml**

> 标识当前XXL-开头，且日志级别INFO以上的日志将被拦截

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 其他已有配置 -->

    <!-- 添加XXL-JOB日志Appender -->
    <appender name="XXL-JOB" class="com.relaxed.common.job.XxlJobLogAppender">
        <logPrefix>XXL-</logPrefix>
        <minLevel>INFO</minLevel>
    </appender>

    <root level="INFO">

        <!-- 添加XXL-JOB appender -->
        <appender-ref ref="XXL-JOB"/>
    </root>
</configuration>

```

### 编程式添加appender

实现`LogbackAppenderProvider`接口,注册成bean即可。替换默认appender的生成。

