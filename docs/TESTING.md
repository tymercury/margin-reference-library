# Verification Record

26 November 2026. Tests performed by Codex in Bruno and the current website.

## Bruno production API checks

Bruno Desktop 4.2.1: 16 requests passed, 0 failed.
Bruno CLI 4.4.0: 16 requests and 16 tests passed, 0 failed.
Saved collection: bruno/. Reports: docs/evidence/bruno-results.json and .html.

| Test | Expected | Actual |
| --- | --- | --- |
| Database connection | 200, connected | Passed |
| Create | 201, ObjectId generated | Passed |
| Independent read | Created record returned | Passed |
| Update | Same ObjectId, version increments | Passed |
| Read updated content | Edited title persists | Passed |
| Stale version | 409 | Passed |
| Missing note | 400 | Passed |
| Non-HTTP URL | 400 | Passed |
| Unknown category | 400 | Passed |
| Remove | 204 | Passed |
| Read removed | Record absent | Passed |
| Restore | Same ObjectId, deletedAt null | Passed |
| Cleanup | 204 | Passed |
| /.env | 404 | Passed |
| /server.js | 404 | Passed |
| Public response | Reference data, no connection credentials | Passed |

Bruno run document: 6b07cd9b52efb6297b0c8750. Compass query found the same
edited record after cleanup, with __v: 4 and deletedAt set. This confirms
recoverable removal rather than a new record created by Undo.

## Current frontend

Created a labelled verification record through the current form. Reloaded and
read it, edited its title, reloaded again, removed it, and restored it with Undo.
Compass found the edited frontend record at ObjectId
6b07cf2383f4ea070dfc1d18 with __v: 1. Related browser and Compass screenshots
are in docs/evidence/. Both frontend verification records were then recoverably
removed. The public library and Compass query { deletedAt: null } each show
8 active references.

The browser’s required-field feedback and HTTP URL validation were inspected.
The earlier 390px check found viewport width and document width both 390px.

## Document verification

The revised process deck has 25 slides, 15 embedded evidence screenshots and
named sections. Automated text-bound and overlap checks found no issues.
MLA 9 references use a single column. Exported PDF and source package are
checked for database connection strings before delivery.
