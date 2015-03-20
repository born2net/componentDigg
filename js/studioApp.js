var x2js = new X2JS();
var m_data = {};

/**
 LOAD: popular the UI with from local msdb onto UI
 @method setData
 @param {XML} i_xmlData
 **/

function setData(i_xmlData) {

    m_data = x2js.xml_str2json(i_xmlData);

    // set background color
    if (m_data.Data._bgColor != null) {
        $("#bgColor").val(m_data.Data._bgColor).change();
        var radios = $("input[type='radio']");
        var speed = radios.filter(":checked").val();
    }

    // set speed
    if (m_data.Data._speed != null) {
        var speed = m_data.Data._speed;
        $("input[name=speed][value=" + speed + "]").prop('checked', true);
    }
}

/**
 SAVE: get settings from UI and save to local msdb
 @method getData
 @return {XML} json to xml data
 **/
function getData() {
    m_data = {Data: {}};

    // get background color
    m_data.Data._bgColor = document.getElementById('bgColor').value;

    // get speed
    var radios = $("input[type='radio']");
    var speed = radios.filter(":checked").val();
    m_data.Data._speed = speed;

    // return data as xml
    return x2js.json2xml_str(m_data);
}

$(document).ready(function () {
    $('#bgColor').colorPicker();
});



