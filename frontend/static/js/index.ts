import { n2yo_get_radio_passes, gps_position } from './custom_types'

$(document).on('submit', 'form', function (e) {
  get_radio_passes(parseInt($(this).serializeArray()[0].value))

  // stop form submission
  e.preventDefault()
})

function get_radio_passes (norad_id: number) {
  $.ajax({
    url: 'http://localhost:4999/radiopasses',
    data: { norad_id: norad_id },
    type: 'GET',
    dataType: 'json',
    success: function (res: n2yo_get_radio_passes) {
      update_data_field(res)
    }
  })
}

function get_position () {
  $.ajax({
    url: 'http://localhost:4999/position',
    type: 'GET',
    dataType: 'json',
    success: function (res: gps_position) {
      console.log(res)
    }
  })
}

function update_data_field (data: n2yo_get_radio_passes) {
  $('#noradID_result').val(JSON.stringify(data))
}

$('#get_gps').click(function () {
  get_position()
})
