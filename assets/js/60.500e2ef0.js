(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{483:function(t,s,a){"use strict";a.r(s);var n=a(1),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"sftp工具类异常"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#sftp工具类异常"}},[t._v("#")]),t._v(" SFTP工具类异常")]),t._v(" "),s("h2",{attrs:{id:"文件存在-却读取不到。"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#文件存在-却读取不到。"}},[t._v("#")]),t._v(" 文件存在，却读取不到。")]),t._v(" "),s("h3",{attrs:{id:"问题描述"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#问题描述"}},[t._v("#")]),t._v(" 问题描述:")]),t._v(" "),s("p",[t._v("SFTP上有文件，用SFTP工具类读取提示"),s("code",[t._v("No such file")])]),t._v(" "),s("p",[t._v("读取路径：home/upload/BILLING_20241222.ok")]),t._v(" "),s("p",[t._v("依赖版本")]),t._v(" "),s("div",{staticClass:"language-xml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-xml"}},[s("code",[t._v("      "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("dependency")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("groupId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("com.lovecyy"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("groupId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("artifactId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("relaxed-spring-boot-starter-sftp"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("artifactId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("version")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("1.4.12"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("version")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("dependency")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("h3",{attrs:{id:"构成原因"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#构成原因"}},[t._v("#")]),t._v(" 构成原因:")]),t._v(" "),s("p",[t._v("路径不带前缀 "),s("code",[t._v("/")]),t._v("（即使用相对路径而不是绝对路径），会受到当前工作目录（Working Directory）的影响。")]),t._v(" "),s("h4",{attrs:{id:"路径类型说明"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#路径类型说明"}},[t._v("#")]),t._v(" "),s("strong",[t._v("路径类型说明")])]),t._v(" "),s("ol",[s("li",[s("strong",[t._v("绝对路径")]),t._v("：\n"),s("ul",[s("li",[t._v("路径以 "),s("code",[t._v("/")]),t._v(" 开头，例如 "),s("code",[t._v("/home/user/file.txt")]),t._v("。")]),t._v(" "),s("li",[t._v("这种路径是从文件系统的根目录开始解析，通常不受当前工作目录的影响。")])])]),t._v(" "),s("li",[s("strong",[t._v("相对路径")]),t._v("：\n"),s("ul",[s("li",[t._v("路径不以 "),s("code",[t._v("/")]),t._v(" 开头，例如 "),s("code",[t._v("file.txt")]),t._v(" 或 "),s("code",[t._v("./file.txt")]),t._v("。")]),t._v(" "),s("li",[t._v("相对路径会以 SFTP 当前工作目录为基准解析。")])])])]),t._v(" "),s("h4",{attrs:{id:"当前工作目录的影响"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#当前工作目录的影响"}},[t._v("#")]),t._v(" "),s("strong",[t._v("当前工作目录的影响")])]),t._v(" "),s("ul",[s("li",[t._v("在 SFTP 会话中，"),s("code",[t._v("ChannelSftp")]),t._v(" 有一个当前工作目录（可以通过 "),s("code",[t._v("pwd()")]),t._v(" 查看）。")]),t._v(" "),s("li",[t._v("如果使用相对路径，SFTP 会基于当前工作目录查找文件。")])]),t._v(" "),s("h4",{attrs:{id:"示例-路径解析"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#示例-路径解析"}},[t._v("#")]),t._v(" "),s("strong",[t._v("示例：路径解析")])]),t._v(" "),s("p",[t._v("假设当前工作目录是 "),s("code",[t._v("/home/user")]),t._v("：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("使用相对路径：")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("lstat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 实际路径为 /home/user/file.txt")]),t._v("\n")])])])]),t._v(" "),s("li",[s("p",[t._v("使用绝对路径：")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("lstat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/etc/file.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 实际路径为 /etc/file.txt")]),t._v("\n")])])])])]),t._v(" "),s("h4",{attrs:{id:"潜在问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#潜在问题"}},[t._v("#")]),t._v(" "),s("strong",[t._v("潜在问题")])]),t._v(" "),s("ol",[s("li",[s("strong",[t._v("路径错误")]),t._v("：\n"),s("ul",[s("li",[t._v("如果不带 "),s("code",[t._v("/")]),t._v(" 前缀，而当前工作目录不是期望的路径，可能会导致文件找不到。")]),t._v(" "),s("li",[t._v("示例：当前目录是 "),s("code",[t._v("/home/user")]),t._v("，但你希望访问 "),s("code",[t._v("/var/log/file.txt")]),t._v("，使用 "),s("code",[t._v("file.txt")]),t._v(" 会查找 "),s("code",[t._v("/home/user/file.txt")]),t._v("，导致文件不存在。")])])]),t._v(" "),s("li",[s("strong",[t._v("工作目录改变")]),t._v("：\n"),s("ul",[s("li",[t._v("如果代码或其他操作更改了 SFTP 的当前工作目录（例如使用 "),s("code",[t._v("cd()")]),t._v(" 方法），相对路径会指向错误的位置。")])])]),t._v(" "),s("li",[s("strong",[t._v("路径不明确")]),t._v("：\n"),s("ul",[s("li",[t._v("相对路径可能依赖外部环境，导致代码的可移植性和可维护性变差。")])])])]),t._v(" "),s("h3",{attrs:{id:"解决方案"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#解决方案"}},[t._v("#")]),t._v(" 解决方案：")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[t._v("优先使用绝对路径")]),t._v("：可以避免因工作目录改变而引起的路径解析问题。")])]),t._v(" "),s("li",[s("p",[s("strong",[t._v("检查当前工作目录")]),t._v("：如果必须使用相对路径，确保在调用前通过 "),s("code",[t._v("pwd()")]),t._v(" 确认当前工作目录。")])]),t._v(" "),s("li",[s("p",[t._v("设置工作目录：如果需要一致性，可以显式设置工作目录：")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cd")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/home/user"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nsftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("lstat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 基于 /home/user")]),t._v("\n")])])])])]),t._v(" "),s("h4",{attrs:{id:"示例代码"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#示例代码"}},[t._v("#")]),t._v(" "),s("strong",[t._v("示例代码")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ChannelSftp")]),t._v(" sftp "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ChannelSftp")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" session"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("openChannel")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sftp"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nsftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("connect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 打印当前工作目录")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Current Directory: "')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("pwd")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    \n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 使用绝对路径")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SftpATTRS")]),t._v(" attrs "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("lstat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/absolute/path/to/file.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File Size: "')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" attrs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSize")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 使用相对路径")]),t._v("\n    sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cd")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/home/user"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    attrs "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("lstat")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 相对路径基于 /home/user")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File Size: "')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" attrs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSize")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("catch")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SftpException")]),t._v(" e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("printStackTrace")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("finally")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    sftp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("disconnect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h4",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" "),s("strong",[t._v("总结")])]),t._v(" "),s("p",[t._v("如果路径不带前缀 "),s("code",[t._v("/")]),t._v("，"),s("code",[t._v("lstat")]),t._v(" 会将其解析为相对路径，并基于当前工作目录查找文件。为避免问题，建议优先使用绝对路径或在操作前明确设置工作目录。")])])}),[],!1,null,null,null);s.default=e.exports}}]);