$(document).ready(function(){

    $("#rightImg").on("click",function() {
      $('#rightImg').addClass('rotate-left').delay(300).fadeOut(200, function() {
	    updater();
	    $('#rightImg').find('.status').remove();
		$('#rightImg').removeClass('rotate-left rotate-right').fadeIn(700);});
      $('#rightImg').append('<div class="status like">Right!</div>');      
    });  

	$("#leftImg").on("click",function() {
      $('#leftImg').addClass('rotate-right').delay(300).fadeOut(200, function() {
		updater();
	    $('#leftImg').find('.status').remove();
		$('#leftImg').removeClass('rotate-left rotate-right').fadeIn(700);});
      $('#leftImg').append('<div class="status dislike">Left!</div>');      
    });
});

