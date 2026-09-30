# tools

A personal collection of small dev utilities (JSON, JWT, Base64, hashes, UUIDs, regex, cron, timestamps), one single-page app with a sidebar of tools. Everything runs client-side: no backend, nothing you paste leaves the browser.

## Running locally

```bash
npm install
npm run dev
```

Checks CI runs: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Adding a tool

Create a component under `src/tools/` and add one entry to `tools` in `src/tools/registry.ts`. The sidebar and route come from that entry.

## Deployment

Push to `main`, CI runs the checks and, on success, SSHs into the VPS to `git pull` and rebuild via `compose.yaml` (Node build stage, then nginx serving the static files on a loopback port). Cloudflare Tunnel exposes it at `tools.arn0.be`.
