//load layout for all app

//load navbar
$(document).ready(function(){
	$('#navbar-container').load('Layout.html #navbar-container')
});

//load menu
$(document).ready(function(){
	$('#mainMenuModal-container').load('Layout.html #mainMenuModal-container')
});

//load branch modal
$(document).ready(function(){
	$('#branchModal-container').load('Layout.html #branchModal-container')
});

//load login moadal
$(document).ready(function(){
	$('#LoginModal-container').load('Layout.html #LoginModal-container')
	$('#LogoutModal-container').load('Layout.html #LogoutModal-container')
});

//laod overlay - loader
$(document).ready(function(){
	$('#overlay-container').load('Layout.html #overlay-container')
});

//select item count Modal
$(document).ready(function(){
	$('#select-item-count-Modal-container').load('Layout.html #select-item-count-Modal-container')
});
