# Remaining details to fill in (everything else is already filled from the resume)

## 0. Certificates already added from your uploads (8 scans in `frontend/public/certs/`)
Done (images): Breakpoint Ideathon 1st, ADVAYA 2.0 1st, IEEE Impulse Innovathon 2nd, Hack.Algo 3rd (prize-board photo),
ICRIET-2025 best paper + presentation, InnovateX 2nd, Idea to Impact excellence.
Still open: the Hack.Algo date, and confirm the items flagged in the chat (InnovateX placing, AI Sthetica and Adobe certificates).

## 1. Certificates
- IBM Introduction to DevOps and Edureka Introduction to Linux (Coursera) are added with real credential IDs and verify links.
- Add one entry per any new certificate; copy an existing entry as a template.

## 2. Achievements (`registry.json` -> `releases`)
- Replace the remaining `{{YYYY-MM}}` dates (Hack.Algo, AI Sthetica, Adobe round 2).

## 3. In-progress learning (`registry.json` -> `inProgress`)
- Set Kubernetes `progress` (0-100) and `eta`, or add other courses you are doing now.

## 4. Skill levels (`registry.json` -> `skills`)
- Levels are DRAFT self-assessments. Adjust to what you honestly feel. Statuses: healthy, deploying, learning.

## 5. Projects (`data/projects.json`)
- For each project fill `incident`, `rootCause`, `fix`, `automation` (one real thing that broke and how you fixed it).
- Add the VeriFarm repo URL (`{{VERIFARM_REPO_URL}}`), and repo links for ARGUS and SAATHI if public.

## 6. Resume
- Place your PDF at `frontend/public/resume.pdf`.
- Your phone number is NOT included in the data (kept off the public site). Email and social links are included.

After editing `data/*.json`, copy them to `frontend/src/data/` (or tell the agent to).
