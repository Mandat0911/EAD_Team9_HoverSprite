// // ---------Responsive-navbar-active-animation-----------
// function test(){
//     var tabsNewAnim = $('#navbarSupportedContent');
//     var activeItemNewAnim = tabsNewAnim.find('.active');

//     if (activeItemNewAnim.length === 0) {
//         console.log("Active nav item not found");
//         return;
//     }

//     var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
//     var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
//     var itemPosNewAnimTop = activeItemNewAnim.position();
//     var itemPosNewAnimLeft = activeItemNewAnim.position();

//     $(".hori-selector").css({
//         "top": itemPosNewAnimTop.top + "px", 
//         "left": itemPosNewAnimLeft.left + "px",
//         "height": activeWidthNewAnimHeight + "px",
//         "width": activeWidthNewAnimWidth + "px"
//     });
// }

// function setActiveLink() {
//     var path = window.location.pathname.split("/").pop();
//     if (path === '') {
//         path = 'home';
//     }
//     var target = $('#navbarSupportedContent ul li a[href="/'+path+'"]');
//     $('#navbarSupportedContent ul li').removeClass("active");
//     target.parent().addClass('active');
//     test();
// }

// $(document).ready(function(){
//     setActiveLink();
//     $("#navbarSupportedContent").on("click", "li", function(e){
//         e.preventDefault();
//         $('#navbarSupportedContent ul li').removeClass("active");
//         $(this).addClass('active');
//         test();
//     });
// });

// $(window).on('resize', function(){
//     setTimeout(function(){ test(); }, 500);
// });
// $(".navbar-toggler").click(function(){
//     $(".navbar-collapse").slideToggle(300);
//     setTimeout(function(){ test(); });
// });

function updateHoriSelector() {
    var activeItem = $('#navbarSupportedContent .active');
    if (activeItem.length > 0) {
        var itemPosLeft = activeItem.position();
        var itemPosTop = activeItem.position();
        var itemWidth = activeItem.outerWidth();
        var itemHeight = activeItem.innerHeight();
        $(".hori-selector").css({
            "left": itemPosLeft.left + "px",
            "top": itemPosTop.top + "px",
            "width": itemWidth + "px",
            "height": itemHeight + "px",
        });
    }
}

function setActiveLink() {
    var path = window.location.pathname.split("/").pop();

    // If the path is any of the subpages related to account, highlight the Account on navbar
    if (path === 'user_profile' || path === 'orders' || path === 'order_details') {
        path = 'account';
    }

    var target = $('#navbarSupportedContent ul li a[href="/' + path + '"]');
    $('#navbarSupportedContent ul li').removeClass("active");
    target.parent().addClass('active');
    updateHoriSelector();
}

$(document).ready(function () {
    setActiveLink();

    $(window).on('resize', function () {
        updateHoriSelector();
    });
    $(".navbar-toggler").click(function () {
        $(".navbar-collapse").slideToggle(300);
        setTimeout(function () {
            updateHoriSelector();
        });
    });
});

// --------------add active class-on another-page move----------
$(window).on('load', function () {
    setTimeout(setActiveLink, 100);
});


$(window).on('popstate', function(){
    setActiveLink();
});
