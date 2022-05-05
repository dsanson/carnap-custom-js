export function scrollToView(id) {
  var top = document.getElementById(id).offsetTop-document.getElementById("navbar").offsetHeight-10;
  //show 10 pixels down the border
  window.scrollTo(0, top);
}
