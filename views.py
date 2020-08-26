from __init__ import app
from flask import render_template, request

import glob
import numpy as np

import json
import cv2
import pickle


from flask import send_from_directory

baseWeb="/videoanalysis"
usersArr=["junaid","Sherzod","Haris","test_user1"] # list(userDict.keys())

@app.route(baseWeb+'/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)
    
@app.route(baseWeb+'/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        print("post side is not implemented yet")
    else:
        print("get req: ",request.values)
        return render_template('comming_soon.html')

@app.route(baseWeb+'/getvaasui', methods=["GET", "POST"])
def getvaasui():
    if request.method == 'POST':
        print("post side is not implemented yet")
    else:
#        print("get req: ",request.values)
        return render_template('vaasui.html')

@app.route(baseWeb+'/getVideoStats', methods=["POST"])
def getVideoStats():
    print("getVideoStats req: ",request.values)
    response = {"feedback":True}
    return json.dumps(response)
    
@app.route(baseWeb+'/getmain', methods=["GET", "POST"])
def getmain():
    if request.method == 'POST':
        print("post side is not implemented yet")
    else:
        userGet=request.args.get("name")
        print("request args dataDict getmain: ",userGet)
        if(userGet in usersArr):
            return render_template('vidsum.html')
        else:
            return render_template('access_forbidden.html')
#            response = {"feedback":"User is not authorized for access.!!!"} access_forbidden
#            return json.dumps(response)
    
@app.route(baseWeb+'/getListOfVideos', methods=["POST"])
def getListOfVideos():
    dataDict=eval(list(request.values.keys())[0])
    print("request args dataDict: ",dataDict)
    userDict=pickle.load(open("video_dict_vidsum.p","rb"))
    videoNames=json.load(open("videoNames.json","r"))
    if request.method == 'POST':
         response = {"video_dict":pickle.load(open("video_dict_vidsum.p","rb")),"usersArr":usersArr,"vidUserLs":pickle.load(open("videoAnnotate.p","rb")),"videoNames":videoNames}
         print("video dictionary loaded...")
         return json.dumps(response)
     
@app.route(baseWeb+'/saveAnnotation', methods=["POST"])
def saveAnnotation():
    print("in the saving function...")
#    print("request args saveAnnotation: ",request.args)
    dataDict=eval(list(request.values.keys())[0])
    print("creatorName: ",dataDict["creatorName"])
    print("videoImportance: ",dataDict["videoImportance"])
    print("videoName: ",dataDict["videoName"])
    videoAnnotate=pickle.load(open("videoAnnotate.p","rb"))
    print(" request.method: ", request.method)
    if request.method == 'POST':
        if(dataDict["creatorName"] in videoAnnotate):
            videoAnnotate[dataDict["creatorName"]][dataDict["videoName"]]=dataDict["videoImportance"]
            videoAnnotate["vidUserLs"][dataDict["creatorName"]].append([dataDict["videoName"],dataDict["videoImportance"]])
            print("existing user data added...")
        else:
            videoAnnotate[dataDict["creatorName"]]={}
            videoAnnotate[dataDict["creatorName"]][dataDict["videoName"]]=dataDict["videoImportance"]
            videoAnnotate["vidUserLs"][dataDict["creatorName"]]=[[dataDict["videoName"],dataDict["videoImportance"]]]
            print("new suer data added...")
        pickle.dump(videoAnnotate,open("videoAnnotate.p","wb"))
        
        print("dictionary saved...")
        response = {"feedback":True}
        return json.dumps(response)
    response = {"feedback":True}
    return json.dumps(response)

def printMyName():
    print("JUNAID")

#dictLoaded=pickle.load(open("videoAnnotate.p","rb"))
##dictLoaded["junaid"]={}
#dictLoaded["au_sherzod"]={}
#dictLoaded["au_tu1"]={}
#dictLoaded["vidUserLs"]={}
#pickle.dump(dictLoaded,open("videoAnnotate.p","wb"))