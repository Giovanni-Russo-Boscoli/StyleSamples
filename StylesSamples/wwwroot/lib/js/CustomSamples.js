$(document).ready(function () {

    ReadDevicesFromJsonFile(false);

    btnShowDevices();

    controlBtnsToggle();

});

var imgLightOn = "/images/light_on.png";
var imgLightOff = "/images/light_off.png";
var imgLampOff = "/images/lamp_off.png";
var imgLampOn = "/images/lamp_on.png";
var imgGateClosed = "/images/gate_closed.png";
var imgGateOpened = "/images/gate_opened.png";
var imgGenericDeviceOff = "/images/genericDevice_off.png";
var imgGenericDeviceOn = "/images/genericDevice_on.png";
var btnShowDevicesByArea = "showDevicesByArea";
var btnShowAllDevices = "showAllDevices";

function registerClickDevice() {

    $(".deviceClass").on("click", function () {

        var textQuestion_ImgDevice = identifyCommand($(this));

        if (confirm(textQuestion_ImgDevice[0])) {

            $(this).attr("src", textQuestion_ImgDevice[1]);

            $(this).attr("data-currentState", textQuestion_ImgDevice[2]);

            callCommandByAjax($(this).attr("data-currentState"), $(this).attr("id"));
        }

        checkStateDevices();

    });
}

function identifyCommand(element) {
        
    var textQuestion_ImgDevice = [];
    var titleDevice = $(element).attr("title");
    var typeDevice = $(element).attr("data-typeDevice");
    var currentState = $(element).attr("data-currentState");
    
    switch (typeDevice) {

        case 'light': {

            if (currentState == "off") {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' ON?";

                textQuestion_ImgDevice[1] = imgLightOn;

                textQuestion_ImgDevice[2] = "on";

            } else {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' OFF?";

                textQuestion_ImgDevice[1] = imgLightOff;

                textQuestion_ImgDevice[2] = "off";

            }

            return textQuestion_ImgDevice;

        }

        case 'lamp': {

            if (currentState == "off") {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' ON?";

                textQuestion_ImgDevice[1] = imgLampOn;

                textQuestion_ImgDevice[2] = "on";

            } else {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' OFF?";

                textQuestion_ImgDevice[1] = imgLampOff;

                textQuestion_ImgDevice[2] = "off";

            }

            return textQuestion_ImgDevice;
        }

        case 'gate': {

            if (currentState == "closed") {

                textQuestion_ImgDevice[0] = "Do you want OPEN the '" + titleDevice + "'?";

                textQuestion_ImgDevice[1] = imgGateOpened;

                textQuestion_ImgDevice[2] = "opened";

            } else {

                textQuestion_ImgDevice[0] = "Do you want CLOSE the '" + titleDevice + "'?";

                textQuestion_ImgDevice[1] = imgGateClosed;

                textQuestion_ImgDevice[2] = "closed";

            }

            return textQuestion_ImgDevice;

        }

        default: {

            if (currentState == "off") {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' ON?";

                textQuestion_ImgDevice[1] = imgGenericDeviceOn;

                textQuestion_ImgDevice[2] = "on";

            } else {

                textQuestion_ImgDevice[0] = "Do you want turn the '" + titleDevice + "' OFF?";

                textQuestion_ImgDevice[1] = imgGenericDeviceOff;

                textQuestion_ImgDevice[2] = "off";

            }

            return textQuestion_ImgDevice;

        }

    }

}

function ReadDevicesFromJsonFile(_showByArea) {

    $.ajax({

        type: "GET",

        url: '/Samples/JsonReaderDevice',

        data: { "showByArea": _showByArea },

        success: function (data) {

            if (_showByArea) {

                createDisplayDevicesShowByArea(data, checkStateDevices);

            } else {

                createDisplayDevices(data, checkStateDevices);

            }

        },

        error: function (xhr, status, error) {

            //ToastrMessage("", "Something went wrong to load Tasks list!");

        }

    });

}

function createDisplayDevicesShowByArea(devices, checkStateDevicesCallback) {

    var qttDevicesPerRow = 6;
    var deviceLength = 0;
    var _html;
    var rows = 0;
    var countDevices;
    var colSize = 12 / qttDevicesPerRow; //(12 columns from Bootstrap)

    $("#divDevices").html("");

    $.each(devices, function (i, item) {

        _html = "";
        countDevices = 0;

        _html += "<div class='row row'" + item.area + " id='row_" + i + "'>";

        _html += "<fieldset>";

        _html += "<legend>" + item.area + "</legend>";

        deviceLength = $(item.devices).length;

        rows = Math.floor(deviceLength / qttDevicesPerRow) + (deviceLength % qttDevicesPerRow > 0 ? 1 : 0);//define how many rows will be necessary to create based in 12 columns[bootstrap]

        for (i = 0; i < rows; i++) {

            _html += "<div class='row rowBtnControlDevicesByArea' id='rowBtnControlDevicesByArea_" + i + "'>";

            _html += "Show control buttons by area...";

            _html += "</div>";

            _html += "<div class='row rowClassItem' id='row_" + i + "'>";

            for (j = 0; j < qttDevicesPerRow; j++) {

                if (countDevices >= deviceLength) {

                    break;

                }

                _html += "<div class='col-sm-2 col-md-2 col-lg-2 itemDevice' id='row_" + i + "_col_" + j + "'>";

                _html += "<div id='divImgRow_" + i + "_col_" + j + "'>";

                _html += "<img title='" + item.devices[countDevices].description + "' src='" + returnImgTypeDevice(item.devices[countDevices].typeDevice, item.devices[countDevices].currentState) + "' id='" + item.devices[countDevices].idDevice +

                    "' class='deviceClass' data-ipAddress=" + item.devices[countDevices].ipAddress + " data-typeDevice=" + item.devices[countDevices].typeDevice + " data-currentState=" + item.devices[countDevices].currentState

                    + " data-action=" + devices[countDevices].action + " />";

                _html += "</div>";

                _html += "<div id='divSpanRow_" + i + "_col_" + j + "'>";

                _html += "<span>" + item.devices[countDevices].description + "</span>";

                _html += "</div>";

                _html += "</div>";

                countDevices++;

            }

            _html += "</div>";

        }

        _html += "</fieldset>";

        _html += "</div> ";

        $("#divDevices").append(_html);

    });

    registerClickDevice();

    checkStateDevicesCallback();
}

function createDisplayDevices(devices, checkStateDevicesCallback) {

    var qttDevicesPerRow = 6;
    var deviceLength = $(devices).length;
    var _html = "";
    var rows = Math.floor(deviceLength / qttDevicesPerRow) + (deviceLength % qttDevicesPerRow > 0 ? 1 : 0);//define how many rows will be necessary to create based in 12 columns[bootstrap]
    var countDevices = 0;
    var colSize = 12 / qttDevicesPerRow; //(12 columns from Bootstrap)

    $("#divDevices").html("");

    for (i = 0; i < rows; i++) {

        _html += "<div class='row rowClassItem' id='row_" + i + "'>";

        for (j = 0; j < qttDevicesPerRow; j++) {

            if (countDevices >= deviceLength) {
                break;
            }

            _html += "<div class='col-sm-2 col-md-2 col-lg-2 itemDevice' id='row_" + i + "_col_" + j + "'>";

            _html += "<div id='divImgRow_" + i + "_col_" + j + "'>";

            _html += "<img title='" + devices[countDevices].description + "' src='" + returnImgTypeDevice(devices[countDevices].typeDevice, devices[countDevices].currentState) + "' id='" + devices[countDevices].idDevice +

                "' class='deviceClass' data-ipAddress=" + devices[countDevices].ipAddress + " data-typeDevice=" + devices[countDevices].typeDevice + " data-currentState=" + devices[countDevices].currentState

                + " data-action=" + devices[countDevices].action + " />";

            _html += "</div>";

            _html += "<div id='divSpanRow_" + i + "_col_" + j + "'>";

            _html += "<span>" + devices[countDevices].description + "</span>";

            _html += "</div>";

            _html += "</div>";

            countDevices++;

        }

        _html += "</div> <hr />";
    }

    $("#divDevices").html(_html);
    registerClickDevice();
    checkStateDevicesCallback();
}

function returnImgTypeDevice(typeDevice, currentState) {

    switch (typeDevice) {

        case 'light': {

            if (currentState == "off") {

                return imgLightOff;

            } else {

                return imgLightOn;

            }

        }

        case 'lamp': {

            if (currentState == "off") {

                return imgLampOff;

            } else {

                return imgLampOn;

            }

        }

        case 'gate': {

            if (currentState == "closed") {

                return imgGateClosed;

            } else {

                return imgGateOpened;

            }

        }

        default: {

            if (currentState == "off") {

                return imgGenericDeviceOff;

            } else {

                return imgGenericDeviceOn;

            }

        }

    }

}

function btnShowDevices() {

    $("#btnShowDevices").attr("data-showDevices", btnShowAllDevices);

    $("#btnShowDevices").text("Show devices by area");

    $("#btnShowDevices").on("click", function () {

        if ($(this).attr("data-showDevices") == btnShowAllDevices) {

            $(this).attr("data-showDevices", btnShowDevicesByArea);

            $("#btnShowDevices").text("Show all devices");

            $("#btnControlDevices").hide();

            ReadDevicesFromJsonFile(true);

        } else {

            $(this).attr("data-showDevices", btnShowAllDevices);

            $("#btnShowDevices").text("Show devices by area");

            $("#btnControlDevices").show();

            ReadDevicesFromJsonFile(false);

        }

    });

}

function controlBtnsToggle() {

    $("#btnTurnAllDevicesOn").prop("disabled", true);

    $("#btnTurnAllDevicesOff").prop("disabled", true);

    $("#btnOpenAllDevices").prop("disabled", true);

    $("#btnCloseAllDevices").prop("disabled", true);



    $("#btnToggleAll").on("click", function () {

        if (confirm("Do you want switch the current states of all devices? (**This action reflects in ALL DEVICES)")) {

            toggleDevice($(".deviceClass"));

            checkStateDevices();

        }

    });



    $("#btnTurnAllDevicesOn").on("click", function () {

        if (confirm("Do you want turn all devices on? (**This action reflects in all devices that has an operation on/off)")) {

            toggleDevice($(".deviceClass[data-currentstate='off']"));

            checkStateDevices();

        }

    });



    $("#btnTurnAllDevicesOff").on("click", function () {

        if (confirm("Do you want turn all devices off? (**This action reflects in all devices that has an operation on/off)")) {

            toggleDevice($(".deviceClass[data-currentstate='on']"));

            checkStateDevices();

        }

    });



    $("#btnOpenAllDevices").on("click", function () {

        if (confirm("Do you want open all devices? (**This action reflects in all devices that has an operation open/close)")) {

            toggleDevice($(".deviceClass[data-currentstate='closed']"));

            checkStateDevices();

        }

    });



    $("#btnCloseAllDevices").on("click", function () {

        if (confirm("Do you want close all devices? (**This action reflects in all devices that has an operation open/close)")) {

            toggleDevice($(".deviceClass[data-currentstate='opened']"));

            checkStateDevices();

        }

    });

}

function toggleDevice(listDevices) {



    $.each(listDevices, function (i, item) {



        switch ($(item).attr("data-typeDevice")) {

            case 'light': {

                if ($(item).attr("data-currentState") == "off") {

                    $(item).attr("src", imgLightOn);

                    $(item).attr("data-currentstate", "on");

                } else {

                    $(item).attr("src", imgLightOff);

                    $(item).attr("data-currentstate", "off");

                }

                break;

            }

            case 'lamp': {

                if ($(item).attr("data-currentState") == "off") {

                    $(item).attr("src", imgLampOn);

                    $(item).attr("data-currentstate", "on");

                } else {

                    $(item).attr("src", imgLampOff);

                    $(item).attr("data-currentstate", "off");

                }

                break;

            }

            case 'gate': {

                if ($(item).attr("data-currentState") == "closed") {

                    $(item).attr("src", imgGateOpened);

                    $(item).attr("data-currentstate", "opened");

                } else {

                    $(item).attr("src", imgGateClosed);

                    $(item).attr("data-currentstate", "closed");

                }

                break;

            }

            default: {

                if ($(item).attr("data-currentState") == "off") {

                    $(item).attr("src", imgGenericDeviceOn);

                    $(item).attr("data-currentstate", "on");

                } else {

                    $(item).attr("src", imgGenericDeviceOff);

                    $(item).attr("data-currentstate", "off");

                }

                break;

            }

        }

    });

}

function checkStateDevices() {



    $("#btnTurnAllDevicesOn").prop("disabled", $(".deviceClass[data-currentstate='off']").length > 0 ? false : true);//at least 1 device off to enable button (All Devices ON);

    $("#btnTurnAllDevicesOff").prop("disabled", $(".deviceClass[data-currentstate='on']").length > 0 ? false : true);//at least 1 device on to enable button (All Devices OFF);

    $("#btnOpenAllDevices").prop("disabled", $(".deviceClass[data-currentstate='closed']").length > 0 ? false : true);//at least 1 device closed to enable button (Open All Devices);

    $("#btnCloseAllDevices").prop("disabled", $(".deviceClass[data-currentstate='opened']").length > 0 ? false : true);//at least 1 device opened to enable button (Close All Devices);



}

function callCommandByAjax(_command, _idDevice) {

    var customViewModuleRequest = {
        "command": _command,
        "idDevice": _idDevice
    };

    //TODO: fix problems with CORS: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    $.ajax({
        type: "POST",
        url: 'https://5f07b66b.ngrok.io/api/HomeAssistant/DeviceRequestCommandCustomViewModule',
        data: customViewModuleRequest,
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, status, error) {
            alert("error: " + JSON.stringify(xhr));
            //ToastrMessage("", "Something went wrong to load Tasks list!");
        }
    });
}