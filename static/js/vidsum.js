"use strict";
var vidsum=(function (){
	var xml ="";
	var segments=[];
	var videDataBase="/videoanalysis/static/videodata/";
	//var videDataBase="\\static\\videodata\\";
	var video_dict={};
	var videoNames={};
	var currentImpArray=[];
	var currentVideo="";
	var tempCols=45;
	var impLevel=10;
	var usersArr=[];
	var currentUser="";
	var vidUserLs=[];
	var segmentSize=5;
	var init=function(){
		vidsum.sampleAjax();
		//vidsum.loadDictionaries();
		
		/*$("#slider").slideReveal({
		  trigger: $("#trigger"),
		  position: "right",
		  width: 400,
		  push: true
		});*/
	};
	var startTimeIndicator=function(){
		var curTime=$("#main_video")[0].currentTime;
		$(".cell_play").removeClass("cell_graph_time");
		var tSegment=parseInt(curTime/segmentSize);
		$("#cell_play_"+tSegment).addClass("cell_graph_time");
	};
	var buildCurrentPlayGrid=function(cols){
		var insideTab="";
		currentImpArray=new Array(cols).fill(1);	
		insideTab+="<tr id='curr_play_row'>";
		insideTab+="<td id='imp_level_head_l' class='video_implevel'></td>";
		for(var j=0;j<cols;j++){
			insideTab+="<td id='cell_play_"+j+"' class='cell_play'></td>";
		}
		insideTab+="<td id='imp_level_head_r' class='video_implevel'></td>";
		insideTab+="</tr>";	
		$("#curr_play_grid").html(insideTab);
	};	
	var buildImpGrid=function(impLevel,cols){
		var insideTab="";
		currentImpArray=new Array(cols).fill(1);
		for(var i=0;i<impLevel;i++){
			var rowNum=impLevel-i
			insideTab+="<tr id='r_"+rowNum+"'>";
			insideTab+="<td id='imp_level_l_"+rowNum+"' class='video_implevel'>"+rowNum+"</td>";
			for(var j=0;j<cols;j++){
				insideTab+="<td id='cell_"+rowNum+"_"+j+"' class='cell_click'></td>";
			}
			insideTab+="<td id='imp_level_r_"+rowNum+"' class='video_implevel'>"+rowNum+"</td>";
			insideTab+="</tr>";	
		}
		$("#imp_grid").html(insideTab);
		vidsum.bindpageEvents();
	};
	var fillTheGraph=function(scores){
		if(scores){
			for(var j=0;j<scores.length;j++){
			$("#cell_"+scores[j]+"_"+j).addClass("cell_graph_bg");
			currentImpArray=scores;
		}}
	};
	var loadDictionaries=function(){
	};
	var pagePostOperation=function(){
		var userName=window.location.href.split("=")[1];
		if(usersArr.indexOf(userName)>=0){
			currentUser=userName;
		}
		else{
			currentUser="au_"+userName;
		}
		$("#creatorInput").val(currentUser);
	};
	var getCellIdx=function(id){
		var splitIdx=id.split("_");
		var cellIdx=[parseInt(splitIdx[1]),parseInt(splitIdx[2])];
		return cellIdx;
	};
	var clearColumnValues=function(cellIdx){
		for(var i=0;i<impLevel;i++){
			var finCellRow=i+1;
			$("#cell_"+finCellRow+"_"+cellIdx[1]).removeClass("cell_graph_bg");
		}
	};
	var eventforCellAnnotation=function($elm,obj){
			var cellIdx=getCellIdx(obj.target.id);
			clearColumnValues(cellIdx);
			$elm.addClass("cell_graph_bg");
			currentImpArray[cellIdx[1]]=cellIdx[0];
	};
	var bindpageEvents=function(){
		//http://paperjs.org/
		$(".video_thumb").off().on( "click", function(obj) {
					var fullnameVideo=$(this).attr("name")+".mp4";
					$("#main_video").attr("src",videDataBase+fullnameVideo);
					$("#main_video").children()[1].src=videDataBase+"en_"+$(this).attr("name")+".vtt";
					var displayVidname=replacenameWithRefinedName($(this).attr("name"));
					$("#current_video").val(displayVidname);
					$("#current_vid_span").html(displayVidname)
					currentVideo=fullnameVideo;
					vidsum.buildImpGrid(vidsum.video_dict[fullnameVideo].impLevel,vidsum.video_dict[fullnameVideo].scores.length);
					vidsum.buildCurrentPlayGrid(vidsum.video_dict[fullnameVideo].scores.length);
					if(vidUserLs[currentUser][fullnameVideo]){
						vidsum.fillTheGraph(vidUserLs[currentUser][fullnameVideo]);
					}else{
						vidsum.fillTheGraph(vidsum.video_dict[fullnameVideo].scores);
					}
					//vidsum.fillTheGraph(vidsum.video_dict[fullnameVideo].scores);
				});

		$(".cell_click").on("click",function(obj) {
					eventforCellAnnotation($(this),obj);
				});
		$(".cell_click").on("mousedown",function(obj) {
					$(".cell_click").on("mouseover",function(obj) {
						eventforCellAnnotation($(this),obj);
					});
					
				});
		$(".cell_click").on("mouseup",function(obj) {
					$(".cell_click").off("mouseover");
					
				});
		//$(".cell_click").bind("click mouseover",function(obj) {});
		var hoverOrClick = function (obj) {
    		var $elm=$(this);
			var cellIdx=getCellIdx(obj.target.id);
			clearColumnValues(cellIdx);
			$(this).addClass("cell_graph_bg");
			currentImpArray[cellIdx[1]]=cellIdx[0];
		}
		//$('.cell_click').hover(hoverOrClick).click(hoverOrClick);

		$("#submit").off().on( "click", function(obj) {
					$.ajax({
				    url : "saveAnnotation",
				    type : "POST",
				    data : JSON.stringify({creatorName:$("#creatorInput").val(),videoImportance: currentImpArray,videoName:currentVideo}),
				    dataType:"json",
				    async: false,
				    success : function(data) {
				    	alert("annotation submitted for: "+currentVideo);
				    	location.reload();
				    },
				    error : function(request,error){
				    	alert("Error while submission");
				    }
				});
				});
		$("#next").off().on( "click", function(obj) {
			var remainArr=[];
			$(".cb_user_mark").each(function( index ) {
			  	if(!$(this).prop("checked")){
			  		remainArr.push($(this).attr("name"));
			  	}
			});
			if(remainArr.length>0){
				var fullnameVideo=remainArr[0]+".mp4";
				currentVideo=fullnameVideo;
				$("#main_video").attr("src",videDataBase+fullnameVideo);
				$("#main_video").children()[1].src=videDataBase+"en_"+remainArr[0]+".vtt";
				var displayVidname=replacenameWithRefinedName(remainArr[0]);
				$("#current_video").val(displayVidname);
				$("#current_vid_span").html(displayVidname);
				currentVideo=fullnameVideo;
				vidsum.buildImpGrid(vidsum.video_dict[fullnameVideo].impLevel,vidsum.video_dict[fullnameVideo].scores.length);
				vidsum.buildCurrentPlayGrid(vidsum.video_dict[fullnameVideo].scores.length);
				if(vidUserLs[currentUser][fullnameVideo]){
						vidsum.fillTheGraph(vidUserLs[currentUser][fullnameVideo]);
					}else{
						vidsum.fillTheGraph(vidsum.video_dict[fullnameVideo].scores);
					}
			}


		});
	};
	var replacenameWithRefinedId=function (strVal){
		return strVal.replace(/\./g, "_").replace(/-/g, "_").replace(/\|/g, "_").replace(/\(/g, "_").replace(/\)/g, "_");
	};
	var replacenameWithRefinedName=function (strVal){
		return strVal.replace(/\./g, "_").replace(/-/g, "_").replace(/_/g, " ");
	};
	var getThumbVideoPlaceHolder=function(vidname,dict){
		//vidname=vidname.split(".")[0];

		vidname=vidname.slice(0,vidname.indexOf(".",vidname.length-4));
		var fullName=vidname;
		if(vidname in vidsum.videoNames){
			fullName=vidsum.videoNames[vidname];
		}
		var refinedvidname=replacenameWithRefinedId(vidname);
		var displayVidname=replacenameWithRefinedName(fullName);
		var placeHtml="<div class='single-right-grids video_thumb' name='"+vidname+"'>\
								<div class='col-md-4 single-right-grid-left'>\
									<a name='"+vidname+"'><img src='"+dict.thumbnail+"'/></a>\
								</div>\
								<div class='col-md-8 single-right-grid-right'>\
									<input type='checkbox' class='cb_user_mark' id='"+refinedvidname+"_cb' name='"+vidname+"' disabled><a class='title' name='"+vidname+"'> "+displayVidname+"</a>\
									<p class='author'> "+vidname+"</p>\
								</div>\
								<div class='clearfix'> </div>\
							</div>";
		return placeHtml;

	};
	var markUserVideos=function(vidUserLs){
		var currentUserLs=vidUserLs[currentUser];
		for(var idx in currentUserLs){
			//var vidName=currentUserLs[idx].split(".")[0];
			//var vidnameTokens=idx.split(".");
			//var vidName=vidnameTokens[0];
			var vidname=idx.slice(0,idx.indexOf(".",idx.length-4));
			var refinedvidname=replacenameWithRefinedId(vidname);
			$("#"+refinedvidname+"_cb").prop("checked",true);
		}
	};

	var sampleAjax=function(){
		$.ajax({
		    url : "getListOfVideos",
		    type : "POST",
		    data : JSON.stringify({creatorName:$("#creatorInput").val()}),
		    dataType:"json",
		    success : function(data) {
	    		vidsum.video_dict=data.video_dict;
	    		vidsum.videoNames=data.videoNames;
	    		var firstVid=""
	    		for(var k in data.video_dict){
	    			$(".video_pane").append(getThumbVideoPlaceHolder(k,data.video_dict[k]));
	    			if(data.video_dict[k].impLevel>impLevel){
	    				impLevel=data.video_dict[k].impLevel;
	    			}
	    			if(firstVid===""){
	    				firstVid=k;
	    			}
	    		}
	    		vidsum.bindpageEvents();
				$("#main_video").attr("src",videDataBase+firstVid);
				//currentVideo=firstVid.split(".")[0];
				currentVideo=firstVid.slice(0,firstVid.indexOf(".",firstVid.length-4));
				$("#main_video").children()[1].src=videDataBase+"en_"+currentVideo+".vtt";
				if(currentVideo in vidsum.videoNames){
    				$("#current_video").val(vidsum.videoNames[currentVideo]);
    				$("#current_vid_span").html(vidsum.videoNames[currentVideo]);
				}else{
					var displayVidname=replacenameWithRefinedName(currentVideo);
					$("#current_video").val(displayVidname);
    				$("#current_vid_span").html(displayVidname);
				}
				vidsum.buildImpGrid(vidsum.video_dict[firstVid].impLevel,vidsum.video_dict[firstVid].scores.length);
				vidsum.fillTheGraph(vidsum.video_dict[firstVid].scores);
				vidsum.buildCurrentPlayGrid(vidsum.video_dict[firstVid].scores.length); 
				usersArr=data.usersArr; 
				vidsum.pagePostOperation();
				markUserVideos(data.vidUserLs);
				$("#video_done").val(Object.keys(data.vidUserLs[currentUser]).length+" / "+Object.keys(data.video_dict).length);
				
				vidsum.bindpageEvents();	
        		vidsum.buildImpGrid(impLevel,tempCols);
        		vidsum.buildCurrentPlayGrid(tempCols);
        		var fullnameVideo=currentVideo+".mp4";
        		if(data.vidUserLs[currentUser][fullnameVideo]){
        			vidsum.fillTheGraph(data.vidUserLs[currentUser][fullnameVideo]);
        			}else{
            			vidsum.fillTheGraph(vidsum.video_dict[fullnameVideo].scores);
        		}
        		vidUserLs=data.vidUserLs;	
        		var timeIndicator = setInterval(vidsum.startTimeIndicator, 1000);
		        //alert('Data: '+data);
    		    },
		    error : function(request,error){
		        alert("Request: "+JSON.stringify(request));
		    }
		});
	};

	return{
		init:init,
		loadDictionaries:loadDictionaries,
		bindpageEvents:bindpageEvents,
		sampleAjax:sampleAjax,
		video_dict:video_dict,
		videoNames:videoNames,
		buildImpGrid:buildImpGrid,
		fillTheGraph:fillTheGraph,
		pagePostOperation:pagePostOperation,
		buildCurrentPlayGrid:buildCurrentPlayGrid,
		startTimeIndicator:startTimeIndicator
	}
})();

$(document).ready(function(){
	vidsum.init()
	});