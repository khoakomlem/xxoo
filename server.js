var port =  process.env.PORT || 3000;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.get('/', function(req, res){
	var express=require('express');
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname, 'index.html'));
});
var board={};
var idserver=[];
var text=[];
var danh=[];
function make2DArray(col, row, vf){
	var arr=new Array(col);
	for (var m=0; m<col; m++){
		arr[m]=new Array(row);
		arr[m].fill(vf);
	}
	return arr;
}
var check={};
var room={};
io.on('connection', function(socket){
	socket.on('create', data=>{
		var t=socket.id;
		check[t]=make2DArray(45,45,'none');
		board[socket.id] = {
			name:data.name,
			mode:data.mode,
			text:data.text,
			players:data.players,
			time:data.time,
			room:socket.id
		} 
		room[socket.id]={
			player1:socket.id,
			player2:''
		}
		danh[socket.id]=true;
		socket.join(socket.id);
		idserver.push(socket.id);
		io.emit('board',board,idserver);
	});
	socket.on('disconnect', ()=>{
		for (var i in room){
			if (room[i].player1==socket.id || room[i].player2==socket.id){
				io.sockets.in(room[i].player1).emit('exit','dis');
				var j=-1;
				for (var k in idserver){
					j++;
					if (idserver[k]==room[i].player1){
						idserver.splice(j,1);
						delete board[idserver[k]];
						break;
					}
				}
				break;
			}
		};
	});
	socket.on('disconnect2', ()=>{
		for (var i in room){
			if (room[i].player1==socket.id || room[i].player2==socket.id){
				io.sockets.in(room[i].player1).emit('exit','dis');
				var j=-1;
				for (var k in idserver){
					j++;
					if (idserver[k]==room[i].player1){
						idserver.splice(j,1);
						delete board[idserver[k]];
						break;
					}
				}
				break;
			}
		};
	})

	socket.on('move', (x,y,id)=>{
		
		try{
		check[id][y][x]=text[socket.id];
		if (danh[socket.id]==false){
			return 0;
		}
		if (danh[room[id].player1])
			danh[room[id].player1]=false;
		else
			danh[room[id].player1]=true;

		if (danh[room[id].player2])
			danh[room[id].player2]=false;
		else
			danh[room[id].player2]=true;
		}
		catch(err){
			console.log(err);
		}
		var move={
			x:x,
			y:y,
			text:text[socket.id]
		}
		// console.log(text);
		var chainx=0;
		var chaino=0;
		io.sockets.in(id).emit('move', move, socket.id);
		//ngang
		for (y=1; y<=20; y++)
			for (x=1; x<=40; x++){
				if (check[id][y][x]=='X') {
					chainx++;
					chaino=0;
				}
				if (check[id][y][x]=='O') {
					chaino++;
					chainx=0;
				}
				if (check[id][y][x]=='none'){
					chainx=0;
					chaino=0;
				}
				if (chainx>=5)
					io.sockets.in(id).emit('ketqua','player1');
				if (chaino>=5)
					io.sockets.in(id).emit('ketqua','player2');
				if (chainx>=5 || chaino>=5){
					io.sockets.in(id).emit('exit','end');
					var j=-1;
					for (var k in idserver){
						j++;
						if (idserver[k]==id){
							idserver.splice(j,1);
							delete board[idserver[k]];
							break;
						}
					}
					chainx=0;
					chaino=0;
					break;
				}
			}

		//doc
		chainx=0;
		chaino=0;
		for (x=1; x<=40; x++)
			for (y=1; y<=20; y++){
				if (check[id][y][x]=='X') {
					chainx++;
					chaino=0;
				}
				if (check[id][y][x]=='O') {
					chaino++;
					chainx=0;
				}
				if (check[id][y][x]=='none'){
					chainx=0;
					chaino=0;
				}
				if (chainx>=5)
					io.sockets.in(id).emit('ketqua','player1');
				if (chaino>=5)
					io.sockets.in(id).emit('ketqua','player2');
				if (chainx>=5 || chaino>=5){
					io.sockets.in(id).emit('exit','end');
					var j=-1;
					for (var k in idserver){
						j++;
						if (idserver[k]==id){
							idserver.splice(j,1);
							delete board[idserver[k]];
							break;
						}
					}
					chainx=0;
					chaino=0;
					break;
				}
			}
		//cheo trái sang phải
		chainx=0;
		chaino=0;
		var p=0;var tmp=0;
		var x=0; var y=0;
		while (x!=40 || y!=20){
			p++;
			if (p>40) {p=40;tmp++};
			x=p;
			y=tmp;
			for (x=p; x>=1; x--){
				y++;
				if (y>20) {y=20;break;}
				if (check[id][y][x]=='X') {
					chainx++;
					chaino=0;
				}
				if (check[id][y][x]=='O') {
					chaino++;
					chainx=0;
				}
				if (check[id][y][x]=='none'){
					chainx=0;
					chaino=0;
				}
				if (chainx>=5)
					io.sockets.in(id).emit('ketqua','player1');
				if (chaino>=5)
					io.sockets.in(id).emit('ketqua','player2');
				if (chainx>=5 || chaino>=5){
					io.sockets.in(id).emit('exit','end');
					var j=-1;
					for (var k in idserver){
						j++;
						if (idserver[k]==id){
							idserver.splice(j,1);
							delete board[idserver[k]];
							break;
						}
					}
					chainx=0;
					chaino=0;
					break;
				}
			}
		
		}
		chainx=0;
		chaino=0;
		var p=21;var tmp=0;
		var x=1; var y=0;
		while (x!=40 || y!=1){
			p--;
			if (p<1) {p=1;tmp++};
			x=tmp;
			for (y=p; y<=20; y++){
				x++;
				if (x>40) {x=40;break;}
				if (check[id][y][x]=='X') {
					chainx++;
					chaino=0;
				}
				if (check[id][y][x]=='O') {
					chaino++;
					chainx=0;
				}
				if (check[id][y][x]=='none'){
					chainx=0;
					chaino=0;
				}
				if (chainx>=5)
					io.sockets.in(id).emit('ketqua','player1');
				if (chaino>=5)
					io.sockets.in(id).emit('ketqua','player2');
				if (chainx>=5 || chaino>=5){
					io.sockets.in(id).emit('exit','end');
					var j=-1;
					for (var k in idserver){
						j++;
						if (idserver[k]==id){
							idserver.splice(j,1);
							delete board[idserver[k]];
							break;
						}
					}
					chainx=0;
					chaino=0;
					break;
				}
				
			}
		}

	});

	socket.on('join', id=>{
		
		if (room[id].player2==''){
			socket.join(id);
			board[id].players=2;
			io.sockets.in(id).emit('message', socket.id+'has joined the game!');
			io.sockets.in(id).emit('message', 'chủ phòng will go first!');
			io.sockets.in(socket.id).emit('join success', id);
			room[id].player2=socket.id;
			text[room[id].player1]='X';
			danh[room[id].player1]=true;
			danh[socket.id]=false;
			text[socket.id]='O';
		} else {
			socket.emit('join failed', id);
		}
		
		
	})	

});
http.listen(port, function(){
	console.log('listening on *:'+port);
});
setInterval(function(){
	io.emit('board',board,idserver);
	// console.log(id);
},1000);