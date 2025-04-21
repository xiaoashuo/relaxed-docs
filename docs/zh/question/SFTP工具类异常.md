# SFTP工具类异常

## 文件存在，却读取不到。

### 问题描述: 

SFTP上有文件，用SFTP工具类读取提示`No such file`

读取路径：home/upload/BILLING_20241222.ok

依赖版本

```xml
      <dependency>
            <groupId>cn.lovecyy</groupId>
            <artifactId>relaxed-spring-boot-starter-sftp</artifactId>
            <version>1.4.12</version>
        </dependency>
```

### 构成原因:

路径不带前缀 `/`（即使用相对路径而不是绝对路径），会受到当前工作目录（Working Directory）的影响。

#### **路径类型说明**

1. **绝对路径**：
   - 路径以 `/` 开头，例如 `/home/user/file.txt`。
   - 这种路径是从文件系统的根目录开始解析，通常不受当前工作目录的影响。
2. **相对路径**：
   - 路径不以 `/` 开头，例如 `file.txt` 或 `./file.txt`。
   - 相对路径会以 SFTP 当前工作目录为基准解析。

#### **当前工作目录的影响**

- 在 SFTP 会话中，`ChannelSftp` 有一个当前工作目录（可以通过 `pwd()` 查看）。
- 如果使用相对路径，SFTP 会基于当前工作目录查找文件。

#### **示例：路径解析**

假设当前工作目录是 `/home/user`：

- 使用相对路径：

  ```java
  sftp.lstat("file.txt");  // 实际路径为 /home/user/file.txt
  ```

- 使用绝对路径：

  ```java
  sftp.lstat("/etc/file.txt");  // 实际路径为 /etc/file.txt
  ```

#### **潜在问题**

1. **路径错误**：
   - 如果不带 `/` 前缀，而当前工作目录不是期望的路径，可能会导致文件找不到。
   - 示例：当前目录是 `/home/user`，但你希望访问 `/var/log/file.txt`，使用 `file.txt` 会查找 `/home/user/file.txt`，导致文件不存在。
2. **工作目录改变**：
   - 如果代码或其他操作更改了 SFTP 的当前工作目录（例如使用 `cd()` 方法），相对路径会指向错误的位置。
3. **路径不明确**：
   - 相对路径可能依赖外部环境，导致代码的可移植性和可维护性变差。

### 解决方案：

- **优先使用绝对路径**：可以避免因工作目录改变而引起的路径解析问题。

- **检查当前工作目录**：如果必须使用相对路径，确保在调用前通过 `pwd()` 确认当前工作目录。

- 设置工作目录：如果需要一致性，可以显式设置工作目录：

  ```java
  sftp.cd("/home/user");
  sftp.lstat("file.txt");  // 基于 /home/user
  ```

#### **示例代码**

```java

ChannelSftp sftp = (ChannelSftp) session.openChannel("sftp");
sftp.connect();

try {
    // 打印当前工作目录
    System.out.println("Current Directory: " + sftp.pwd());
    
    // 使用绝对路径
    SftpATTRS attrs = sftp.lstat("/absolute/path/to/file.txt");
    System.out.println("File Size: " + attrs.getSize());

    // 使用相对路径
    sftp.cd("/home/user");
    attrs = sftp.lstat("file.txt");  // 相对路径基于 /home/user
    System.out.println("File Size: " + attrs.getSize());
} catch (SftpException e) {
    e.printStackTrace();
} finally {
    sftp.disconnect();
}
```

#### **总结**

如果路径不带前缀 `/`，`lstat` 会将其解析为相对路径，并基于当前工作目录查找文件。为避免问题，建议优先使用绝对路径或在操作前明确设置工作目录。



