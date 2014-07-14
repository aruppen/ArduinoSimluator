if (!($('#log1').length <= 0)) {
    console.log('Element found');
    var interval = setInterval(function(){runner();}, 1000);
    // can be stopped with:
    // window.clearInterval(interval)
}

/*
 *  This is the Regex Selector for JQuery by J. Padolesy
 *  More information:
 *  http://james.padolsey.com/javascript/regex-selector-for-jquery/
 */
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

/**
 * Each Arduino Panel has an option-select called #serialPortSelector. When a serial port is select, this needs
 * to be reflected in the class of the corresponding Arduino Panel. This is important to route incoming messages
 * to the right Arduino board
 * @param arduino The Arduino board to which the #serialPortSelector belongs to
 * @param option The #serialPortSelector itself
 */
function updateComPort(arduino, option){
    var selectedOption = option.value;
    console.log(selectedOption);
    var arduinoclasses = $('.'+arduino).attr('class').split(' ');
    var oldCom;
    for(var i in arduinoclasses)
    {
        if(arduinoclasses[i].match(/COM/g))
        {
            oldCom = arduinoclasses[i];
        }
    }
    console.log("OldCom: "+oldCom);
    $('.'+arduino).each(function(index){
        if(oldCom == undefined)
        {
            $(this).addClass(selectedOption);
        }
        else
        {
            $(this).removeClass(oldCom).addClass(selectedOption);
        }

    });
}
/**
 * Generic function which is called when one of the elements of an Arduino board changes. The method iterates over
 * all sensors and actuators of this Arduino, creates a JSON message representing the new state of this board
 * and sends it with a POST back to the controller.
 *
 * @param arduino the Arduino Panel which is updated.
 */
function xwotcallback(arduino)
{
    var serialPort = $('.'+arduino+" #serialPortSelector option:selected").val();
    console.log('Updating Arduino: '+arduino+" on serial port "+serialPort);
    var jsonText = {'serialPort' : serialPort, 'data' : {}};
    $('.'+arduino+' .xwot').each(function( index ) {

        var value = "";
        if($(this ).hasClass('sensor') )
        {
            var hwname = $(this).attr('id').replace(/[0-9]+/i, '');
            value = $( this ).val();
            $('.'+arduino+' #'+hwname+"text").text(value);
            console.log( index + ": (Got A sensor "+hwname+") " + value);
        }
        else
        {
            var hwname = $(this).attr('id')//.replace(/[0-9]+/i, '');
            value = $( this ).prop('checked');
            console.log( index + ": (Got An Acutator"+hwname+") " +  value);
        }
        var jsonElement = {};
        jsonElement[hwname] = value;
        jsonText.data[hwname] = value;
    });
    console.log(jsonText);
    $.ajax({
        url:'', data:jsonText,
        dataType:'json',
        cache:false,
        type:'POST',
        success:function(data){
            console.log("Sucess");
        }
    });
}

/**
 * Add a new "type" of Arduino Board to the instantiated boards. This is used for the onclick events on the menu.
 *
 * @param type The selected Arduino Board to create.
 */
function instantiateArduino(type)
{
    $.ajax({
        url:'addArduino?type='+type,
        type:'GET',
        success:function(data){
            console.log("Sucess");
            $('#arduinoContainer').append(data.value);
        }
    });
}

/**
 * Removes and Arduino Baord from the instantiated boards.
 *
 * @param arduino The Arduino Board to remove.
 */
function removeArduino(arduino)
{
    $('.'+arduino).remove();
}

/**
 * Asks the controller for a new line receivec on the serial bus on a given Socket. Upon receiving the response
 * from the controller, the Arduino Board currently communicating on the specified "comPort" is updated with
 * the received values.
 *
 * @param comPort the serial port on which to look for new data.
 */
function getLine(comPort)
{
    $.ajax({
        url:'serial?sp='+comPort,
        type:'GET',
        success:function(data){
            //console.log(data);
            //console.log(data["serialPort"]);
            $.each(data['data'], function(key, value) {
                console.log( "The key is '" + key + "' and the value is '" + value + "'" );
                if($('div:regex(class, arduino[0-9]+).'+comPort+' #'+key ).hasClass('sensor') )
                {
                    $('div:regex(class, arduino[0-9]+).'+comPort+' #'+key).val(value);
                }
                else
                {
                    $('div:regex(class, arduino[0-9]+).'+comPort+' #'+key).prop('checked', $.parseJSON(value));
                }

            });
        }
    });
}

/**
 * Helper function which iterates over all instantiated Arduino Boards. For each board, the getLine(comPort)
 * method is called.
 * This method can be used in the setInterval for a polling approach to update the instantiated Arduino Boards with
 * messages received on their corresponding serial bus.
 */
function runner()
{
    $('div:regex(class, arduino[0-9]+):regex(class, COM[0-9])').each(function(){

        var arduinoclasses = $(this).attr('class').split(' ');
        var comPort;
        for(var i in arduinoclasses)
        {
            if(arduinoclasses[i].match(/COM/g))
            {
                comPort = arduinoclasses[i];
            }
        }
        //console.log("will update "+comPort)
        getLine(comPort);
    });
}