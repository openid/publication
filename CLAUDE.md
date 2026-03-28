# OpenID Publication Repository

Hosts OpenID Foundation specifications for publication to https://openid.net/specs/.

## Structure

- `sync/specs/` - Published specification files (deployed to web server)
- `{wg-name}/` - Working group subdirectories (authzen, connect, ekyc-ida, fapi, igov, ipsie, sharedsignals, digital-credentials-protocols)
- `.github/workflows/` - CI/CD workflows
- `.github/CODEOWNERS` - Restricts commits by working group

## Workflows

- `publication-checks.yml` - Triggered on PRs targeting main from `propose/` branches. Runs `process.py` from `openid/publication-checks` to validate proposed specs. Posts a comment on the PR with pass/fail/warning details. PRs from non-propose/ branches get a warning comment instead.
- `oidf-publish-prep.yml` - Triggered on PR approval. Runs `publish.py` to generate correctly-named files, copies them to `sync/specs/`, removes the WG source files, commits and pushes back to the PR branch. Posts a comment listing the files to be published.
- `oidf-publish.yml` - Triggered on push to main when `sync/specs/` changes. Deploys to the web server via SSH and purges CDN cache.
- `sync.yml` - Manual trigger to sync web server with repo.

## Publication Flow

1. Editor pushes spec files to a `propose/{wg}/` branch
2. Editor creates PR from `propose/` to `main`
3. `publication-checks.yml` runs and posts check results as a PR comment
4. Editor fixes any issues and pushes again (checks re-run automatically)
5. Secretary reviews and approves PR
6. `oidf-publish-prep.yml` generates publish-ready files in `sync/specs/`, removes WG source files, pushes to the PR branch, and posts a preview comment
7. Secretary reviews the `sync/specs/` changes in the PR diff
8. Secretary clicks merge
9. `oidf-publish.yml` deploys to web server and purges CDN cache

## Branch Naming

Proposal branches must follow the pattern `propose/{wg-name}/` where `{wg-name}` matches one of the working group subdirectories.

## OIDF Publication Rules

- https://openid.net/wg/resources/naming-and-contents-of-specifications/
- https://openid.net/wg/resources/publishing-specifications/
- https://openid.net/wg/resources/approving-specifications/
