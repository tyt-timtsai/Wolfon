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
    - [Get Viewer Code](#Get-Viewer-Code)
    - [Add and Use Version](#Add-and-Use-Version)

    **Post**
    - [Create Post](#Create-Post)
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

![架構細節1-1](https://user-images.githubusercontent.com/81073535/195830529-42a86570-194e-4aea-b980-24467b09faac.png)

## Demo
#### Create Live
![create_live](https://user-images.githubusercontent.com/81073535/195973721-20f8dd9e-d3b8-457e-99e7-036638a96e28.gif)

#### Join Live
![join_live](https://user-images.githubusercontent.com/81073535/195973726-deb0214f-e0a1-4889-bf44-ae523b44f545.gif)

#### End Live
![end_live](https://user-images.githubusercontent.com/81073535/195973903-ea939606-d964-4ded-b2cc-9ed6e868f9ef.gif)

#### Review Live
![review_live](https://user-images.githubusercontent.com/81073535/195973734-f60e1a6c-bd38-40ef-92ce-1178638c78b9.gif)

#### Select Language
![select_language](https://user-images.githubusercontent.com/81073535/195973744-28e16996-2a92-4825-aa4c-8d4b058d293c.gif)

#### Get Viewer Code
![get_viewer_code](https://user-images.githubusercontent.com/81073535/195974129-84fd8464-2023-438c-8b3c-df8fb02187c5.gif)

#### Add and Use Version
![add_code](https://user-images.githubusercontent.com/81073535/195973880-3f9443ca-bc2a-4f22-be1a-81f37009e956.gif)

#### Create Post

#### Edit Post
![edit_post](https://user-images.githubusercontent.com/81073535/195973917-e5bec20e-4a44-4a73-bd4b-21bfae25fa1f.gif)

#### Like and Follow Post
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
