<img width="100%" alt="wolfon logo" src="https://user-images.githubusercontent.com/81073535/195976095-3847ecc2-763d-4b12-9f7a-0618b9491d02.png">

# Wolfon [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

[Wolfon Website](https://www.wolfon.live)

A website for **live streaming and learning programs**, combined with a **developer social media**.

## Table of Contents
- [Introduction](#Introduction)  
- [System Architecture](#system-architecture)  
- [Test Account](#test-account)
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
- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [Technical Detail](#Technical-Detail)
- [Licence](#License)
- [Links](#Links)

## Introduction

**Wolfon** is used for programs online learning, tech sharing and article publishing.
Provided a low latency live streaming service and interactive online code editor which can execution programs in JavaScript, Python, and Golang.

After learning programs from live stream, there is a social media for user to publish their tech articles and reviews, writing with a rich text editor which support code block, image insertion and link href.

## System Architecture
![架構細節1-1](https://user-images.githubusercontent.com/81073535/195974725-d3ada339-ad50-415d-9d26-958126fa4bf7.png)

## Test account :
- Account_01 (Wolfon): user01@gmail.com / Password: 123456
- Account_02 (Sam): user02@gmail.com / Password: 123456
## Demo
### Create Live
- Set live title and upload a live cover image.
![create_live](https://user-images.githubusercontent.com/81073535/195973721-20f8dd9e-d3b8-457e-99e7-036638a96e28.gif)

### Join Live
- Browsing lives and records in home page, live section.
![join_live](https://user-images.githubusercontent.com/81073535/195973726-deb0214f-e0a1-4889-bf44-ae523b44f545.gif)

### End Live
- Click end stream button to automatically upload stream to cloud ( Amazon S3 ).
![end_live](https://user-images.githubusercontent.com/81073535/195973903-ea939606-d964-4ded-b2cc-9ed6e868f9ef.gif)

### Review Live
- Code versions are still avaliable in live reviews.
![review_live](https://user-images.githubusercontent.com/81073535/195973734-f60e1a6c-bd38-40ef-92ce-1178638c78b9.gif)

### Select Language
- Multiple languages are supported in code editor.
![select_language](https://user-images.githubusercontent.com/81073535/195973744-28e16996-2a92-4825-aa4c-8d4b058d293c.gif)

### Get Viewer Code
- Streamer can get viewer's code by a simple click on button of the viewer.
![get_viewer_code](https://user-images.githubusercontent.com/81073535/195974129-84fd8464-2023-438c-8b3c-df8fb02187c5.gif)

### Add and Use Version
- Streamer can add version to save the current code on editor, and all viewers will get the new version immediately.
![add_code](https://user-images.githubusercontent.com/81073535/195973880-3f9443ca-bc2a-4f22-be1a-81f37009e956.gif)

### Create Post
- Able to use markdown language writing articles, inserting images by URL, set links, and preview.
![create_post](https://user-images.githubusercontent.com/81073535/195974672-7e05fc2e-056b-4460-81c7-639f9f55e439.gif)

### Edit Post
- Articles are able to edit after published, with a click on edit button in article page.
![edit_post](https://user-images.githubusercontent.com/81073535/195973917-e5bec20e-4a44-4a73-bd4b-21bfae25fa1f.gif)

### Like and Follow Post
- A simple click on like and follow icon, you can save the article you like.
![like_post](https://user-images.githubusercontent.com/81073535/195973899-62d84f96-6e6c-40b9-b8cb-30171c3d5a12.gif)


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
**Client:** 
- WebRTC
- MediaRecorder
- React
- MaterialUI
- TipTap
- React-Ace
- Socket.IO

**Server:** 
- Node
- Express
- Nginx
- Docker
- Socket.IO
- multer
- aws-sdk

**Database:** 
- MongoDB Atlas

**Cloud service:** 
- Amazon EC2
- Amazon S3
- Amazon CloudFront

**Test:** 
- mocha
- chai
- supertest

## Technical Detail
**Live Streaming**
- Built a WebRTC one-to-many live stream service with Socket.IO for SDP and ICE exchange.
- Using Socket.IO room to separate each live streaming.
- Applied MediaRecorder and design a automatic live stream recording service when stream start.
- Using Amazon S3 and S3 pre-signed URL to automatically recorded live stream with S3 multipart-upload after stream end.

**Online Code Editor**
- Adopted Docker and Dockerfile to create different program language runtime enviroments for program execution.
- Add code version for viewers to use and catch up the streamer's progress, passing data by Socket.IO.
- Applied cpu and memory limited on container with Docker for resource limination.
- Run programs using Node child_process modules and Docker images.
- Handling the infinite loop case by execution time limit.
- Streamer can get each viewer's code from the viewer's editor by a simple click on button using Socket.IO for passing programs.

**Chatroom**
- Many-to-many online chatroom using Socket.IO room.
- Upload images with Amazon S3 and multer, and access with Amazon CloudFront.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Links
- [Wolfon](https://www.wolfon.live)
- [How to make Code sandbox](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-3673b7e6ea06)
- [How to handle infinite loop in Code sandbox](https://medium.com/@Tim_Tsai/docker-%E7%94%A8-dockerfile-%E8%88%87-node-js-%E5%AF%A6%E4%BD%9C%E7%B0%A1%E6%98%93-codesandbox-%E5%BE%8C%E7%AB%AF-part-2-d55c99708eb8)
