var SF={
	now:0,
	num:10,
	answer:[3,1,3,0,2,6,1,0,1,1],
	score:0,
	aUrl:img_arr,
};
SF.Wx=function(){
	this.welcome=null;
	this.main=null;
	this.index=null;
	this.score=null;
	this.settings={
		now:0,
		num:SF.num,
		answer:SF.answer,
		score:SF.score,
		btn:true,
		aUrl:SF.aUrl,
	}
};
SF.Wx.prototype={
	constructor:SF.Wx,
	init:function(obj,opt){
		var _this=this;
		$.extend(true,{},this.settings,opt);
		_this.welcome=obj.welcome;
		_this.index=obj.index;
		_this.main=obj.main;
		_this.score=obj.score;
		_this.load();
		_this.nextissue();
	},
	load:function(){
		var _this=this;
		var percent=_this.welcome.find('.percent span');
		var bar=_this.welcome.find('.bar p');
		var cite=_this.welcome.find('.bar cite');
		var iLength=0;
		for(var i=0;i<_this.settings.aUrl.length;i++){
			var oImg=new Image();
			oImg.onload=function(){
				iLength++;
				var _percent=parseInt(iLength/_this.settings.aUrl.length*100)+"%";
				percent.html(_percent);
				bar.css({'transform':'translateX('+_percent+')','webkitTransform':'translateX('+_percent+')'});
				if(iLength==_this.settings.aUrl.length){
					cite.css({'background':'#ffcc33'});
					window.onload=function(){
						setTimeout(function(){
							_this.welcome.hide(_this.create_index());
						},500);	
					}
				}
			};
			oImg.onerror=function(){
				iLength++;
				var _percent=parseInt(iLength/_this.settings.aUrl.length*100)+"%";
				percent.html(_percent);
				bar.css({'transform':'translateX('+_percent+')','webkitTransform':'translateX('+_percent+')'});
				if(iLength==_this.settings.aUrl.length){
					cite.css({'background':'#ffcc33'});
					window.onload=function(){
						setTimeout(function(){
							_this.welcome.hide(_this.create_index());
						},500);	
					}
				}
			};
			oImg.src=_this.settings.aUrl[i];
		}
	},
	create_index:function(){
		var _this=this;

		_this.index.find('.theme-content').addClass('themein');
		_this.index.find('.ship').addClass('shipin');
		_this.index.find('.shiper-content').addClass('shiperin');
		_this.index.find('.begin span').addClass('shake2');
		_this.index.find('.begin span')[0].addEventListener('touchstart',function(){
			_this.index.hide(_this.create_card());
		},false);
	},
	create_card:function(){
		var _this=this;
		_this.main.find('.blackboard-content').addClass('blackboarddown');
    	_this.main.find('.card-content').addClass('cardshow');
    	_this.main.find('.card-content').on('webkitAnimationEnd AnimationEnd',function(){
    		_this.begin_answer();
    	});
	},
	setState:function(){
		var _this=this;
		var person=_this.main.find('.person');
		var answer=_this.main.find('.answer');
		var question=_this.main.find('.blackboard-content p');
		person.stop(true).css({'display':'none'});
		answer.stop(true).css({'display':'none'});

		if(_this.settings.now==9){
			_this.main.find('.next span').hide();
			_this.main.find('.next em').show();
		}

		question.hide();
		question.eq(_this.settings.now).show();
		_this.begin_answer();
	},
	begin_answer:function(){
		var _this=this;
		var card=_this.main.find('.card-list');
		var card_list=card.eq(_this.settings.now).find('.card-question li');
		var card_list_l=card_list.length;
		
		if(_this.settings.now!=0){
			card.eq(_this.settings.now-1).addClass('cardout');
			card.eq(_this.settings.now-1).on('webkitAnimationEnd',function(){
				card.eq(_this.settings.now-1).hide().removeClass('cardout');
			});
		};
		
		for(var i=0;i<card_list_l;i++){
			card_list[i].addEventListener('touchstart',function(){
				var _index=$(this).index();
				if(_this.settings.btn){
					_this.settings.now++;
					_this.settings.btn=false;
					if(_index==_this.settings.answer[_this.settings.now-1]){
						$(this).find('span').css({'display':'block'});
						_this.right_answer();
					   	return false;
					}else if(_this.settings.answer[_this.settings.now-1]==6){//第六题
						$(this).find('span').css({'display':'block'});
						_this.right_answer();
					   	return false;
					}else{
						$(this).addClass('shake');
						$(this).find('cite').css({'display':'block'});
					    _this.wrong_answer();
					    return false;
					}
					return false;
				}else{
					return false;
				}
			},false);
		}
		card.eq(_this.settings.now).find('.card-question li').on('webkitAnimationEnd AnimationEnd',function(){
			$(this).removeClass('shake');
			return false;
		});
		
	},
	nextissue:function(){
		var _this=this;
		var nextbtn=_this.main.find('.next span');
		nextbtn[0].addEventListener('touchstart',function(){
			if(_this.settings.btn){
				_this.no_answer();
				return false;
			}else{
				_this.settings.btn=true;
				_this.setState();
				return false;
			}
		},false);
	},
	no_answer:function(){
		var _this=this;
		var dH=$(document).height(),wH=$(window).height(),sH=$(window).scrollTop(),msgW,msgH,bd=$('body');
		if($("div[name=alertmask]").length!=0){
            return false;
        }
        (function(){
            var oMask = "<div class='alertmask' name='alertmask' style='background:#000; opacity:0.75;display:block;overflow:hidden;position:fixed; left:0px; top:0px; width:100%; z-index:999; height:"+(dH+sH)+"px' ></div>";
            var msgDiv = "<div name='alertMsgDialog' class='msg' id='msg' style='position:fixed; z-index:1000;'><span></span></div>";
            //是否需要遮罩
            bd.append(oMask);
            bd.append(msgDiv);
        })();
        //禁止页面滚动
        function notouchmove(event){
            var event=event||window.event;
            event.preventDefault();
            event.cancelBubble = true;
        }
        //阻止滚动
        bd.eq(0).css("overflow","hidden");
        document.addEventListener('touchmove',notouchmove,false);
        var mask=$('.alertmask'),msg=$('#msg');
		$('#msg span')[0].addEventListener('touchstart',function(){
			document.removeEventListener('touchmove',notouchmove,false);
            mask.remove();
            msg.remove();
            bd.eq(0).css("overflow","auto");
		},false);
	},
	see_score:function(){
		var _this=this;
		var seebtn=_this.main.find('.next em');
		seebtn[0].addEventListener('touchstart',function(){
			if(_this.settings.btn){
				_this.no_answer();
				return false;
			}else{
				_this.main.hide(_this.show_score());
				return false;
			}
			
		},false);
	},
	right_answer:function(){
		var _this=this;
		var person=_this.main.find('.person-r');
		var answer_r=_this.main.find('.answer-r');
		_this.settings.score+=10;
		person.eq(_this.settings.now-1).show().addClass('personin'); 
	   	person.eq(_this.settings.now-1).on('webkitAnimationEnd',function(){
	       answer_r.eq(_this.settings.now-1).show(function(){
	       		if(_this.settings.now==10){
					//答完题目了
					_this.see_score();
				}
	       });

	    });
	},
	wrong_answer:function(){
		var _this=this;
		var person=_this.main.find('.person-w');
		var answer_w=_this.main.find('.answer-w');
		person.eq(_this.settings.now-1).show().addClass('personin');
	    person.eq(_this.settings.now-1).on('webkitAnimationEnd',function(){
	        answer_w.eq(_this.settings.now-1).show(function(){
	        	if(_this.settings.now==10){
					//答完题目了
					_this.see_score();
				}
	        });
	    });
	},
	show_score:function(){
		var _this=this;
		var reset_btn=_this.score.find('.score-btn span');
		var share_btn=_this.score.find('.score-btn em');
		_this.score.find('.score-card-content h4 span').html( _this.settings.score+"<em></em>");
		var scores=_this.score.find('.score-card-content p');
		var scores_span=_this.score.find('.score-card-content>span');
		var arr_sc=['搜航的保洁小妹打了100分，你看着办。','去“船长课堂”蹭课去，不收费。','哎呦喂，加把劲就能上100了，看好你哦。','天才，你打100分的原因是总分才100。'];
		var sc=parseInt(_this.settings.score);
		if(sc<=30){
			scores.html(arr_sc[0]);
			scores_span.eq(0).addClass('papa');
		}else if(sc>30&&sc<=60){
			scores_span.eq(1).addClass('papa');
			scores.html(arr_sc[1]);
		}else if(sc>60&&sc<=90){
			scores_span.eq(2).addClass('papa');
			scores.html(arr_sc[2]);
		}else{
			scores_span.eq(3).addClass('papa');
			scores.html(arr_sc[3]);
		}
		reset_btn[0].addEventListener('touchstart',function(){
			_this.reset();
		},false);

		share_btn[0].addEventListener('touchstart',function(){
			_this.share();
		},false);

	},
	reset:function(){
		var _this=this;
		var person=_this.main.find('.person');
		var answer=_this.main.find('.answer');
		var card=_this.main.find('.card-list');
		var question=_this.main.find('.blackboard-content p');

		_this.settings.now=0;
		_this.settings.score=0;
		_this.settings.btn=true;

		person.hide();
		answer.hide();
		card.removeClass('cardout').show();
		card.find('.card-question li span').css({'display':'none'});
		card.find('.card-question li cite').css({'display':'none'});
		_this.main.find('.next span').show();
		_this.main.find('.next em').hide();
		_this.score.find('.score-card-content>span').removeClass('papa');
		question.hide();
		question.eq(_this.settings.now).show();
		_this.main.show();
	},
	share:function(){
		var _this=this;
		
		var dH=$(document).height(),wH=$(window).height(),sH=$(window).scrollTop(),msgW,msgH,bd=$('body');
		if($("div[name=alertmask]").length!=0){
            return false;
        }
        (function(){
            var oMask = "<div class='alertmask' name='alertmask' style='background:#000; opacity:0.75;display:block;overflow:hidden;position:fixed; left:0px; top:0px; width:100%; z-index:999; height:"+(dH+sH)+"px' ></div>";
            var msgDiv = "<div class='share' id='share'><div class='share-content'><span></span></div></div>";
            //是否需要遮罩
            bd.append(oMask);
            bd.append(msgDiv);
        })();
        //禁止页面滚动
        function notouchmove(event){
            var event=event||window.event;
            event.preventDefault();
            event.cancelBubble = true;
        }
        //阻止滚动
        bd.eq(0).css("overflow","hidden");
        document.addEventListener('touchmove',notouchmove,false);
        var mask=$('.alertmask'),msg=$('#share');
		$('#share span')[0].addEventListener('touchstart',function(){
			document.removeEventListener('touchmove',notouchmove,false);
            mask.remove();
            msg.remove();
            bd.eq(0).css("overflow","auto");
		},false);
	},
};