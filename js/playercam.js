window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //AJAX data request sent to server(in this case server being local json file)
	var streamJSON = '../sc/streamcontrol.json'; //specifies path for streamcontrol output json
	var scObj; //variable to hold data extracted from parsed json
	var startup = true; //flag for if looping functions are on their first pass or not
	var animated = false;
	var cBust = 0; //variable to hold cache busting value
	var com1Wrap = $('#com1Title'); //variables to shortcut copypasting text resize functions
	var fullWrap = $('.wrappers');
	var com2Wrap = $('#com2Wrapper');
	
	xhr.overrideMimeType('application/json'); //explicitly declares that json should always be processed as a json filetype
	
	function pollJSON() {
		xhr.open('GET',streamJSON+'?v='+cBust,true); //string query-style cache busting, forces non-cached new version of json to be opened each time
		xhr.send();
		cBust++;		
	}
	
	pollJSON();
	setInterval(function(){pollJSON();},1000); //runs polling function twice per second
	
	xhr.onreadystatechange = parseJSON; //runs parseJSON function every time XMLHttpRequest ready state changes
	
	function parseJSON() {
		if(xhr.readyState === 4){ //loads data from json into scObj variable each time that XMLHttpRequest ready state reports back as '4'(successful)
			scObj = JSON.parse(xhr.responseText);
			if(animated == true){
				comm(); 
			}
		}
	}
	
	function comm(){
		if(startup==true){
			game = scObj['game'];
			$('#gameHold').html(game);
			$('#commVid').attr('src','../webm/commentary_2.webm');
			document.getElementById('commVid').play();
			getData(); //runs function that sets data polled from json into html objects
			startup = false; //flags that the scoreboard/getData functions have run their first pass
			animated = true;
			
		}
		else{
			getData();
		}
		
	}
	setTimeout(comm, 1000);
	function getData(){
		var lName=scObj['p2Name'];
		var lSocial=scObj['lSocial'];
		var rName=scObj['p1Name'];
		var rSocial=scObj['rSocial'];
		if(startup == true){
			
			TweenMax.set('#com1Wrapper',{css:{x: p1Move}});
			TweenMax.set('#com2Wrapper',{css:{x: p2Move}});
			$('#com1Title').html(lName);
			$('#com2Title').html(rName);
			$('#com1Social').html(lSocial);
			$('#com2Social').html(rSocial);
			
			com1Wrap.each(function(i, com1Wrap){ //function to resize font if text string is too long and causes div to overflow its width/height boundaries
				while(com1Wrap.scrollWidth > com1Wrap.offsetWidth || com1Wrap.scrollHeight > com1Wrap.offsetHeight){
					var newFontSize = (parseFloat($(com1Wrap).css('font-size').slice(0,-2)) * .95) + 'px';
					$(com1Wrap).css('font-size', newFontSize);
				}
			});
			TweenMax.to('#com1Wrapper',nameTime,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:nameDelay}); //animates wrappers traveling back to default css positions while
			TweenMax.to('#com2Wrapper',nameTime,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:nameDelay}); //fading them in, timing/delay based on variables set in scoreboard.html
			
		}
		else{
			game = scObj['game']; //if this is after the first time that getData function has run, changes the value of the local game variable to current json output
			
			if($('#com1Title').text() != lName ){ //if the name doesn't match, fades out wrapper and updates them both
				TweenMax.to('#com1Title',.3,{css:{x: p1Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //uses onComplete parameter to execute function after TweenMax
					$('#com1Title').css('font-size',nameSize); //restores default font size based on variable set in scoreboard.html
					$('#com1Title').html(lName); //updates name and team html objects with current json values				
			
					
					
					TweenMax.to('#com1Title',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2}); //fades name wrapper back in while moving to original position
				}});
			}
			if($('#com1Social').text() != lSocial ){ //if the name doesn't match, fades out wrapper and updates them both
				TweenMax.to('#com1Social',.3,{css:{x: p1Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //uses onComplete parameter to execute function after TweenMax
					$('#com1Social').css('font-size',socialSize); //restores default font size based on variable set in scoreboard.html
					$('#com1Social').html(lSocial); //updates name and team html objects with current json values				
			
					
					
					TweenMax.to('#com1Social',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2}); //fades name wrapper back in while moving to original position
				}});
			}
			if($('#com2Title').text() != rName ){ //if the name doesn't match, fades out wrapper and updates them both
				TweenMax.to('#com2Title',.3,{css:{x: p1Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //uses onComplete parameter to execute function after TweenMax
					$('#com2Title').css('font-size',nameSize); //restores default font size based on variable set in scoreboard.html
					$('#com2Title').html(rName); //updates name and team html objects with current json values				
			
					
					
					TweenMax.to('#com2Title',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2}); //fades name wrapper back in while moving to original position
				}});
			}
			if($('#com2Social').text() != rSocial ){ //if the name doesn't match, fades out wrapper and updates them both
				TweenMax.to('#com2Social',.3,{css:{x: p1Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //uses onComplete parameter to execute function after TweenMax
					$('#com2Social').css('font-size',socialSize); //restores default font size based on variable set in scoreboard.html
					$('#com2Social').html(rSocial); //updates name and team html objects with current json values				
			
					
					
					TweenMax.to('#com2Social',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2}); //fades name wrapper back in while moving to original position
				}});
			}
		}
	}
}