"use strict";
var vaasui=(function (){
	var xml ="";
	var segments=[];
	var videDataBase="/static/videodata/";
	//var videDataBase="\\static\\videodata\\";
	var video_dict={};
	var currentImpArray=[];
	var currentVideo="";
	var tempCols=45;
	var impLevel=10;
	var usersArr=[];
	var currentUser="";
	var vidUserLs=[];
	var segmentSize=5;
	var init=function(){
		//vaasui.loadDictionaries();
		vaasui.bindpageEvents();
	};

	var loadDictionaries=function(){
	};

	var bindpageEvents=function(){		
		//var $uploadObj = $("#videouploader").uploadFile({
		//	url:"https://194.95.158.74:5000/getVideoStats",
		//	fileName:"videoupload",
		//	acceptFiles:"video/*"
		//	}); 
		//$uploadObj.startUpload();
		$("#vidFile").off().on( "change", function(obj) {
			var filesLen=$(this)[0].files.length;
			var fiel1=$(this)[0].files[0];
			var reader = new FileReader();
			reader.onload = function(){
		      var dataURL = reader.result;
		      debugger;
		    };
			reader.readAsDataURL($("#vidFile")[0].files[0]);

			
		});
	};

	return{
		init:init,
		loadDictionaries:loadDictionaries,
		bindpageEvents:bindpageEvents
	}
})();

$(document).ready(function(){
	vaasui.init()
	});