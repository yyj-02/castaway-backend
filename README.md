<p align="center"><img width=20% src="./assets/castaway.png" /></p>

<h1 align="center">
  Castaway
</h1>

<h3 align="center">
  Your friendly podcast app (work in progress)
</h3>

 <br/>

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

## Getting started

Castaway is a podcast app that serves contents from your favorite content creators on iPhone and Android. This project is written in Express and Firebase for the backend and Flutter for the frontend.

## Installation

1. Create a Firebase project [here](https://console.firebase.google.com/u/0/) with "Add project". \*use Blaze plan or above

2. Install the latest firebase tools:

```bash
# using npm
npm install -g firebase-tools

# using yarn
yarn global add firebase-tools
```

3. Login to your Google account linked to Firebase.

```bash
firebase login:ci
```

4. Clone this repository.

```bash
## using ssh
git clone git@github.com:yyj-02/castaway-backend.git

##using https
git clone https://github.com/yyj-02/castaway-backend.git
```

5. Initializing Firebase.

```bash
firebase init
# 1. select the previously created Firebase project
# 2. enable firestore, functions, storage and their respective emulators
# 3. enable typescript but don't enable linting service
```

6. Installing dependencies.

```bash
cd functions/

# using npm
npm install

# using yarn
yarn add
```

7. Add a Google Identity Server [here](https://console.cloud.google.com/customer-identity) to your previously created project, copy the {apiKey} in "APPLICATION SETUP DETAILS". And in "Add provider", select "email and password".

8. Configuring the identity server.

```bash
# in functions/
touch .env
```

In the `.env` file, add this line and replace the apiKey without the brackets.

```dotenv
IDENTITY_SERVER_API_KEY="{apiKey}"
```

9. Running the emulators. \*note that the authentication does not have an emulator so it will be synced to the actual database

```bash
# in functions/
npm run serve
```

10. Deploying to the cloud.

```bash
# in functions/
npm run deploy
```

## Usage

Let {appUrl} denotes the url of the cloud function entry point, e.g.

- (live) https://us-central1-castaway-819d7.cloudfunctions.net/app
- (emulator) http://127.0.0.1:5001/castaway-819d7/us-central1/app

<details>
<summary><h3 style="display: inline;">Create an account</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/auth/signup
```

**Request payload:**
| Property    |  Type  | Description                           |
| ----------- | :----: | :------------------------------------ |
| email       | string | The email associated with the account |
| displayName | string | A display name for the account        |
| password    | string | A strong password                     |

**Response payload:**
| Property     |  Type  | Description                                                  |
| ------------ | :----: | :----------------------------------------------------------- |
| idToken      | string | The id token for this session, to be used for other services |
| refreshToken | string | The refresh token, to be used to retrieve a new id token.    |
| expiresIn    | number | The duration whereby this id token is valid                  |
| displayName  | string | The display name for the account                             |
</details>

<details>
<summary><h3 style="display: inline;">Log into an account</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/auth/login
```

**Request payload:**
| Property |  Type  | Description                    |
| -------- | :----: | :----------------------------- |
| email    | string | The email used for the account |
| password | string | The password used              |

**Response payload:**
| Property     |  Type  | Description                                                  |
| ------------ | :----: | :----------------------------------------------------------- |
| idToken      | string | The id token for this session, to be used for other services |
| refreshToken | string | The refresh token, to be used to retrieve a new id token.    |
| expiresIn    | number | The duration whereby this id token is valid                  |
| displayName  | string | The display name for the account                             |
</details>

<details>
<summary><h3 style="display: inline;">Refresh id token</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/auth/login
```

**Request payload:**
| Property     |  Type  | Description              |
| ------------ | :----: | :----------------------- |
| refreshToken | string | The latest refresh token |

**Response payload:**
| Property     |  Type  | Description                                                  |
| ------------ | :----: | :----------------------------------------------------------- |
| idToken      | string | The id token for this session, to be used for other services |
| refreshToken | string | The refresh token, to be used to retrieve a new id token.    |
| expiresIn    | number | The duration whereby this id token is valid                  |
| displayName  | string | The display name for the account                             |
</details>