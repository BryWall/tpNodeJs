$(function () {
    const server = 'http://localhost:'+ '3002' // a changer
    var socket = io(server);
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
});