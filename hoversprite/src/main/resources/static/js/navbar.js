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
        var itemPosLeft = activeItem.position().left;
        var itemPosTop = activeItem.position().top;
        var itemWidth = activeItem.outerWidth();
        var itemHeight = activeItem.innerHeight();
        $(".hori-selector").css({
            "left": itemPosLeft + "px",
            "top": itemPosTop + "px",
            "width": itemWidth + "px",
            "height": itemHeight + "px",
        });

        // Store the position in localStorage
        localStorage.setItem('horiSelectorLeft', itemPosLeft);
        localStorage.setItem('horiSelectorTop', itemPosTop);
        localStorage.setItem('horiSelectorWidth', itemWidth);
        localStorage.setItem('horiSelectorHeight', itemHeight);
    }
}

function setActiveLink() {
    var path = window.location.pathname.split("/").pop();

    // If the path is any of the subpages related to account, highlight the Account on navbar
    if (path === 'user_profile' || path === 'notifications') {
        path = 'account';
    }

    var target = $('#navbarSupportedContent ul li a[href="/' + path + '"]');
    $('#navbarSupportedContent ul li').removeClass("active");
    target.parent().addClass('active');

    // Retrieve the position from localStorage
    var storedLeft = localStorage.getItem('horiSelectorLeft');
    var storedTop = localStorage.getItem('horiSelectorTop');
    var storedWidth = localStorage.getItem('horiSelectorWidth');
    var storedHeight = localStorage.getItem('horiSelectorHeight');

    if (storedLeft && storedTop && storedWidth && storedHeight) {
        $(".hori-selector").css({
            "left": storedLeft + "px",
            "top": storedTop + "px",
            "width": storedWidth + "px",
            "height": storedHeight + "px",
        });
    }
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
