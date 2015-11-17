
$(document).ready(function(){

	// once question tags submitted, send ajax request to stackoverfolow
	function findUnanswered(questionTags) {
		getUnansweredQuestions(questionTags);
	}

	// when answer comes back create the # of reults and tag(s) used
	function createQuestionCountHTML(questionNum, questionTags){
		var questionCountHTML = '<p>' + questionNum + ' results for <strong>' +
								questionTags + '</strong></p>';
		return questionCountHTML;
	}

	//clone question template and insert data into it
	function createHtmlForQuestion(question) {

		//clone the template code
		var questionHTML = $('.templates .question').clone();

		// enter question data into template
		var questionElem = questionHTML.find('.question-text a');
		questionElem.attr('href', question.link);
		questionElem.text(question.title);

		// enter date asked data into template
		var dateElem = questionHTML.find('.asked-date');
		var date = new Date(1000*question.creation_date);
		dateElem.text(date.toString());

		//enter the viewed data into template
		var viewedElem = questionHTML.find('.viewed');
		viewedElem.text(question.view_count);

		// enter the asker with link to profile
		var askerElem = questionHTML.find('.asker');
		askerElem.html('<p>Name: <a target="blank" href="http://stackoverflow.com/users/' +
						question.owner.user_id + '">' + question.owner.display_name + '</a></p>'+
						'<p>Reputation: ' + question.owner.reputation + '</p>' );

		return questionHTML;

	}




	//set up the get request for the unanswered questions
	function getUnansweredQuestions(questionTags){

		// set up the parameters tos end to SatckOverflow
		var questionRequest = {
			tagged: questionTags,
			site: 'stackoverflow',
			order: 'desc',
			sort: 'creation'
		};

		// ask for jQuery ajax request with the data parameters set up apove
		$.ajax({
			url: "http://api.stackexchange.com/2.2/questions/unanswered",
			data: questionRequest,
			dataType: "jsonp",
			type: "GET",
			})

		// if we get back answers...
		.done(function(returnedData){

			//create and add HTML for question count to results div
			var questionCountAlert = createQuestionCountHTML(returnedData.items.length, questionRequest.tagged);
			$('.search-results').html(questionCountAlert);

			// iterate through each array item and create htnl for it
			$.each(returnedData.items, function(i, item){
				var createNewQuestionHTML = createHtmlForQuestion(item);
				$('.results').append(createNewQuestionHTML);


			});
		
		})

		// if ajax call doesnt work...
		.fail (function(){
			console.log('request failed!');

		});

	}





	// once best answerer tags submitted, send ajax request to stackoverfolow
	function findBestAnswers(answerSubjectTags) {
		getBestAnswerers(answerSubjectTags);
	}



	//set up the get request for the best answerers
	function getBestAnswerers(answerSubjectTags){

			var AnswererInfoRequest = {
				tag: answerSubjectTags,
				site: 'stackoverflow',
				period: 'all_time'
			};

			$.ajax({
				url: "http://api.stackexchange.com/2.2/tags/" + AnswererInfoRequest.tag + 
					"/top-answerers/" + AnswererInfoRequest.period,
				data: AnswererInfoRequest,
				dataType: "jsonp",
				type: "GET"	
				})

			//if the an answer comes back...
			.done(function(returnedData){
				console.log(returnedData.items);

				//create and add HTML for question count to results div
				var questionCountAlert = createQuestionCountHTML(returnedData.items.length, AnswererInfoRequest.tag);
				$('.search-results').html(questionCountAlert);

				// iterate through each array item and create htnl for it
				$.each(returnedData.items, function(i, item){
					var createNewAnswererHTML = createHtmlForAnswerer(item, AnswererInfoRequest.tag);
					$('.results').append(createNewAnswererHTML);

				});
			})

		// if ajax call doesnt work...
		.fail (function(){
			console.log('request failed!');

		});

	}

	//clone best anwserers template and insert data into it
	function createHtmlForAnswerer(answerer, topic) {

		//clone the template code
		var answererHTML = $('.templates .answer').clone();

		// set image into template
		var champPic = answererHTML.find('img.answerChamp');
		champPic.attr('src', answerer.user.profile_image);
		champPic.attr('alt', 'picture of ' + answerer.user.display_name);

		// set link into image in template
		var champPicLink = answererHTML.find('a.imageLink');
		champPicLink.attr('href', answerer.user.link);



		//enter name an link into template
		var champName = answererHTML.find('.champName a');
		champName.text(answerer.user.display_name);
		champName.attr('href', answerer.user.link);

		// enter link to list of topic questions
		var champAnswers = answererHTML.find('.champAnswers a');
		champAnswers.attr('href', 'http://stackoverflow.com/search?q=user:' +
							answerer.user.user_id + '+' + topic + ']');
		champAnswers.text('Posts made by ' + answerer.user.display_name + ' for ' + topic);

		// enter the count of posts by chamo answerer for topc
		var champTopicCountTopic = answererHTML.find('.champTopicCount em');
		var champTopicCount = answererHTML.find('.champTopicCount span');
		champTopicCountTopic.text(topic);
		champTopicCount.text(answerer.post_count);

		return answererHTML;

	}





	//Set up submit function for unanswered question finder
	$('.unanswered-getter').submit(function(){
		//empy any previous posted data
		$('.results').html('');

		//get the value of submit
		var questionTags = $(this).find("input[name='tags']").val();

		//run function for posting data with submited tags
		findUnanswered(questionTags);
	});



	//Set up submit function for best answers finder
	$('.inspiration-getter').submit(function(){
		//empy any previous posted data
		$('.results').html('');

		//get the value of submit
		var answerSubjectTags = $(this).find("input[name='answerers']").val();

		//run function for posting data with submited tags
		findBestAnswers(answerSubjectTags);
	});





}); // end document ready function