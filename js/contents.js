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

        // $.each($("*"), function(index, element) {
        //     console.log($(element));
        //     console.log($(element).css("color"));
        //     console.log($(element).css("background-color"));
        // });

        if (request.inversionEnabled) {
            // invert the colors
            $("body").addClass("inversionEnabled");

            // $.each($("*"), function(index, element) {
            //     $(element).css({
            //         "filter": "contrast(100%) invert(100%)"
            //     });
            // });
        }
        else {
            // remove the inversion
            $("body").removeClass("inversionEnabled");
            // $.each($("*"), function(index, element) {
            //     $(element).css({
            //         "filter": "none"
            //     });
            // });
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
                    for(var i = 0; i < canvas.width; i += 3) {
                        for(var j = 0; j < canvas.height ; j += 3)
                        {
                            var redComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 0];
                            var greenComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 1];
                            var blueComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 2];
                            var alphaComponent = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 3];

                            var rgba = "";

                            var rgba =  formatNumberLength(redComponent, 3) +
                                        formatNumberLength(greenComponent, 3) +
                                        formatNumberLength(blueComponent, 3)
                                 //       formatNumberLength(alphaComponent, 3);

                            //var value = colorsMap.has(rgba)? colorsMap.get(rgba)+1 : 1;
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

                    // check if the most used color is close to white
                    if (distinctColors[0].color >= "240240240")
                    {
                        for(var i = 0; i < canvas.width; i += 1) {
                            for (var j = 0; j < canvas.height; j += 1) {

                                var rIndex = ((i * (imageData.width * 4)) + (j * 4)) + 0;
                                var gIndex = ((i * (imageData.width * 4)) + (j * 4)) + 1;
                                var bIndex = ((i * (imageData.width * 4)) + (j * 4)) + 2;

                                var r = imageData.data[rIndex];
                                var g = imageData.data[gIndex];
                                var b = imageData.data[bIndex];

                                //  var a = imageData.data[((i * (imageData.width * 4)) + (j * 4)) + 3];

                                var rgbImage = formatNumberLength(r, 3) +
                                    formatNumberLength(g, 3) +
                                    formatNumberLength(b, 3);
                                //       formatNumberLength(alphaComponent, 3);

                                if (distinctColors.some(function (element, index, array) {
                                        return element.color == rgbImage;
                                    }))
                                {
                                    imageData[rIndex] = 255 - r;
                                    imageData[gIndex] = 255 - g;
                                    imageData[bIndex] = 255 - b;
                                }
                            }
                        }
                    }
                    canvas.style.cssText = "z-index: 5000";
                    context.putImageData(imageData, 0, 0);
                    document.body.appendChild(canvas);
                    console.log("Done");
                }
            });
        }
        else {
        }
    }
    function invertUsingManualColors(request) {
        console.log("Manual :" + request.inversionEnabled);
        if (request.inversionEnabled) {

        }
        else {
        }
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


