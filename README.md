# OpenID Foundation proposed publications automation repository

Files proposed by Working Group draft editors should be added into the corresponding sub-directory via a branch that follows the pattern...
    propose/**

Working Group co-chairs or editors will have access right granted that allow them to commit only to sub-directories that are pertinent to their Working Group(s).

The proposed document sets should be as described in https://openid.net/wg/resources/naming-and-contents-of-specifications/

The automated checks that will be triggeerd by a push to the sub-directory and with the branch naming pattern above will indicate to the editors and to the OIDF secretary and their team whether there are issues that should be looked at prior to publication.  The automated checks only operate on the .html files that are submitted.  The source files should also be submitted with the same filename and extensions that may be .xml, .txt. or .md.

Once the checks have run the output can be reviewed under https://github.com/openid/publication/actions.  Further pushes to branches that match the propose/** pattern will result in re-run of the document checks. In the event of the checks failing because of an external dependancy failure (such as availability of openid.net/specs) then it is possible to re-run jobs from the GitHub "actions" interface.

Once there is either a fully successful run of the document checks or a co-chair feels the documents are ready for the Secretary or team to review (even with failures reported) then they should convert the branch to a PR and request a review and optionally publication.

The Secretary or their team can then review, feedback and potentially publish in circumstances when it is a technical failure rather than a policy failure.


