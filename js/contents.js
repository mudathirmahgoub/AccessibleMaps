$(function () {
    // enable the page extension
    chrome.runtime.sendMessage({action: "show"});

    // listen to messages from the extension
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        switch(request.type)
        {
            case "filter":
            {
                invertColorsUsingFilter(request);
            }
            break;
            case "automatic":
            {
                invertUsingDefaultColors(request);
            } break;
            case "manual":
            {
                invertUsingManualColors(request);
            } break;
        }
    });

    function invertColorsUsingFilter(request) {
        console.log("Filter :" + request.inversionEnabled);

        if (request.inversionEnabled) {
            // invert the colors
            $("body").addClass("inversionEnabled");
        }
        else {
            // remove the inversion
            $("body").removeClass("inversionEnabled");
        }
    }
    function invertUsingDefaultColors(request) {
        console.log("Automatic :" + request.inversionEnabled);
        if (request.inversionEnabled) {
            html2canvas(document.body, {
                onrendered: function(canvas) {

                    // map to store the colors
                    var colorsList = [];

                    // get the pixels of the canvas
                    var context = canvas.getContext("2d");
                    var imageData = context.getImageData(0, 0, canvas.width, canvas.height );

                    for(var i = 0; i < canvas.width; i += 3) // every three pixels for performance.
                    {
                        for(var j = 0; j < canvas.height ; j += 3)
                        {
                            var redComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 0];
                            var greenComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 1];
                            var blueComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 2];
                            var alphaComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 3];

                            if(! redComponent){
                                // sometimes color can be undefined !!!
                                continue;
                            }

                            var rgba = "";

                            var rgba =  formatNumberLength(redComponent, 3) +
                                        formatNumberLength(greenComponent, 3) +
                                        formatNumberLength(blueComponent, 3)
                                 //       formatNumberLength(alphaComponent, 3);

                            colorsList.push(rgba);
                        }
                    }
                    colorsList.sort();

                    var distinctColors = [], previous;
                    for ( var i = 0; i < colorsList.length; i++ ) {
                        if ( colorsList[i] !== previous ) {
                            distinctColors.push({color:colorsList[i], count: 1});
                        } else {
                            var color = distinctColors[distinctColors.length-1];
                            color.count ++;
                            distinctColors[distinctColors.length-1] = color;
                        }
                        previous = colorsList[i];
                    }

                    if(distinctColors.length > 100)
                    {
                        distinctColors = distinctColors.filter(function (color) {
                            if(color.count > 100)
                                return color;
                        });
                    }

                    distinctColors.sort(function(a,b){
                       if(a.count >= b.count)
                           return -1;
                       return 1;
                    });


                    console.log(distinctColors);

                    var invertedColors  = {
                        backgroundColor : "black",
                        color: "white",
                        border: "orange"};
                    // check if the most used color is close to white
                    if (distinctColors[0].color >= "240240240")
                    {
                        $.each(distinctColors, function () {
                            this.color = "rgb(" + this.color.substr(0,3) + ", " + this.color.substr(3,3)
                                +", " + this.color.substr(6, 3) + ")";
                            console.log(this);
                        });

                        $("*:visible").each(function(){

                            var backgroundColor = rgb2hex($(this).css("background-color"));
                            if( backgroundColor == rgb2hex(distinctColors[0].color))
                            {
                                $(this).css("background-color", invertedColors.backgroundColor);
                                $(this).css("color", invertedColors.color );

                                var borderColor = rgb2hex($(this).css("border-color"));
                                console.log(backgroundColor + " : " + borderColor);
                                if(backgroundColor !== borderColor)
                                {
                                    $(this).css("border-color", invertedColors.border);
                                }
                            }
                        });
                    }

                    console.log(request.imageData.substr(0, 50));
                    var image = new Image();
                    image.src = request.imageData;
                    var context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);

                    $( "body" ).empty();

                    // add canvas as a layer over the current layer
                    document.body.appendChild(image);
                    //document.body.appendChild(canvas);
                    console.log("Done");
                }
            });
        }
        else
        {
            // reload the page
            window.location.reload();
        }
    }
    function invertUsingManualColors(request) {
        console.log("Manual :" + request.inversionEnabled);
        if (request.inversionEnabled) {

        }
        else {
        }
    }

    function rgb2hex(rgbColor){
        var rgb = rgbColor;
        if(rgb.startsWith("rgba"))
        {
            rgb = rgb.replace(/,\s\d\)/, ")");
            rgb = rgb.replace("rgba", "rgb");
        }
        var rgb = rgb.replace(/\s/g,'').match(/^rgb?\((\d+),(\d+),(\d+)/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : rgbColor;
    }

function formatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
});


// get the contents of the dom
// construct a graph of the content
// determine the color-contrast between adjacent elements
// if the color-contrast is good, we are done
// otherwise, choose high-contrasted colors.


