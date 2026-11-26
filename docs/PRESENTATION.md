# Five-minute presentation

Topic: verifying a database-driven web app with Bruno and Compass.
Use process slides 8–14 and 18. Show the existing app, collection and database.

## 0:00–0:55 — System Architecture

Margin is a design reference library. Each record contains a source link, a
design note, a discipline and an optional project. The browser sends JSON to an
Express API. Mongoose validates the fields and writes the document to Atlas.
The browser receives JSON back and displays the saved reference.

## 0:55–1:35 — Database Storage

The records are stored in MongoDB Atlas, in the margin database and references
collection. In Compass, I can inspect the fields, the generated ObjectId and the
timestamps. The query { deletedAt: null } returns the active library records.

## 1:35–2:15 — Data Access and Credentials

The browser calls the API. It does not receive the MongoDB connection string.
The backend reads MONGODB_URI from its Vercel environment. The database password
stays there. The references themselves are shared through the public API;
a private library would also need login and ownership checks.

## 2:15–3:10 — Bruno Testing

Bruno tests the API independently of the webpage. The collection sends POST,
GET, PUT and DELETE requests. POST returns 201 and a new ObjectId. A separate
GET returns the stored record. PUT updates the same ID. DELETE hides it from
the active list. The run also checks required fields and an outdated edit.
All sixteen requests and tests passed.

## 3:10–4:10 — Frontend Integration

The current webpage was tested through create, reload, edit, remove and Undo.
The edited record can be found in Compass. Its title changes, while its ObjectId
stays the same. The version increases so an outdated edit can be rejected.

## 4:10–5:00 — Verification Summary

These tools answer different questions. The webpage shows whether the interaction
works. Bruno checks API requests and responses. Compass shows what was stored.
Comparing them makes the full data lifecycle visible and easier to troubleshoot.

## Terms to rehearse

| Term | Plain-language explanation |
| --- | --- |
| Persistence | 页面关闭或刷新后，数据仍保存在数据库里 |
| API | 浏览器与后端交换请求和数据的入口 |
| Schema | 规定一条记录有哪些字段、类型和验证规则 |
| ObjectId | 数据库记录的唯一身份，编辑内容不会换 ID |
| Environment variable | 在服务器运行环境中提供配置，连接串不写进前端 |
| Bruno | 直接测试 API 的请求、状态码和响应内容 |
| Compass | 查看 Atlas 中实际保存的数据库文档 |
| __v | 本项目用来检查编辑版本的字段 |
| deletedAt | 本项目用来标记可恢复删除的字段 |

## Before class

1. Open the website, Bruno collection and Compass margin.references.
2. Select Production in Bruno and keep parallel execution off.
3. Rehearse the explanation in your own words and choose one short live action.
4. Use a clearly labelled test record and remove it afterwards.


Updated Chinese rehearsal notes are in PRESENTER-NOTES.md.
