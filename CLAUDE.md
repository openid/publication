# OpenID Publication Repository

Hosts OpenID Foundation specifications for publication to https://openid.net/specs/.

## Structure

- `sync/specs/` - Published specification files (deployed to web server)
- `{wg-name}/` - Working group subdirectories (authzen, connect, ekyc-ida, fapi, igov, ipsie, sharedsignals, digital-credentials-protocols)
- `.github/workflows/` - CI/CD workflows
- `.github/CODEOWNERS` - Restricts commits by working group

## Workflows

- `publication-checks.yml` - Triggered on push to `propose/**` branches. Runs `process.py` from `openid/publication-checks` to validate proposed specs.
- `oidf-publish-prep.yml` - Triggered on PR approval. Runs publish prep and posts a comment showing what files/URLs will be created.
- `oidf-publish.yml` - Triggered on merge to main. Copies files to `sync/specs/`, deploys to web server, purges CDN cache.
- `sync.yml` - Manual trigger to sync web server with repo.

## Publication Flow

1. Editor pushes to `propose/{wg}/` branch
2. `publication-checks.yml` validates the spec
3. Editor creates PR from `propose/` to `main`
4. Secretary reviews and approves PR
5. `oidf-publish-prep.yml` posts a preview comment on the PR
6. Secretary clicks merge
7. `oidf-publish.yml` deploys to web server and purges CDN cache

## Branch Naming

Proposal branches must follow the pattern `propose/{wg-name}/` where `{wg-name}` matches one of the working group subdirectories.

## OIDF Publication Rules

- https://openid.net/wg/resources/naming-and-contents-of-specifications/
- https://openid.net/wg/resources/publishing-specifications/
- https://openid.net/wg/resources/approving-specifications/
