# Certificates and Achievements: "Artifact Registry" (route `/registry`)

Present credentials the way a DevOps engineer manages software: a container registry plus release history.

## 1. Certificates = images
Table columns: `REPOSITORY` (issuer/course), `TAG` (level or version), `DIGEST` (credential ID, monospace,
copy button), `ISSUED`, `STATUS`.
- Status badge "verified" links to the issuer's verification URL (styled like `cosign verify`).
- **Pull** button: modal that shows the certificate file from `frontend/public/certs/`.
- **Inspect** button: side panel with skills covered, hours, date, issuer link.
- CLI-style filter input: `docker images --filter issuer=aws` (parse simple `key=value` filters, plus free-text search).
- Keyboard: `/` focuses the filter.
- Optional: "Pull all" downloads a ZIP of the certificates; hover on a badge shows a fake `cosign verify` output.

### Credential digest and status rules
- `digest` column: show `credentialId` when the certificate has one; otherwise show the first 12 characters of `digest`
  (a real SHA-256 of the certificate file, already computed in `registry.json`) so every row has an honest, verifiable identifier.
- Status badge states: `verified` (has a `verifyUrl`), `on-file` (scanned copy, no online verification), `pending` (file or ID not added yet).
- `kind` filter chips: `course`, `achievement`, `research`. Support `docker images --filter kind=research`.
- Certificate files live in `frontend/public/certs/` and are already uploaded (JPEG scans, plus two Coursera PDFs: render PDFs in the Pull modal with an `<iframe>` or `<object>`). Show them in the Pull modal with zoom.
- Entries with `{{PLACEHOLDER}}` values must render a visible "details pending" state, never fake data.

## 2. In-progress courses = running pipelines
Render stages `[ build ] -> [ test ] -> [ scan ] -> [ deploy ]` with states done / running / pending,
plus percentage and ETA. Data from `inProgress` in `registry.json`.

## 3. Achievements = release notes
Semantic-versioned changelog. Major = big win (hackathon placement), minor = new skill or shipped project,
patch = small milestone. Newest first, collapsible.

## 4. Skills = service health panel
One row per skill: progress bar and status (`healthy`, `deploying`, `learning`). Honest self-assessment only.

## 5. Data contract (`frontend/src/data/registry.json`)
Same shape as `data/registry.json`. The page must render entirely from this file so adding a certificate
means editing JSON only. Handle empty arrays gracefully (show a helpful empty state).

## 6. Acceptance criteria
- Works with zero, one and many certificates.
- Fully keyboard accessible; modal traps focus and closes on Esc.
- Mobile layout turns the table into stacked cards.
- No credential data is hardcoded in components.
