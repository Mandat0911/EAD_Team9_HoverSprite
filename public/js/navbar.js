// ---------Responsive-navbar-active-animation-----------
function test(){
    var tabsNewAnim = $('#navbarSupportedContent');
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
        "top": itemPosNewAnimTop.top + "px", 
        "left": itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
    });
}

function setActiveLink() {
    var path = window.location.pathname.split("/").pop();
    if (path == '') {
        path = 'home.html';
    }
    var target = $('#navbarSupportedContent ul li a[href="'+path+'"]');
    $('#navbarSupportedContent ul li').removeClass("active");
    target.parent().addClass('active');
    test();
}

$(document).ready(function(){
    setActiveLink();
    $("#navbarSupportedContent").on("click", "li", function(e){
        e.preventDefault();
        $('#navbarSupportedContent ul li').removeClass("active");
        $(this).addClass('active');
        test();
    });
});

$(window).on('resize', function(){
    setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function(){ test(); });
});

// --------------add active class-on another-page move----------
$(window).on('load', function () {
    setActiveLink();
});

$(window).on('popstate', function(){
    setActiveLink();
});
