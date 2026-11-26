# Margin API verification

Open this folder as a collection in Bruno. Select **Production** and open
**Runner → Run 16 Requests**. Keep **Run in parallel** off: later requests use
the ObjectId returned by Create. No database password is required.

The Production environment contains only the public website URL. Local targets
port 5051 for a running Start Margin.command session.

| Request | Expected result |
| --- | --- |
| Health | 200, Atlas connection established |
| Create | 201, new ObjectId |
| Read | 200, created record returned by an independent request |
| Update | 200, same ObjectId, __v increments |
| Read update | 200, edited content persists |
| Stale update | 409, newer content preserved |
| Missing note / unsafe URL / unknown category | 400 |
| Remove / cleanup | 204 |
| Read removed | 200, removed record absent |
| Restore | 200, same ObjectId restored |
| /.env and /server.js | 404 |
| Public response | Reference data contains no connection credentials |

Run through the official CLI from this folder:

```sh
pnpm dlx @usebruno/cli run --env Production \
  --reporter-json ../docs/evidence/bruno-results.json \
  --reporter-html ../docs/evidence/bruno-results.html
```

The saved run completed on 26 November 2026: 16 requests and 16 tests passed.
The collection creates labelled verification records and removes them from the
visible library. Recoverably removed test documents remain in Atlas because
Margin implements Undo through deletedAt.
