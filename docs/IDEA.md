# Concept: Portfolio as a Live Production System

The site is not *about* DevOps; it **is** a DevOps system. Each page is backed by something real.

## Routes
| Route | What it is | What it proves |
|---|---|---|
| `/` | Terminal landing (`help`, `ls projects`, `cat about`) | Linux/CLI comfort |
| `/projects` | Projects as services with health badge, pipeline link, postmortem | Ownership, real projects |
| `/pipeline` | Live GitHub Actions runs (build, test, scan, deploy) | CI/CD |
| `/status` | Public status page with uptime checks | Monitoring, SRE mindset |
| `/architecture` | Diagram of how this site is hosted and shipped | System design |
| `/registry` | Certificates and achievements as an artifact registry | Credentials, uniquely presented |
| `/chaos` | "Break the site" button: failure, alert, recovery | Resilience, rollback |
| `/resume` | Plain, fast resume | Recruiter-friendly fallback |

## Principles
- Verifiable: everything links to a real pipeline, repo or monitor.
- Honest: show what broke and how it was fixed; show "learning" states truthfully.
- Fast and usable: recruiters skim in 30 seconds. Always offer "Skip to Resume / Projects".
- Incremental: ship after Stage 1-2, keep upgrading.

## Project postmortem template
Service, Status, Stack, Problem, Incident (what broke), Root cause, Fix, Automation, Links.
