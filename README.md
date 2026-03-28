# OpenID Foundation proposed publications automation repository

Files proposed by Working Group draft editors should be added into the corresponding sub-directory via a branch that follows the pattern `propose/**`.

Working Group co-chairs or editors will have access rights granted that allow them to commit only to sub-directories that are pertinent to their Working Group(s).

The proposed document sets should be as described in https://openid.net/wg/resources/naming-and-contents-of-specifications/

## How to publish a specification

1. Create a branch following the `propose/{wg-name}` pattern
2. Add your HTML, source (.md or .xml), and .zip files to the appropriate WG sub-directory
3. Create a Pull Request from your branch to `main`
4. The automated checks will run and post a comment on the PR showing any issues
5. Fix any failures and push again - the checks will re-run automatically
6. Once ready, request a review from the Secretary team
7. On approval, the publish prep workflow will generate the correctly-named files in `sync/specs/`, remove the source files from the WG directory, and push the changes to your PR branch
8. The Secretary reviews the final `sync/specs/` changes in the PR diff
9. On merge, the files are deployed to https://openid.net/specs/ and CDN caches are purged

Details of how to fix the various check errors are documented in [ERROR-MODES.md](https://github.com/openid/publication/blob/main/ERROR-MODES.md).

## File requirements

- HTML file is required
- Either a `.md` or `.xml` source file is required (with matching filename)
- A `.zip` file is required if the source references external files (e.g., `<{{examples/file.json}}`)
- A `.zip` is also required if the previous version of the spec included one
- Draft numbers must be two digits, zero-padded (e.g., `-01` not `-1`)
- Draft numbers start at `-00`
