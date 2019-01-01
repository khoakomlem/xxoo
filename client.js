var package={
	name:'',
	mode:1,
	text:'',
	players:1,
	time:''
}
var lastid='1 1';
var timeout;
function addTalk(data){
	clearTimeout(timeout);
	$('#talk').html('<p>'+data+'</p>');
	timeout=setTimeout(function(){
		$('#talk p').fadeOut();
	},3000);
}
$('#create').click(function(){
	$('#behind').css('filter','brightness(40%)');
	$('#front').slideDown(500);
});

$('#close').click(function(){
	$('#front').slideUp(10);
	$('#behind').css('filter','brightness(100%)');
})
$('#error').click(function(){
	alert('Vui lòng chụp ảnh màn hình lỗi và gửi cho tui mau !! >:3');
	window.open('http://www.facebook.com/nghienpascal', '_blank');
});
$('#ok').click(function(){
	if ($('#name').val()=='' || $('#text').val()==''){
		return 0;
	}
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	package={
		name:$('#name').val(),
		mode:'1 v 1',
		text:$('#text').val(),
		players:1,
		time:dateTime
	}
	room=socket.id;
	socket.emit('create',package);
	$('#front').slideUp(10);
	$('#behind').css('filter','brightness(100%)');
	$('#man1').fadeOut();
	$('#man2').fadeIn();
	$('#talk').html('<p>WAITING OTHER PLAYERS . . .</p>');
});
$('#exit').click(function(){
	socket.emit('disconnect2');
	setTimeout(function(){
		for (i=1; i<=20; i++){
			for (j=1; j<=40; j++){
				var t=j+' '+i;
				document.getElementById(t).innerHTML='';
				document.getElementById(t).style.backgroundColor='#d8d8d8';
			}
		}
		$('#man1').fadeIn();
		$('#man2').fadeOut();
	})
})
var timeout;
socket.on('message', data=>{
	if (data=='chủ phòng will go first :P'){
		alert('Ping :v');
	}
	addTalk(data);
});
socket.on('move', (data,ids)=>{
	if (ngoai[room].players==1){
		return 0;
	}
	var id=data.x+' '+data.y;
	// alert(id);
	if (ids!=socket.id){
		lastid=id;
		document.getElementById(id).style.backgroundColor='#99e579';
	}
	if (ids==socket.id){
		if (lastid==''){
			lastid=id;
		}
		document.getElementById(lastid).style.backgroundColor='#d8d8d8';
		// document.getElementById(id).style.backgroundColor='#62c162';
	}
	document.getElementById(id).innerHTML='<p>'+data.text+'</p>';
})
socket.on('exit', (reason)=>{
	if (reason=='end')
		addTalk('Trận đã kết thúc!!');
	if (reason=='dis')
		alert('May be someone disconnected then the game ended :(');
	setTimeout(function(){
		for (i=1; i<=20; i++){
			for (j=1; j<=40; j++){
				var t=j+' '+i;
				document.getElementById(t).innerHTML='';
				document.getElementById(t).style.backgroundColor='#d8d8d8';
			}
		}
		$('#front').slideUp(10);
		$('#behind').css('filter','brightness(100%)');
		$('#man1').fadeIn();
		$('#man2').fadeOut();
},2000);
	

})