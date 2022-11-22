/* eslint-env jquery Plyr */

// Video embeds with Plyr
//
// This script does a four things.
//
// 1.  Initalizes Plyr for all html5 video on the page. Add appropriate
//     links to your Carnap file headers:
//     
//     css:
//     -   https://cdn.plyr.io/3.6.8/plyr.css
//     js: 
//     -   https://cdn.plyr.io/3.6.8/plyr.polyfilled.js
//
// 2.  Inserts video after any carnap exercise with a 'data-carnap-video'
//     attribute. e.g.,
//
//     ``` {.QualitativeProblem .ShortAnswer video="https://example.com/video.mp4"}
//
//     If the value of data-carnap-video does not start with 'http', then
//     the script constructs an appropriate url using the value of the 'server'
//     variable. So you should set that to the url of the server you use to
//     host videos.
//
//     If the value of data-carnap-video is 'auto', then the script constructs
//     a video file name from the attributes of the exercise. (File name generation
//     has only been tested for translation problems.)
//
// 3.  Transforms divs with the class 'youtube' that contain a youtube share url
//     into proper youtube video embeds:
//
//     ::: youtube
//     <https://youtu.be/I45-zWJtvfM>
//     :::
//
//     into a proper youtube embed. This greatly simplifies the task of
//     embedding youtube videos on Carnap.
//
// 4.  Adds links to captions and posters to all html5 videos, with file names
//     based on the video file name, and urls based on the values of the 'imghost'
//     and 'vtthost' variables. So you put this into your Carnap source file:
//
//     ![A video](https://your_video_server/this_video.mp4)
//
//     And it will create links to captions and poster:
//
//     https://your_img_host/this_video.jpg
//     https://your_vtt_host/this_video.vtt
//
// Anyone wanting to use this script for themselves will want
// to change the values of imghost and vtthost.

import Plyr from 'plyr';

function insertVids() {

  const server = "https://dsanson.github.io/logic-materials/vid/"

  $('div[data-carnap-video]').each(function() {
    let url = $(this).attr('data-carnap-video')
    if ( url == 'auto' ) {
      const type = $(this).attr('data-carnap-type')
      let problem = $(this).attr('data-carnap-problem').trim()
      problem = problem.replace(/[.]*$/, '')
      problem = problem.replace(/ +/g, '_')
      url = encodeURIComponent(type + '_' + problem + '.mp4')
      url = server + url
      console.log(url)
    }
    else if ( url.substring(0,4) != 'http' ) {
      url = server + url
    }
    const ex = $(this).parent().attr('id')
    let video = $(`<video id="video-${ex}" class="video-solution" src="${url}" controls=""><a href="${url}">solution</a></video>`)
    let solution = $('<div class="solution"></div>')
    solution.append(video)
    $(this).parent().parent().append(solution)
  })

}

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
     const imghost = 'https://dsanson.github.io/logic-materials/vid/'
     const vtthost = 'https://dsanson.github.io/logic-materials/vid/'
     const poster = imghost + root + '.jpg'
     const subs = vtthost + root + '.vtt'
     const track = `<track kind="captions" label="English captions" src="${subs}" srclang="en" default />`
     $(this).attr('crossOrigin',"anonymous")
     $(this).attr('data-poster',poster)
     $(this).append(track)
  })
}
 

$(document).ready(function() {
  
  insertVids();

  setPosterandSubtitles(); 

  let opts = {
    autopause: false,
    disableContextMenu: false
    }

  Plyr.setup('video',opts);

  youtubeEmbeds();
  Plyr.setup('.youtube',opts);
});
