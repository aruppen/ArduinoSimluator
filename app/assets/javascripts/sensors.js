if (!($('#log1').length <= 0)) {
    console.log('Element found');

}

$('select').on('change', function() {
    console.log( this.value );
});

function updateThermistor(slider, value, comselector)
{
    //console.log(this)
    console.log("hi2")
    console.log(slider)
    $('#log1').text(value)
    var temp = $('#thermistor1').val();
    var hum = $('#humidity1').val();
    var com = $("#serialPortSelector1 option:selected").val()
    console.log(com);
    var jsonText={'temp':temp, 'hum':hum, 'com':com};
    $.ajax({url:'', data:jsonText, dataType:'json', cache:false, type:'POST', success:function(data){$('#'+slider+'text').text(data['value'])}})
}

