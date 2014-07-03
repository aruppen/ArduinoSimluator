if (!($('#log1').length <= 0)) {
    console.log('Element found');
    var interval = setInterval(function(){runner();}, 1000);
}

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
}

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

function xwotcallback(arduino)
{
    var serialPort = $('.'+arduino+" #serialPortSelector option:selected").val()
    console.log('Updating Arduino: '+arduino+" on serial port "+serialPort);
    var jsonText = {'serialPort' : serialPort, 'data' : {}}
    $('.'+arduino+' .xwot').each(function( index ) {
        var hwname = $(this).attr('id').replace(/[0-9]+/i, '');
        var value = "";
        if($(this ).hasClass('sensor') )
        {
            value = $( this ).val();
            $('.'+arduino+' #'+hwname+"text").text(value)
            console.log( index + ": (Got A sensor "+hwname+") " + value);
        }
        else
        {
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

function removeArduino(arduino)
{
    $('.'+arduino).remove();
}

function getLine(comPort)
{
    $.ajax({
        url:'serial?sp='+comPort,
        type:'GET',
        success:function(data){
            console.log(data);
            console.log(data["serialPort"]);
            console.log(data["data"]["temperature"]);

            //$('div:regex(class, arduino[0-9]+).COM1 #temperature').val(data["data"]["temperature"]);
            $.each(data['data'], function(key, value) {
                console.log( "The key is '" + key + "' and the value is '" + value + "'" );
                $('div:regex(class, arduino[0-9]+).'+comPort+' #'+key).val(value);
            });
        }
    });
}

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
        console.log("will update "+comPort)
        getLine(comPort);
    });
}