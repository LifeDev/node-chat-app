

var socket = io();
socket.on('connect', function () {
  console.log("Connected to server");

});
socket.on('disconnect', function () {
  console.log("Disconnected from server");
});

socket.on('newMessage', function (message) {
  var newFormattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: newFormattedTime,
    text: message.text
  });

  $('#messages').append(html);

});
socket.on('newLocationMessage', function(message) {
  var newFormattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: newFormattedTime,
    url: message.url
  });

  $('#messages').append(html);

});

$('#message-form').on('submit', function (e) {
  e.preventDefault();


    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function () {
      $('[name=message]').val('');
    });



});

var locationButton = $("#send-location-button");

locationButton.on('click', () => {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(error){
    alert("Unable to get location");
  });
});
