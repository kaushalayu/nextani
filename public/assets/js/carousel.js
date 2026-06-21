$(document).ready(function () {
    var owl = $('.testimonials-con .owl-carousel');
    owl.owlCarousel({
        margin: 30,
        nav: false,
        loop: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4500,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            }
        }
    })
})
$(document).ready(function () {
    // Button click -> trigger hidden file input
    $("#uploadBtn").click(function () {
        $("#fileInput").click();
    });

    // Show selected file name
    $("#fileInput").change(function () {
        let file = this.files[0];
        if (file) {
            $("#fileName").text("Selected file: " + file.name);
        } else {
            $("#fileName").text("");
        }
    });
});