# Presenter notes

## 8. Data Model and Schema

Schema 可以理解成一条资料的结构和规则。先指左边五个字段，再以 note 为例：String 表示文字；required 表示必填；maxlength 表示最多1200个字符。Mongoose 在后端检查这些规则。通过验证后，资料才会保存到 Atlas。Schema 是规则，document 是按照规则实际保存的一条资料，两者不是同一个东西。

## 9. System Architecture

按图从左到右讲：浏览器收集输入；Express 接收 HTTP 请求；Mongoose 按 schema 检查数据；Atlas 实际保存数据。再从右往左讲响应返回网页。API 是入口，数据库是保存资料的位置。Bruno 测入口，Compass 看保存结果。

## 10. Database Storage

Atlas 是云端数据库服务。Cluster0 是我们已有的集群，里面有 margin 数据库；margin 里面的 references collection 存放本项目的资料；其中每个 document 就是一条 reference。用截图从左边 margin 和 references 指到右边文档。ObjectId 是记录身份。查询 deletedAt:null 是只看没有被标记删除的记录，因此与网页的8条一致。关闭 Compass 不会删除云端资料。

## 11. Data Access and Credentials

连接串就是后端连接数据库所需的地址和账号信息。服务器从环境变量 MONGODB\_URI 读取它，前端只访问 /api/references。用户可以看到 API 返回的资料，因为网页需要显示它们；用户看不到数据库密码。当前版本是共享库。若以后做个人私密收藏，还需要登录，并在每个读写请求中检查资料属于谁。公开 GitHub 提供源码，但没有实际密码。

## 12. API Testing with Bruno

Bruno 不是数据库，而是发送 API 请求的工具。我们先 POST 新建，再用另一个 GET 请求查找，证明资料已经保存。PUT 修改同一个ID；DELETE 让它从有效列表消失；Restore 恢复同一个文档。16项通过也包括错误输入和版本冲突测试。报告与collection都保留在源码里，可以重跑。

## 14. Frontend and Database Verification

Presentation, 3:10–4:10. Compare the edited title in the website and Compass. \_id remains stable while \_\_v changes. Show Save, reload, Edit and Remove on the live website if time permits.

## 18. Deployment and Verification

Presentation, 4:10–5:00. Summarise the evidence. Teach the distinction: the UI is one client, Bruno checks the API independently, and Compass confirms the stored document. Finish by showing that the URI is server-side while shared reference data remains visible.

## 19. AI Use Note

说明分工：我选择选题与方向，使用 Codex 协助实现、测试和整理文档。我审阅结果，并对界面与解释提出具体修改要求。举两个例子：取消装饰性缩略图、改为完整展示来源和笔记；用 Bruno 和 Compass 补充 API 与数据库验证。

## 20. Reflection and Next Steps

用自己的话讲三个实际变化：电影练习让我看到刷新后数据仍在；Bruno 与 Compass 帮助对应请求和保存结果；我通过批评和修改 AI 输出来调整信息层级。下一步是独立走完一次请求，解释 schema 验证与实际文档的变化。