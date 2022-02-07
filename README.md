# Custom Javascript for Carnap.io

This is a collection of custom javascript that I use with <https://carnap.io>.

Many of these scripts are tied up with details about how I run and design my
own courses, and so will require adaptation to be used for your own purposes.
But many of them should be usable as is.
I do hope to make them all more modular and adaptable.

I use webpack to combine all the scripts into a single minimized javascript
file, which I then upload to Carnap.
But I barely know what I am doing with webpack, so I'm not the right person to
explain to you how to install it and use it yourself.
Right now, the only script that *requires* webpack is `navbar.js`, which uses
webpack to import a json file, `src/config.json`, containing course specific settings.

For my set up, I first build using webpack:

    npm run build

Then I upload the two resulting files, found in the `dist` folder, to Carnap:

    logic-book.js
    logic-book.js.map

I make `logic-book.js` a Shared, Link-Only document on Carnap.
I keep `logic-book.js.map` set to Private, since it is just for debugging
purposes.

Then I include a link to the shared `logic-book.js` in the YAML header of
each of my class assignments.
