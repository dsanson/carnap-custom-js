---
js:
-   https://carnap.io/shared/dsanson@gmail.com/truthtable-keys.js
---

# An example

This is an example demonstrating the use of
<https://carnap.io/shared/dsanson@gmail.com/truthtable-keys.js>, a script that
adds keyboard navigation to truth tables. To use it on your own files, add a
link to the javascript to your header:

```
---
js:
-   https://carnap.io/shared/dsanson@gmail.com/truthtable-keys.js
---
```

Click on a cell in the table below and select a truth value to give it focus.
Then navigate between cells using the arrow keys, wasd, or hjkl. When a cell
is focused, you can type t or f to select a truth value, and - or delete or
backspace to clear the cell. If the cell is under a turnstyle, and the
turnstilemark option is set, type c or y to select ✓, and x or n to select ✗.

```{.TruthTable .Validity options="nocounterexample turnstilemark"}
Example ~(P/\Q), Q->~Q :|-: P
```
