# OpenID Foundation publication actions - Secretary team

## How to process a PR containing a proposed publication

As described in [README.md](https://github.com/openid/publication/blob/main/README.md), once an authorised WG co-chair or document editor has created a branch and submitted a PR, the automated checks will run and post a comment on the PR with the results.

### Review process

1. Check the automated check results in the PR comments - look for any failures
2. Verify that the documents submitted originate from the WG whose sub-directory is being used
3. If satisfied, approve the PR via the "Files Changed" tab review
4. On approval, the **Publish Prep** workflow will automatically:
   - Generate the correctly-named files in `sync/specs/`
   - Remove the source files from the WG directory
   - Push these changes back to the PR branch
   - Post a comment listing the files to be published
5. Review the updated PR diff to verify the `sync/specs/` changes look correct
6. **Merge the PR** to deploy the files to https://openid.net/specs/

The deploy workflow will automatically pull the changes to the web server and purge CDN caches for the affected files.

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

This is done by updating files under the `sync` directory in the main branch (either directly or via a branch and PR). Changes to `sync/specs/` will automatically trigger the deploy workflow and update the web server.

If the web server needs to be re-synced for any other reason, the "OIDF Sync" GitHub action can be manually triggered at https://github.com/openid/publication/actions/workflows/sync.yml.
