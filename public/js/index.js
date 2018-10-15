

var socket = io();
socket.on('connect', function () {
  console.log("Connected to server");

});
socket.on('disconnect', function () {
  console.log("Disconnected from server");
});

socket.on('newMessage', function (data) {
  var newFormattedTime = moment(data.createdAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${data.from} ${newFormattedTime}: ${data.text}`)

  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var newFormattedTime = moment(message.createdAt).format('h:mm a');

  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  console.log(li);
  console.log(a);
  li.text(`${message.from} ${newFormattedTime}: `);
  a.attr('href', message.url);

  li.append(a);

  $('#messages').append(li);
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
