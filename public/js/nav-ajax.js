$(document).ready(function(){
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    $('body').on('click', '.nav-link, .btn', function(e){
        e.preventDefault();
        var url = $(this).attr('href');

        // Load the content into the main section
        $('#main-content').load(url + ' #main-content > *', function(){
            // Update the URL in the address bar
            history.pushState(null, null, url);
            // Reinitialize the hori-selector
            setTimeout(function(){ setActiveLink(); }, 100);
        });
    });

    $(window).on('popstate', function(){
        $('#main-content').load(location.pathname + ' #main-content > *', function(){
            setTimeout(function(){ setActiveLink(); }, 100);
        });
    });
});
