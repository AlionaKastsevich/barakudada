(function(){
	var i=0;
	function setColor(){
		var colors=['#6B80DD','#00A4B9','#C45381','#E7654E'];
		return colors[Math.floor(Math.random()*4)]
	};

	function setText(){
		var phrases=['Dashing through the snow','In a one-horse open sleigh','Oh the fields we go,','Laughing all the way',
					'Bells on bobtail ring','Making spirits bright','What fun it is to ride and sing',
					'A sleighing song tonight!', 'Jingle bells, jingle bells,','Jingle all the way.',
					'Oh! what fun it is to ride','In a one-horse open sleigh.'];
		var userPhrase=document.getElementById("userText");
		var result=userPhrase.value;
		if (!result) {
			result=phrases[i];
			i++;
			if (i===12) { i=0 }
		};
		userPhrase.value='';
		return result;
	};
	function addToast(){
		var toast=document.createElement('li');
		var text=document.createTextNode(setText());
		var color=setColor();
		var parent=document.getElementById('toastWrap');
		toast.appendChild(text);
		toast.style.backgroundColor=color;
		parent.appendChild(toast);
	};
	function disp(){
		var circle=document.getElementById('circle')
		var wrapForIntro=document.getElementById("wrapForIntro");
		circle.classList.add('show');
		wrapForIntro.classList.add('hidden');
	}
	
	function remove(e){
		var target=e.target;
		var thought=document.getElementById('thought');
		target.parentNode.removeChild(target);
		thought.classList.add('show');
		thought.addEventListener('webkitAnimationEnd',removeClass);
		thought.addEventListener('animationend',removeClass);
		function removeClass(){thought.classList.remove('show')}
	}
	document.getElementById("toastWrap").addEventListener("webkitAnimationEnd",remove);
	document.getElementById("toastWrap").addEventListener("animationend",remove);
	document.getElementById("send").addEventListener("click", addToast)
	document.getElementById("intro").addEventListener("webkitAnimationEnd", disp)
	document.getElementById("intro").addEventListener("animationend", disp)
	

})()