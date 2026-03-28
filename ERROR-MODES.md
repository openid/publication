# OpenID Foundation publication actions - Dealing with Errors


## <span style="color:red">FAIL: No HTML files have changed. Exiting script</span>
The branch being processed does not have any updated HTML files for the checks to run against.

__ACTION TO FIX__: Add one or more HTML files with specification content in them.

## <span style="color:red">FAIL: More than one WG sub-directory updated</span>
HTML files have been updated in more than one Working Group sub-directory. Proposed specs in a branch should only be submitted from one Working Group.

__ACTION TO FIX__: Split the proposed publications into separate branches for each Working Group.

## <span style="color:red">FAIL: File {file} already exists</span>
The HTML file submitted has the same name as a file that has been published to the https://openid.net/specs/ directory on a previous occasion.

__ACTION TO FIX__: Change the filename of the HTML document to the next draft increment number.

## <span style="color:red">FAIL: Either Markdown or XML Source is required</span>
The source of the HTML document must be submitted with the HTML file and that source can either be a ".md" or ".xml".

__ACTION TO FIX__: Add source files of either Markdown or XML with the correct filename suffix and a filename prefix that is the same as the proposed HTML file.

## <span style="color:red">FAIL: {file}.md references external files but no .zip archive is provided</span>
The Markdown source contains file include directives (e.g., `<{{examples/file.json}}`) but no .zip archive was submitted. A .zip is required to capture all source files used to build the specification.

__ACTION TO FIX__: Create a .zip archive containing the .md source and all referenced files, and submit it alongside the other files.

## <span style="color:red">FAIL: Previous version {spec} included .zip but this submission does not</span>
The previous draft of this specification was published with a .zip file, but the new submission does not include one.

__ACTION TO FIX__: Include a .zip file with the same content as the previous version's .zip, updated for the current draft.

## <span style="color:red">FAIL: Problem with document titles so state is UNKNOWN</span>
## OR - <span style="color:red">FAIL: Unexpected document state: {state}</span>

This tool analyses the HTML document headers to determine what type of submission it is: "draft", "final", "errata", "implementers draft", or "draft errata".

__ACTION TO FIX__: The document should contain one of the following:
- Title: "Document Name 1.0 - Draft 01" (for working group drafts)
- Title: "Document Name 1.0 - Implementers Draft 1" (for implementers drafts)
- Title: "Document Name 1.0 incorporating errata set 1 - Draft 01" (for post-final drafts)
- Status header: "Final" (for final specifications)
- Title containing "incorporating errata set N" without "Draft" (for approved errata)

Check that both the `<title>` tag and the `<h1 id="title">` have the correct content and that the two are the same.

## <span style="color:red">FAIL: A final spec already exists. Post-final drafts must be titled like 'Spec Name 1.0 - Draft NN incorporating errata set N'</span>
A final specification has already been published for this spec. New drafts after a final must include errata language in the title.

__ACTION TO FIX__: Update the title to include both the draft number and errata set number, e.g., "OpenID Example 1.0 - Draft 18 incorporating errata set 1".

## <span style="color:red">FAIL: DRAFT state but does not have required history section</span>
When the document is in a DRAFT or DRAFT_ERRATA state it must have a Document History section.

__ACTION TO FIX__: Add a Document History section, or change the title if the document is intended to be Final or Errata.

## <span style="color:red">FAIL: History section does not reference current draft number {N}</span>
The Document History section must contain an entry for the current draft number.

__ACTION TO FIX__: Add a history entry for the current draft number (e.g., "-17" for draft 17).

## <span style="color:red">FAIL: FINAL state but history section exists</span>
When the document is in a FINAL state it must not have a Document History section.

__ACTION TO FIX__: Delete the Document History section, or change the title if this is intended to be a Draft.

## <span style="color:red">FAIL: ERRATA state but history section exists</span>
When the document is in an approved ERRATA state it must not have a Document History section.

__ACTION TO FIX__: Delete the Document History section, or change the title if this is intended to be a Draft Errata.

## <span style="color:red">FAIL: IMPLEMENTERS state but history section exists</span>
When the document is an approved Implementers Draft it must not have a Document History section.

__ACTION TO FIX__: Delete the Document History section.

## <span style="color:red">FAIL: A predecessor final spec does not exist</span>
When the document is in an ERRATA or DRAFT_ERRATA state there must be a FINAL spec previously published with the same base name.

__ACTION TO FIX__: Either change the document state to FINAL by adjusting the title if there is no pre-existing FINAL spec, or correct the filename to match the previously published final spec.

## <span style="color:red">FAIL: Title tag does not match H1 heading in {file}</span>
The content of the `<title>` tag must match the `<h1>` heading.

__ACTION TO FIX__: Ensure both originate from the same element in the source Markdown or XML.

## <span style="color:red">FAIL: Filename indicates Final but document header does not contain 'Status: Final'</span>
The filename has a `-final` suffix but the document header does not include a Final status indicator.

__ACTION TO FIX__: Add `<dd class="intended-status">Final</dd>` or `<dd class="status">Final</dd>` to the document header metadata, or `<td class="header">Final</td>` for older-style specs.

## <span style="color:red">FAIL: Content state or version number does not match filename in {file}</span>
The document state or version number detected from the content does not match what the filename indicates.

__ACTION TO FIX__: Ensure the filename and title/content are consistent. For example, a file named `spec-1_0-05.html` should have "Draft 05" in the title.

## <span style="color:red">FAIL: Problem with authors in {file}</span>
The Authors section needs to exist and contain at least one author name and the affiliation of all authors.

__ACTION TO FIX__: Check that the authors section exists and has rendered correctly in the HTML.

## <span style="color:red">FAIL: Problem with Notices section in {file}</span>
The Notices section needs to exist and contain the current year and specific text defined in the OIDF IPR Policy (Section VII).

__ACTION TO FIX__: Ensure that the Notices section exists and contains the required OIDF license text. See https://openid.net/wp-content/uploads/2024/10/OIDF-Policy_IPR-Policy_Final_2024-10-19.pdf Section VII.

## <span style="color:red">FAIL: {file} contains 'This document is not an OIDF International Standard'</span>
Final and Errata publications must not contain the draft disclaimer text.

__ACTION TO FIX__: Remove the "This document is not an OIDF International Standard" text from the document. This is only appropriate for draft publications.

## <span style="color:red">FAIL: OIDF specs must not include IETF IPR notices</span>
The document contains IETF Trust boilerplate text (e.g., "IETF Trust", "BCP 78", "BCP 79"). OIDF specifications must use the OIDF IPR notices instead.

__ACTION TO FIX__: Replace the IETF IPR boilerplate with the OIDF Notices text. If using xml2rfc, set `ipr = "none"` in the markdown metadata.

## <span style="color:red">FAIL: Problem with References in {file}</span>
The References section is checked to ensure that all links referenced are reachable over the internet. Both HEAD and GET requests are attempted.

__ACTION TO FIX__: Double check the references to ensure that they are all reachable. The check output will show which specific URLs failed and with what HTTP status code.

## <span style="color:red">FAIL: Problem with structure in {file}. Missing sections: ...</span>
The following sections are required:
- Abstract
- Introduction
- References
- Normative References
- Acknowledgements
- Security Considerations

Informative References are optional.

The error message will list which specific sections are missing.

__ACTION TO FIX__: Add the missing sections listed in the error message.

## <span style="color:red">FAIL: Publication date is more than 10 days ago in {file}</span>
Documents should be published soon after the last revision. This tool reports a FAIL if the detected date is more than 10 days before the checks are executed.

__ACTION TO FIX__: Rebuild the document with a recent publication date (within the last 10 days).


## <span style="color:orange">WARNING: Non-canonical OpenID reference URLs</span>
References to OpenID specifications should use `https://openid.net/specs/` URLs, not editor's draft URLs on `openid.github.io` or `openid.bitbucket.io`.

__ACTION TO FIX__: Update the references to point to the published versions at `https://openid.net/specs/`.

## <span style="color:orange">WARNING: Previous draft not found in published specs. Draft numbers should be sequential.</span>
The previous draft number was not found in the published spec list. Draft numbers should increment sequentially (-00, -01, -02, etc.).

__ACTION TO FIX__: This is a warning only. If a draft was intentionally skipped, this can be ignored.

## Any other errors or errors you are struggling to resolve:
Contact the Technical Director, Operations Director or Secretary of the OIDF.
