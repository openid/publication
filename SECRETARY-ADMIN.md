# OpenID Foundation publication actions - Secretary team

## How to process a PR containing a proposed publication

As described in [README.md](https://github.com/openid/publication/blob/main/README.md), once an authorised WG co-chair or document editor has created a branch and submitted a PR, the automated checks will run and post a comment on the PR with the results.

### Review process

1. Check the automated check results in the PR comments - look for any failures
2. Check the GitHub Pages preview links to verify the specs look correct
3. Verify that the documents submitted originate from the WG whose sub-directory is being used
4. If satisfied, approve the PR via the "Files Changed" tab review
5. On approval, the **Publish Prep** workflow will check approval permissions and post a comment previewing the files and URLs to be published
6. **Merge the PR** to publish

On merge, the publish workflow will automatically generate the correctly-named files in `sync/specs/`, deploy them to the web server, purge CDN caches, and comment on the PR with the published URLs. If publication fails, an issue is automatically opened.

### Approval permissions

- **Secretary team** can approve any publication type (drafts, finals, errata, implementers drafts)
- **WG co-chairs/editors** (listed in CODEOWNERS) can approve working group drafts, but only if the publication checks pass
- **Final, Errata, and Implementers Draft** publications always require secretary team approval

This requires "Require review from Code Owners" enabled in branch protection for main.

### Implementers Drafts

When a draft is proposed as an Implementers Draft, it is initially published as a regular draft with a draft number suffix. Once there has been a positive vote for "Implementers Draft" status, the draft files need to be copied to files with an `-ID#` suffix. This currently needs to be done via a manual change by the Secretary or their delegate.

## How to manage WG co-chair/editor access

WG co-chair and editor access is managed through GitHub "openid" organisation level teams and the `/.github/CODEOWNERS` file in this repository.

The "openid" organisation has teams set up in a hierarchy as follows:
- The root openid teams list includes "working-groups" team - see https://github.com/orgs/openid/teams
- The "working-groups" team in turn has teams within it - see https://github.com/orgs/openid/teams/working-groups/teams
- As an example the "wg-abconnect" team has a team within it called "wg-abconnect-editors" - see https://github.com/orgs/openid/teams/wg-abconnect/teams
- The "wg-abconnect-editors" team is then used in the CODEOWNERS file to grant access to edit files with specific patterns in the /connect sub-directory of the repository:
```
/connect/*.html   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.xml   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.txt   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.md   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.zip   @openid/wg-abconnect-editors @openid/secretaryandteam
```

## How to add a new WG

When a new WG is formed there are some administrative actions required by the administrators of this Repository:

1. Add a new sub-directory to the main branch (this is also how the publication checks tool knows which WG directories are valid - it automatically discovers them)
2. Add a new team to the GitHub "openid" organisation level teams structure for the new WG co-chairs and editors
3. Update the CODEOWNERS file in the main branch that reflects the new sub-directory, team and file types

## How to do manual changes to specs, schemas, or bibxml

The privileged users of this repository can also make changes to any file in the repository and update the webserver.

This is done by updating files under the `sync` directory in the main branch (either directly or via a branch and PR). Changes will be automatically deployed to the web server.
