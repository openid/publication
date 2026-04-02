# OpenID Publication Repository

Hosts OpenID Foundation specifications for publication to https://openid.net/specs/.

## Structure

- `sync/specs/` - Published specification files (deployed to web server)
- `{wg-name}/` - Working group subdirectories (authzen, connect, ekyc-ida, fapi, igov, ipsie, sharedsignals, digital-credentials-protocols)
- `.github/workflows/` - CI/CD workflows
- `.github/CODEOWNERS` - Restricts commits by working group

## Workflows

- `publication-checks.yml` - Triggered on PRs targeting main from `propose/` branches. Runs `process.py` from `openid/publication-checks` to validate proposed specs. Posts a comment on the PR with pass/fail/warning details. PRs from non-propose/ branches get a warning comment instead.
- `preview.yml` - Triggered on PR create/update from `propose/` branches. Deploys HTML files to GitHub Pages for preview. Posts a comment with clickable preview links. Cleans up on PR close.
- `oidf-publish-prep.yml` - Triggered on PR approval. Runs `publish.py` to preview what files will be published, checks approval permissions, and posts a comment with file list and published URLs. Blocks non-secretary approval of Final/Errata/Implementers specs.
- `oidf-publish.yml` - Triggered on push to main when WG directories or sync/specs change. Runs `publish.py` to generate correctly-named files in `sync/specs/`, deploys to the web server via SSH, purges CDN cache. Comments on the merged PR with success/failure status and published URLs. Opens a GitHub issue on failure.
- `sync.yml` - Manual trigger to sync web server with repo.

## Publication Flow

1. Editor pushes spec files to a `propose/{wg}/` branch
2. Editor creates PR from `propose/` to `main`
3. `publication-checks.yml` runs and posts check results as a PR comment
4. `preview.yml` deploys HTML to GitHub Pages and posts preview links
5. Editor fixes any issues and pushes again (checks and preview update automatically)
6. Secretary or WG co-chair reviews and approves PR
7. `oidf-publish-prep.yml` checks approval permissions and posts a preview of published files/URLs
8. Secretary or co-chair (for drafts) clicks merge
9. `oidf-publish.yml` publishes files to `sync/specs/`, deploys, and comments on the PR with published URLs
10. If publish fails, an issue is automatically opened

## Approval Permissions

- **Secretary team**: can approve any publication type
- **WG co-chairs/editors** (CODEOWNERS): can approve drafts only if publication checks pass
- **Final, Errata, Implementers Drafts**: always require secretary team approval

Requires branch protection with "Require review from Code Owners" enabled on main.

## Branch Naming

Proposal branches must follow the pattern `propose/{wg-name}/` where `{wg-name}` matches one of the working group subdirectories.

## OIDF Publication Rules

- https://openid.net/wg/resources/naming-and-contents-of-specifications/
- https://openid.net/wg/resources/publishing-specifications/
- https://openid.net/wg/resources/approving-specifications/
