

var socket = io();

function scrollToBottom () {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');


  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, (err) => {
    if(err){
      window.location.href = '/';
    } else {
      console.log('No error');
    }

  });
});
socket.on('disconnect', function () {
  console.log("Disconnected from server");
});

socket.on('updateUserList', function (users) {
  var ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
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
  scrollToBottom();

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
  scrollToBottom();
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();


    socket.emit('createMessage', {
      text: $('[name=message]').val()
    }, function () {
      $('[name=message]').val('');
      $('[name=message]').focus();
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
