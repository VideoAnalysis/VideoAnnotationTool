#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jan 27 14:30:23 2020

@author: ghauri
"""

from moviepy.editor import VideoFileClip
import cv2
import pickle
import numpy as np
import glob
import os

def getVideoSegments(video_clip,segLenth):
    segments = [(start, int(start+video_clip.fps*segLenth)) for start in range(0,int(video_clip.duration*video_clip.fps),int(video_clip.fps*segLenth))]
    return segments

def getSymmetricSegmetLength(video_clip,nSegments):
    print("duration of video: ",video_clip.duration)
    segLength=video_clip.duration//nSegments
    return segLength

def getDummyScoreForSegments(impLevel,segmentslen):
    return np.ones(segmentslen)

listvideos=glob.glob("./static/videodata/*.mp4")
video_dict = {}
nSegments=100

segLenth=5
nthFrame=5
impLevel=10

thumbnailBase="./static/videodata/thumbnails/"
print("total vids is list: ",len(listvideos))
for vid in listvideos:
    print("processing video: ",vid)
    vidName=vid.split("/")[-1]
    video_dict[vidName]={}
    video_clip = VideoFileClip(vid)
    video_dict[vidName]["segments"]=getVideoSegments(video_clip,segLenth)
    video_dict[vidName]["scores"]=getDummyScoreForSegments(impLevel,len(video_dict[vidName]["segments"])).tolist()
    video_dict[vidName]["impLevel"]=impLevel
    thumbnailFrame=video_clip.get_frame(nthFrame)
    thumbnailName=vidName[:-4]+"_thumbnail.jpg"
    cv2.imwrite(thumbnailBase+thumbnailName, thumbnailFrame)
    video_dict[vidName]["thumbnail"]=thumbnailBase+thumbnailName
pickle.dump(video_dict,open("video_dict_vidsum.p","wb"));

videoAnnotate=pickle.load(open("videoAnnotate.p","rb"))

