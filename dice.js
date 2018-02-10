function gendiv(cur, risk){
	
	if(risk == 0){
		risk = 'Risk: <span style="color:green;">LOW </span>';
	}else if(risk == 1){
		risk = 'Risk: <span style="color:orange;">MEDIUM </span>';
	}else{
		risk = 'Risk: <span style="color:red;">HIGH </span>';;
	}
	
		$('body').append('<div style="position: absolute; z-index:93999; bottom:8px; left:8px; background-color:white; width:200px; height:400px; border-radius: 10px; border: 0px ridge black; box-shadow: 0 0 10px rgba(0,0,0,0.5); padding: 5px;"><center>DiceBot </center> <br> Coin: '+cur+' <br> '+risk+' <br> Winning: <span id="winlog"> </span> <hr><center> LOG </center> <br><div class="prokrutka" style="height: 200px; width: 200px; overflow-y: scroll;"></div> <hr> <center> For stoppage close the tab or reload the page.  <br> Donate BTC: <span style="font-size: 7pt;">14LXh1x4cGm9gRr6ucMs3ajQ2XFwLRp2So</span> <div style="display:none"><p id="syslogbet"></p><p id="syslogwin"></p></div></center> </div>');
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function dice(bet, cur, risk, b1){
	erbet = bet;
	$(".prokrutka").prepend("BET "+bet+"<br>");
	$("#syslogbet").text(+$("#syslogbet").text()+ +bet);

	sleep(2000);

	$.post("/ajax/system_dice.php", { method: "dice_play", csrf_token: $("#csrf_token").val(), locale:"en", currency: cur, bet: bet, type:1 })
	
	.done(function(data) {
	  var myObj = JSON.parse(data);
	  if(myObj.win == 0){
		  bet = bet * risk; dice(bet.toFixed(8), cur, risk, b1);
	  }else{ 
	  	  $(".prokrutka").prepend("<b style='color:orange;'> WIN "+(bet*2)+"</b><br>"); 
	  	  $("#syslogwin").text(+$("#syslogwin").text()+ +bet*2);  
	  	  $("#winlog").text((+$("#syslogwin").text() - +$("#syslogbet").text()).toFixed(8));
	  	  dice(b1, cur, risk, b1); 	  	  
	  }
	}).fail(function() {
	    dice(erbet, cur, risk, b1);
	  });
}


function startdice(balance, cur, risk){
	if(risk == 0){
		risk = 2;
		step=16;
	}else if(risk == 1){
		risk = 2.1;
		step=15;
	}else{
		risk = 3;
		step=14;
	}
	
	bn = balance/risk; 
	b1 = (bn/Math.pow(risk,(step-1))).toFixed(8);
	
    dice(b1, cur, risk, b1);
}

