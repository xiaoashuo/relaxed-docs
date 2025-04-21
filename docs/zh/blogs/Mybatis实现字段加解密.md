# Mybtias实现字段加解密

> 支持mybatis plus

## 期望

1、实现指定注解字段，落库加密，出库解密，且内存中原始参数不变。

## 使用方式

### 1.引入坐标

```xml
     <dependency>
            <groupId>cn.lovecyy</groupId>
            <artifactId>relaxed-extend-mybatis-encrypt</artifactId>
            <version>${version}</version>
        </dependency>
```

### 2.application.yml

此处默认使用AES加解密，若需添加或替换默认算法
实现`FieldEncryptor`且注册成bean即可。 

```java
relaxed:
  mybatis:
    sec:
      aes:
       key: c6eb7f4a1df78536
      def-sec: AES
```

### 3.开始测试

测试单元关联信息查看==>拓展内容->单元测试信息

#### 数据准备

```java
	private  BlackData getBlackData() {
		BlackData userPo = new BlackData();
		userPo.setVcExpid("11111");
		userPo.setDDatetime(LocalDate.now());
		userPo.setCIsdelete("1");
		userPo.setVcCustname("张娜");
		userPo.setCIdentitytype("1");
		userPo.setVcIdentityno("1");
		userPo.setCCusttype("1");
		userPo.setVcModifydate(LocalDate.now());
		userPo.setVcFlag("1");
		userPo.setBirthDate("1");
		userPo.setMd5("1");
		userPo.setValid(1);
		userPo.setCreatedTime(LocalDateTime.now());
		userPo.setUpdatedTime(LocalDateTime.now());
		userPo.setCListId("123");
		return userPo;
	}
```



##### 一、数据保存/批量保存

单数据保存

```java
BlackData blackData = getBlackData();
		boolean testResult = blackDataService.save(blackData);
		log.info("当前数据执行结果:{},主键id{}",testResult,blackData.getId());

```

批数据存储

```java
BlackData batchBlackData = getBlackData();
		BlackData batchBlackData2 = BeanUtil.toBean(batchBlackData, BlackData.class);
		batchBlackData2.setCListId("456");
	    ArrayList<BlackData> dataArrayList = ListUtil.toList(batchBlackData, batchBlackData2);
	    boolean batchTestResult = blackDataService.saveBatch(dataArrayList);
		log.info("当前数据执行结果:{},主键id:{},{}",batchTestResult,batchBlackData.getId(),batchBlackData2.getId());
```

##### 二、数据查询

> 所有结果集包含注解的会自动解密成明文

实体构建参数查询，标注注解的字段自动加解密

LambdaQuery构建查询

```java
//Wrappers.<T>lambdaQuery() 无法获取泛型 T 泛型擦除  ，此处建议使用 Wrappers.lambdaQuery(BlackData.class) 方式
		List<BlackData> list = blackDataService.list(Wrappers.lambdaQuery(BlackData.class)
				.eq(BlackData::getCListId, "123")
				.orderByDesc(BlackData::getCreatedTime));
		log.info("当前查询结果:{}",list);
```

mybatis查询

```java
	BlackData queryData=new BlackData();
		queryData.setCListId("123");
		List<BlackData> list = blackDataService.getByClistId(queryData);
		log.info("当前查询结果:{}",list);
```

参数变量查询

```java
//手动编码方式
//需要手动将明文参数进行编码，在传递入参。也可以在service层统一处理，
String encrypt = FieldSecurityHolder.INSTANCE.encrypt("123");
		List<BlackData> list = blackDataService.listByClistId(encrypt);

		log.info("编码后查询参数:{},当前查询结果:{}",encrypt,list);

//使用@ParamEncrypt注解标注方式
String plainText = "123";
List<BlackData> list = blackDataService.listByClistId(plainText);
		log.info("当前查询结果:{}",list);
```

分页查询

```java
PageParam pageParam = new PageParam();
pageParam.setCurrent(1);
pageParam.setSize(10);
IPage<BlackData> page = blackDataService.page(PageUtil.prodPage(pageParam),s		Wrappers.lambdaQuery(BlackData.class).eq(BlackData::getCListId, "123"));
		log.info("当前分页查询结果:{}", page);
```



##### 三、数据修改

```java
//实体入参
BlackData blackData = blackDataService.getById(23);
		blackData.setCListId("456");
		boolean b = blackDataService.updateById(blackData);
//lambda入参
boolean update = blackDataService.update(Wrappers.lambdaUpdate(BlackData.class).eq(BlackData::getCListId, "26")
				.eq(BlackData::getCCusttype, 1).set(BlackData::getCListId, "123").set(BlackData::getCIsdelete, 1));
		log.info("执行结果:{}", update);
```

##### 四、数据删除

```java
boolean removeResult = blackDataService.remove(Wrappers.lambdaQuery(BlackData.class)
				.eq(BlackData::getCListId, "123"));
		log.info("数据删除结果:{}",removeResult);
```





## 拓展内容

### 1.内置组件

#### FieldEncryptor

作用：对数据进行加解密。

内置方法：

encrypt: 对明文数据加密

decrypt: 对密文数据解密

#### FieldEncrypt

作用:标识数据/字段是否需要加解密

标识类上：表示当前类需要进行加解密检测

标识字段上: 表示当前字段需要进行加解密

配套使用，若缺失任何一个加解密均不生效。

且标注字段必须为字符串类型。

#### ParamEncrypt

作用:标注参数是否需要加密

仅字符串类型时生效



### 2.单元测试信息

#### BlackData.java

```java
@Data
@FieldEncrypt
@TableAlias("a")
@TableName("t_black_data")
public class BlackData implements Serializable {

	private static final long serialVersionUID = 1L;
	@TableId(value = "id", type = IdType.AUTO)
	private Integer id;
	@FieldEncrypt
	private String cListId;
	private String vcExpid;
	private LocalDate dDatetime;
	private String cIsdelete;
	private String vcCustname;
	private String cIdentitytype;
	private String vcIdentityno;
	private String cCusttype;
	private LocalDate vcModifydate;
	private String vcFlag;
	private String birthDate;
	private String md5;
	@TableLogic
	private Integer valid;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
}
```

#### BlackDataMapper.java

```java
public interface BlackDataMapper extends BaseMapper<BlackData> {

    int  insertData(BlackData data);

     List<BlackData> listByEntity(BlackData data);
     List<BlackData> listByClistId(@ParamEncrypt
                                   @Param("cListId") String cListId, @Param("ext") String ext);
     

}
```

#### BlackDataMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.example.common.mapper.BlackDataMapper">


    <insert id="insertData" parameterType="org.example.common.model.entity.BlackData">

        INSERT INTO `t_black_data` ( `c_list_id`, `vc_expid`, `d_datetime`, `c_isdelete`, `vc_custname`, `c_identitytype`, `vc_identityno`, `c_custtype`, `vc_modifydate`, `vc_flag`,

                                    `birth_date`, `md5`, `valid`, `created_time`, `updated_time`)

        VALUES     ( #{cListId}, #{vcExpid}, #{dDatetime}, #{cIsdelete}, #{vcCustname}, #{cIdentitytype}, #{vcIdentityno},
                    #{cCusttype}, #{vcModifydate}, #{vcFlag}, #{birthDate}, #{md5}, #{valid}, #{createdTime}, #{updatedTime});

    </insert>
    <select id="listByEntity" resultType="org.example.common.model.entity.BlackData">
        select *  from  t_black_data where c_list_id=#{cListId}
    </select>
    <select id="listByClistId" resultType="org.example.common.model.entity.BlackData">
        select *  from  t_black_data where c_list_id=#{cListId}
    </select>
</mapper>

```

#### IBlackDataService.java

```java
public interface IBlackDataService extends IService<BlackData> {
    int  insertData(BlackData data);

    List<BlackData> listByEntity(BlackData data);

    List<BlackData> listByClistId(String clistId);
}

```

#### BlackDataServiceImpl.java

```java
@Service
public class BlackDataServiceImpl extends ServiceImpl<BlackDataMapper, BlackData> implements IBlackDataService {
    @Override
    public int insertData(BlackData data) {
        return baseMapper.insertData(data);
    }

    @Override
    public List<BlackData> listByEntity(BlackData data) {
        return baseMapper.listByEntity(data);
    }

    @Override
    public List<BlackData> listByClistId(String clistId) {
        return baseMapper.listByClistId(clistId,"11");
    }
}

```



