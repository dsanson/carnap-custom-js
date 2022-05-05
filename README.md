# Custom Javascript for Carnap.io

This is a collection of custom javascript that I use with <https://carnap.io>.

Many of these scripts are tied up with details about how I run and design my
own courses, and so will require adaptation to be used for your own purposes.
But many of them should be usable as is. Also, many of them are meant to work
in conjunction with custom CSS. Right now that custom CSS is mixed in with
everything else in <https://github.com/dsanson/carnap-css>.

TODO: make everything more modular and configurable.

TODO: package scripts with appropriate minimal working custom CSS

## Installing/Using

Most of these scripts should work as is. Upload to Carnap, set to public,
and put the link to the script into your YAML headers.

Right now, I am using [webpack](https://webpack.js.org/) to generate a single 
minimized javascript file, which I then upload to Carnap, and include in my
YAML header.

To be clear: I barely know what I am doing, so I'm not the right person to
explain to you how to install and use webpack.
Right now, the only script that *requires* webpack is `navbar.js`, which uses
webpack to import a json file, `src/config.json`, containing course specific settings.

I believe these steps should allow you to replicate my setup:

1.  Clone the repository:

    ```bash
    git clone https://github.com/dsanson/logic-book-js
    ```

2.  Copy the example config to config:

    ```bash
    cd logic-book-js/src
    cp config.example.json config.json
    ```

3.  Return to the root directory, and install npm dependencies:

    ```bash
    cd ..
    npm install
    ```

4.  Build the script:

    ```bash
    npm run build
    ```

You can then upload `logic-book.js` from the `dist` folder to Carnap, and make
it a "Shared, Link-Only" document, and link to it from your Carnap document
YAML header.

## scripts/navbar.js

This is a script that reformats the Carnap navbar, adding course-specific
links. I use it to add links to Zoom, my LMS, and a course Discord server.
It also adds a light/dark/auto switch, for switching between color schemes.

TODO: make the light/dark/auto switch a course-specific option.

TODO: provide minimal working light/dark/auto CSS.

TODO: steal ideas from [bookdown](https://www.bookdown.org/)

TODO: provide table of contents for current document

## scripts/navfooter.js

This adds navigation links to the bottom of each page: "Previous", "Contents",
and "Next". As implemented, it depends on specific facts about how my course
assignments are organized on Carnap.

TODO: make this configurable

## scripts/assigned.js

This is a simple script that parses the URL to figure out whether the
page is being viewed as an assignment or as a shared document on Carnap,
and adds the class 'assignments' or 'shared' to the html body.
It also adds the class '\_<filename>' to the html body.

## scripts/toc-book.js

This script grabs a div with the id 'tableofcontents' from my "Book" on Carnap,
and adds it as a drop down menu of links, under the "Book" link.

It also does some filtering, disabling links with the "disabled" class (I use when I have not
yet uploaded a given chapter or set of exercises).

It also filters out links with the class 'enrolled', when the page is viewed as a "Shared"
document rather than an assignment. (I use this to remove links to tests from publically 
shared versions of my book.)

TODO: integrate this into navbar.js

## scripts/boxes-and-circles.js

A script to make metavariable "boxes" and "circles"
into live editable and "linked".

For example:

```{.markdown}
:::liveshapes
  []{.P} → []{.Q}
  []{.P}
  ∴ []{.Q}
:::
```

Requires separate CSS to style the "boxes" and "circles".

TODO: document the "linked" feature

TODO: minimal CSS

## scripts/derived-rules.js

Display a list of enabled derived rules.

Rules are grabbed from the User page, and used to populate any
div with the class, 'derived-rules'.

TODO: deleting rules isn't working

## scripts/save-work-local.js

A script to save student work on Carnap.io

-   saves work to localStorage.
-   doesn't work for truth tables, syntax problems, sequent calculus problems, or gentzen-prawtiz deductions
-   buggy!

TODO: get it working with all exercises

TODO: figure out which events should trigger saves. Right now, I think we are
saving too often.

TODO: provide some way to clear saved work.

TODO: save both locally and remotely, using Carnap's API.

## scripts/video.js

This script is for embedding videos.

It does a four things.

1.  Initalizes Plyr for all html5 video on the page. To use plyr, you need to
    add appropriate links to your assignment YAML header:
   
    ```yaml
    css:
    -   https://cdn.plyr.io/3.6.12/plyr.css
    js: 
    -   https://cdn.plyr.io/3.6.12/plyr.polyfilled.js
    ```

2.  Inserts video after any carnap exercise with a 'data-carnap-video'
    attribute. e.g.,
 
    ````
    ``` {.QualitativeProblem .ShortAnswer video="https://example.com/video.mp4"}
    1  What is your favorite color?
    ```
    ````

    If the value of data-carnap-video does not start with 'http', then
    the script constructs an appropriate url using the value of the 'server'
    variable. So you should set that to the url of the server you use to
    host videos.

    If the value of data-carnap-video is 'auto', then the script constructs
    a video file name from the attributes of the exercise. (File name generation
    has only been tested for translation problems.)

    TODO: add keyboard shortcut for displaying auto-generated file name.

    TODO: Rethink the presentation of the video. Maybe put it behind a button?

    TODO: Option to only show the video *after* the student has attempted the
    exercises.

    TODO: Support youtube urls

3.  Transforms divs with the class 'youtube' that contain a youtube share url
    into proper youtube video embeds:

    ```markdown
    ::: youtube
    <https://youtu.be/I45-zWJtvfM>
    :::
    ```
    This simplifies the task of embedding youtube videos on Carnap.

4.  Adds links to captions and posters for all html5 videos, with file names
    based on the video file name, and urls based on the values of the 'imghost'
    and 'vtthost' variables. 

    To use, embed a video using pandoc's usual syntax:

    ```markdown
    ![A video](https://example.com/this_video.mp4)
    ```
    
    This will generate an html5 `<video>` element. The script will add 
    poster and caption links:

    ```
    ${imghost}/this_video.jpg
    ${vtthost}/this_video.vtt
    ```

    Right now, I am using a github pages repository as both my imghost and
    vtthost.

## scripts/slideshow.js

A simple script for displaying a "slideshow".

TODO: delete this and replace with CSS animations

## scripts/spoiler.js

A few different classes that can be revealed by clicking.

I use these to give students the ability to reveal "spoilers"
or "hints", or toggle cheat sheets.

TODO: minimal working CSS

TODO: reconsider the placement. Perhaps a button added to the preceding
exercise?

## scripts/score.js

A script that allows students to get immediate feedback on their submissions
without leaving the assignment page.

This script does too many things, and it builds in a bunch of assumptions
about assignment structure specific to my own courses.

TODO: split into more than one script

TODO: make configurable

Basic features:

1.  If an exercise has been submitted:
    -    add class 'submitted' to the exercise
    -    add class 'correct' if received non-zero points
    -    add class 'incorrect' if received a zero.

Combined with custom CSS, this gives students immediate and persistant feedback
on each exercise.

TODO: minimal working CSS

2.  Divs that are revealed upon exercises submission:

    :::{.reaction .correct ex=1}
    Here is some feedback!
    :::
    :::{.reaction .incorrect ex=1}
    Here is some feedback!
    :::

    The value of 'ex' should be the exercise label.

TODO: integrate this and the video solution feature.

3.  Create a "progress bar" at the top of the page, with extensive information 
    about the student's progress through the assignment. Right now, this is
    hardcoded with assumptions specific to my course.

TODO: right now, this depends on the existence of an auto-tally checklist
generated by checklist.js. But it should generate the list of exercises
itself.

## scripts/display-mode.js

"Display Mode" for demonstrating solutions to exercises.

Provides instructors, but not students, a "display mode" that hides everything 
but the exercise, and centers the exerise on the page. 

It also hides the exercise label, since I use this for creating screencast
videos, and I want to be able to change the exercise labels without having
to redo the videos.

Also provides keyboard shortcuts for easily jumping between exercises. These
work (for instructors) whether or not you are in display mode.

| ctrl-<period>: toggles display mode (exercise must be focused)
| ctrl-w: toggles "wide" display mode
| ctrl-n: jump to next exercise (works in display mode and in regular mode)
| ctrl-p: jump to previous exercise (works in display mode and in regular mode)

TODO: support for displaying nearest scheme of abbreviation for translation problems.

## scripts/hypothes.is.config.js

This is configuration for hypothes.is.

## scripts/checklist.js

This started out as a script to enabling persistent checklists, with the idea
that students could use checklists to keep track of their own progress through
individual assignments, and also through a list of assignments and other
tasks.

Then I added the feature of automatically generating a checklist of exercises,
from the exercises on the current page. For this feature, create
an empty div with the class 'auto-tally':

::::markdown
:::auto-tally
:::
::::

This div will be populated by a checklist of all the exercises.
As of now, `score.js` depends on this when constructing the progress bar, but
I plan to eliminate this dependency.

Then I added checkboxes to each exercise, linked to the checkboxes in the
generated list of exercises. That way, students could check off each
exercise as it was completed, and then see their progress at a glance by
looking at the list.

I don't use this feature anymore, as I let `score.js` do the work for the students,
telling them which exercises they have successfully submitted and which not.

My current plan is to revert this to its original purpose, and remove the
auto-generation features.

TODO: clean this up and revert to a simpler script.

## scripts/truthtable-keys.js

Easily navigate truth tables using the keyboard.

-   Use arrow keys, HJKL, or WASD to move from cell to cell.
-   Use delete or backspace to delete a cell (i.e., select '-')

I use this together with custom CSS that removes most of the "dropdown"
decoration from each truth table cell.

TODO: minimal CSS

WARNING: this overrides the default use of arrow keys for the select boxes
within truth tables. This is generally a bad idea for accessibility.

## scripts/defs.js

This script gathers inline definitions into a definition list. I use it to
append definitions of key concepts to the end of each chapter.

Here is what an inline definition looks like:

```markdown
[An argument is [valid]{.vocab} iff it is impossible for its premises to be
true and its conclusion false.]{.def}
```

Place a div with the class '.defs' somewhere in your document, and it will be
filled with an html definition list for each definition. So, something like:

```markdown
:::defs
:::
```

becomes:

```html
<dl>
<dt><span class="vocab">valid</span></dt>
<dd>
<span class="def">An argument is <span class="vocab">valid</span> iff it
is impossible for its premises to be true and its conclusion
false.</span>
</dd>
</dl>
```

## scripts/reaction.js

This script makes it possible to offer students feedback based on what they
submit. 

In your source document, wrap your feedback in divs, like so:

```
:::{.reaction .correct ex=10}
Feedback for a correct response to exercise 10
:::

:::{.reaction .incorrect ex=10}
Feedback for an incorrect response to exercise 10
:::
```

Use custom CSS to hide these divs when the page is first loaded, e.g.,

```css
.reaction {
  display: none;
  border-radius: .5em;
  padding: 1em;
}

.reaction.correct
  border: thick solid green;
}

.reaction.incorrect {
  border: thick solid red;
}
```

For multiple choice and multiple selection exercises, it is possible to
provide tailored feedback based on which answers the student selected.
To do this, provide a "selector" as the value of the "ans" attribute.

In the simplest case, the selector is the index (starting with zero) of the
selected answer:

```
:::{.reaction .incorrect ex=10 ans=0}
Feedback for an incorrect response to exercise 10, where the student selected
the first option.
:::

:::{.reaction .incorrect ex=10 ans=2}
Feedback for an incorrect response to exercise 10, where the student selected
the third option.
:::
```

For multiple selection questions, concatenate the indices of the selected
answers:

```
:::{.reaction .incorrect ex=10 ans=03}
Feedback for an incorrect response to exercise 10, where the student selected
the first and fourth options.
:::
```

To combine multiple selectors, separate them by spaces:

```
:::{.reaction .incorrect ex=10 ans="02 03"}
Feedback for an incorrect response to exercise 10, where the student either selected
the first and third options, or selected the first and fourth options.
:::
```

You can also use the selector 'other', which will provide feedback for
incorrect answers that don't match the selectors of any of the other feedback
divs:

```
:::{.reaction .incorrect ex=10 ans="other"}
Feedback for an incorrect response to exercise 10, for students who select
options that don't have any other specific feedback.
:::
```


TODO: automatically attach reactions to the immediately preceding exercise.

TODO: tailored feedback for other exercise types???






