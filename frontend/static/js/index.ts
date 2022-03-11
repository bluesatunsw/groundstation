$(document).on('submit', 'form', function (e) {
  $('#noradID_result').val($(this).serialize())

  // stop form submission
  e.preventDefault()
})
