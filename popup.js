
$(function () {

    // variable to enable or disable accessible maps
    var enabled  = false;
    // enable button element
    var enableButton = $("#enableButton");

    // read the last value for enabled from the storage
    chrome.storage.sync.get(['enabled'], function (items){
        enabled = (items.enabled == 'true');
    });

    // set the text the button
    setEnabledButtonText();


    /************************************************
     * functions and events
     ************************************************/

    // event when the user click the extension icon.
    // Doesn't fire when the extension has a popup page.
    chrome.pageAction.onClicked.addListener(toggleEnabledCommand);

    // add listener for the the toggle command
    chrome.commands.onCommand.addListener(function(command)
    {
        if(command == "toggleColorsInversion"){
            toggleEnabledCommand();
        }
    });
    // add listener for the button click
    enableButton.click(toggleEnabledCommand);

    // set the text of the button
    function setEnabledButtonText() {
        if (enabled) {
            chrome.tts.speak('Enabled');
            enableButton.text('Enabled');
        }
        else {
            enableButton.text('Disabled');
            chrome.tts.speak('Disabled');
        }
        console.log("enabled = " + enabled);
    }

    // function to toggle enabled variable
    function toggleEnabledCommand() {
        enabled = !enabled;
        chrome.storage.sync.set({'enabled': enabled});
        setEnabledButtonText();
    }

});