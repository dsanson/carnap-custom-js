/* eslint-env jquery Plyr */

// Video embeds with Plyr
//
// This script does a three things.
//
// First, it initalizes Plyr for all html5 video on the page.
//
// Second, it transforms a div containing a youtube share link, like so:
//
// ::: youtube
// <https://youtu.be/I45-zWJtvfM>
// :::
//
// into a proper youtube embed. This greatly simplifies the task of
// embedding youtube videos on Carnap.
//
// Third, it extends html5 video to include links to captions and posters
// hosted on github. You can use pandoc's image syntax for videos:
//
// ![A video](http://example/url/to/this_video.mp4)
//
// Assuming you have uploaded `this_video.jpg` and `this_video.vtt` to
// the urls specified by the `imghost` and `vtthost` variables.
//
// Anyone wanting to use this script for themselves will want
// to change the values of imghost and vtthost.

import Plyr from 'plyr';

function youtubeEmbeds() {
  $('div.youtube').each(function() {
    if ($(this).attr('skip') != "true" ) {
      let opts = '?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1&amp;rel=0';
      if ($(this).attr('data-t')) {
        opts = opts +'&start=' + $(this).attr('data-t');
      } 
      try {
        let slug = $(this).text().split('/')[3];
        slug = slug.replace(/(\n|\r)+$/, '');
        let frame = $('<iframe/>');
        frame.attr('src','https://www.youtube.com/embed/' + slug + opts);
        console.log(frame.attr('src'))
        frame.attr('frameborder', '0');
        frame.attr('allow', 'autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture');
        frame.attr('allowfullscreen', 'true');
        frame.attr('allowtransparency', 'true');
        $(this).html(frame);
        $(this).class('plyr__video-embed');
      }
      catch {
        console.log('unable to parse youtube link');
      }
    }
  });
}

function setPosterandSubtitles() {
  $('video').each( function() {
     const src = $(this).attr('src')
     const root = src.split('/').slice(-1)[0].split('.').slice(0,-1).join('.')
     const imghost = 'https://dsanson.github.io/logic/vid/'
     const vtthost = 'https://dsanson.github.io/logic/vid/'
     const poster = imghost + root + '.jpg'
     const subs = vtthost + root + '.vtt'
     const track = `<track kind="captions" label="English captions" src="${subs}" srclang="en" default />`
     $(this).attr('crossOrigin',"anonymous")
     $(this).attr('data-poster',poster)
     $(this).append(track)
  })
}
 

$(document).ready(function() {
  setPosterandSubtitles(); 

  let opts = {
    autopause: false,
    disableContextMenu: false
    }

  Plyr.setup('video',opts);

  youtubeEmbeds();
  Plyr.setup('.youtube',opts);
});
