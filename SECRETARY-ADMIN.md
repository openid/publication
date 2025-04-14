# OpenID Foundation publication actions - Secretary team

## How to process a PR containing a proposed publication

As described in https://github.com/openid/publication/blob/main/README.md, once an authorised WG co-chair or document editor has created a branch and is satisfied that their documents are ready for publication they raise a PR.  It is the responsibility of the OIDF Secretary or one of their delegates to perform any final checks and approve the documents for publication.

This approval and publication are now undertaken by reviewing the PR and if satisfied by simply approving the PR (not a manual merge!).  All other steps are scripted, including creation of correct filenames, update of the main branch, synchronisation with the webserver and closure of the PR.

It is possible to see the output of the automated checks of the proposed documents in the "checks" tab of the PR on GitHub.
- consider any "red" messages in the pre-publication checks that should have been run before the PR was raised.
![image of checks tab](https://github.com/openid/publication/blob/main/.github/screenshots/checks.png?raw=true)

Specific checks that need to be done by the Secretary of their delegate are:
- The documents submitted are documents that originate from the WG whose sub directory is being used.

Approval of the PR is done in the "Files Changed"
![Approve PR screenshot](https://github.com/openid/publication/blob/main/.github/screenshots/approve-pr.jpg?raw=true)

Note: when a draft is proposed as Implementers Draft it is published as a draft with usual draft number suffix.  Once there has been a positive vote for "Implementers Draft" status then the draft files need to be copied to files with an ID# suffix - this currently is not scripted and needs to be done via a manual change by the Secretary or their delegate - see process below

## How to manage WG co-chair/editor access

WG co-chair and editor access is managed through Github "openid" organisation level teams and the /.github/CODEOWNERS file in this repository.

The "openid" organisation has teams set up in a hierarchy as follows:
- The root openid teams list includes "working-groups" team - see https://github.com/orgs/openid/teams
- the "working-groups" team in turn has teams within it - see https://github.com/orgs/openid/teams/working-groups/teams
- as an example the "wg-abconnect" team has a team within it called "wg-abconnect-editors" - see https://github.com/orgs/openid/teams/wg-abconnect/teams
- the "wg-abconnect-editors" team is then used in the CODEOWNERS file to grant access to edit files with specific patterns in the /connect sub-directory of the repository:
```
/connect/*.html   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.xml   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.txt   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.md   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.zip   @openid/wg-abconnect-editors @openid/secretaryandteam
```

## How to Add a new WG

When a new WG is formed there are some administrative actions required by the administrators of this Repository

- Add a new sub-directory to the main branch
- Add a new team to the Github "openid"" organisation level teams structure for the new WG co-chairs and editors
- Update the CODEOWNERS file in the main branch that reflects the new sub-directory, team and file types that should be permitted - this is best done with a cut-and-paste and edit from another WG sub-directory such as "connect"

```
...
/connect/*.html   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.xml   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.txt   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.md   @openid/wg-abconnect-editors @openid/secretaryandteam
/connect/*.zip   @openid/wg-abconnect-editors @openid/secretaryandteam
...
```


## How to do manual changes to specs, schemas, or bibxml

The privileged users of this repository can also make changes to any file in the repository and update the webserver.

This is simply done by updating files under the "sync" directory in the main branch (either directly or via a branch and PR) and then manually initiating the "OIDF Sync" Github action on the main branch.  This is done at https://github.com/openid/publication/actions/workflows/sync.yml
