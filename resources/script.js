
var popup = {
    show: function() {
        document.getElementById("testoverlay").style.display = "flex";
        setTimeout(()=>{document.getElementById("testoverlay").style.opacity = 1;}, 20);
    },
    hide: function() {
        document.getElementById("testoverlay").style.opacity = 0;
        setTimeout(()=>{document.getElementById("testoverlay").style.display = "none";}, 200);
    },
    populate: function(html) {
        document.getElementById("popup").innerHTML = html;
    },
    append: function(html) {
        document.getElementById("popup").innerHTML = document.getElementById("popup").innerHTML + html;
    },
    init: function() {
        document.getElementById("testoverlay").addEventListener('mousedown', function(e) {   
            if (e.target == document.getElementById("testoverlay")) popup.hide();
        });
    }
}

function toggleMenu() {
    switch (document.getElementsByClassName('left_menu')[0].getAttribute('status')) {
        case "closed":
            document.getElementsByClassName('left_menu')[0].setAttribute('status', 'opened');
        break;
        case "opened":
            document.getElementsByClassName('left_menu')[0].setAttribute('status', 'closed');
        break;
    }
}