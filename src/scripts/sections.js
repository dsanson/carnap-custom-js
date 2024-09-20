// View one section at a time
// TODO: intelligent scrolling
// TODO: remember last visited section on reload
// TODO: proper handling of anchor links
// TODO: accessibility worries about the way the sections are being hidden (display:none would be better, but then need some other way to handle preloading

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByTagName("section");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[slideIndex-1].style.display = 'block';
} 



    // Don't try to render immediately
    mermaid.initialize({startOnLoad:false});
    mermaid.mermaidAPI.initialize();

    // Watch the element's attributes for changes
    let mermaidObserverOpts = {
        attributes: true
    };

    // Find all Mermaid elements and act on each
    document.querySelectorAll('.mermaid').forEach(function(el) {
        let observer = new MutationObserver((entries) => {
            let target = entries[0].target;

            // Act only when the element becomes visible
            if(window.getComputedStyle(target).display != 'none') {
                // Get the contents of the Mermaid element
                let html = el.textContent;

                // Generate a unique-ish ID so we don't clobber existing graphs
                // This is definitely quick and dirty and could be improved to 
                // avoid collisions when many charts are used
                let id = 'graph-' + Math.floor(Math.random() * Math.floor(1000));

                // Actually render the chart
                mermaid.mermaidAPI.render(id, html, content => {
                    el.innerHTML = content;
                });

                // Disconnect the observer, since the chart is now on the page. 
                // There's no point in continuing to watch it
                observer.disconnect();
            }
        });

        observer.observe(el, mermaidObserverOpts);
    });
