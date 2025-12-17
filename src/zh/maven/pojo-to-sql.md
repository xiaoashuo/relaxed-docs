# pojo-sql-maven-plugin

## 介绍

根据实体 生成建表Sql语句  Maven 插件
需求: 对接某合作方，提供N张表M字段，数据落库到我们本地数据库，
导致手写工作量巨大，因此使用此插件辅助生成。

[插件地址](https://gitee.com/TomSale/pojo-sql-maven-plugin.git)

## 使用说明

1. 引入Maven插件坐标

   ```xml
   <plugin>
                <groupId>com.relaxed</groupId>
                <artifactId>pojo-sql-plugin</artifactId>
                <version>1.0.0</version>
                <configuration>
                    <!-- 扫描目录 -->
                    <basedir>${project.basedir}\src\main\java\com\natrust\securities\bridge\model\huaxia</basedir>
                    <!-- 输出目录 -->
                    <target>outputPath</target>
                    <!-- 生成表前缀 -->
                    <tablePrefix>t</tablePrefix>
                </configuration>
     </plugin>
   ```

2. mvn 执行命令

```shell
mvn  com.relaxed:poj
o-sql-plugin:1.0.0:generate -DscanRootDir=originPath
```

3.idea使用maven插件辅助直接执行
4.附加实体文档注释

```shell
/**
 * @author Yakir
 * @Topic TestData
 * @Description
 * @date 2021/12/8 17:19
 * @Version 1.0
 */
@Data
public class TestData {
    /**
     * 年龄
     */
    private Integer age;
    /**
     * username
     * 指定sql类型 优先于默认类型
     * @sqlType decimal(10,2)
     * 要求是否必填 true not null false null default null
     * @required true
     */
    private String username;
}
```

