if (!($('#log1').length <= 0)) {
    console.log('Element found');

}

$('select').on('change', function() {
    console.log( this.value );
});

function updateThermistor(slider, value)
{
    //console.log(this)
    //$('#log1').text(value)
    var temp = $('#thermistor1').val();
    var hum = $('#humidity1').val();
    var com = $("#serialPortSelector1 option:selected").val()
    console.log(com);
    var jsonText={'temp':temp, 'hum':hum, 'com':com};
    $.ajax({url:'', data:jsonText, dataType:'json', cache:false, type:'POST', success:function(data){$('#log1').text(value)}});
    $('#'+slider+'text').text(value)
}

function updateLightBulb(slider, value)
{
    var light = $('#lightsensor').val();
    var onoff = $('#lightswitch').prop('checked')
    var com = $("#serialPortSelector2 option:selected").val()
    console.log(com);
    var jsonText={'light':light, 'switch':onoff, 'com':com};
    $.ajax({url:'', data:jsonText, dataType:'json', cache:false, type:'POST', success:function(data){$('#log3').text(value)}});
    $('#'+slider+'text').text(value);
}

