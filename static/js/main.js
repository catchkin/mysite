let userId_arr=[];
let question_list={};
let messageCount=0;
let chartFunctionObj = {
		chatClass : ""
		,chatTag : null
		,chatTime : ""
};

$(document).ready(function(){

	let userId = $('.ck_login').val();
	userId_arr.push(userId)


	if(userId_arr[0] !== ""){
	    $('.messages').empty();
	    getPersonChat(userId_arr[0]);
	}
	greet();

});

function getPositionWord(className){
	className = className.toLowerCase();
	if( className.indexOf("left") ){
		return "left";
	}
	if( className.indexOf("right") ){
		return "right";
	}
}

function Message(arg) {
    this.text = arg.text;
    this.contentType = arg.contentType;
    this.content = arg.content;
    this.message_side = arg.message_side;
    this.scenarioButtons = arg.scenarioButtons;
    this.chatTime = arg.chatTime;
    this.draw = function (_this) {
        return function () {
            let $message;
            $message = $($('.message_template').clone().html());
            /*
            // 챗봇 메뉴 변경
            if(arg.text.indexOf("<div class=catemenu>") != -1){
            	// 챗봇 안내 이미지 삭제
            	$message.find('.avatar').remove();
            	// 챗봇 메뉴 크기 조절 css
            	$message.find('.text_wrapper').css('margin', '0 0 0 5%').css('bottom', '20px');
            	// 챗봇 메뉴 불러오기 및 크기조절 css
            	$message.find('.text').html(_this.text).css('width', '110%');
            	// 챗봇 시간 출력 및 위지 css
              	$message.find('.chatting_time').html(_this.chatTime).css('font-size', '13px').css('margin', '3px 0 0 50');
              	// 챗봇 메뉴 출력(append방식)
              	$('.messages').append($message);
            } else {
            	$message.addClass(_this.message_side).find('.text').html(_this.text);
            	$message.find('.chatting_time').html(_this.chatTime);
            	$('.messages').append($message);
            }
            */
            if(_this.message_side == "left"){

            	var chatbot = '';
            	if($('#chatbotImageUseYn').val() == 'Y'){
                	chatbot += '<i class="cbiCon" style="background:url('+$('#chatbotImage').val()+') no-repeat ;background-size: contain;"></i>'
            	}else{
            		chatbot += '<i class="cbiCon"></i>'
            	}
            	chatbot +=$('#chatbotName').val();
            	$message.find('.name').html(chatbot);

            }

            _this.text = _this.text.replaceAll('\n','<br>');
            $message.addClass(_this.message_side).find('.txt').html(_this.text);
        	$message.find('.date').html(_this.chatTime);
        	$message.find('.out_Btn').html(_this.scenarioButtons)

        	if(_this.contentType == "button"){
        		$message.find('.buttons').html(_this.content)
        	}else if(_this.contentType == "card"){
        		$message.find('.swp_wrap').html(_this.content)
        	}
        	$('.messages').append($message);
			var swiper = new Swiper("#mySwiper"+messageCount, {
		        navigation: {
		          nextEl: "#swiper-button-next"+messageCount,
		          prevEl: "#swiper-button-prev"+messageCount,
		        },
		      });

            if( chartFunctionObj.chatTag == null ){
            	chartFunctionObj.chatClass = getPositionWord(_this.message_side);
            	chartFunctionObj.chatTag = $message;
            	chartFunctionObj.chatTime = _this.chatTime;
            }else if(chartFunctionObj.chatClass != getPositionWord(_this.message_side)){
            	chartFunctionObj.chatClass = getPositionWord(_this.message_side);
            	chartFunctionObj.chatTag = $message;
            	chartFunctionObj.chatTime = _this.chatTime;
            }else if( chartFunctionObj.chatTime == _this.chatTime ){
            	removeChartTimeWroker(chartFunctionObj.chatTag)
            	chartFunctionObj.chatClass = getPositionWord(_this.message_side);
            	chartFunctionObj.chatTag = $message;
            	chartFunctionObj.chatTime = _this.chatTime;
            }else{
//            	removeChartTimeWroker($message)
            	chartFunctionObj.chatClass = getPositionWord(_this.message_side);
            	chartFunctionObj.chatTag = $message;
            	chartFunctionObj.chatTime = _this.chatTime;
            }
            messageCount++;
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);

    return this;
}

function removeChartTimeWroker(tag){
	tag.find('.date').html("");
}

//input value 받아오기
function getMessageText() {
    let $message_input;
    $message_input = $('.message_input');
    return $message_input.val();
}
yoilList = ["일", "월", "화", "수", "목", "금", "토"];
//time
function formatAMPM(date) {
    let year = date.getFullYear(); // 년도
    let month = date.getMonth() + 1;  // 월
    let day = date.getDate();  // 날짜
    let yoil = date.getDay();  // 요일
    let textToday = `${year}-${month}-${day}-${yoilList[yoil]} `
    var hours = date.getHours();
    var minutes = date.getMinutes();
    let seconds = date.getSeconds();  // 초
    let milliseconds = date.getMilliseconds(); // 밀리초
    var ampm = hours >= 12 ? 'PM' : 'AM';
    let koAmpm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    let detailTime = `${strTime}/${textToday} ${koAmpm} ${hours}시 ${minutes}분 ${seconds}.${milliseconds}초`;
    return [strTime, detailTime];
}


//회원채팅내용
function getPersonChat(id_user) {
    $.ajax({
        url: "personal_chat",
        type: "POST",
        dataType: "json",
        data:{userId : id_user},

    }).done(function (data) {
//    	let log_chat = data['log']
    	let log_chat = data.chatLogList;
    	if(log_chat != null && log_chat.length > 0){
    		let time_arr = log_chat[0].chatLogTime.split(' ');
    		let first_day = time_arr[0]
    		$('.messages').append(`<div class="prev-history"><span>${first_day}</span></div>`);

    		for(let i in log_chat){
              let time_list = log_chat[i].chatLogTime.split(' ');
              let day_time = time_list[0]
              if(day_time !== first_day){
                  $('.messages').append(`<div class="prev-history"><span>${day_time}</span></div>`);
                  first_day = day_time;
              }
              if(log_chat[i].chatLogSide === '봇'){
                  log_sendMessage(`${log_chat[i].chatLogMessage}`, 'left', time_list[0],'');
              }else{
                  log_sendMessage(`${log_chat[i].chatLogMessage}`, 'right', time_list[0],'');
              }
            }
    		$('.messages').last().append(`
            		<div class="prev-history"><span>이전 대화 내역</span></div>
            `);
    	}



    });
}

//채팅 띄우기
function sendMessage(text, message_side, notsave,contentType,content,scenarioButtons) {
    let date = formatAMPM(new Date());
    let $messages, message;
    $('.message_input').val('');
    var checkTimes = new Date().getTime();
    $messages = $('.messages');
    message = new Message({
        text: text,
        contentType:contentType,
        content: content,
        message_side: message_side,
        scenarioButtons: scenarioButtons,
        chatTime: date[0]
    });
    message.draw();
    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 0.0001);
    if(!notsave){
        saveChatLog(text, message_side, date[1], userId_arr[0]);
    }
}

function log_sendMessage(text, message_side, chattime,buttonList) {

    let $messages, message;
    $messages = $('.messages');
    message = new Message({
        text: text,
        buttonList:buttonList,
        message_side: message_side,
        chatTime: chattime
    });
    message.draw();
    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 0.0001);
}

// 처음 인사말
function greet() {

	setTimeout(function () {
        return sendMessage("Kochat 데모에 오신걸 환영합니다.", 'left');
    }, 1000);

}


function saveMenuLog(menuIdx) {

	let userId = $('.ck_login').val();

	$.ajax({
		url : "/insertChatbotMenuLog",
		type : "POST",
		data : {
			menuIdx : menuIdx,
			userId : userId
		},
		success : data => {
		},
		error : () => {
		}
	});
}

function dropmenuClick(qa){
	$("div.accordion").removeClass("on");
    sendMessage(qa, 'right', 0,'','','');
    requestChat(qa, 'request_chat','');
}

var timer = null,shi=0;

function scrollClear(){
	if( timer != null ){
		clearInterval(timer);
		timer = null;
		shi = 0;
	}
}

//드롭버튼
function catchCategory(cateName){
	let qa_arr;
	scrollClear();
	$.ajax({
        type: 'GET',
        url: "http://202.68.228.97:5003/knowledge_qa_list/"+cateName,
        dataType: 'JSON',
        success:function(data){

        		qa_arr= data.list;
            	$('.messages').append(
            	    `
            	    <div class="message left">
            	    		<div class="accordion">
            	                      <button type="button" class="accordion-header" onclick="accordionClick($(this))">${cateName}관련 질문 보기</button>
            	                      <div class="accordion-contents">
            	                        <ul class="dropdown-menu">
            	                        </ul>
            	                      </div>
            	    		</div>
            		</div>
            	    `);

            	    for(let i in qa_arr){

            	    	$('.dropdown-menu').last().append(`<li><a href="javascript:dropmenuClick('${qa_arr[i]['question']}'); ">${qa_arr[i]['question']}</a></li>`)
            	    }

            		if( timer == null ) {
            			timer = setInterval(scrollDown, 500);
            			shi = $('.messages').prop('scrollHeight');
            		}

            	    $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 0.0001);

        },
        error: function (xtr, status, error) {
            console.log("연결실패 - ");
        }
    });
}

function scrollDown(){

	$('.scrollBottom').each(function(){
		var $this = $(this);
		var chk = JSON.parse($this.attr('aria-expanded'));
		if( chk ) {
			var trueShi = $('.messages').prop('scrollHeight');
			if( (trueShi-shi) > 200 ) {
				$('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 1000);
				scrollClear();
			}
		}
	});

};

// 챗봇 엔터 가능
function onClickAsEnter(e) {
    if (e.keyCode === 13) {
        onSendButtonClicked()
    }
}

//연관 키워드 변경
function requestRelationWord(middle, main) {
    $('.relation p').empty();
    if (Array.isArray(main)) {
        for (let i in main) {
            $('.relation p').append(`<a href='#' style="cursor:default;"><span>${main[i]}</span></a>`)
        }
    } else {
        $('.relation p').append(`<a href='#' style="cursor:default;"><span>${main}</span></a>`)
    }
    if (middle !== 'no') {
        $('.relation p').append(`<a href='#' style="cursor:default;"><span>${middle}</span></a>`)
    }
}

//뉴스 타이틀
function requestNewsTitle(news, id){
    $('.news p').remove();
    for(let i=0; i<news.length; i++){
        //$('.news').append(`<p><a href='http://medi.ai/news.do?newsId=${id[i]}'>${news[i]}</a></p>`);
    }
}

function openModal(modalname) {
    document.get
    let modalContents = intentModal(modalname)
    $("#modal").fadeIn(300);
    $(".modal_name").fadeIn(300);
    $("#modal .title").empty();
    $("#modal .con").empty();
    $("#modal .title").append("<strong>"+modalContents[0]+"</strong>");
    $("#modal .con").append("<p>"+modalContents[1]+"</p>");
}

$(".close").on('click', function () {
    $("#modal").fadeOut(300);
    $(".modal-con").fadeOut(300);
});

function intentModal(modalName){
    if(modalName.includes('img-modal')){
        let img = $("img").text();
        return [img]
    }else if(modalName == 'leadingcase-modal'){
        let title = '판례';
        let content = $(".judicial p").text();
        return [title, content]
    }else if(modalName == 'case-modal'){
        let title = '사례';
        let content = $(".case p").text();
        return [title, content]
    }
}

// 노무사전 키워드 변경
function requestDictionary(nomu_dict) {
    $('.dictionary p').empty();
    for (let i in nomu_dict) {
        if(nomu_dict[i] === null){
            $('.dictionary p').append(`<a href='#' style="cursor:default;"><span>사전에 없습니다</span></a>`)
        }
        else{
            $('.dictionary p').append(`<a href='#' style="cursor:default;"><span>${nomu_dict[i]}</span></a>`)
        }
    }
}
//추천 키워드 변경
function requestRecommend(word) {
    $('.recommend_keyword p').empty();
    for (let i in word) {
        $('.recommend_keyword p').append(`<a href='#' style="cursor:default;"><span>${word[i]}</span></a>`)
    }
}

//키워드 값 변경을 위해서 데어터 가져옴
function requestChat(messageText, url_pattern) {

    let msg = encodeURIComponent(messageText)
    $.ajax({
        url: "http://202.68.228.97:5003/" + url_pattern + "/" + msg,
        type: "GET",
        dataType: "json",
        error: function (request, status, error) {
            return sendMessage($("#failMessage").val(), 'left',0,'','');
        }
    }).done(function (data) {
    	console.log(data);
        if (url_pattern === 'request_chat') {
            if (data.hasOwnProperty('leadingcase')) {
                requestLeadingCase(data['leadingcase']);
            }
            if (data.hasOwnProperty('case')) {
                requestCase(data['case']);
            }
            if (data['middleCategory'] != null) {
                requestRelationWord(data['middleCategory'], data['mainCategory']);
            } else if (data['mainCategory'] != null) {
                requestRelationWord('no', data['mainCategory']);
            }
            if (data['recommend'] != null) {
                requestRecommend(data['recommend']);
            }
            if (data['nomu_dict'] != null){
                requestDictionary(data['nomu_dict']);
            }
            if (data['wordcloud'] != null){
                //requestWordcloud(data['wordcloud']);
            }
            if (data['news_title'] != null){
                requestNewsTitle(data['news_title'], data['news_ids']);
            }
            if (data['answer_question'] != null){
            	let aq_arr = question_list[data['answer_question']]
            	if(aq_arr === undefined){

            		var answer = ``;
                	for (let i in data['answer']) {
                		(function (x) {
                			if(x > 0){
                				answer+=",";
                			}
                			answer += data['answer'][x];
                		})(i);
                	}

                	setTimeout(function () {
    					sendMessage(answer, 'left',0,'','');
    				}, 1000);
            	} else {
            		var answer = ``;
                	for (let i in data['answer']) {
                		(function (x) {
                			if(x > 0){
                				answer+=",";
                			}
                			answer += data['answer'][x];
                		})(i);
                	}

            		setTimeout(function () {
    					sendMessage(answer + `<br/>
    								<button class=cate_btn onclick=catchCategory('${data['answer_question']}')>
    									관련질문
    								</button>`, 'left',0,'','');
    				}, 1000 * x);
            	}
            } else {
            	var answer = ``;
            	for (let i in data['answer']) {
            		(function (x) {
            			if(x > 0){
            				answer+=",";
            			}
            			answer += data['answer'][x];
            		})(i);
            	}

            	setTimeout(function () {
            		if(answer == ""){
            			answer = $("#failMessage").val();
            		}
    				sendMessage(answer, 'left',0,'','');
    				$('.messages').append(
    						`<div class="message left">
    							<button type="button" class="btn-beginning" onclick=catchCategory('${data['mainCategory']}')>이전으로</button>
    						<div>
    						`);
    			}, 1000);
            	$('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 300);
            }
        } else {
        	return sendMessage($("#failMessage").val(), 'left',0,'','');
        }
    })
}

//챗봇로그저장 - post
function saveChatLog(messageText, side, time, userId) {
    if(side == "left"){
    	side = "봇";
    }else{
    	side = "사용자";
    }

    $.ajax({
        type: 'POST',
        url: "/save_log",
        data: {
            "chatLogMessage": messageText,
            "chatLogSide": side,
            "userId": userId,
        },
        dataType: 'JSON',
        error: function (xtr, status, error) {
            console.log("연결실패 - ");
        }
    });
}

// 판례 변경
function requestLeadingCase(leadingcase) {
    leadingcaseContent = "";
    if (leadingcase == null) {
        leadingcaseContent = "<p>아직 판례가 없습니다.</p>";
        $('.judicial a').empty();
    }
    else {
        leadingcaseContent = leadingcase;
        $('.judicial a').empty();
        $('.judicial a').append(`<a href="javascript:openModal('leadingcase-modal');"><button type="button">더보기</button></a>`);
    }
    $('.judicial').empty();
    $('.judicial').append(`<a href="#">`+leadingcaseContent+`</a>`);
}

//사례 변경
function requestCase(exampleCase) {
    caseContent = "";
    if (exampleCase == null) {
        caseContent = "<p>아직 사례가 없습니다.</p>";
    } else {
        caseContent = exampleCase;
    }
    $('.case').empty();
    $('.case').append(`<a href="#">`+caseContent+`</a>`);
}


// 챗봇 특정 단어 입력시 반응
function onSendButtonClicked() {
    let messageText = getMessageText();
    if (messageText.trim() === ""){
        alert("질문을 입력해 주세요.")
    }
    else if (messageText.includes('/')) {
    	sendMessage(messageText, 'right',0,'','');
        setTimeout(function () {
            return sendMessage($("#failMessage").val(), 'left',0,'','');
        }, 1000);
    }else if (messageText === ('안녕')) {
    	sendMessage(messageText, 'right');
        setTimeout(function () {
            return sendMessage("안녕하세요. 저는 상담 채팅봇 입니다.", 'left',0,'','');
        }, 1000);
    } else if (messageText.includes('고마워')) {
    	sendMessage(messageText, 'right');
        setTimeout(function () {
            return sendMessage("천만에요. 더 물어보실 건 없나요?", 'left',0,'','');
        }, 1000);
    } else if (messageText === ('없어')) {
    	sendMessage(messageText, 'right');
        setTimeout(function () {
            return sendMessage("그렇군요. 다음에 또 이용해주세요!", 'left',0,'','');
        }, 1000);
    }else if(messageText === ('처음')){
      greet();
    }else if(messageText == ('지우기')){
      $('.messages').empty();
      greet();
    }else if(messageText === ('도움말')){
      sendMessage(messageText, 'right',0,'','');
      menual();
    }
    else {
	   sendMessage(messageText, 'right',0,'','');
    return requestChat(messageText, 'request_chat');
    }
}


function requestWordcloud(wordcloud){
    $('.box-contents wordcloud').empty();
    if(wordcloud != null){
	    anychart.onDocumentReady(function () {
	    	var arr = wordcloud.split(",");
	    	var data = [];
	    	for(var i=0; i< arr.length ; i++){
	    		var obj = { "x": arr[i], "value": 1, category: "" }
	    		data.push(obj);
	    	}
		  	  var chart = anychart.tagCloud(data);
		  	  chart.angles([0]);
		  	  chart.container("wordCloud");
		  	  // chart.getCredits().setEnabled(false);
		  	  chart.listen("pointClick", function(e){
		  		var qa = e.point.get("x");
		  	    sendMessage(qa, 'right', 0,'','','');
		  	    requestChat(qa, 'request_chat','');
		  		});
		  	  chart.draw();
		  	  });
        //$('.box-contents wordcloud').append('<img src=./resources/medi/img/wordcloud/'+ wordcloud + '></img>')
    }
}

//챗봇 상단 지우개 버튼
$('.btn-remove').click(function () {
	$('.messages').empty();
});

function menuButtonEvent(type, requestMessage ,responseMessage, content ){

	if(type == "text"){
		sendMessage(requestMessage, 'right', 0,'','');
		textAnswer(responseMessage);

	}else if(type == "url"){
		sendMessage(requestMessage, 'right', 0,'','');
		urlAnswer(responseMessage,content);
	}else if(type == "block"){
		sendMessage(requestMessage, 'right', 0,'','');
		requestBlock(content);
	}else if(type == "scenario"){
		requestScenario(requestMessage,content,0);
	}
}

function textAnswer(responseMessage){
    sendMessage(responseMessage, 'left',0,'','');
}

function urlAnswer(responseMessage,url){
    var button = '<button class = "one_Btn" type="button" onclick="openUrl(\''+url+'\');">이동하기</button>';
    sendMessage(responseMessage, 'left',0,'button',button);
}

function openUrl(url){
	var win = window.open(url, "_blank");
}

function requestScenario(requestMessage,scenarioInfoIdx,scenarioIdx){
	sendMessage(requestMessage, 'right', 0,'','');

    $.ajax({
		url : "requestScenario",
		type : "POST",
		data : {
			scenarioInfoIdx : scenarioInfoIdx,
			scenarioIdx : scenarioIdx
		},
		success : data => {
			if(data != null && data.scenario != null){
				var buttonName = data.scenario.scenarioButtonName;
				var buttonType = data.scenario.scenarioButtonType;
				var buttonMessage = data.scenario.scenarioButtonMessage;
				var buttonUrl = data.scenario.scenarioButtonUrl;
				var blockIdx = data.scenario.blockIdx;
				var buttonKnowledge = data.scenario.scenarioButtonKnowledge;
				var subScenarioList = data.subScenarioList;

				var scenarioButtons = "";

				if(subScenarioList != null && subScenarioList.length > 0){

					for(var i = 0 ; i < subScenarioList.length ; i++){
						var subScenarioInfoIdx = subScenarioList[i].scenarioInfoIdx;
						var subScenarioIdx = subScenarioList[i].scenarioIdx;
						var subScenarioButtonName = subScenarioList[i].scenarioButtonName;

						if(subScenarioButtonName != null && subScenarioButtonName != ''){
							scenarioButtons += "<button type=\"button\" onclick=\"requestScenario('"+subScenarioButtonName+"','"+subScenarioInfoIdx+"','"+subScenarioIdx+"');\">"+subScenarioButtonName+"</button>";
						}
					}
				}

				if(buttonType == 1){
					 var button = '<button class = "one_Btn" type="button" onclick="openUrl(\''+buttonUrl+'\');">이동하기</button>';
					sendMessage(buttonMessage, 'left',0,'button',button,scenarioButtons);
				}else if (buttonType == 2){
					 var button = '<button class = "one_Btn" type="button" onclick="catchCategory(\''+buttonKnowledge+'\');">'+buttonKnowledge+'</button>';
					sendMessage(buttonMessage, 'left',0,'button',button,scenarioButtons);
				}else if (buttonType == 3){
					$.ajax({
						url : "requestBlock",
						type : "POST",
						data : {
							blockIdx : blockIdx
						},
						success : data => {
							if(data != null && data.block != null){
								var answer = data.block.blockAnswer;
								var answerType = data.block.blockAnswerType;

								if( data.blockItemList != null &&  data.blockItemList.length > 0){
									blockMessage(answer,answerType,data.blockItemList,scenarioButtons);
								}else{
									sendMessage(answer, 'left',0,'','',scenarioButtons);
								}
							}else{
								sendMessage($("#failMessage").val(), 'left', 1,'','');
							}

						},
						error : () => {
						}
					});
				}else{
					sendMessage(buttonMessage, 'left', 1,'','',scenarioButtons);
				}
			}else{
				sendMessage($("#failMessage").val(), 'left', 1,'','');
			}

		},
		error : () => {
			alert("통신에러");
		}
	});
}


function requestBlock(idx){

    $.ajax({
		url : "requestBlock",
		type : "POST",
		data : {
			blockIdx : idx
		},
		success : data => {
			if(data != null && data.block != null){
				var answer = data.block.blockAnswer;
				var answerType = data.block.blockAnswerType;

				if( data.blockItemList != null &&  data.blockItemList.length > 0){
					blockMessage(answer,answerType,data.blockItemList);
				}else{
					sendMessage(answer, 'left',0,'','');
				}
			}else{
				sendMessage($("#failMessage").val(), 'left', 1,'','');
			}

		},
		error : () => {
		}
	});
}

function blockMessage(message,answerType,blockItemList,scenarioButtons){
	if(answerType == 0){
		sendMessage(message, 'left',0,'','',scenarioButtons);
	}else{
		var content = "";

      	if(blockItemList.length > 0){
      		content +="<div class=\"swiper\" id=\"mySwiper"+messageCount+"\">";
      		content +="		<div class=\"swiper-wrapper\">";


			for(var i=0; i <blockItemList.length; i++){

				content += "<div class=\"swiper-slide\">";
				content += "	<div class=\"swp_headerImg\">";
				content += "		<img src=\""+blockItemList[i].blockImage+"\" alt=\"\">";
				content += "	</div>";

				if(blockItemList[i].blockContent !=''){
					content += "	<div class=\"swp_contents\">";
					content += "		<p>"+blockItemList[i].blockContent+"</p> ";
					content += "	</div>";
				}

				if(blockItemList[i].blockButtonName != ''){

					if(blockItemList[i].blockButtonType ==0){
						content += "	<div class=\"swpBnt\">";
						content += "		<button type=\"button\" onclick=\"textAnswer('"+blockItemList[i].blockButtonName+"','"+blockItemList[i].blockButtonMessage+"')\">"+blockItemList[i].blockButtonName+"</button>";
						content += "	</div>";
					}else if(blockItemList[i].blockButtonType ==1){
						content += "	<div class=\"swpBnt\">";
						content += "		<button type=\"button\" onclick=\"openUrl('"+blockItemList[i].blockButtonUrl+"')\">"+blockItemList[i].blockButtonName+"</button>";
						content += "	</div>";
					}

				}

				content += "</div>";
			}

			content += "	</div>";
			content += "</div>";

			if(blockItemList.length>1){
				content += "<div class=\"swiper-button-next\" id=\"swiper-button-next"+messageCount+"\"></div>";
				content += "<div class=\"swiper-button-prev\" id=\"swiper-button-prev"+messageCount+"\"></div>";
			}

      	}


		sendMessage(message, 'left',0,'card',content,scenarioButtons);
	}


}