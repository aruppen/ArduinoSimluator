if (!($('#log1').length <= 0)) {
    console.log('Element found');

}

function updateComPort(arduino){

    $('.'+arduino).each(function(index){
        $(this).removeClass('com1').addClass('com3');

    });
}

function xwotcallback(arduino)
{
    var serialPort = $('.'+arduino+" #serialPortSelector option:selected").val()
    console.log('Updating Arduino: '+arduino+" on serial port "+serialPort);
    var jsonText = {'serialPort' : serialPort, 'data' : {}}
    $('.'+arduino+' .xwot').each(function( index ) {
        var hwname = $(this).attr('id');
        var value = "";
        if($(this ).hasClass('sensor') )
        {
            value = $( this ).val();
            $('#'+hwname+"text").text(value)
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
        url:'/arduino/'+type,
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
