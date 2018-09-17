$(function() {

  $('#inputForm').submit(function (e){
    e.preventDefault()
    e.stopPropagation()
    var data = getInputs()
    $('#pleaseWait').modal('show'); // loader show
    $.post('/calculate', {
        inputs: data
      },function (data,status,xhr){
        console.log(data)
        $('#pleaseWait').modal('hide');
        if(xhr.status===200){
          $('#error-box').html('')
          $('#pmt').val(data.pmt)
        }
      }).error(function(error){
        $('#pleaseWait').modal('hide');
        $('#error-box').html(error.responseText)
      });
  })

});

function getInputs(){
  return {
    "p": $('#p').val(),
    "i": $('#i').val(),
    "n1": $('#n1').val(),
    "n2": $('#n2').val(),
    "fv": $('#fv').val(),
    "n": $('#n').val(),
    "r": $('#r').val(),
    "pmt": $('#pmt').val()
  }
}