# Margin · Process record

Yinman Tang · DESN31927 · Project 2 · November 25–26, 2026

## Intent and scope

A design reference library for a student who collects examples across assignments.
A saved URL needs a reason to become useful later. Margin pairs the source with a
design note, discipline and project. The first version is a shared classroom demo.
Its data is visible and editable by visitors. Account separation is future work.

The student selected the design reference library idea and asked Codex to implement
and document it. Codex proposed the name, visual direction, schema and implementation.
The movie watchlist remains a separate classroom exercise and belongs in the appendix.

## Research and decisions

Bruce, Jones and Dumais, *Information Behaviour That Keeps Found Things Found*,
Information Research 10(1), October 2004, studies keeping and re-finding web sources.
Its account of delayed re-finding motivates a persistent library with more than a URL.
The project inference is that a design note can preserve why a student saved a source.
This is a design hypothesis, not a tested finding about design students.
https://www.microsoft.com/en-us/research/publication/information-behaviour-keeps-found-things-found/

Are.na describes channels as contextual collections and blocks as pieces of content
that may connect to many channels. Margin adopts visible source and project context.
One discipline and an optional project keep the initial form short. This limits
multi-project reuse and is a deliberate first-version tradeoff.
https://help.are.na/docs/getting-started/channels
https://help.are.na/docs/getting-started/blocks

Raindrop supports collections by topic or project, tags and annotated bookmarks.
Margin uses a project filter and searchable notes. The form foregrounds a specific
design observation to connect collecting with the student's design work.
https://help.raindrop.io/collections
https://help.raindrop.io/bookmarks

## Audience hypothesis

Primary audience is a design student collecting references during concurrent projects.
A plausible task is to save a typography example during research, associate it with
an identity assignment, then return to the observation while building a composition.
Needs include a fast form, attribution, project context, retrieval and correction.
No interviews, survey or usability study were conducted for this project.

## Course translation

Week 06 compared browser persistence with cloud storage and introduced Atlas.
Week 07 introduced Compass queries, connection strings and read-only API endpoints.
Week 08 paired HTML forms with POST, schema and data display using Express/Mongoose.
Week 09 required GET, POST, PUT, DELETE, front-end integration and architecture diagrams.
Week 10 demonstrated optional image uploads with Canvas, multipart data and blob storage.
Margin's first scope uses source links and written design notes. It does not
implement the optional uploaded-image feature.

Course sources reviewed in Teams and Figma:
https://github.com/ixd-system-design/Resume-Builder
https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching
https://www.figma.com/board/Px2MWMyu6O2b1RcSiA8hV3/System-Map-for-a-TODO-App
https://www.figma.com/board/7IVsWGa93jg7tGeOonoLgt/Getting-Started-With-MongoDB-Atlas
https://www.figma.com/board/gWgi8TSlXjIv418TPjRMEv/System-Map---File-Uploads

## System and feature specification

| User goal | Frontend | HTTP and backend | Persistent result |
| --- | --- | --- | --- |
| Keep a reference | Labelled native form | POST /api/references; schema validation | New document in margin.references |
| Find a reference | Reference list, search, discipline/project filters | GET /api/references; client-side filter | Existing records returned after reload |
| Correct an observation | Prefilled edit form | PUT /api/references/:id; version check | Same document updated |
| Remove a reference | Confirmation dialog | DELETE /api/references/:id | deletedAt set, hidden from library |
| Recover a removal | Undo notification | POST /api/references/:id/restore | deletedAt cleared |

## Schema

| Field | Type | Requirement |
| --- | --- | --- |
| title | String | Required, trimmed, 1–120 characters |
| url | String | Required HTTP(S), no embedded credentials, ≤2000 characters |
| category | String enum | Required, one of six disciplines |
| project | String | Optional, ≤80 characters |
| note | String | Required, trimmed, 1–1200 characters |
| _id | ObjectId | Generated identity |
| createdAt / updatedAt | Date | Server timestamps |
| __v | Integer | Used to reject outdated edits |
| deletedAt | Date or null | Recoverable removal |

Browser → fetch JSON → Express route → Mongoose model → MongoDB Atlas.
Responses return through the API and render as textContent in reference rows.
The URI exists only on the server. Netlify Functions adapts the same Express app
used locally. Compass and Atlas Data Explorer inspect the stored documents.

## Implementation decisions

Native form constraints and inline messages provide specific correction cues.
Server schema validation also runs because browser checks can be bypassed.
Stable ObjectIds identify records even when title or project changes.
An atomic version condition prevents a stale tab from overwriting a newer edit.
Recoverable deletion supports undo without recreating a record under a new ID.
Category graphics were removed in the feedback iteration because they added no information about the linked source.

## AI use and evidence

The full delegation prompt asked Codex to follow the brief and Harold's tutorials,
implement the chosen idea, and document the process in the existing Figma Slides.
Codex reviewed course posts, conducted desk research, proposed the scope and brand,
authored application code, generated sample reference notes, ran checks and drafted
this documentation. Sources are linked where they inform decisions.
The student chose the idea and provided the course materials, target deck and Atlas access.
Reflection should be reviewed by the student and grounded in what they can demonstrate.
No interview findings or student-authored code are claimed.

## Presentation focus

A five-minute teaching segment can follow one reference through its lifecycle.
Explain why a database ID matters when correcting a title, then demonstrate creating,
reloading, editing, removing and restoring a sample record. The core learning goal
is connecting a UI action to an HTTP method and a persistent database change.

## Verification outcomes · November 25, 2026

Local browser tests passed create, page reload, edit, reload, remove and undo
against MongoDB Atlas. An HTTP regression check verified schema rejection and
HTTP 409 for an outdated edit. Production checks passed create, reload, edit
and recoverable removal. The production health endpoint returned connected
without Vercel authentication. At 390px, page width matched viewport width.

A first local preview exposed a URL-encoded directory path caused by spaces
in the project folder. fileURLToPath now resolves that path for Express static
serving. Form checks also exposed that nested error text changed field names.
Explicit field labels now keep those names stable while aria-describedby
connects help and error messages. Both issues were corrected during verification.

The deployed app uses Vercel. This retains the Express/Mongoose/Atlas model
from the course while adapting the function entry point to the user's existing
hosting account. The Netlify adapter is also retained as a course comparison.

A credential was accidentally pasted into a Figma slide while transferring a
screenshot via the system clipboard. The text node was immediately removed,
and source files and slide text were scanned for connection strings. The student reset the database password. The hosting helper verified the new
credentials and redeployed the application because file history may retain the
removed value.


## Interface revision after student feedback

The student rejected the first UI’s oversized hero, isolated italic emphasis,
repeated slogans, uniformly rounded cards and unrelated category colours.
The revision treats Margin as a working reference library. No usability study is
claimed: this is an iteration responding to direct client feedback.

| Problem | Decision | Reason |
| --- | --- | --- |
| Hero delayed access to saved work | Start with library heading, count and Save action | Retrieval is the main return-visit task |
| Decorative graphics looked like previews | Remove fabricated category artwork | The schema stores URLs and notes, not source images |
| Competing slogans and labels | Delete marketing copy; keep task labels and data | Each visible line should identify a source, explain a control or communicate state |
| Colour and type competed with content | One system sans stack and neutral tokens | Weight, placement and spacing establish the hierarchy |
| Notes were hard to compare across cards | Desktop list with source, full note, organisation and actions | The saved observation is the product’s useful content |
| Desktop columns do not fit phones | Reflow each record into source, note and labelled metadata | Preserve reading order and full text at 390px |
| Failed load resembled an empty library | Distinct error message with Retry | Failure should not imply that records were lost |

Research: Raindrop’s actual product screenshot presents collections, titles and
source information together (https://raindrop.io/). Its collection documentation
supports project-based retrieval (https://help.raindrop.io/collections).
Are.na’s channel documentation describes context around saved blocks
(https://help.are.na/docs/getting-started/channels). These informed organisation;
the row composition is Margin’s response to its own text-and-link data model.

At the student’s request, Codex installed and read Leonxlnx/taste-skill and
Nutlope/hallmark from their official GitHub repositories. Taste’s plain-language
copy rules and Hallmark’s app-screen, hierarchy, token, focus and state guidance
were applied. Marketing-site hero and decorative-theme instructions yield to the
student’s explicit utility-app direction. No additional UI framework was added.
https://github.com/Leonxlnx/taste-skill
https://github.com/Nutlope/hallmark

Taste copy-lint and Hallmark static app checks were run. Browser verification uses
the approved computer-use browser rather than the skills’ separate headless
renderer. These checks do not certify visual taste or replace user testing.
