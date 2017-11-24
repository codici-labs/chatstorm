var http = require('http');
var server = http.createServer();
var io = require('socket.io')(server);



var users_connected = [];
var room = 'CS Room';

io.on('connection', function(socket) {

    socket.on('message', function(msg){
    	
         io.in(room).emit('message', {msg: msg.msg, user: msg.user});
    });


    socket.on('join_room', function(data){

	    socket.join(room);
	    var user_connected = {};
	  
	    user_connected.username = data.user;
	    user_connected.id = socket.id;
	    user_connected.color = socket.client.color;
	   
     
             
      	users_connected.push(user_connected);
	   
	    io.in(room).emit('users_to_me', {users: users_connected});
	    socket.emit('room_joined');
	    //socket.broadcast.emit('users_to', {users: users_connected});
	  });

	

    socket.on('disconnect', function () {
   
	    removeUser(users_connected, 'username', socket.username);
	    io.in(room).emit('users_to_me', {users: users_connected});
	});


});

function removeUser(arr, attr, value){
    var i = arr.length;
   
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}




server.listen(3000, function(){
    console.log('Server started');
});