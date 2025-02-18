# OpenID Foundation publication actions - Dealing with Errors


## <span style="color:red">FAIL: No HTML files have changed.  Exiting script</span>
The branch being processed does not have any updated HTML files for the checks to run against

__ACTION TO FIX__: Add one or more HTML files with specification content in them

## <span style="color:red">FAIL: More than one WG sub-directory updated</span>
HTML files have been updated in more than one Working Group Sub-directory.  Proposed specs in a branch should only be submitted from one Working Group.

__ACTION TO FIX__: split the proposed publications into seperate branches for each Working Group

## <span style="color:red">FAIL: File {file} already exists</span>
The HTML: file submitted has the same name as a file that has been published to the https:/openid.net/specs directory on a previous occasion

__ACTION TO FIX__: Change the filename of the HTML document to the next draft increment number

## <span style="color:red">FAIL: Either Markdown or XML Source is required</span>
The source of the HTML document must be submitted with the HTML file and that source can either be a ".md" or ".xml" 

__ACTION TO FIX__: Add source files of either Markdown or XML with the correct filename suffix and a filename prefix that is the same as the proposed HTML file

## <span style="color:red">FAIL: Problem with document titles so state is UNKNOWN</span>
## OR - <span style="color:red">FAIL: Unexpected document state: {state}</span>

__ACTION TO FIX__
This tool analyses the "title" inside the HTML document to determine what type or proposal the document submission is.  It could be "draft", "final" or "errata".  The tool has failed to detect this type based on the HTML file content.

__ACTION TO FIX__: The document title should contain one of the following:
- "document name - draft 01" - note the draft number
- "document name - final"
- "document name - errata"

Check that both the "\<title\>" tag  and the "\<h1 id="title"\>" has the correct content and that the two are the same.  This content should originate from the same element in the source Markdown or XML.

## <span style="color:red">FAIL: DRAFT state but does not have required history section</span>
When the document is in a DRAFT state it must have the history section

__ACTION TO FIX__: add a history section or change the heading to change the state of the document to Final or Errata if that is what is intended

## <span style="color:red">FAIL: FINAL state but history section exists</span>
When the document is in a FINAL state it must not have the history section

__ACTION TO FIX__: delete the history section or change the heading to change the state of the document to Draft if that is what is intended

## <span style="color:red">FAIL: ERRATA state but history section exists</span>
When the document is in a ERRATA state it must not have the history section

__ACTION TO FIX__: delete the history section or change the heading to change the state of the document to Draft if that is what is intended

## <span style="color:red">FAIL: A predecessor final spec does not exist</span>
When the document is in a ERRATA state it there must be a FINAL spec published that was previously published with the same name

__ACTION TO FIX__: Either change the document state to FINAL by adjusting the title if there is no pre-existing FINAL spec or correct the filename to match the previously published final spec


## <span style="color:red">FAIL: Problem with authors in {file}</span>
The Authors section needs to exist and contain at least one author name and the affiliation of all authors

__ACTION TO FIX__: Check that the authors section exists and has rendered correctly in the HTML

## <span style="color:red">FAIL: Problem with Notices section in {file}</span>
The Notices section needs to exist and contain the current year and specific text defined in the OIDF IPR document

__ACTION TO FIX__: ensure that the Notices section exists and that it contains the right text

## <span style="color:red">FAIL: Problem with References in {file}</span>
The References section is checked to ensure that all links referenced are reachable over rthe internet.

__Known Defect__: A small number of valid resources that are references do not respond to a HEAD method request with a 200 code.  These will fail even though there is a successfule response to a GET request

__ACTION TO FIX__: Double check the references to ensure that they are all reachable and highlight to secretary team if there is an issue with response to HEAD requests

## <span style="color:red">FAIL: Problem with structure in {file}</span>
If any of the following sections are not present there will be a failure:
- Abstract
- Introduction
- Normative References
- Informative References
- Acknowledgements
- Security Considerations

__ACTION TO FIX__: Identify which section is missing and ensure it is present in the document

## <span style="color:red">FAIL: FAIL: Publication date is more than 10 days ago in {file}</span>
Documents should be published soon after the last revision and this tool reports a FAIL if the detected date is more than 10 days before the checks are executed.

__ACTION TO FIX__: Re build the document with a recent publication date (within last 10 days)

## <span style="color:red">FAIL: {file} did not pass all checks</span>
This is simply a reflection that one or more mandatory checks have failed

__ACTION TO FIX__: Determine which of the other checks have failed and address those 



## Any other errors or errors you are struggling to resolve:
Contact the Technical Director, Operations Director or Secretary of the OIDF