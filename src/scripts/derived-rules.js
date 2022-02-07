// Display a list of enabled derived rules.
//
// Rules are grabbed from the User page, and used to populate any
// div with the class, 'derived-rules'.
//


function loadDerivedRules() {                                                                            

  function deleteRule(name) {
      url = $('#navbar > ul > li.dropdown > ul > li:nth-child(1) > a').attr('href');
      jQuery.ajax({
          url: url,
          type: 'DELETE',
          contentType: "application/json",
          data: JSON.stringify(name),
          success: function(data) {
              var el = document.getElementById("rule-" + name);
              el.parentElement.removeChild(el);
              window.alert("Deleted the rule " + name);
              },
          error: function(data) {
              window.alert("Error, couldn't delete the rule" + name)
              },
      });
  };

  function tryDeleteRule(name) {
      if (confirm("Permanently delete the rule " + name + "?")) {
          deleteRule(name);
      }
  }


  let userpage = '/user'
  // check to see if user is logged in as instructor
  //   if there are more than 2 dropdown items in the navbar,
  //   then user is an instructor
  const dropdown = $('#navbar > ul > li:last-child ul')[0].children.length
  if (dropdown > 2) {
    let user = $('#navbar > ul > li:last-child ul li:first-child a').attr('href')
    user = user.split('/').slice(-1)[0]
    userpage = userpage + '/' + user
  }

  $('.derived-rules').load(userpage + ' .derivedRules', function() {
    n = 1
    $('.derived-rules td').each(function() { 
      $(this).html(
        $(this).html()
          .replace(/φ/g,'<span class="P" data-to=' + n + '></span>')
          .replace(/ψ/g,'<span class="Q" data-to=' + n + '></span>')
          .replace(/χ/g,'<span class="R" data-to=' + n + '></span>')
          .replace(/θ/g,'<span class="S" data-to=' + n + '></span>')
          .replace(/delete rule/,'')
      )
      n = n + 1;
    });
 
    $('.derived-rules button').each(function() {
      const name = $(this).parent().parent().attr('id').slice(5)
      $(this).removeAttr('onclick')
      $(this).on('click', function() {
        tryDeleteRule(name)
      });
    });

    if ($('.derived-rules').html().trim() == "") {
      $('.derived-rules').html('<p class="empty">Once you have enabled some derived rules, they will appear here</p>');
    }
    else if ( typeof makeShapesLive === 'function' ) {
      makeShapesLive()
    }
  });
}

$(document).ready(function() {                                                                          
    loadDerivedRules();
});
