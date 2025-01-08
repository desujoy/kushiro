# Kushiro

## Overview
**Kushiro** is a simple tool designed to fetch and display random anime from your "Plan to Watch" list on MyAnimeList (MAL). It’s a great way to discover what to watch next, seamlessly integrated with your existing MAL account.

---

## Features
- Fetches random anime from your "Plan to Watch" list.
- User-friendly web interface.
- Quick setup and easy integration with MyAnimeList.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**
  - Download and install it from [Node.js Official Website](https://nodejs.org/en).

---

## Installation

Follow these steps to get Kushiro up and running:

1. Clone the repository:
   ```bash
   git clone https://github.com/desujoy/kushiro
   cd kushiro
   ```

2. Set up the environment:
   - Retrieve your MyAnimeList Client ID by creating an application on [MyAnimeList API Configuration](https://myanimelist.net/apiconfig).
   - Copy the Client ID and paste it into the `sample.env` file.
   - Rename `sample.env` to `.env`:
     ```bash
     mv sample.env .env
     ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   node index.js
   ```

5. Open the application in your browser at:
   [http://localhost:3000/](http://localhost:3000/)

---

## Screenshots

### Desktop 
![Homepage Screenshot](assets/desktop.png)

### Mobile
![Random Anime Screenshot](assets/mobile.png)

---

## Contributing
We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your descriptive message here"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---


### Happy Watching! ✨

