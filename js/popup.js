$(function () {

    // variable to enable or disable accessible maps
    var enabled = false;
    // enable button element
    var enableButton = $("#enableButton");

    // read the last value for enabled from the storage
    chrome.storage.sync.get(['enabled'], function (items) {
        enabled = (items.enabled == 'true');
    });

    // set the text the button
    setEnabledButtonText();

    // send the current value of enabled to the contents script
    sendFilterMessage();

    /************************************************
     * functions and events
     ************************************************/

    // event when the user click the extension icon.
    // Doesn't fire when the extension has a popup page.
    chrome.pageAction.onClicked.addListener(toggleEnabledCommand);

    // add listener for the the toggle command
    chrome.commands.onCommand.addListener(function (command) {
        if (command == "toggleColorsInversion") {
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

        chrome.tabs.getSelected(null, function (tab) {
            if (enabled) {
                chrome.pageAction.setIcon({tabId: tab.id, path: {"128": "images/enabledIcon.png"}});
            }
            else {
                chrome.pageAction.setIcon({tabId: tab.id, path: {"128": "images/disabledIcon.png"}});
            }
        });
        console.log("enabled = " + enabled);
    }

    // function to toggle enabled variable

    function toggleEnabledCommand() {
        // reverse the boolean enabled
        enabled = !enabled;
        // store the new value in the storage
        chrome.storage.sync.set({'enabled': enabled});
        // change the button text
        setEnabledButtonText();
        sendFilterMessage();
    }

    // send a message to the contents.js with the new value for enabled
    function sendFilterMessage()
    {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "filter", inversionEnabled: enabled});
            console.log("Message sent");
        });
    }

});