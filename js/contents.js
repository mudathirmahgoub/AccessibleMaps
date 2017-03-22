$(function () {
    // enable the page extension
    chrome.runtime.sendMessage({action: "show"});

    // listen to messages from the extension
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // if the message type is filter
        if (request.type == "filter") {
            console.log("Inversion :" + request.inversionEnabled);
            if(request.inversionEnabled) {
                // invert the colors
                $("html").addClass("inversionEnabled");

                // $.each($("*"), function(index, element) {
                //     $(element).css({
                //         "filter": "contrast(100%) invert(100%)"
                //     });
                // });
            }
            else
            {
                // remove the inversion
                $("html").removeClass("inversionEnabled");
                // $.each($("*"), function(index, element) {
                //     $(element).css({
                //         "filter": "none"
                //     });
                // });
            }
        }
    });
});


// get the contents of the dom
// construct a graph of the content
// determine the color-contrast between adjacent elements
// if the color-contrast is good, we are done
// otherwise, choose high-contrasted colors.


