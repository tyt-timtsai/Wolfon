# Wolfon [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

[Wolfon Website](https://www.wolfon.live)

A website for **live streaming and learning programs**, combined with a **developer social media**.

## Table of Contents
- [Introduction](#Introduction)  
- [Demo](#Demo)  

    **Live**
    - [Create Live Stream](#Create-Live)
    - [Join Live Stream](#Join-Live)
    - [Review Stream](#Review-Live)

     **Code Editor**
    - [Select Language](#Select-Language)
    - [Programming](#Programming)
    - [Get Viewer Code](#Get-Viewer-Code)
    - [Add Version](#addCode)
    - [Use Version](#useCode)

    **Post**
    - [Create Post](#Create-Post)
    - [Browse Post](#Browse-Post)
    - [Edit Post](#Edit-Post)
    - [Like and Follow Post](#Like-and-Follow-Post)
- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [Technical Detail](#Technical0-Detail)
## License

[MIT](https://choosealicense.com/licenses/mit/)


## Introduction
**Test account :**
- Account_01 (Wolfon): user01@gmail.com / Password: 123456
- Account_02 (Sam): user02@gmail.com / Password: 123456

**Wolfon** is used for programs online learning, tech sharing and article publishing.
Provided a low latency live streaming service and interactive online code editor which can execution programs in JavaScript, Python, and Golang.

After learning programs from live stream, there is a social media for user to publich their tech articles and reviews, writing with a rich text editor which support code block, image insertion and link href.

## System Architecture

![架構細節1-1](https://user-images.githubusercontent.com/81073535/195830529-42a86570-194e-4aea-b980-24467b09faac.png)## Demo

<a name="createLive"></a>
#### Create Live
Insert gif or link to demo

#### Join Live
#### Review Live

#### Select Language
#### Programming
#### Get Viewer Code
#### Add Version
#### Use Version

#### Create Post
#### Browse Post
#### Edit Post
#### Like and Follow Post<a name="features"></a>
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
- Sign-up and sign-in## Tech Stack

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