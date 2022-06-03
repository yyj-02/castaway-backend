<p align="center"><img width=20% src="./assets/castaway.png" /></p>

<h1 align="center">
  Castaway
</h1>

<h3 align="center">
  Your friendly podcast app (work in progress)
</h3>

 <br/>

<div align="center">

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

</div>

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

- (live) https://us-central1-castaway-819d7.cloudfunctions.net/app/api
- (emulator) http://127.0.0.1:5001/castaway-819d7/us-central1/app/api

<br>

### Authentication

A successful login or account creation will grant user an id token, similar to a cookie in browser, and a refresh token. The id token will allow user to use any of the listed services without sign in within a certain duration. After which, user need to exchange the refresh token for a new id token.

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

<br>

### Podcast

The process of creating a podcast entails uploading an audio file, followed by an image file and lastly adding the podcast details.

<details>
<summary><h3 style="display: inline;">Upload audio file</h3></summary>

**Method:** POST

**Content-Type:** multipart/form-data

**Endpoint:**
```
{appUrl}/uploads/podcasts
```

**Request payload:**
| Property |  Type  | Description                        |
| -------- | :----: | :--------------------------------- |
| idToken  | string | The latest id token                |
| podcast  |  file  | An audio file in the format of mp3 |

**Response payload:**
| Property        |  Type  | Description                                                 |
| --------------- | :----: | :---------------------------------------------------------- |
| podcastUploadId | string | The id for the upload, to be used when creating the podcast |
</details>

<details>
<summary><h3 style="display: inline;">Upload image file</h3></summary>

**Method:** POST

**Content-Type:** multipart/form-data

**Endpoint:**
```
{appUrl}/uploads/images
```

**Request payload:**
| Property |  Type  | Description                                 |
| -------- | :----: | :------------------------------------------ |
| idToken  | string | The latest id token                         |
| image    |  file  | An image file in the format of png/jpg/jpeg |

**Response payload:**
| Property      |  Type  | Description                                                 |
| ------------- | :----: | :---------------------------------------------------------- |
| imageUploadId | string | The id for the upload, to be used when creating the podcast |
</details>

<details>
<summary><h3 style="display: inline;">Create podcast</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts
```

**Request payload:**
| Property        |  Type   | Description                            |
| --------------- | :-----: | :------------------------------------- |
| idToken         | string  | The latest id token                    |
| podcastUploadId | string  | The upload id of the audio file        |
| imageUploadId   | string  | The upload id of the image file        |
| title           | string  | The title for the podcast              |
| description     | string  | A description for the podcast          |
| genres          |  array  | An array of string denoting the genres |
| public          | boolean | The accessibility of the podcast       |

**Response payload:**
| Property  |  Type  | Description                                                            |
| --------- | :----: | :--------------------------------------------------------------------- |
| podcastId | string | The id for the podcast, to be used to access/update/delete the podcast |
</details>

<details>
<summary><h3 style="display: inline;">Access podcast details</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId/info
```

**Request payload:**
| Property |  Type  | Description                                                            |
| -------- | :----: | :--------------------------------------------------------------------- |
| idToken  | string | (Optional) The latest id token, required if the podcast set to private |

**Response payload:**
| Property          |  Type   | Description                                         |
| ----------------- | :-----: | :-------------------------------------------------- |
| title             | string  | The title of the podcast                            |
| description       | string  | The description of the podcast                      |
| path              | string  | *Useless shit I haven't deleted                     |
| imgPath           | string  | *Useless shit I haven't deleted                     |
| durationInMinutes | number  | The duration of the podcast                         |
| artistId          | string  | *Now a meaningless id, to be changed to artist name |
| genres            |  array  | The genres of the podcast                           |
| public            | boolean | The accessibility of the podcast                    |
</details>

<details>
<summary><h3 style="display: inline;">Stream podcast</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId/stream
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property   |  Type  | Description                          |
| ---------- | :----: | :----------------------------------- |
| podcastUrl | string | The url to stream the mp3 file       |
| message    | string | The duration before the link expires |
</details>

<details>
<summary><h3 style="display: inline;">Delete podcast</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId/delete
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property |  Type  | Description                                |
| -------- | :----: | :----------------------------------------- |
| status   | string | Should be "OK"                             |
| message  | string | Should be "Your podcast has been removed." |
</details>

<br>

To update the upload file or podcast, choose the appropriate route below and provide the latest id token and the relevant upload id or podcast id.

<details>
<summary><h3 style="display: inline;">Update audio file upload</h3></summary>

**Method:** PUT

**Content-Type:** multipart/form-data

**Endpoint:**
```
{appUrl}/uploads/podcasts/:podcastUploadId
```

**Request payload:**
| Property |  Type  | Description                                 |
| -------- | :----: | :------------------------------------------ |
| idToken  | string | The latest id token                         |
| podcast  |  file  | The updated audio file in the format of mp3 |

**Response payload:**
| Property |  Type  | Description                               |
| -------- | :----: | :---------------------------------------- |
| status   | string | Should be "OK"                            |
| message  | string | Should be "Your upload has been updated." |
</details>

<details>
<summary><h3 style="display: inline;">Update image file upload</h3></summary>

**Method:** PUT

**Content-Type:** multipart/form-data

**Endpoint:**
```
{appUrl}/uploads/images/:imageUploadId
```

**Request payload:**
| Property |  Type  | Description                                          |
| -------- | :----: | :--------------------------------------------------- |
| idToken  | string | The latest id token                                  |
| image    |  file  | The updated image file in the format of png/jpg/jpeg |

**Response payload:**
| Property |  Type  | Description                               |
| -------- | :----: | :---------------------------------------- |
| status   | string | Should be "OK"                            |
| message  | string | Should be "Your upload has been updated." |
</details>

<details>
<summary><h3 style="display: inline;">Delete audio file</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/uploads/podcasts/:podcastUploadId/delete
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property |  Type  | Description                               |
| -------- | :----: | :---------------------------------------- |
| status   | string | Should be "OK"                            |
| message  | string | Should be "Your upload has been deleted." |
</details>

<details>
<summary><h3 style="display: inline;">Delete image file</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/uploads/images/:imageUploadId/delete
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property |  Type  | Description                               |
| -------- | :----: | :---------------------------------------- |
| status   | string | Should be "OK"                            |
| message  | string | Should be "Your upload has been deleted." |
</details>

<details>
<summary><h3 style="display: inline;">Update podcast details</h3></summary>

**Method:** PUT

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId
```

**Request payload:**
| Property    |  Type   | Description                              |
| ----------- | :-----: | :--------------------------------------- |
| idToken     | string  | The latest id token                      |
| title       | string  | The updated title                        |
| description | string  | The updated description                  |
| genres      |  array  | The updated list of genres               |
| public      | boolean | The updated accessibility of the podcast |

**Response payload:**
| Property |  Type  | Description                                |
| -------- | :----: | :----------------------------------------- |
| status   | string | Should be "OK"                             |
| message  | string | Should be "Your podcast has been updated." |
</details>

<details>
<summary><h3 style="display: inline;">Update podcast audio file</h3></summary>

**Method:** PUT

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId/podcast
```

**Request payload:**
| Property               |  Type  | Description                             |
| ---------------------- | :----: | :-------------------------------------- |
| idToken                | string | The latest id token                     |
| updatedPodcastUploadId | string | The upload id of the updated audio file |

**Response payload:**
| Property |  Type  | Description                                            |
| -------- | :----: | :----------------------------------------------------- |
| status   | string | Should be "OK"                                         |
| message  | string | Should be "Your podcast audio track has been updated." |
</details>

<details>
<summary><h3 style="display: inline;">Update podcast image file</h3></summary>

**Method:** PUT

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/podcasts/:podcastId/image
```

**Request payload:**
| Property             |  Type  | Description                             |
| -------------------- | :----: | :-------------------------------------- |
| idToken              | string | The latest id token                     |
| updatedImageUploadId | string | The upload id of the updated image file |

**Response payload:**
| Property |  Type  | Description                                            |
| -------- | :----: | :----------------------------------------------------- |
| status   | string | Should be "OK"                                         |
| message  | string | Should be "Your podcast cover image has been updated." |
</details>
