<img width="100%" alt="wolfon logo" src="https://user-images.githubusercontent.com/81073535/195976095-3847ecc2-763d-4b12-9f7a-0618b9491d02.png">

# Wolfon [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

[Wolfon Website](https://www.wolfon.live)

A website for **live streaming and learning programs**, combined with a **developer social media**.

## Table of Contents
- [Introduction](#Introduction)  
- [Test Account](#test-account)
- [Technical Detail](#Technical-Detail)
- [System Architecture](#system-architecture)  
- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [Demo](#Demo)  
    **Live**
    - [Create Live Stream](#Create-Live)
    - [Join Live Stream](#Join-Live)
    - [Review Stream](#Review-Live)

     **Code Editor**
    - [Select Language](#Select-Language)
    - [Get Viewer Code](#Get-Viewer-Code)
    - [Add and Use Version](#Add-and-Use-Version)

    **Post**
    - [Create Post](#Create-Post)
    - [Edit Post](#Edit-Post)
    - [Like and Follow Post](#Like-and-Follow-Post)
- [Licence](#License)
- [Links](#Links)

## Introduction

**Wolfon** is used for programs online learning, tech sharing and article publishing.
Provided a low latency live streaming service and interactive online code editor which can execution programs in JavaScript, Python, and Golang.

After learning programs from live stream, there is a social media for user to publish their tech articles and reviews, writing with a rich text editor which support code block, image insertion and link href.

## Test account :
- Account_01 (Wolfon): user01@gmail.com / Password: 123456
- Account_02 (Sam): user02@gmail.com / Password: 123456

## Technical Detail
**Live Streaming**
- Built a WebRTC one-to-many live stream service with Google STUN server, using Socket.IO for accelerating SDP and ICE exchange.
- Using Socket.IO room to separate live stream rooms, providing media stream correctly to viewers.
- Applied MediaRecorder to build a automatic live stream recording service when stream start, which will capture screen and camera (depends on streamer's device ) and microphone audio.
- Using Amazon S3 and S3 pre-signed URL to automatically recorded live stream to S3 bucket after stream end, and applied S3 multipart-upload for large blob files upload.

**Online Code Editor**
- Adopted Docker and Dockerfile to create different program language runtime enviroments for program execution.( [Tech Blog](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-3673b7e6ea06) )
- Add code version for viewers to use and catch up the streamer's progress, passing data by Socket.IO.
- Applied cpu and memory limited on container with Docker for resource limination.( [Tech Blog](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-part-2-d55c99708eb8) )
- Run programs using Node child_process modules and Docker images.
- Handling the infinite loop case by execution time limit.
- Streamer can get each viewer's code from the viewer's editor by a simple click on button using Socket.IO for passing programs.

**Chatroom**
- Many-to-many online chatroom using Socket.IO room.
- Upload images with Amazon S3 and multer, and access with Amazon CloudFront.
- 
## System Architecture
![架構細節1-1](https://user-images.githubusercontent.com/81073535/195974725-d3ada339-ad50-415d-9d26-958126fa4bf7.png)

## Database Schema
![schema](https://user-images.githubusercontent.com/81073535/198870219-c6b9461b-75f4-4f96-887d-354380ede7fd.png)

## Features

**Live Streaming**
- One-to-many live boardcast
- Live automatic recording
- Live recorded video automatic upload to AWS S3
- Switch streaming device ( screen / camera )
- Live record reviews

**Online Code Editor**
- Support JavaScript / Python / Golang
- Support markdown
- Version control tags
- Get code from viewer's editor with a simple click on button

**Chatroom**
- Many-to-many online chatroom
- Image upload and preview
- Zoom in image

**Article Publishing**
- Rich text editor on writing article
- Markdown editing
- Support code block display
- Add links href on text
- Insert images through URL
- Support draging image to adjust layout
- Editing after published
- Like and Follow article
- Recording post views
- Delete article

**Social Media**
- Friend system
- Following other users
- Browsing user's posts and lives in their profile page
- Browsing personal followed and liked posts
- Searching post, live, and user with short keyword
- Change personal avatar and background image in profile
- Sign-up and sign-in

## Tech Stack
**Client:**  WebRTC / MediaRecorder / Socket.IO / React / MaterialUI / TipTap / React-Ace
 ( [Front-End Repostority](https://github.com/tyt-timtsai/Wolfon-Frontend) )

**Server:** Node / Express / Nginx / Docker / Socket.IO / multer

**Database:** MongoDB Atlas

**AWS Cloud service:** EC2 / S3 / CloudFront

**API Test:** mocha / chai / supertest

## Demo
### Create Live
- Set live title and upload a live cover image.
- <video src=https://user-images.githubusercontent.com/81073535/196971069-a30caaa4-2fed-433f-b3de-327931d1d3d0.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196971069-a30caaa4-2fed-433f-b3de-327931d1d3d0.mp4)
</video>

### Join Live
- Browsing lives and records in home page, live section.
- <video src=https://user-images.githubusercontent.com/81073535/196971113-6391dc9f-0acd-445a-82ff-60abcfae7564.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196971113-6391dc9f-0acd-445a-82ff-60abcfae7564.mp4)
</video>

### End Live
- Click end stream button to automatically upload stream to cloud ( Amazon S3 ).
- <video src=https://user-images.githubusercontent.com/81073535/196969398-cc368253-e8ad-4237-bf3d-d7f3e8761c53.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196969398-cc368253-e8ad-4237-bf3d-d7f3e8761c53.mp4)
</video>

### Review Live
- Code versions are still avaliable in live reviews.
- <video src=https://user-images.githubusercontent.com/81073535/196974309-1d29b697-d731-4aa2-8f45-d22e6778e513.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196974309-1d29b697-d731-4aa2-8f45-d22e6778e513.mp4)
</video>

### Select Language
- Multiple languages are supported in code editor.
- <video src=https://user-images.githubusercontent.com/81073535/196974555-21177b9d-5c15-492d-89c9-6fc174d9eabb.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196974555-21177b9d-5c15-492d-89c9-6fc174d9eabb.mp4)
</video>

### Get Viewer Code
- Streamer can get viewer's code by a simple click on button of the viewer.
- <video src=https://user-images.githubusercontent.com/81073535/196969206-d078152d-5467-4e01-80c5-d953b8ec7d72.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196969206-d078152d-5467-4e01-80c5-d953b8ec7d72.mp4)
</video>


### Add and Use Version
- Streamer can add version to save the current code on editor, and all viewers will get the new version immediately.
- <video src=https://user-images.githubusercontent.com/81073535/196936744-1b4651f2-cecd-4c95-ac98-f0de48d1ca28.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196936744-1b4651f2-cecd-4c95-ac98-f0de48d1ca28.mp4)
</video>

### Create Post
- Able to use markdown language writing articles, inserting images by URL, set links, and preview.
- <video src=https://user-images.githubusercontent.com/81073535/196979793-4df89a36-5883-4da7-a71c-b0f4ed81e3ad.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196979793-4df89a36-5883-4da7-a71c-b0f4ed81e3ad.mp4)
</video>

### Edit Post
- Articles are able to edit after published, with a click on edit button in article page.
- <video src=https://user-images.githubusercontent.com/81073535/196949954-eb132aad-0440-4b52-a05f-36c39c9a5f10.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196949954-eb132aad-0440-4b52-a05f-36c39c9a5f10.mp4)
</video>

### Like and Follow Post
- A simple click on like and follow icon, you can save the article you like.
- <video src=https://user-images.githubusercontent.com/81073535/196934373-3fff441c-c319-4069-be91-3ec05975d196.mp4>
   Sorry, your browser doesn't support embedded videos. ![Video is Here](https://user-images.githubusercontent.com/81073535/196934373-3fff441c-c319-4069-be91-3ec05975d196.mp4)
</video>

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Links
- [Wolfon](https://www.wolfon.live)
- [How to make Code sandbox](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-3673b7e6ea06)
- [How to handle infinite loop in Code sandbox](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-part-2-d55c99708eb8)
- [How to create one-to-many WebRTC boardcast](https://medium.com/@Tim_Tsai/webrtc-one-to-many-live-stream-with-reactjs-and-socket-io-1-getdisplaymedia-getusermedia-43df2116a959)
- [How to create one-to-many WebRTC boardcast-(2)](https://medium.com/@Tim_Tsai/webrtc-one-to-many-live-stream-with-reactjs-and-socket-io-2-p2p-connection-6c126ea1dc9d)
