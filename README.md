# Custom Javascript for Carnap.io

This is a collection of custom javascript that I use with <https://carnap.io>.

Many of these scripts are tied up with details about how I run and design my
own courses, and so will require adaptation to be used for your own purposes.
But I do hope to make them more modular and adaptable over time.

I use webpack to combine all the scripts into a single minimized javascript
file, which I then upload to Carnap.

Right now, the only script that *requires* webpack is `navbar.js`, which uses
webpack to import a json file, containing course specific settings.

To deploy:

    npm run build

Then upload the resulting files, found in the `dist` folder, to Carnap:

    logic-book.js
    logic-book.js.map

Make sure the set `logic-book.js` to shareable, link-only. Leave
`logic-book.js.map` set to Private.


