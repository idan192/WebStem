$(function() {

	$('.social a').switcher();

	var error = false;
	
	$("input,textarea").focus(function() {
		$(this).removeClass("error");
		error = false;
	});

	$('.email').click(function(e) {
		if($(window).width() > 640)
		{
			e.preventDefault();
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		}
	});

	$("#submit").click(function(e) {
		var fields = {
			name	:	$("#name"),
			email	:	$("#email"),
			subject	:	$("#subject"),
			message	:	$("#message")
		};
		
		if(fields.name.val()=="") { fields.name.addClass("error"); error = true; }
		if(fields.email.val()=="") { 
			fields.email.addClass("error"); 
			error = true; 
		} else {
			var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if(!reg.test(fields.email.val())) {
				fields.email.addClass("error"); 
				error = true;
			}
		}
		if(fields.subject.val()=="") { fields.subject.addClass("error"); error = true; }
		if(fields.message.val()=="") { fields.message.addClass("error"); error = true; }
		
		if(!error) {
			$.ajax({
				type: $("form").attr("method"),
				url: $("form").attr("action"),
				data: "name=" + $("#name").val() + "&email=" + $("#email").val() + "&subject=" + $("#subject").val() + "&budget=" + $("#budget").val() + "&message=" + $("#message").val().replace('&','%26'),
				beforeSend: function() {
					$("#status button").hide();
				},
				success: function(html) {
					$("#status #success").html(html).show();
				},
				error: function(html) {
					$("#status button").show();
					$("#status #error").html(html).show();
				}
			});
		}
		e.preventDefault()
	});
});
