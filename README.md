#  🚀💬 RocketChat Apps.Quick


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Nabhag8848/RocketChat.Apps-OAuth2">
    <img src="quick/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">RocketChat Apps.Quick</h3>
</div>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

```

Introducing Quick App to RocketChat offers a convenient way to send standard responses swiftly, that can work as a pre-written message in customer support. Users can effortlessly create, edit, delete, and save a list of these quick replies, leveraging AI to generate responses tailored to their needs. 

```



##  📜 Getting Started

### Prerequisites

- You need a Rocket.Chat Server Setup
- Rocket.Chat.Apps CLI, 
* In case you don't have run:
  ```sh
  npm install -g @rocket.chat/apps-cli
  ```
- Make sure to Enable development mode



### ⚙️ Installation
- Every RocketChat Apps runs on RocketChat Server, thus everytime you wanna test you need to deploy the app with this note. lets start setting up:

1. Clone the repo
   ```sh
   git clone https://github.com/<yourusername>/Apps.Quick
   ```
2. Install NPM packages
   ```sh
   cd oauth2; npm install
   ```
3. Deploy app using:
   ```sh
   rc-apps deploy --url <serverurl> --username <username> --password <password>
   ```
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
>

4. Once its deploy, Go to Installed Apps and Settings tab in RC,you would see two input fields:
   ```
   
    # Enter Your API URL 
    // Its prefilled with google gemini right now we only support gemini
    # Enter Your API key
    // Go to [Google AI studio](https://aistudio.google.com/) and the in Get API key By and create you key by click the *
Create API key* button .

    
   ```

5. Once Its done save the changes,.
  

<!-- ABOUT THE PROJECT -->
### Why we need Quick?

 Quick Replies in RocketChat brings significant advantages for its community. One notable benefit is the enhanced communication speed it offers. With Quick Replies, users can swiftly respond to messages by selecting from pre-written responses. This not only minimizes delays in communication exchanges but also fosters smoother interactions among users.

## :rocket: Usage :

```
     • To create new reply /quick create.
     • To list all you reply /quick list.
     • To use search using preview /qs <name of reply>.
     • To get help of Usage use /quick help.

```

## ✨ Glimpse :
[oAuth](https://user-images.githubusercontent.com/65061890/226479699-5d975e54-ec27-400e-a853-22e5fc1470b4.webm)


<!-- CONTRIBUTING -->
## 🧑‍💻 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources
Here are some links to examples and documentation:
- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- [DemoApp](https://github.com/RocketChat/Rocket.Chat.Demo.App)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/VipinDevelops/Apps.Quick?style=for-the-badge
[contributors-url]:https://github.com/VipinDevelops/Apps.Quick/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/VipinDevelops/Apps.Quick?style=for-the-badge
[forks-url]:https://github.com/VipinDevelops/Apps.Quick/network/members
[stars-shield]: https://img.shields.io/github/stars/VipinDevelops/Apps.Quick?style=for-the-badge
[stars-url]:https://github.com/VipinDevelops/Apps.Quick/stargazers
[issues-shield]: https://img.shields.io/github/issues/VipinDevelops/Apps.Quick?style=for-the-badge
[issues-url]:https://github.com/VipinDevelops/Apps.Quick/issues
[license-shield]: https://img.shields.io/github/license/VipinDevelops/Apps.Quick?style=for-the-badge
[license-url]:https://github.com/VipinDevelops/Apps.Quick/blob/master/LICENSE.txt
