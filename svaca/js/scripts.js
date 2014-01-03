$(document).ready(function(){

  $("#pages a").click(function(e){
    //if(e.target.hash.slice(1)=="") console.log("nic");
    e.preventDefault();
    var nextPage = $(e.target.hash);
     if(e.target.hash.slice(1)!="")transition(nextPage, 'fade');
    $("#pages").attr("className", e.target.hash.slice(1));
  });

  $(".produkt .produktKosik").click(function(e){
      console.log("asdasd")
    kosikPocetVeci ++;
      $("#circleKosikH1").text(kosikPocetVeci);
      $("#circleKosikH1").css('display','block');




  });


});

function transition(toPage, type) {

    $('#menuLeftDiv').css('display','none');
  var toPage = $(toPage),
    fromPage = $("#pages .current");
    
  if(toPage.hasClass("current") || toPage === fromPage) { 
    return; 
  };
  
  toPage
    .addClass("current " + type + " in")
    .one("webkitAnimationEnd", function(){
      fromPage.removeClass("current " + type + " out");
      toPage.removeClass(type + " in")
    });
  fromPage.addClass(type + " out");
  
  if(!("WebKitTransitionEvent" in window)){
    toPage.addClass("current");
    fromPage.removeClass("current");
    return;
  }
}