# Introduction #

Web forms could be better. How?
Here are some ideas.

# Semantics of forms #
This is about semantic markup, as a way of providing useful (semantic) hooks as a foundation for enhanced presentation and behaviour (implemented through CSS and jquery extensions). Check out the references at the end of this page for the source of these semantics.


## Relationships ##
Some possible values for the relationship between the customer and the supplier (entity behind the form).
  * customer
  * client
  * citizen
  * subject
_inspired by Tim Turner's market segmentation research_

Specify this as a class on the semantic form container, maybe even the body tag?

## Conversations ##

### Answer types ###
Group questions meaningfully by subject, and by how the user determines the answer. These four types of answering strategies are identified in _Forms that Work_:
  * slot-in
  * gathered
  * third-party
  * created
_inspired by Forms that Work_

Specify these as a class on the container of a group of questions?

## Appearance ##
Multiple page forms cannot be encapsulated within a single HTML document, but metadata (link relationships) can be used to relate the pages together. Let's focus on a forms within HTML documents.

In HTML, "form" is the container for the form controls. It specifies the action and method to take.

Semantically, the "form" is a self-contained document with a whole bunch more stuff.
Stuff that is in forms: title, questions, instructions, help, hints, furniture, required markers, notes, actions, labels, groups, controls, widgets, …

Represent a "semantic form" with the concept of ["article" from HTML5](http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#the-article-element).

### Number everything ###
_Learning to Love Forms_ posits forms as a list of questions. As forms grow more complex, this may become multiple sections of questions (and then multiple pages, but let us remain focussed on a single page form for the time being).

Use an ordered list as the basic building block. The last item in the list should be for the final section of the form, with the actions (buttons) and final instructions, etc. Could this be considered the footer of the form? "Footer" may imply a more tenuous relationship with the form content than desired …

### Actions ###
Identify one (and only one) primary action.
Distinguish secondary actions.
_inspired by Web Form Design_

Semantically markup the primary action by:
  1. putting it first in document order
  1. surround it with _strong_ tags for strong emphasis
  1. applying styles

## Accessibility ##
Be aware of "forms mode" and keep important information needed for interacting with form controls within the relevant elements: specifically fieldset, legend and label.
[Improperly associated form details](http://webaim.org/articles/gonewild/#forms)

# References #
  1. [Forms that Work](http://www.formsthatwork.com/), Caroline Jarrett and Gerry Gaffney 2009
  1. [Introducing a Novel Market Segmentation for e-Government](http://www.acs.org.au/act/2008conference/docs/ACSe-GovernmentPresentation.ppt) (Powerpoint file) Tim Turner
  1. [Web Form Design](http://www.rosenfeldmedia.com/books/webforms/), Luke Wroblewski 2008
  1. [Learning to Love Forms](http://www.webdirections.org/resources/aaron-gustafson/), Aaron Gustafson 2007

## Articles ##

### WebAIM ###
  * [Usable and Accessible Form Validation and Error Recovery](http://www.webaim.org/techniques/formvalidation/)
  * [Creating Accessible Forms](http://www.webaim.org/techniques/forms/)