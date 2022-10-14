# Wolfon

Website : https://www.wolfon.live

A website for **live streaming and learning programs**, combined with a **developer social media**.

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Introduction
**Test account :**
- Account_01: user_1@gmail.com / Password:  123456
- Account_02: user_2@gmail.com / Password: 123456

**Wolfon** is used for programs online learning, tech sharing and article publishing.
Provided a low latency live streaming service and interactive online code editor which can execution programs in JavaScript, Python, and Golang.

After learning programs from live stream, there is a social media for user to publich their tech article or reviews with a rich text editor which support code block, image insertion and link href.
## Demo

Insert gif or link to demo


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


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

**Client:** WebRTC, MediaRecorder, React, MaterialUI, TipTap, React-Ace, Socket.IO

**Server:** Node, Express, Docker, multer, aws-sdk, Socket.IO

**Database:** MongoDB

**Cloud service:** Amazon S3, Amazon EC2

**Test:** mocha, chai, supertest

## Developement

**Live Streaming**
- Built a WebRTC one-to-many live stream service with Socket.IO for SDP and ICE exchange.
- Using Socket.IO room to separate each live streaming.
- Applied MediaRecorder and design a automatic live stream recording service when stream start.
- Using Amazon S3 and S3 pre-signed URL to automatically recorded live stream with S3 multipart-upload after stream end.

**Online Code Editor**
- Adopted Docker and Dockerfile to create different program language runtime enviroments for program execution.
- Applied cpu and memory limited on container with Docker for resource limination.
- Run programs using Node child_process modules and Docker images.
- Handling the infinite loop case.


**Chatroom**
- Many-to-many online chatroom


**Article Publishing**
- Rich text editor on writing article


**Social Media**
- Friend system
