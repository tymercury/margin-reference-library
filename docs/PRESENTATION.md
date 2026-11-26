# Five-minute presentation · Margin

Use Slides 1–5, then demonstrate the live app. The remaining slides document the
process for the instructor to read. Practise with the actual interface before class.

## Slide 1 · 0:00–0:35

“Margin is a design reference library. It lets a design student save a source
with a note about what is useful in it. For this presentation, I want to explain
how one saved reference moves between the webpage, an API and a database.”

## Slide 2 · 0:35–1:10

“When I save a reference, the link tells me where the work came from. The note
records why I wanted to keep it. Margin also stores a discipline and a project,
so I can return to an example when I need it for an assignment. Research on
keeping and re-finding web information informed this design hypothesis.”

## Slide 3 · 1:10–2:00

“There are three main parts. The browser collects the form. The Express API
receives the request. Mongoose checks the fields and communicates with MongoDB
Atlas, where the record is stored. POST creates a record. GET retrieves records.
That is why the reference can appear again after a full page refresh.”

## Slide 4 · 2:00–2:45

“In an earlier classroom movie-list exercise, I entered a wrong year and wanted
to correct it. That showed a reason to support editing. In Margin, an edit uses
PUT and the record's MongoDB ID. The title can change while the identity stays
the same. A version check also rejects an outdated edit.”

## Slide 5 + live demonstration · 2:45–4:45

1. Open https://margin-reference-library.vercel.app
2. Choose Save a reference.
3. Enter title “Typography practice”, source https://fonts.google.com/knowledge,
   discipline Typography, project Presentation demo, and a specific design note.
4. Save and reload. Explain that GET returns the record from Atlas.
5. Edit the note, save and reload. Explain that PUT updates the same ID.
6. Remove it, then choose Undo. Explain that DELETE hides the record and the
   restore endpoint reverses that action.

Keep the demonstration short. Copy the source URL beforehand and prepare one
sentence for the note. If internet access fails, use documentation Slide 14 and
the verified screenshots to describe the same sequence.

## Closing · 4:45–5:00

“The connection I want to highlight is between a user action, an HTTP request
and a stored document. AI helped implement and document the project. I am using
this example to practise explaining the system behind the page.”

## 用中文理解

- 前端是你看得到并操作的网页。
- API 是网页与数据库沟通的接口。网页提出请求，后端执行并回应。
- Schema 是一条参考资料需要遵守的数据结构和规则。
- Atlas 是保存记录的云数据库。页面刷新后再次读取记录。
- MongoDB _id 是记录的固定身份。修改标题时，系统仍然知道要改哪一条。
- GET 读取，POST 新增，PUT 修改，DELETE 移除。
- 撤销移除通过 restore 接口清除 deletedAt，显示同一条记录。

## Likely questions

**Why make the note required?**
To preserve a specific reason for saving the reference. This is a design choice
informed by keeping/re-finding research and still needs evaluation with users.

**Why MongoDB?**
It matches the course examples and the existing Atlas setup. One reference maps
to one document with simple fields.

**Can other visitors see the same data?**
Yes. This is a shared classroom demo. Individual account separation is future work.

**Did you build it with AI?**
Yes. Codex assisted research, design, implementation, sample notes and testing.
The process document describes the contributions and decisions.

**What do the graphics show?**
They represent disciplines. The linked original source is the reference itself.
