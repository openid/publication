<!DOCTYPE html>
<html lang="en" class="Internet-Draft">
<head>
<meta charset="utf-8">
<meta content="Common,Latin" name="scripts">
<meta content="initial-scale=1.0" name="viewport">
<title>FAPI 2.0 Attacker Model – Draft 04</title>
<meta content="Daniel Fett" name="author">
<meta content="
       OIDF FAPI 2.0 is an API security profile suitable for high-security
applications based on the OAuth 2.0 Authorization Framework
 . This document describes that attacker model that informs
the decisions on security mechanisms employed by the FAPI security
profiles. 
    " name="description">
<meta content="xml2rfc 3.16.0" name="generator">
<meta content="security" name="keyword">
<meta content="openid" name="keyword">
<meta content="fapi-attacker-model-2_0-04" name="ietf.draft">
<!-- Generator version information:
  xml2rfc 3.16.0
    Python 3.10.2
    appdirs 1.4.4
    ConfigArgParse 1.5.3
    google-i18n-address 2.5.2
    html5lib 1.1
    intervaltree 3.1.0
    Jinja2 3.1.2
    lxml 4.9.2
    MarkupSafe 2.1.2
    pycountry 22.3.5
    PyYAML 6.0
    requests 2.28.2
    setuptools 57.5.0
    six 1.16.0
    wcwidth 0.2.6
-->
<link href="./fapi-attacker-model-2_0-04.xml" rel="alternate" type="application/rfc+xml">
<link href="#copyright" rel="license">
<style type="text/css">/*

  NOTE: Changes at the bottom of this file overrides some earlier settings.

  Once the style has stabilized and has been adopted as an official RFC style,
  this can be consolidated so that style settings occur only in one place, but
  for now the contents of this file consists first of the initial CSS work as
  provided to the RFC Formatter (xml2rfc) work, followed by itemized and
  commented changes found necessary during the development of the v3
  formatters.

*/

/* fonts */
@import url('https://fonts.googleapis.com/css?family=Noto+Sans'); /* Sans-serif */
@import url('https://fonts.googleapis.com/css?family=Noto+Serif'); /* Serif (print) */
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono'); /* Monospace */

:root {
  --font-sans: 'Noto Sans', Arial, Helvetica, sans-serif;
  --font-serif: 'Noto Serif', 'Times', 'Times New Roman', serif;
  --font-mono: 'Roboto Mono', Courier, 'Courier New', monospace;
}

@viewport {
  zoom: 1.0;
  width: extend-to-zoom;
}
@-ms-viewport {
  width: extend-to-zoom;
  zoom: 1.0;
}
/* general and mobile first */
html {
}
body {
  max-width: 90%;
  margin: 1.5em auto;
  color: #222;
  background-color: #fff;
  font-size: 14px;
  font-family: var(--font-sans);
  line-height: 1.6;
  scroll-behavior: smooth;
}
.ears {
  display: none;
}

/* headings */
#title, h1, h2, h3, h4, h5, h6 {
  margin: 1em 0 0.5em;
  font-weight: bold;
  line-height: 1.3;
}
#title {
  clear: both;
  border-bottom: 1px solid #ddd;
  margin: 0 0 0.5em 0;
  padding: 1em 0 0.5em;
}
.author {
  padding-bottom: 4px;
}
h1 {
  font-size: 26px;
  margin: 1em 0;
}
h2 {
  font-size: 22px;
  margin-top: -20px;  /* provide offset for in-page anchors */
  padding-top: 33px;
}
h3 {
  font-size: 18px;
  margin-top: -36px;  /* provide offset for in-page anchors */
  padding-top: 42px;
}
h4 {
  font-size: 16px;
  margin-top: -36px;  /* provide offset for in-page anchors */
  padding-top: 42px;
}
h5, h6 {
  font-size: 14px;
}
#n-copyright-notice {
  border-bottom: 1px solid #ddd;
  padding-bottom: 1em;
  margin-bottom: 1em;
}
/* general structure */
p {
  padding: 0;
  margin: 0 0 1em 0;
  text-align: left;
}
div, span {
  position: relative;
}
div {
  margin: 0;
}
.alignRight.art-text {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 1em 1em 0;
  margin-bottom: 1.5em;
}
.alignRight.art-text pre {
  padding: 0;
}
.alignRight {
  margin: 1em 0;
}
.alignRight > *:first-child {
  border: none;
  margin: 0;
  float: right;
  clear: both;
}
.alignRight > *:nth-child(2) {
  clear: both;
  display: block;
  border: none;
}
svg {
  display: block;
}
svg[font-family~="serif" i], svg [font-family~="serif" i] {
  font-family: var(--font-serif);
}
svg[font-family~="sans-serif" i], svg [font-family~="sans-serif" i] {
  font-family: var(--font-sans);
}
svg[font-family~="monospace" i], svg [font-family~="monospace" i] {
  font-family: var(--font-mono);
}
.alignCenter.art-text {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 1em 1em 0;
  margin-bottom: 1.5em;
}
.alignCenter.art-text pre {
  padding: 0;
}
.alignCenter {
  margin: 1em 0;
}
.alignCenter > *:first-child {
  display: table;
  border: none;
  margin: 0 auto;
}

/* lists */
ol, ul {
  padding: 0;
  margin: 0 0 1em 2em;
}
ol ol, ul ul, ol ul, ul ol {
  margin-left: 1em;
}
li {
  margin: 0 0 0.25em 0;
}
.ulCompact li {
  margin: 0;
}
ul.empty, .ulEmpty {
  list-style-type: none;
}
ul.empty li, .ulEmpty li {
  margin-top: 0.5em;
}
ul.ulBare, li.ulBare {
  margin-left: 0em !important;
}
ul.compact, .ulCompact,
ol.compact, .olCompact {
  line-height: 100%;
  margin: 0 0 0 2em;
}

/* definition lists */
dl {
}
dl > dt {
  float: left;
  margin-right: 1em;
}
/* 
dl.nohang > dt {
  float: none;
}
*/
dl > dd {
  margin-bottom: .8em;
  min-height: 1.3em;
}
dl.compact > dd, .dlCompact > dd {
  margin-bottom: 0em;
}
dl > dd > dl {
  margin-top: 0.5em;
  margin-bottom: 0em;
}

/* links */
a {
  text-decoration: none;
}
a[href] {
  color: #22e; /* Arlen: WCAG 2019 */
}
a[href]:hover {
  background-color: #f2f2f2;
}
figcaption a[href],
a[href].selfRef {
  color: #222;
}
/* XXX probably not this:
a.selfRef:hover {
  background-color: transparent;
  cursor: default;
} */

/* Figures */
tt, code, pre {
  background-color: #f9f9f9;
  font-family: var(--font-mono);
}
pre {
  border: 1px solid #eee;
  margin: 0;
  padding: 1em;
}
img {
  max-width: 100%;
}
figure {
  margin: 0;
}
figure blockquote {
  margin: 0.8em 0.4em 0.4em;
}
figcaption {
  font-style: italic;
  margin: 0 0 1em 0;
}
@media screen {
  pre {
    overflow-x: auto;
    max-width: 100%;
    max-width: calc(100% - 22px);
  }
}

/* aside, blockquote */
aside, blockquote {
  margin-left: 0;
  padding: 1.2em 2em;
}
blockquote {
  background-color: #f9f9f9;
  color: #111; /* Arlen: WCAG 2019 */
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 1em 0;
}
cite {
  display: block;
  text-align: right;
  font-style: italic;
}

/* tables */
table {
  width: 100%;
  margin: 0 0 1em;
  border-collapse: collapse;
  border: 1px solid #eee;
}
th, td {
  text-align: left;
  vertical-align: top;
  padding: 0.5em 0.75em;
}
th {
  text-align: left;
  background-color: #e9e9e9;
}
tr:nth-child(2n+1) > td {
  background-color: #f5f5f5;
}
table caption {
  font-style: italic;
  margin: 0;
  padding: 0;
  text-align: left;
}
table p {
  /* XXX to avoid bottom margin on table row signifiers. If paragraphs should
     be allowed within tables more generally, it would be far better to select on a class. */
  margin: 0;
}

/* pilcrow */
a.pilcrow {
  color: #666; /* Arlen: AHDJ 2019 */
  text-decoration: none;
  visibility: hidden;
  user-select: none;
  -ms-user-select: none;
  -o-user-select:none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
@media screen {
  aside:hover > a.pilcrow,
  p:hover > a.pilcrow,
  blockquote:hover > a.pilcrow,
  div:hover > a.pilcrow,
  li:hover > a.pilcrow,
  pre:hover > a.pilcrow {
    visibility: visible;
  }
  a.pilcrow:hover {
    background-color: transparent;
  }
}

/* misc */
hr {
  border: 0;
  border-top: 1px solid #eee;
}
.bcp14 {
  font-variant: small-caps;
}

.role {
  font-variant: all-small-caps;
}

/* info block */
#identifiers {
  margin: 0;
  font-size: 0.9em;
}
#identifiers dt {
  width: 3em;
  clear: left;
}
#identifiers dd {
  float: left;
  margin-bottom: 0;
}
/* Fix PDF info block run off issue */
@media print {
  #identifiers dd {
    float: none;
  }
}
#identifiers .authors .author {
  display: inline-block;
  margin-right: 1.5em;
}
#identifiers .authors .org {
  font-style: italic;
}

/* The prepared/rendered info at the very bottom of the page */
.docInfo {
  color: #666; /* Arlen: WCAG 2019 */
  font-size: 0.9em;
  font-style: italic;
  margin-top: 2em;
}
.docInfo .prepared {
  float: left;
}
.docInfo .prepared {
  float: right;
}

/* table of contents */
#toc  {
  padding: 0.75em 0 2em 0;
  margin-bottom: 1em;
}
nav.toc ul {
  margin: 0 0.5em 0 0;
  padding: 0;
  list-style: none;
}
nav.toc li {
  line-height: 1.3em;
  margin: 0.75em 0;
  padding-left: 1.2em;
  text-indent: -1.2em;
}
/* references */
.references dt {
  text-align: right;
  font-weight: bold;
  min-width: 7em;
}
.references dd {
  margin-left: 8em;
  overflow: auto;
}

.refInstance {
  margin-bottom: 1.25em;
}

.references .ascii {
  margin-bottom: 0.25em;
}

/* index */
.index ul {
  margin: 0 0 0 1em;
  padding: 0;
  list-style: none;
}
.index ul ul {
  margin: 0;
}
.index li {
  margin: 0;
  text-indent: -2em;
  padding-left: 2em;
  padding-bottom: 5px;
}
.indexIndex {
  margin: 0.5em 0 1em;
}
.index a {
  font-weight: 700;
}
/* make the index two-column on all but the smallest screens */
@media (min-width: 600px) {
  .index ul {
    -moz-column-count: 2;
    -moz-column-gap: 20px;
  }
  .index ul ul {
    -moz-column-count: 1;
    -moz-column-gap: 0;
  }
}

/* authors */
address.vcard {
  font-style: normal;
  margin: 1em 0;
}

address.vcard .nameRole {
  font-weight: 700;
  margin-left: 0;
}
address.vcard .label {
  font-family: var(--font-sans);
  margin: 0.5em 0;
}
address.vcard .type {
  display: none;
}
.alternative-contact {
  margin: 1.5em 0 1em;
}
hr.addr {
  border-top: 1px dashed;
  margin: 0;
  color: #ddd;
  max-width: calc(100% - 16px);
}

/* temporary notes */
.rfcEditorRemove::before {
  position: absolute;
  top: 0.2em;
  right: 0.2em;
  padding: 0.2em;
  content: "The RFC Editor will remove this note";
  color: #9e2a00; /* Arlen: WCAG 2019 */
  background-color: #ffd; /* Arlen: WCAG 2019 */
}
.rfcEditorRemove {
  position: relative;
  padding-top: 1.8em;
  background-color: #ffd; /* Arlen: WCAG 2019 */
  border-radius: 3px;
}
.cref {
  background-color: #ffd; /* Arlen: WCAG 2019 */
  padding: 2px 4px;
}
.crefSource {
  font-style: italic;
}
/* alternative layout for smaller screens */
@media screen and (max-width: 1023px) {
  body {
    padding-top: 2em;
  }
  #title {
    padding: 1em 0;
  }
  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 20px;
    margin-top: -18px;  /* provide offset for in-page anchors */
    padding-top: 38px;
  }
  #identifiers dd {
    max-width: 60%;
  }
  #toc {
    position: fixed;
    z-index: 2;
    top: 0;
    right: 0;
    padding: 0;
    margin: 0;
    background-color: inherit;
    border-bottom: 1px solid #ccc;
  }
  #toc h2 {
    margin: -1px 0 0 0;
    padding: 4px 0 4px 6px;
    padding-right: 1em;
    min-width: 190px;
    font-size: 1.1em;
    text-align: right;
    background-color: #444;
    color: white;
    cursor: pointer;
  }
  #toc h2::before { /* css hamburger */
    float: right;
    position: relative;
    width: 1em;
    height: 1px;
    left: -164px;
    margin: 6px 0 0 0;
    background: white none repeat scroll 0 0;
    box-shadow: 0 4px 0 0 white, 0 8px 0 0 white;
    content: "";
  }
  #toc nav {
    display: none;
    padding: 0.5em 1em 1em;
    overflow: auto;
    height: calc(100vh - 48px);
    border-left: 1px solid #ddd;
  }
}

/* alternative layout for wide screens */
@media screen and (min-width: 1024px) {
  body {
    max-width: 724px;
    margin: 42px auto;
    padding-left: 1.5em;
    padding-right: 29em;
  }
  #toc {
    position: fixed;
    top: 42px;
    right: 42px;
    width: 25%;
    margin: 0;
    padding: 0 1em;
    z-index: 1;
  }
  #toc h2 {
    border-top: none;
    border-bottom: 1px solid #ddd;
    font-size: 1em;
    font-weight: normal;
    margin: 0;
    padding: 0.25em 1em 1em 0;
  }
  #toc nav {
    display: block;
    height: calc(90vh - 84px);
    bottom: 0;
    padding: 0.5em 0 0;
    overflow: auto;
  }
  img { /* future proofing */
    max-width: 100%;
    height: auto;
  }
}

/* pagination */
@media print {
  body {

    width: 100%;
  }
  p {
    orphans: 3;
    widows: 3;
  }
  #n-copyright-notice {
    border-bottom: none;
  }
  #toc, #n-introduction {
    page-break-before: always;
  }
  #toc {
    border-top: none;
    padding-top: 0;
  }
  figure, pre {
    page-break-inside: avoid;
  }
  figure {
    overflow: scroll;
  }
  .breakable pre {
    break-inside: auto;
  }
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }
  h2+*, h3+*, h4+*, h5+*, h6+* {
    page-break-before: avoid;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 10pt;
  }
  table {
    border: 1px solid #ddd;
  }
  td {
    border-top: 1px solid #ddd;
  }
}

/* This is commented out here, as the string-set: doesn't
   pass W3C validation currently */
/*
.ears thead .left {
  string-set: ears-top-left content();
}

.ears thead .center {
  string-set: ears-top-center content();
}

.ears thead .right {
  string-set: ears-top-right content();
}

.ears tfoot .left {
  string-set: ears-bottom-left content();
}

.ears tfoot .center {
  string-set: ears-bottom-center content();
}

.ears tfoot .right {
  string-set: ears-bottom-right content();
}
*/

@page :first {
  padding-top: 0;
  @top-left {
    content: normal;
    border: none;
  }
  @top-center {
    content: normal;
    border: none;
  }
  @top-right {
    content: normal;
    border: none;
  }
}

@page {
  size: A4;
  margin-bottom: 45mm;
  padding-top: 20px;
  /* The following is commented out here, but set appropriately by in code, as
     the content depends on the document */
  /*
  @top-left {
    content: 'Internet-Draft';
    vertical-align: bottom;
    border-bottom: solid 1px #ccc;
  }
  @top-left {
    content: string(ears-top-left);
    vertical-align: bottom;
    border-bottom: solid 1px #ccc;
  }
  @top-center {
    content: string(ears-top-center);
    vertical-align: bottom;
    border-bottom: solid 1px #ccc;
  }
  @top-right {
    content: string(ears-top-right);
    vertical-align: bottom;
    border-bottom: solid 1px #ccc;
  }
  @bottom-left {
    content: string(ears-bottom-left);
    vertical-align: top;
    border-top: solid 1px #ccc;
  }
  @bottom-center {
    content: string(ears-bottom-center);
    vertical-align: top;
    border-top: solid 1px #ccc;
  }
  @bottom-right {
      content: '[Page ' counter(page) ']';
      vertical-align: top;
      border-top: solid 1px #ccc;
  }
  */

}

/* Changes introduced to fix issues found during implementation */
/* Make sure links are clickable even if overlapped by following H* */
a {
  z-index: 2;
}
/* Separate body from document info even without intervening H1 */
section {
  clear: both;
}


/* Top align author divs, to avoid names without organization dropping level with org names */
.author {
  vertical-align: top;
}

/* Leave room in document info to show Internet-Draft on one line */
#identifiers dt {
  width: 8em;
}

/* Don't waste quite as much whitespace between label and value in doc info */
#identifiers dd {
  margin-left: 1em;
}

/* Give floating toc a background color (needed when it's a div inside section */
#toc {
  background-color: white;
}

/* Make the collapsed ToC header render white on gray also when it's a link */
@media screen and (max-width: 1023px) {
  #toc h2 a,
  #toc h2 a:link,
  #toc h2 a:focus,
  #toc h2 a:hover,
  #toc a.toplink,
  #toc a.toplink:hover {
    color: white;
    background-color: #444;
    text-decoration: none;
  }
}

/* Give the bottom of the ToC some whitespace */
@media screen and (min-width: 1024px) {
  #toc {
    padding: 0 0 1em 1em;
  }
}

/* Style section numbers with more space between number and title */
.section-number {
  padding-right: 0.5em;
}

/* prevent monospace from becoming overly large */
tt, code, pre {
  font-size: 95%;
}

/* Fix the height/width aspect for ascii art*/
.sourcecode pre,
.art-text pre {
  line-height: 1.12;
}


/* Add styling for a link in the ToC that points to the top of the document */
a.toplink {
  float: right;
  margin-right: 0.5em;
}

/* Fix the dl styling to match the RFC 7992 attributes */
dl > dt,
dl.dlParallel > dt {
  float: left;
  margin-right: 1em;
}
dl.dlNewline > dt {
  float: none;
}

/* Provide styling for table cell text alignment */
table td.text-left,
table th.text-left {
  text-align: left;
}
table td.text-center,
table th.text-center {
  text-align: center;
}
table td.text-right,
table th.text-right {
  text-align: right;
}

/* Make the alternative author contact information look less like just another
   author, and group it closer with the primary author contact information */
.alternative-contact {
  margin: 0.5em 0 0.25em 0;
}
address .non-ascii {
  margin: 0 0 0 2em;
}

/* With it being possible to set tables with alignment
  left, center, and right, { width: 100%; } does not make sense */
table {
  width: auto;
}

/* Avoid reference text that sits in a block with very wide left margin,
   because of a long floating dt label.*/
.references dd {
  overflow: visible;
}

/* Control caption placement */
caption {
  caption-side: bottom;
}

/* Limit the width of the author address vcard, so names in right-to-left
   script don't end up on the other side of the page. */

address.vcard {
  max-width: 30em;
  margin-right: auto;
}

/* For address alignment dependent on LTR or RTL scripts */
address div.left {
  text-align: left;
}
address div.right {
  text-align: right;
}

/* Provide table alignment support.  We can't use the alignX classes above
   since they do unwanted things with caption and other styling. */
table.right {
 margin-left: auto;
 margin-right: 0;
}
table.center {
 margin-left: auto;
 margin-right: auto;
}
table.left {
 margin-left: 0;
 margin-right: auto;
}

/* Give the table caption label the same styling as the figcaption */
caption a[href] {
  color: #222;
}

@media print {
  .toplink {
    display: none;
  }

  /* avoid overwriting the top border line with the ToC header */
  #toc {
    padding-top: 1px;
  }

  /* Avoid page breaks inside dl and author address entries */
  .vcard {
    page-break-inside: avoid;
  }

}
/* Tweak the bcp14 keyword presentation */
.bcp14 {
  font-variant: small-caps;
  font-weight: bold;
  font-size: 0.9em;
}
/* Tweak the invisible space above H* in order not to overlay links in text above */
 h2 {
  margin-top: -18px;  /* provide offset for in-page anchors */
  padding-top: 31px;
 }
 h3 {
  margin-top: -18px;  /* provide offset for in-page anchors */
  padding-top: 24px;
 }
 h4 {
  margin-top: -18px;  /* provide offset for in-page anchors */
  padding-top: 24px;
 }
/* Float artwork pilcrow to the right */
@media screen {
  .artwork a.pilcrow {
    display: block;
    line-height: 0.7;
    margin-top: 0.15em;
  }
}
/* Make pilcrows on dd visible */
@media screen {
  dd:hover > a.pilcrow {
    visibility: visible;
  }
}
/* Make the placement of figcaption match that of a table's caption
   by removing the figure's added bottom margin */
.alignLeft.art-text,
.alignCenter.art-text,
.alignRight.art-text {
   margin-bottom: 0;
}
.alignLeft,
.alignCenter,
.alignRight {
  margin: 1em 0 0 0;
}
/* In print, the pilcrow won't show on hover, so prevent it from taking up space,
   possibly even requiring a new line */
@media print {
  a.pilcrow {
    display: none;
  }
}
/* Styling for the external metadata */
div#external-metadata {
  background-color: #eee;
  padding: 0.5em;
  margin-bottom: 0.5em;
  display: none;
}
div#internal-metadata {
  padding: 0.5em;                       /* to match the external-metadata padding */
}
/* Styling for title RFC Number */
h1#rfcnum {
  clear: both;
  margin: 0 0 -1em;
  padding: 1em 0 0 0;
}
/* Make .olPercent look the same as <ol><li> */
dl.olPercent > dd {
  margin-bottom: 0.25em;
  min-height: initial;
}
/* Give aside some styling to set it apart */
aside {
  border-left: 1px solid #ddd;
  margin: 1em 0 1em 2em;
  padding: 0.2em 2em;
}
aside > dl,
aside > ol,
aside > ul,
aside > table,
aside > p {
  margin-bottom: 0.5em;
}
/* Additional page break settings */
@media print {
  figcaption, table caption {
    page-break-before: avoid;
  }
}
/* Font size adjustments for print */
@media print {
  body  { font-size: 10pt;      line-height: normal; max-width: 96%; }
  h1    { font-size: 1.72em;    padding-top: 1.5em; } /* 1*1.2*1.2*1.2 */
  h2    { font-size: 1.44em;    padding-top: 1.5em; } /* 1*1.2*1.2 */
  h3    { font-size: 1.2em;     padding-top: 1.5em; } /* 1*1.2 */
  h4    { font-size: 1em;       padding-top: 1.5em; }
  h5, h6 { font-size: 1em;      margin: initial; padding: 0.5em 0 0.3em; }
}
/* Sourcecode margin in print, when there's no pilcrow */
@media print {
  .artwork,
  .artwork > pre,
  .sourcecode {
    margin-bottom: 1em;
  }
}
/* Avoid narrow tables forcing too narrow table captions, which may render badly */
table {
  min-width: 20em;
}
/* ol type a */
ol.type-a { list-style-type: lower-alpha; }
ol.type-A { list-style-type: upper-alpha; }
ol.type-i { list-style-type: lower-roman; }
ol.type-I { list-style-type: lower-roman; }
/* Apply the print table and row borders in general, on request from the RPC,
and increase the contrast between border and odd row background slightly */
table {
  border: 1px solid #ddd;
}
td {
  border-top: 1px solid #ddd;
}
tr {
  break-inside: avoid;
}
tr:nth-child(2n+1) > td {
  background-color: #f8f8f8;
}
/* Use style rules to govern display of the TOC. */
@media screen and (max-width: 1023px) {
  #toc nav { display: none; }
  #toc.active nav { display: block; }
}
/* Add support for keepWithNext */
.keepWithNext {
  break-after: avoid-page;
  break-after: avoid-page;
}
/* Add support for keepWithPrevious */
.keepWithPrevious {
  break-before: avoid-page;
}
/* Change the approach to avoiding breaks inside artwork etc. */
figure, pre, table, .artwork, .sourcecode  {
  break-before: auto;
  break-after: auto;
}
/* Avoid breaks between <dt> and <dd> */
dl {
  break-before: auto;
  break-inside: auto;
}
dt {
  break-before: auto;
  break-after: avoid-page;
}
dd {
  break-before: avoid-page;
  break-after: auto;
  orphans: 3;
  widows: 3
}
span.break, dd.break {
  margin-bottom: 0;
  min-height: 0;
  break-before: auto;
  break-inside: auto;
  break-after: auto;
}
/* Undo break-before ToC */
@media print {
  #toc {
    break-before: auto;
  }
}
/* Text in compact lists should not get extra bottom margin space,
   since that would makes the list not compact */
ul.compact p, .ulCompact p,
ol.compact p, .olCompact p {
 margin: 0;
}
/* But the list as a whole needs the extra space at the end */
section ul.compact,
section .ulCompact,
section ol.compact,
section .olCompact {
  margin-bottom: 1em;                    /* same as p not within ul.compact etc. */
}
/* The tt and code background above interferes with for instance table cell
   backgrounds.  Changed to something a bit more selective. */
tt, code {
  background-color: transparent;
}
p tt, p code, li tt, li code {
  background-color: #f8f8f8;
}
/* Tweak the pre margin -- 0px doesn't come out well */
pre {
   margin-top: 0.5px;
}
/* Tweak the compact list text */
ul.compact, .ulCompact,
ol.compact, .olCompact,
dl.compact, .dlCompact {
  line-height: normal;
}
/* Don't add top margin for nested lists */
li > ul, li > ol, li > dl,
dd > ul, dd > ol, dd > dl,
dl > dd > dl {
  margin-top: initial;
}
/* Elements that should not be rendered on the same line as a <dt> */
/* This should match the element list in writer.text.TextWriter.render_dl() */
dd > div.artwork:first-child,
dd > aside:first-child,
dd > figure:first-child,
dd > ol:first-child,
dd > div.sourcecode:first-child,
dd > table:first-child,
dd > ul:first-child {
  clear: left;
}
/* fix for weird browser behaviour when <dd/> is empty */
dt+dd:empty::before{
  content: "\00a0";
}
/* Make paragraph spacing inside <li> smaller than in body text, to fit better within the list */
li > p {
  margin-bottom: 0.5em
}
/* Don't let p margin spill out from inside list items */
li > p:last-of-type:only-child {
  margin-bottom: 0;
}
</style>
<link href="rfc-local.css" rel="stylesheet" type="text/css">
</head>
<body class="xml2rfc">
<script src="metadata.min.js"></script>
<table class="ears">
<thead><tr>
<td class="left"></td>
<td class="center">fapi-attacker-model-2</td>
<td class="right">December 2024</td>
</tr></thead>
<tfoot><tr>
<td class="left">Fett</td>
<td class="center">Standards Track</td>
<td class="right">[Page]</td>
</tr></tfoot>
</table>
<div id="external-metadata" class="document-information"></div>
<div id="internal-metadata" class="document-information">
<dl id="identifiers">
<dt class="label-workgroup">Workgroup:</dt>
<dd class="workgroup">fapi</dd>
<dt class="label-published">Published:</dt>
<dd class="published">
<time datetime="2024-12-08" class="published">8 December 2024</time>
    </dd>
<dt class="label-authors">Author:</dt>
<dd class="authors">
<div class="author">
      <div class="author-name">D. Fett</div>
<div class="org">Authlete</div>
</div>
</dd>
</dl>
</div>
<h1 id="title">FAPI 2.0 Attacker Model – Draft 04</h1>
<section id="section-abstract">
      <h2 id="abstract"><a href="#abstract" class="selfRef">Abstract</a></h2>
<p id="section-abstract-1">OIDF FAPI 2.0 is an API security profile suitable for high-security
applications based on the OAuth 2.0 Authorization Framework
<span>[<a href="#RFC6749" class="cite xref">RFC6749</a>]</span>. This document describes that attacker model that informs
the decisions on security mechanisms employed by the FAPI security
profiles.<a href="#section-abstract-1" class="pilcrow">¶</a></p>
</section>
<section class="note" id="section-note.1">
      <h2 id="name-foreword">
<a href="#name-foreword" class="section-name selfRef">Foreword</a>
      </h2>
<p id="section-note.1-1">The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participant). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.<a href="#section-note.1-1" class="pilcrow">¶</a></p>
<p id="section-note.1-2">Final drafts adopted by the Workgroup through consensus are circulated publicly for the public review for 60 days and for the OIDF members for voting. Publication as an OIDF Standard requires approval by at least 50% of the members casting a vote. There is a possibility that some of the elements of this document may be subject to patent rights. OIDF shall not be held responsible for identifying any or all such patent rights.<a href="#section-note.1-2" class="pilcrow">¶</a></p>
</section>
<section class="note" id="section-note.2">
      <h2 id="name-introduction">
<a href="#name-introduction" class="section-name selfRef">Introduction</a>
      </h2>
<p id="section-note.2-1">Since OIDF FAPI 2.0 aims at providing an API protection profile for high-risk
scenarios, clearly defined security requirements are indispensable. In this
document, the security requirements are expressed through security goals and
attacker models. From these requirements, the security mechanisms utilized in
the Security Profile are derived.<a href="#section-note.2-1" class="pilcrow">¶</a></p>
<p id="section-note.2-2">Implementers and users of the Security Profile can derive from this document
which threats have been taken into consideration by the Security Profile and
which fall outside of what the Security Profile provides.<a href="#section-note.2-2" class="pilcrow">¶</a></p>
<p id="section-note.2-3">A systematic definition of security requirements and an attacker model enable
proofs of the security of the FAPI 2.0 Security Profile, similar to the proofs
in <span>[<a href="#arXiv.1901.11520" class="cite xref">arXiv.1901.11520</a>]</span> for FAPI 1.0, which this work draws from. Formal proofs
can rule out large classes of attacks rooted in the logic of security protocols.<a href="#section-note.2-3" class="pilcrow">¶</a></p>
<p id="section-note.2-4">The formal analysis performed on this attacker model and the FAPI 2.0 Security
Profile, described in <a href="#formal_analysis" class="auto internal xref">Section 9</a>, has helped to refine and improve
this document and the FAPI 2.0 Security Profile.<a href="#section-note.2-4" class="pilcrow">¶</a></p>
</section>
<section class="note" id="section-note.3">
      <h2 id="name-warning">
<a href="#name-warning" class="section-name selfRef">Warning</a>
      </h2>
<p id="section-note.3-1">This document is not an OIDF International Standard. It is distributed
for review and comment. It is subject to change without notice and may
not be referred to as an International Standard.<a href="#section-note.3-1" class="pilcrow">¶</a></p>
<p id="section-note.3-2">Recipients of this draft are invited to submit, with their comments,
notification of any relevant patent rights of which they are aware and
to provide supporting documentation.<a href="#section-note.3-2" class="pilcrow">¶</a></p>
</section>
<section class="note" id="section-note.4">
      <h2 id="name-notational-conventions">
<a href="#name-notational-conventions" class="section-name selfRef">Notational conventions</a>
      </h2>
<p id="section-note.4-1">The keywords "shall", "shall not", "should", "should not", "may", and "can" in
this document are to be interpreted as described in ISO Directive Part 2
<span>[<a href="#ISODIR2" class="cite xref">ISODIR2</a>]</span>. These keywords are not used as dictionary terms such that any
occurrence of them shall be interpreted as keywords and are not to be
interpreted with their natural language meanings.<a href="#section-note.4-1" class="pilcrow">¶</a></p>
</section>
<div id="toc">
<section id="section-toc.1">
        <a href="#" onclick="scroll(0,0)" class="toplink">▲</a><h2 id="name-table-of-contents">
<a href="#name-table-of-contents" class="section-name selfRef">Table of Contents</a>
        </h2>
<nav class="toc"><ul class="compact toc ulBare ulEmpty">
<li class="compact toc ulBare ulEmpty" id="section-toc.1-1.1">
            <p id="section-toc.1-1.1.1" class="keepWithNext"><a href="#section-1" class="auto internal xref">1</a>.  <a href="#name-scope" class="internal xref">Scope</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.2">
            <p id="section-toc.1-1.2.1" class="keepWithNext"><a href="#section-2" class="auto internal xref">2</a>.  <a href="#name-normative-references" class="internal xref">Normative references</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.3">
            <p id="section-toc.1-1.3.1" class="keepWithNext"><a href="#section-3" class="auto internal xref">3</a>.  <a href="#name-terms-and-definitions" class="internal xref">Terms and definitions</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.4">
            <p id="section-toc.1-1.4.1"><a href="#section-4" class="auto internal xref">4</a>.  <a href="#name-symbols-and-abbreviated-ter" class="internal xref">Symbols and Abbreviated terms</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.5">
            <p id="section-toc.1-1.5.1"><a href="#section-5" class="auto internal xref">5</a>.  <a href="#name-security-goals" class="internal xref">Security goals</a></p>
<ul class="compact toc ulBare ulEmpty">
<li class="compact toc ulBare ulEmpty" id="section-toc.1-1.5.2.1">
                <p id="section-toc.1-1.5.2.1.1"><a href="#section-5.1" class="auto internal xref">5.1</a>.  <a href="#name-general" class="internal xref">General</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.5.2.2">
                <p id="section-toc.1-1.5.2.2.1"><a href="#section-5.2" class="auto internal xref">5.2</a>.  <a href="#name-authorization" class="internal xref">Authorization</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.5.2.3">
                <p id="section-toc.1-1.5.2.3.1"><a href="#section-5.3" class="auto internal xref">5.3</a>.  <a href="#name-authentication" class="internal xref">Authentication</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.5.2.4">
                <p id="section-toc.1-1.5.2.4.1"><a href="#section-5.4" class="auto internal xref">5.4</a>.  <a href="#name-session-integrity" class="internal xref">Session integrity</a></p>
</li>
            </ul>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.6">
            <p id="section-toc.1-1.6.1"><a href="#section-6" class="auto internal xref">6</a>.  <a href="#name-attacker-model" class="internal xref">Attacker model</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7">
            <p id="section-toc.1-1.7.1"><a href="#section-7" class="auto internal xref">7</a>.  <a href="#name-attackers" class="internal xref">Attackers</a></p>
<ul class="compact toc ulBare ulEmpty">
<li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.1">
                <p id="section-toc.1-1.7.2.1.1"><a href="#section-7.1" class="auto internal xref">7.1</a>.  <a href="#name-general-2" class="internal xref">General</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.2">
                <p id="section-toc.1-1.7.2.2.1"><a href="#section-7.2" class="auto internal xref">7.2</a>.  <a href="#name-a1-web-attacker" class="internal xref">A1 - Web attacker</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.3">
                <p id="section-toc.1-1.7.2.3.1"><a href="#section-7.3" class="auto internal xref">7.3</a>.  <a href="#name-a1a-web-attacker-participat" class="internal xref">A1a - Web Attacker (participating as authorization server)</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.4">
                <p id="section-toc.1-1.7.2.4.1"><a href="#section-7.4" class="auto internal xref">7.4</a>.  <a href="#name-a2-network-attacker" class="internal xref">A2 - Network attacker</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.5">
                <p id="section-toc.1-1.7.2.5.1"><a href="#section-7.5" class="auto internal xref">7.5</a>.  <a href="#name-attacker-at-the-authorizati" class="internal xref">Attacker at the authorization endpoint: A3a - read authorization request</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.6">
                <p id="section-toc.1-1.7.2.6.1"><a href="#section-7.6" class="auto internal xref">7.6</a>.  <a href="#name-attacker-at-the-token-endpo" class="internal xref">Attacker at the token endpoint: A4 - read and tamper with token requests and responses</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.7.2.7">
                <p id="section-toc.1-1.7.2.7.1"><a href="#section-7.7" class="auto internal xref">7.7</a>.  <a href="#name-attacker-at-the-resource-se" class="internal xref">Attacker at the resource server: A5 - read resource requests</a></p>
</li>
            </ul>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8">
            <p id="section-toc.1-1.8.1"><a href="#section-8" class="auto internal xref">8</a>.  <a href="#name-limitations" class="internal xref">Limitations</a></p>
<ul class="compact toc ulBare ulEmpty">
<li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.1">
                <p id="section-toc.1-1.8.2.1.1"><a href="#section-8.1" class="auto internal xref">8.1</a>.  <a href="#name-general-3" class="internal xref">General</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.2">
                <p id="section-toc.1-1.8.2.2.1"><a href="#section-8.2" class="auto internal xref">8.2</a>.  <a href="#name-protocol-layers" class="internal xref">Protocol layers</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.3">
                <p id="section-toc.1-1.8.2.3.1"><a href="#section-8.3" class="auto internal xref">8.3</a>.  <a href="#name-secrets" class="internal xref">Secrets</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.4">
                <p id="section-toc.1-1.8.2.4.1"><a href="#section-8.4" class="auto internal xref">8.4</a>.  <a href="#name-system-boundaries" class="internal xref">System boundaries</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.5">
                <p id="section-toc.1-1.8.2.5.1"><a href="#section-8.5" class="auto internal xref">8.5</a>.  <a href="#name-implementation-errors" class="internal xref">Implementation errors</a></p>
</li>
              <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.8.2.6">
                <p id="section-toc.1-1.8.2.6.1"><a href="#section-8.6" class="auto internal xref">8.6</a>.  <a href="#name-changes-over-time" class="internal xref">Changes over time</a></p>
</li>
            </ul>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.9">
            <p id="section-toc.1-1.9.1"><a href="#section-9" class="auto internal xref">9</a>.  <a href="#name-formal-analysis" class="internal xref">Formal Analysis</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.10">
            <p id="section-toc.1-1.10.1"><a href="#section-10" class="auto internal xref">10</a>. <a href="#name-security-considerations" class="internal xref">Security Considerations</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.11">
            <p id="section-toc.1-1.11.1"><a href="#section-11" class="auto internal xref">11</a>. <a href="#name-normative-references-2" class="internal xref">Normative References</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.12">
            <p id="section-toc.1-1.12.1"><a href="#section-12" class="auto internal xref">12</a>. <a href="#name-informative-references" class="internal xref">Informative References</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.13">
            <p id="section-toc.1-1.13.1"><a href="#appendix-A" class="auto internal xref">Appendix A</a>.  <a href="#name-acknowledgements" class="internal xref">Acknowledgements</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.14">
            <p id="section-toc.1-1.14.1"><a href="#appendix-B" class="auto internal xref">Appendix B</a>.  <a href="#name-notices" class="internal xref">Notices</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.15">
            <p id="section-toc.1-1.15.1"><a href="#appendix-C" class="auto internal xref">Appendix C</a>.  <a href="#name-document-history" class="internal xref">Document History</a></p>
</li>
          <li class="compact toc ulBare ulEmpty" id="section-toc.1-1.16">
            <p id="section-toc.1-1.16.1"><a href="#appendix-D" class="auto internal xref"></a><a href="#name-authors-address" class="internal xref">Author's Address</a></p>
</li>
        </ul>
</nav>
</section>
</div>
<div id="scope">
<section id="section-1">
      <h2 id="name-scope">
<a href="#section-1" class="section-number selfRef">1. </a><a href="#name-scope" class="section-name selfRef">Scope</a>
      </h2>
<p id="section-1-1">This document describes the FAPI 2.0 profiles security goals, attacker model, attacker roles and capabilities, and limitations.<a href="#section-1-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="normative-references">
<section id="section-2">
      <h2 id="name-normative-references">
<a href="#section-2" class="section-number selfRef">2. </a><a href="#name-normative-references" class="section-name selfRef">Normative references</a>
      </h2>
<p id="section-2-1">The following documents are referred to in the text in such a way that some or all of their content constitutes requirements of this document. For dated references, only the edition cited applies. For undated references, the latest edition of the referenced document (including any amendments) applies.<a href="#section-2-1" class="pilcrow">¶</a></p>
<p id="section-2-2">See Section 11 for normative references.<a href="#section-2-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="terms-and-definitions">
<section id="section-3">
      <h2 id="name-terms-and-definitions">
<a href="#section-3" class="section-number selfRef">3. </a><a href="#name-terms-and-definitions" class="section-name selfRef">Terms and definitions</a>
      </h2>
<p id="section-3-1">For the purpose of this document, the terms defined in <span>[<a href="#RFC6749" class="cite xref">RFC6749</a>]</span>, and <span>[<a href="#OIDC" class="cite xref">OIDC</a>]</span> apply.<a href="#section-3-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="symbols-and-abbreviated-terms">
<section id="section-4">
      <h2 id="name-symbols-and-abbreviated-ter">
<a href="#section-4" class="section-number selfRef">4. </a><a href="#name-symbols-and-abbreviated-ter" class="section-name selfRef">Symbols and Abbreviated terms</a>
      </h2>
<p id="section-4-1"><strong>API</strong> – Application Programming Interface<a href="#section-4-1" class="pilcrow">¶</a></p>
<p id="section-4-2"><strong>CSRF</strong> –  Cross-Site Request Forgery<a href="#section-4-2" class="pilcrow">¶</a></p>
<p id="section-4-3"><strong>DNS</strong> – Domain Name System<a href="#section-4-3" class="pilcrow">¶</a></p>
<p id="section-4-4"><strong>JWKS</strong> – JSON Web Key Sets<a href="#section-4-4" class="pilcrow">¶</a></p>
<p id="section-4-5"><strong>OIDF</strong> – OpenID Foundation<a href="#section-4-5" class="pilcrow">¶</a></p>
<p id="section-4-6"><strong>TLS</strong> – Transport Layer Security<a href="#section-4-6" class="pilcrow">¶</a></p>
<p id="section-4-7"><strong>URL</strong> – Uniform Resource Locator<a href="#section-4-7" class="pilcrow">¶</a></p>
</section>
</div>
<div id="security-goals">
<section id="section-5">
      <h2 id="name-security-goals">
<a href="#section-5" class="section-number selfRef">5. </a><a href="#name-security-goals" class="section-name selfRef">Security goals</a>
      </h2>
<div id="general">
<section id="section-5.1">
        <h3 id="name-general">
<a href="#section-5.1" class="section-number selfRef">5.1. </a><a href="#name-general" class="section-name selfRef">General</a>
        </h3>
<p id="section-5.1-1">In the following, the security goals for the FAPI 2.0 Security Profile with
regards to authorization and, when OpenID Connect is used, authentication, are
defined.<a href="#section-5.1-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="authorization">
<section id="section-5.2">
        <h3 id="name-authorization">
<a href="#section-5.2" class="section-number selfRef">5.2. </a><a href="#name-authorization" class="section-name selfRef">Authorization</a>
        </h3>
<p id="section-5.2-1">The FAPI 2.0 Security Profile aims to ensure that <strong>no attacker can
access protected resources</strong> other than their own.<a href="#section-5.2-1" class="pilcrow">¶</a></p>
<p id="section-5.2-2">The access token is the ultimate credential for access to resources in
OAuth. Therefore, this security goal is fulfilled if no attacker can
successfully obtain and use an access token for access to protected
resources other than their own.<a href="#section-5.2-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="authentication">
<section id="section-5.3">
        <h3 id="name-authentication">
<a href="#section-5.3" class="section-number selfRef">5.3. </a><a href="#name-authentication" class="section-name selfRef">Authentication</a>
        </h3>
<p id="section-5.3-1">The FAPI 2.0 Security Profile aims to ensure that <strong>no attacker is
able to log in at a client under the identity of another user.</strong><a href="#section-5.3-1" class="pilcrow">¶</a></p>
<p id="section-5.3-2">The ID token is the credential for authentication in OpenID Connect.
This security goal therefore is fulfilled if no attacker can obtain and
use an ID token identifying another user for login.<a href="#section-5.3-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="session-integrity">
<section id="section-5.4">
        <h3 id="name-session-integrity">
<a href="#section-5.4" class="section-number selfRef">5.4. </a><a href="#name-session-integrity" class="section-name selfRef">Session integrity</a>
        </h3>
<p id="section-5.4-1">Session integrity is concerned with attacks where a user is tricked
into logging in under the attacker’s identity or inadvertently using
the resources of the attacker instead of the user’s own resources.
Attacks in this field include CSRF attacks (traditionally defended
against by using “state” in OAuth) and session swapping attacks.<a href="#section-5.4-1" class="pilcrow">¶</a></p>
<p id="section-5.4-2">In detail:<a href="#section-5.4-2" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="section-5.4-3.1">For authentication: The FAPI 2.0 Security Profile aims to ensure that
<strong>no attacker is able to force a user to be logged in under the identity of
the attacker.</strong><a href="#section-5.4-3.1" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-5.4-3.2">For authorization: The FAPI 2.0 Security Profile aims to ensure that
<strong>no attacker is able to force a user to use resources of the attacker.</strong><a href="#section-5.4-3.2" class="pilcrow">¶</a>
</li>
        </ul>
</section>
</div>
</section>
</div>
<div id="attacker-model">
<section id="section-6">
      <h2 id="name-attacker-model">
<a href="#section-6" class="section-number selfRef">6. </a><a href="#name-attacker-model" class="section-name selfRef">Attacker model</a>
      </h2>
<p id="section-6-1">This attacker model defines very broad capabilities for attackers. It is assumed
that attackers will exploit these capabilities to come up with attacks on the
security goals defined above. To provide a very high level of security,
attackers are assumed very powerful, including having access to otherwise
encrypted communication.<a href="#section-6-1" class="pilcrow">¶</a></p>
<p id="section-6-2">This model does intentionally not define concrete threats. For example, an
attacker that has the ability to eavesdrop on an authorization request might be
able to use this capability for various types of attacks posing different
threats, e.g., injecting a modified authorization request. In a complex
protocol like OAuth or OpenID Connect, however, yet unknown types of threats and
variants of existing threats can emerge, as has been shown in the past. In order
to not overlook any potential attacks, FAPI 2.0 therefore aims not to address
concrete, narrow threats, but to exclude any attacks conceivable for the
attacker types listed here. This is supported by a formal security analysis, see <a href="#formal_analysis" class="auto internal xref">Section 9</a>.<a href="#section-6-2" class="pilcrow">¶</a></p>
<p id="section-6-3">This attacker model assumes that certain parts of the infrastructure and protocols are working
correctly. Failures in these parts likely lead to attacks that are out of the
scope of this attacker model. These areas need to be analyzed separately within
the scope of an application of the FAPI 2.0 security profiles using threat
modelling or other techniques.<a href="#section-6-3" class="pilcrow">¶</a></p>
<p id="section-6-4">For example, if a major flaw in TLS was found that undermines data integrity in
TLS connections, a network attacker (A2, below) would be able to compromise
practically all OAuth and OpenID Connect sessions in various ways. This would be
fatal, as even application-level signing and encryption is based on key
distribution via TLS connections. As another example, if a human error leads to
the disclosure of secret keys for authentication and an attacker would be able
to misuse these credentials, this attack would not be covered by this attacker
model.<a href="#section-6-4" class="pilcrow">¶</a></p>
<p id="section-6-5">The following parts of the infrastructure are out of the scope of this
attacker model:<a href="#section-6-5" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="section-6-6.1">
          <strong>TLS:</strong> It is assumed that TLS connections are not broken, i.e.,
data integrity and confidentiality are ensured. The correct public
keys are used to establish connections and private keys are not
known to attackers (except for explicitly compromised parties).<a href="#section-6-6.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="section-6-6.2">
          <strong>JWKS:</strong> Where applicable, key distribution mechanisms work as
intended, i.e., encryption and signature verification keys of
uncompromised parties are retrieved from the correct endpoints.<a href="#section-6-6.2" class="pilcrow">¶</a>
</li>
        <li class="compact" id="section-6-6.3">
          <strong>Browsers and endpoints:</strong> Devices and
browsers used by resource owners are considered not compromised. Other
endpoints not controlled by an attacker behave according to the
protocol.<a href="#section-6-6.3" class="pilcrow">¶</a>
</li>
        <li class="compact" id="section-6-6.4">
          <strong>Identity and session management:</strong> End user's identity proofing,
authentication, identity and access management on a client or authorization
server are out of scope for this specification. It is assumed that clients
ensure that sessions of different users are properly protected from each
other and from attackers. Clients retrieving identity attributes using
OpenID Connect are required to check whether the identity attributes
returned fulfills their requirements.<a href="#section-6-6.4" class="pilcrow">¶</a>
</li>
      </ul>
</section>
</div>
<div id="attackers">
<section id="section-7">
      <h2 id="name-attackers">
<a href="#section-7" class="section-number selfRef">7. </a><a href="#name-attackers" class="section-name selfRef">Attackers</a>
      </h2>
<div id="general-1">
<section id="section-7.1">
        <h3 id="name-general-2">
<a href="#section-7.1" class="section-number selfRef">7.1. </a><a href="#name-general-2" class="section-name selfRef">General</a>
        </h3>
<p id="section-7.1-1">FAPI 2.0 profiles aim to ensure the security goals listed above for arbitrary
combinations of the following attackers, potentially collaborating to reach a
common goal:<a href="#section-7.1-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="a1-web-attacker">
<section id="section-7.2">
        <h3 id="name-a1-web-attacker">
<a href="#section-7.2" class="section-number selfRef">7.2. </a><a href="#name-a1-web-attacker" class="section-name selfRef">A1 - Web attacker</a>
        </h3>
<p id="section-7.2-1">This is the standard web attacker model.
The attacker:<a href="#section-7.2-1" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="section-7.2-2.1">can send and receive messages just like any other party controlling one or
more endpoints on the internet,<a href="#section-7.2-2.1" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-7.2-2.2">can participate in protocols flows as a normal user,<a href="#section-7.2-2.2" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-7.2-2.3">can use arbitrary tools (e.g., browser developer tools, custom software,
local interception proxies) on their own endpoints to tamper with messages
and assemble new messages,<a href="#section-7.2-2.3" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-7.2-2.4">can send links to honest users that are then visited by these users.<a href="#section-7.2-2.4" class="pilcrow">¶</a>
</li>
        </ul>
<p id="section-7.2-3">This means that the web attacker has the ability to cause arbitrary requests
from users' browsers, as long as the contents are known to the attacker.<a href="#section-7.2-3" class="pilcrow">¶</a></p>
<p id="section-7.2-4">The attacker cannot intercept or block messages sent between other parties, and
cannot break cryptography unless the attacker has learned the respective
decryption keys. Deviating from the common web attacker model, A1 cannot play
the role of a legitimate authorization server in the ecosystem (see A1a).<a href="#section-7.2-4" class="pilcrow">¶</a></p>
</section>
</div>
<div id="a1a-web-attacker-participating-as-authorization-server">
<section id="section-7.3">
        <h3 id="name-a1a-web-attacker-participat">
<a href="#section-7.3" class="section-number selfRef">7.3. </a><a href="#name-a1a-web-attacker-participat" class="section-name selfRef">A1a - Web Attacker (participating as authorization server)</a>
        </h3>
<p id="section-7.3-1">This is a variant of the web attacker A1, but this attacker can also participate
as an authorization server in the ecosystem.<a href="#section-7.3-1" class="pilcrow">¶</a></p>
<p id="section-7.3-2">Note that this authorization server can reuse/replay messages it has received
from honest authorization servers and can send users to endpoints of honest
authorization servers.<a href="#section-7.3-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="a2-network-attacker">
<section id="section-7.4">
        <h3 id="name-a2-network-attacker">
<a href="#section-7.4" class="section-number selfRef">7.4. </a><a href="#name-a2-network-attacker" class="section-name selfRef">A2 - Network attacker</a>
        </h3>
<p id="section-7.4-1">This attacker controls the whole network (like a rogue WiFi access point or any
other compromised network node). This attacker can intercept, block, and tamper
with messages intended for other people, but cannot break cryptography unless
the attacker has learned the respective decryption keys.<a href="#section-7.4-1" class="pilcrow">¶</a></p>
<p id="section-7.4-2">Note: Most attacks that are exclusive to this kind of attacker can be defended
against by using transport layer protection like TLS.<a href="#section-7.4-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="attacker_a3">
<section id="section-7.5">
        <h3 id="name-attacker-at-the-authorizati">
<a href="#section-7.5" class="section-number selfRef">7.5. </a><a href="#name-attacker-at-the-authorizati" class="section-name selfRef">Attacker at the authorization endpoint: A3a - read authorization request</a>
        </h3>
<p id="section-7.5-1">This attacker is assumed to have the capabilities of the web attacker, but it
can also read the authorization request sent in the front channel from a user's
browser to the authorization server.<a href="#section-7.5-1" class="pilcrow">¶</a></p>
<p id="section-7.5-2">This might happen on mobile operating systems (where apps can register for
URLs), on all operating systems through the browser history, or due to
cross-site scripting on the authorization server. There have been cases where
anti-virus software intercepts TLS connections and stores/analyzes URLs.<a href="#section-7.5-2" class="pilcrow">¶</a></p>
<p id="section-7.5-3"><strong>Note:</strong> An attacker that can read the authorization response is not
considered here, as, with current browser technology, such an attacker
can undermine most security protocols. This is discussed
in "Browser Swapping Attacks" in the security considerations in the FAPI
2.0 Security Profile.<a href="#section-7.5-3" class="pilcrow">¶</a></p>
<p id="section-7.5-4"><strong>Note:</strong> The attackers for the authorization request are more
fine-grained than those for the token endpoint and resource endpoint,
since these messages pass through the complex environment of the
user's browser/app/OS with a larger attack surface. This demands for a
more fine-grained analysis.<a href="#section-7.5-4" class="pilcrow">¶</a></p>
<p id="section-7.5-5"><strong>Note:</strong> For the authorization and resource endpoints, it is assumed that the
attacker can only passively read messages, whereas for the token endpoint, it is
assumed that the attacker can also tamper with messages. The underlying
assumption is that leakages from the authorization request or response are very
common in practice and leakages of the resource request are possible, but a
fully compromised connection to either endpoint is very unlikely. In particular
for the authorization endpoint, a fully compromised connection would undermine
the security of most redirect-based authentication/authorization schemes, including OAuth.<a href="#section-7.5-5" class="pilcrow">¶</a></p>
</section>
</div>
<div id="attacker_a4">
<section id="section-7.6">
        <h3 id="name-attacker-at-the-token-endpo">
<a href="#section-7.6" class="section-number selfRef">7.6. </a><a href="#name-attacker-at-the-token-endpo" class="section-name selfRef">Attacker at the token endpoint: A4 - read and tamper with token requests and responses</a>
        </h3>
<p id="section-7.6-1">This attacker makes the client use a token endpoint that is not the one of the
honest authorization server. This attacker therefore can read and tamper with
messages sent to and from this token endpoint that the client thinks as of an
honest authorization server.<a href="#section-7.6-1" class="pilcrow">¶</a></p>
<p id="section-7.6-2">Important: This attacker is a model for misconfigured token endpoint URLs that
were considered in FAPI 1.0. Since the FAPI 2.0 Security Profile mandates that
the token endpoint address is obtained from an authoritative source and via a
protected channel, i.e., through OAuth metadata obtained from the honest authorization server,
this attacker is not relevant in FAPI 2.0. The description here is kept for
informative purposes only.<a href="#section-7.6-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="attacker_a5">
<section id="section-7.7">
        <h3 id="name-attacker-at-the-resource-se">
<a href="#section-7.7" class="section-number selfRef">7.7. </a><a href="#name-attacker-at-the-resource-se" class="section-name selfRef">Attacker at the resource server: A5 - read resource requests</a>
        </h3>
<p id="section-7.7-1">This attacker has the capabilities of the web attacker, but it can also read
requests sent to the resource server after they have been processed by the
resource server, for example because the attacker can read TLS intercepting
proxy logs on the resource server's side.<a href="#section-7.7-1" class="pilcrow">¶</a></p>
<p id="section-7.7-2"><strong>Note:</strong> An attacker that can read the responses from the resource server is not
considered here, as such an attacker would directly contradict the authorization
goal stated above. If it could tamper with the responses, it could additionally
trivially break the session integrity goal.<a href="#section-7.7-2" class="pilcrow">¶</a></p>
</section>
</div>
</section>
</div>
<div id="limitations">
<section id="section-8">
      <h2 id="name-limitations">
<a href="#section-8" class="section-number selfRef">8. </a><a href="#name-limitations" class="section-name selfRef">Limitations</a>
      </h2>
<div id="general-2">
<section id="section-8.1">
        <h3 id="name-general-3">
<a href="#section-8.1" class="section-number selfRef">8.1. </a><a href="#name-general-3" class="section-name selfRef">General</a>
        </h3>
<p id="section-8.1-1">Beyond the limitations already described in the introduction to the attacker
model above, it is important to note the following limitations:<a href="#section-8.1-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="protocol-layers">
<section id="section-8.2">
        <h3 id="name-protocol-layers">
<a href="#section-8.2" class="section-number selfRef">8.2. </a><a href="#name-protocol-layers" class="section-name selfRef">Protocol layers</a>
        </h3>
<p id="section-8.2-1">FAPI 2.0 profiles only define the behavior of API authorization and
authentication on certain protocol layers. As described above, attacks on lower
protocol layers (e.g., TLS) can break the security of FAPI 2.0 compliant systems
under certain conditions. The attacker model, however, takes some breaks in
the end-to-end security provided by TLS into account by already including the
respective attacker models (A3a/A5/A7). Similarly, many other attacks on
lower layers are already accounted for, for example:<a href="#section-8.2-1" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="section-8.2-2.1">DNS spoofing attacks are covered by the network attacker (A2)<a href="#section-8.2-2.1" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-8.2-2.2">Leakages of authorization request data, e.g., through
misconfigured URLs or system/firewall logs, are covered by A3a<a href="#section-8.2-2.2" class="pilcrow">¶</a>
</li>
          <li class="compact" id="section-8.2-2.3">Directing users to malicious websites is within the capabilities of the web
attacker (A1)<a href="#section-8.2-2.3" class="pilcrow">¶</a>
</li>
        </ul>
<p id="section-8.2-3">FAPI 2.0 aims to be secure when attackers exploit these attacks and all attacks
feasible to attackers described above, even in combination.<a href="#section-8.2-3" class="pilcrow">¶</a></p>
<p id="section-8.2-4">Other attacks are not covered by the attacker model. For example, user
credentials being exposed through misconfigured databases or remote code
execution attacks on authorization servers are neither prevented by nor
accounted for in the attacker model. As another example, when a user is using a
compromised browser and operating system, the security of the user is hard to
uphold. Phishing-resistant credentials, for example, can help in this case, but
are outside of the area defined by FAPI 2.0, as described next.<a href="#section-8.2-4" class="pilcrow">¶</a></p>
</section>
</div>
<div id="secrets">
<section id="section-8.3">
        <h3 id="name-secrets">
<a href="#section-8.3" class="section-number selfRef">8.3. </a><a href="#name-secrets" class="section-name selfRef">Secrets</a>
        </h3>
<p id="section-8.3-1">The security assessment assumes that secrets are created such that attackers
cannot guess them - e.g., nonces and secret keys. Weak random number generators,
for example, can lead to secrets that are guessable by attackers and therefore
to vulnerabilities.<a href="#section-8.3-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="system-boundaries">
<section id="section-8.4">
        <h3 id="name-system-boundaries">
<a href="#section-8.4" class="section-number selfRef">8.4. </a><a href="#name-system-boundaries" class="section-name selfRef">System boundaries</a>
        </h3>
<p id="section-8.4-1">The FAPI 2.0 profiles focus on core aspects of the API security and do not
prescribe, for example, end-user authentication mechanisms, firewall setups,
software development practices, or security aspects of internal architectures.
Anything outside of boundaries of FAPI 2.0 must be assessed in the context of
the ecosystem, deployment, or implementation in which FAPI 2.0 is used.<a href="#section-8.4-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="implementation-errors">
<section id="section-8.5">
        <h3 id="name-implementation-errors">
<a href="#section-8.5" class="section-number selfRef">8.5. </a><a href="#name-implementation-errors" class="section-name selfRef">Implementation errors</a>
        </h3>
<p id="section-8.5-1">API security profiles define how authentication and authorization are
supposed to be implemented and a formal model assesses whether the profiles
are secure and consistent with respect to ideal implementations. Real-world
implementations, of course, sometimes deviate from the specified and formally analyzed
behavior and contain security vulnerabilties on various levels. While the FAPI
2.0 profiles are designed to provide multiple layers of defense where feasible,
implementations must use secure software development and deployment best
practices to ensure that vulnerabilities can be discovered and fixed.<a href="#section-8.5-1" class="pilcrow">¶</a></p>
</section>
</div>
<div id="changes-over-time">
<section id="section-8.6">
        <h3 id="name-changes-over-time">
<a href="#section-8.6" class="section-number selfRef">8.6. </a><a href="#name-changes-over-time" class="section-name selfRef">Changes over time</a>
        </h3>
<p id="section-8.6-1">New technologies or changed behavior of components (e.g., browsers) can lead to
new security vulnerabilities over time that might not have been known during the
development of these specifications.<a href="#section-8.6-1" class="pilcrow">¶</a></p>
</section>
</div>
</section>
</div>
<div id="formal_analysis">
<section id="section-9">
      <h2 id="name-formal-analysis">
<a href="#section-9" class="section-number selfRef">9. </a><a href="#name-formal-analysis" class="section-name selfRef">Formal Analysis</a>
      </h2>
<p id="section-9-1">The FAPI 2.0 Security Profile is accompanied by a formal security analysis
<span>[<a href="#analysis.FAPI2" class="cite xref">analysis.FAPI2</a>]</span> that provides a formal model of the FAPI 2.0 Security Profile
and a proof of the security of the FAPI 2.0 Security Profile within this model.
The formal model is based on the attacker model and security goals defined in
this document.<a href="#section-9-1" class="pilcrow">¶</a></p>
<p id="section-9-2">Note that the analysis is based on a prior version the attacker model that used
a different numbering for the attackers. Some of the attacker models previously
considered were in contradiction with the security goals and therefore removed.
The mapping between the attacker model in this document and the one used in the
analysis is as follows:<a href="#section-9-2" class="pilcrow">¶</a></p>
<table class="center" id="table-1">
        <caption><a href="#table-1" class="selfRef">Table 1</a></caption>
<thead>
          <tr>
            <th class="text-left" rowspan="1" colspan="1">Analysis</th>
            <th class="text-left" rowspan="1" colspan="1">This document</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A1</td>
            <td class="text-left" rowspan="1" colspan="1">A1</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A1a</td>
            <td class="text-left" rowspan="1" colspan="1">A1a</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A2</td>
            <td class="text-left" rowspan="1" colspan="1">A2</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A3a</td>
            <td class="text-left" rowspan="1" colspan="1">A3a</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A3b</td>
            <td class="text-left" rowspan="1" colspan="1">removed - see note in <a href="#attacker_a3" class="auto internal xref">Section 7.5</a>
</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A5</td>
            <td class="text-left" rowspan="1" colspan="1">A4</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A7</td>
            <td class="text-left" rowspan="1" colspan="1">A5 - with reduced capabilities, see note in <a href="#attacker_a5" class="auto internal xref">Section 7.7</a>
</td>
          </tr>
          <tr>
            <td class="text-left" rowspan="1" colspan="1">A8</td>
            <td class="text-left" rowspan="1" colspan="1">removed - see note in <a href="#attacker_a5" class="auto internal xref">Section 7.7</a>
</td>
          </tr>
        </tbody>
      </table>
<p id="section-9-4">As the updates to the attacker model were made to align with the formal
analysis, the analysis results are still valid for the updated attacker model.<a href="#section-9-4" class="pilcrow">¶</a></p>
</section>
</div>
<div id="security-considerations">
<section id="section-10">
      <h2 id="name-security-considerations">
<a href="#section-10" class="section-number selfRef">10. </a><a href="#name-security-considerations" class="section-name selfRef">Security Considerations</a>
      </h2>
<p id="section-10-1">This entire document consists of security considerations.<a href="#section-10-1" class="pilcrow">¶</a></p>
</section>
</div>
<section id="section-11">
      <h2 id="name-normative-references-2">
<a href="#section-11" class="section-number selfRef">11. </a><a href="#name-normative-references-2" class="section-name selfRef">Normative References</a>
      </h2>
<dl class="references">
<dt id="OIDC">[OIDC]</dt>
      <dd>
<span class="refAuthor">Sakimura, N.</span>, <span class="refAuthor">Bradley, J.</span>, <span class="refAuthor">Jones, M.</span>, <span class="refAuthor">de Medeiros, B.</span>, and <span class="refAuthor">C. Mortimore</span>, <span class="refTitle">"OpenID Connect Core 1.0 incorporating errata set 1"</span>, <time datetime="2014-11-08" class="refDate">8 November 2014</time>, <span>&lt;<a href="http://openid.net/specs/openid-connect-core-1_0.html">http://openid.net/specs/openid-connect-core-1_0.html</a>&gt;</span>. </dd>
<dd class="break"></dd>
<dt id="RFC6749">[RFC6749]</dt>
    <dd>
<span class="refAuthor">Hardt, D., Ed.</span>, <span class="refTitle">"The OAuth 2.0 Authorization Framework"</span>, <span class="seriesInfo">RFC 6749</span>, <span class="seriesInfo">DOI 10.17487/RFC6749</span>, <time datetime="2012-10" class="refDate">October 2012</time>, <span>&lt;<a href="https://www.rfc-editor.org/info/rfc6749">https://www.rfc-editor.org/info/rfc6749</a>&gt;</span>. </dd>
<dd class="break"></dd>
</dl>
</section>
<section id="section-12">
      <h2 id="name-informative-references">
<a href="#section-12" class="section-number selfRef">12. </a><a href="#name-informative-references" class="section-name selfRef">Informative References</a>
      </h2>
<dl class="references">
<dt id="ISODIR2">[ISODIR2]</dt>
      <dd>
<span class="refAuthor">ISO/IEC</span>, <span class="refTitle">"ISO/IEC Directives, Part 2 - Principles and rules for the structure and drafting of ISO and IEC documents"</span>, <span>&lt;<a href="https://www.iso.org/sites/directives/current/part2/index.xhtml">https://www.iso.org/sites/directives/current/part2/index.xhtml</a>&gt;</span>. </dd>
<dd class="break"></dd>
<dt id="analysis.FAPI2">[analysis.FAPI2]</dt>
      <dd>
<span class="refAuthor">Hosseyni, P.</span>, <span class="refAuthor">Küsters, R.</span>, and <span class="refAuthor">T. Würtele</span>, <span class="refTitle">"Formal Security Analysis of the OpenID FAPI 2.0: Accompanying a Standardization Process"</span>, <time datetime="2022-10-01" class="refDate">1 October 2022</time>, <span>&lt;<a href="https://openid.net/wordpress-content/uploads/2022/12/Formal-Security-Analysis-of-FAPI-2.0_FINAL_2022-10.pdf">https://openid.net/wordpress-content/uploads/2022/12/Formal-Security-Analysis-of-FAPI-2.0_FINAL_2022-10.pdf</a>&gt;</span>. </dd>
<dd class="break"></dd>
<dt id="arXiv.1901.11520">[arXiv.1901.11520]</dt>
    <dd>
<span class="refAuthor">Fett, D.</span>, <span class="refAuthor">Hosseyni, P.</span>, and <span class="refAuthor">R. Küsters</span>, <span class="refTitle">"An Extensive Formal Security Analysis of the OpenID Financial-grade API"</span>, <span class="seriesInfo">arXiv 1901.11520</span>, <time datetime="2019-01-31" class="refDate">31 January 2019</time>, <span>&lt;<a href="http://arxiv.org/abs/1901.11520/">http://arxiv.org/abs/1901.11520/</a>&gt;</span>. </dd>
<dd class="break"></dd>
</dl>
</section>
<div id="acknowledgements">
<section id="appendix-A">
      <h2 id="name-acknowledgements">
<a href="#appendix-A" class="section-number selfRef">Appendix A. </a><a href="#name-acknowledgements" class="section-name selfRef">Acknowledgements</a>
      </h2>
<p id="appendix-A-1">This document was developed by the OpenID FAPI Working Group.<a href="#appendix-A-1" class="pilcrow">¶</a></p>
<p id="appendix-A-2">We would like to thank Dave Tonge, Nat Sakimura, Brian Campbell, Torsten
Lodderstedt, Joseph Heenan, Pedram Hosseyni, Ralf Küsters and Tim Würtele for their
valuable feedback and contributions that helped to evolve this document.<a href="#appendix-A-2" class="pilcrow">¶</a></p>
</section>
</div>
<div id="notices">
<section id="appendix-B">
      <h2 id="name-notices">
<a href="#appendix-B" class="section-number selfRef">Appendix B. </a><a href="#name-notices" class="section-name selfRef">Notices</a>
      </h2>
<p id="appendix-B-1">Copyright (c) 2024 The OpenID Foundation.<a href="#appendix-B-1" class="pilcrow">¶</a></p>
<p id="appendix-B-2">The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.<a href="#appendix-B-2" class="pilcrow">¶</a></p>
<p id="appendix-B-3">The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.<a href="#appendix-B-3" class="pilcrow">¶</a></p>
</section>
</div>
<div id="document-history">
<section id="appendix-C">
      <h2 id="name-document-history">
<a href="#appendix-C" class="section-number selfRef">Appendix C. </a><a href="#name-document-history" class="section-name selfRef">Document History</a>
      </h2>
<p id="appendix-C-1">[[ To be removed from the final specification ]]<a href="#appendix-C-1" class="pilcrow">¶</a></p>
<p id="appendix-C-2">-04<a href="#appendix-C-2" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="appendix-C-3.1">editorial changes ready for publication<a href="#appendix-C-3.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-3.2">update draft version numbers<a href="#appendix-C-3.2" class="pilcrow">¶</a>
</li>
      </ul>
<p id="appendix-C-4">-03<a href="#appendix-C-4" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="appendix-C-5.1">editorial - remove stray remove title text<a href="#appendix-C-5.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.2">wrong word, wrong number<a href="#appendix-C-5.2" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.3">Fixes #653 - Update abbreviated terms<a href="#appendix-C-5.3" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.4">Addresses #672 - inconsistent capitalization<a href="#appendix-C-5.4" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.5">Fix sentence fragments, fix Issue #657<a href="#appendix-C-5.5" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.6">Fixes #648 - The first paragraph of the Normative reference shall be as provided in ISODIR2<a href="#appendix-C-5.6" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.7">Fixes #645 - Author name of Normative reference ISODIR2 is wrong<a href="#appendix-C-5.7" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.8">Fixes #645 - Author name of Normative reference ISODIR2 is wrong<a href="#appendix-C-5.8" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.9">Add sentence to address Joseph's concerns<a href="#appendix-C-5.9" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.10">Merge branch 'master' into danielfett/editorial-from-tim<a href="#appendix-C-5.10" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.11">Fixes #648 - The first paragraph of the Normative reference shall be as provided in ISODIR2<a href="#appendix-C-5.11" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.12">Edit subclause whitespace<a href="#appendix-C-5.12" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.13">Add explanation for changed numbers, add reference to formal analysis<a href="#appendix-C-5.13" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.14">Apply ISO keywords to Attacker Model<a href="#appendix-C-5.14" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.15">Align Attacker Model with ISO document structure and format<a href="#appendix-C-5.15" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.16">Renumber attackers, fix editorial stuff<a href="#appendix-C-5.16" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.17">Add note on identity and session management<a href="#appendix-C-5.17" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.18">fixes #604 - Add Draft to spec titles<a href="#appendix-C-5.18" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.19">Update affiliation to Authlete, add Dave as editor on the Security Profile, list Dave first for the Message Signing document<a href="#appendix-C-5.19" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.20">Editorial fixes, working group in acknowledgements<a href="#appendix-C-5.20" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-5.21">increment version numbers<a href="#appendix-C-5.21" class="pilcrow">¶</a>
</li>
      </ul>
<p id="appendix-C-6">-02<a href="#appendix-C-6" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="appendix-C-7.1">update acknowledgements for FAPI 2<a href="#appendix-C-7.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-7.2">Address editoral issues<a href="#appendix-C-7.2" class="pilcrow">¶</a>
</li>
      </ul>
<p id="appendix-C-8">-01<a href="#appendix-C-8" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="appendix-C-9.1">Reword to Fix Issue #508<a href="#appendix-C-9.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.2">Change attacker model to reflect formal model<a href="#appendix-C-9.2" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.3">One more fix for the attacker model<a href="#appendix-C-9.3" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.4">use gender-neutral language<a href="#appendix-C-9.4" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.5">Fix attacker model description once more<a href="#appendix-C-9.5" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.6">Fix attacker model description<a href="#appendix-C-9.6" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.7">Change attacker model to reflect formal model<a href="#appendix-C-9.7" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.8">Reduced attacker model<a href="#appendix-C-9.8" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.9">Improve description of attacker model<a href="#appendix-C-9.9" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.10">Improve attacker model description after introduction of metadata<a href="#appendix-C-9.10" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.11">Attempt to explain attacker model better<a href="#appendix-C-9.11" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.12">Change name of Advanced Profile to Message Signing<a href="#appendix-C-9.12" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.13">Remove duplicate copyright notices<a href="#appendix-C-9.13" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.14">Correct workgroup in fapi2 baseline/attack model docs<a href="#appendix-C-9.14" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.15">Fix references<a href="#appendix-C-9.15" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-9.16">FAPI 2.0 version number increase<a href="#appendix-C-9.16" class="pilcrow">¶</a>
</li>
      </ul>
<p id="appendix-C-10">-00<a href="#appendix-C-10" class="pilcrow">¶</a></p>
<ul class="compact">
<li class="compact" id="appendix-C-11.1">Add initial acknowledgements<a href="#appendix-C-11.1" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.2">changed IPR notice for FAPI 2 baseline and attacker model<a href="#appendix-C-11.2" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.3">fixed reference<a href="#appendix-C-11.3" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.4">Editorial fix in attacker model<a href="#appendix-C-11.4" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.5">Further fixes for the attacker model, provided by Miles St&amp;#246;tzner<a href="#appendix-C-11.5" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.6">Address attacker model Issue #339, Issue #338, Issue #387<a href="#appendix-C-11.6" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.7">Improve attacker model description<a href="#appendix-C-11.7" class="pilcrow">¶</a>
</li>
        <li class="compact" id="appendix-C-11.8">First versions of FAPI 2.0 drafts.<a href="#appendix-C-11.8" class="pilcrow">¶</a>
</li>
      </ul>
</section>
</div>
<div id="authors-addresses">
<section id="appendix-D">
      <h2 id="name-authors-address">
<a href="#name-authors-address" class="section-name selfRef">Author's Address</a>
      </h2>
<address class="vcard">
        <div dir="auto" class="left"><span class="fn nameRole">Daniel Fett</span></div>
<div dir="auto" class="left"><span class="org">Authlete</span></div>
<div class="email">
<span>Email:</span>
<a href="mailto:mail@danielfett.de" class="email">mail@danielfett.de</a>
</div>
</address>
</section>
</div>
<script>const toc = document.getElementById("toc");
toc.querySelector("h2").addEventListener("click", e => {
  toc.classList.toggle("active");
});
toc.querySelector("nav").addEventListener("click", e => {
  toc.classList.remove("active");
});
</script>
</body>
</html>