---
js:
-   https://carnap.io/shared/dsanson@gmail.com/save-work-local.js
---

# save-work-local.js

This is a demo of the `save-work-local.js` script, which uses HTML
localStorage to save and reload work. You can use it on your own pages by including 
a link to the script in your header:

---
js:
-   https://carnap.io/shared/dsanson@gmail.com/save-work-local.js
---

# limitations etc

Saves and reloads work for

-   Qualitative problems, including short answer, multiple choice, multiple selection, and numeric.
-   Derivations
-   Truth tables
-   Countermodels

It is not currently able to save and reload work for

-   Syntax Problems
-   Sequent Calculus Problems
-   Gentzen-Prawitz Natural Deduction Problems

Previous versions of this script failed to trigger events needed to get Carnap
to properly recognize reloaded work, and so failed to work properly for many
problem types. That should now be fixed, and support for those problem types
has been re-enabled.

Work is saved to localStorage. This means that the save is local to the device
and browser, and work will not be reloaded across different browsers or
devices.

Ideally, work would also be saved to Carnap's server, using
`CarnapServerAPI.putAssignmentState()` and
`CarnapServerAPI.getAssignmentState()`, allowing for reloading across browsers
and devices. But I am puzzled about the best way to implement this. An earlier
implementation that *just* used CarnapServer was unreliable due to network
occasional network errors. It also meant that saving was limited to *assigned*
pages, and did not work on shared pages. Hence the thought that ideally, work
would be saved both locally and remotely. But I am puzzled about how best to handle
conflicts between local and remote saves, caused by network errors.

It would probably also be a good idea to implement a "Clear" button, allowing
students to quickly clear saved work from a given problem. 

The script relies on exercise type and exercise labels to identify problems
across loads. If several exercises of the same type have the same label, it
relies on the order in which they occur.

# examples

```{.QualitativeProblem .MultipleChoice}
1 Select the true answer:
| *2 + 2 = 4
| 2 + 2 = 5
| 2 + 2 = 6
```

```{.QualitativeProblem .MultipleSelection}
2 Select all true answers
| *2 + 2 = 4
| *2 + 3 = 5
| 2 + 2 = 6
```

```{.QualitativeProblem .ShortAnswer} 
3 Say something:
```

```{.QualitativeProblem .Numerical}
4 8 : How many bits in a byte?
| 2^3
```

| Q: I attend class
| P: I wear pants

``` {.Translate .Prop}
5 Q->P : If I attend class, then I wear pants.
```

``` {.ProofChecker .Prop options="guides fonts indent tabindent resize"}
6 P->Q, Q->R, P :|-: R 
```

```{.TruthTable .Validity options="nocounterexample turnstilemark"}
7 P :|-: P
```

``` {.CounterModeler .Simple counterexample-to=tautology}
8 ~F(a)
```

