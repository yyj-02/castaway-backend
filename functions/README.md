# Castaway API Documentation

Let {appUrl} denotes the url of the cloud function entry point, e.g.

- (live) https://us-central1-castaway-819d7.cloudfunctions.net/app/api
- (emulator) http://127.0.0.1:5001/castaway-819d7/us-central1/app/api

<br>

## Authentication

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
{appUrl}/auth/refreshToken
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

## Podcast

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
<summary><h3 style="display: inline;">Get all podcasts</h3></summary>

**Method:** GET

**Content-Type:** none

**Endpoint:**
```
{appUrl}/podcasts
```

**Response payload:**
An array of podcasts with the following properties:

| Property          |  Type  | Description                                  |
| ----------------- | :----: | :------------------------------------------- |
| podcastId         | string | The id of the podcast                        |
| title             | string | The title of the podcast                     |
| description       | string | The description of the podcast               |
| artistName        | string | The name of the artist                       |
| durationInMinutes | number | The duration of the podcast                  |
| imgUrl            | string | The cover image url that expires in one hour |
| genres            | array  | The genres of the podcast                    |
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
| Property          |  Type   | Description                                  |
| ----------------- | :-----: | :------------------------------------------- |
| title             | string  | The title of the podcast                     |
| description       | string  | The description of the podcast               |
| artistName        | string  | The name of the artist                       |
| durationInMinutes | number  | The duration of the podcast                  |
| imgUrl            | string  | The cover image url that expires in one hour |
| genres            |  array  | The genres of the podcast                    |
| public            | boolean | The accessibility of the podcast             |
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

<br>

## User

<details>
<summary><h3 style="display: inline;">View profile</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/info
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property |  Type  | Description                                            |
| -------- | :----: | :----------------------------------------------------- |
| status   | string | Should be "OK"                                         |
| message  | string | Should be "Your podcast cover image has been updated." |
</details>

<details>
<summary><h3 style="display: inline;">View creations</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/creations
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
An array of podcasts with the following properties:

| Property          |  Type   | Description                                  |
| ----------------- | :-----: | :------------------------------------------- |
| podcastId         | string  | The id of the podcast                        |
| title             | string  | The title of the podcast                     |
| description       | string  | The description of the podcast               |
| artistName        | string  | The name of the artist                       |
| durationInMinutes | number  | The duration of the podcast                  |
| imgUrl            | string  | The cover image url that expires in one hour |
| genres            |  array  | The genres of the podcast                    |
| public            | boolean | The accessibility of the podcast             |
</details>

<details>
<summary><h3 style="display: inline;">View favorites</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/favorites
```

**Request payload:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
An array of podcasts with the following properties:

| Property          |  Type   | Description                                  |
| ----------------- | :-----: | :------------------------------------------- |
| podcastId         | string  | The id of the podcast                        |
| title             | string  | The title of the podcast                     |
| description       | string  | The description of the podcast               |
| artistName        | string  | The name of the artist                       |
| durationInMinutes | number  | The duration of the podcast                  |
| imgUrl            | string  | The cover image url that expires in one hour |
| genres            |  array  | The genres of the podcast                    |
| public            | boolean | The accessibility of the podcast             |
</details>

<details>
<summary><h3 style="display: inline;">Change display name</h3></summary>

**Method:** PUT

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/displayName
```

**Request payload:**
| Property           |  Type  | Description          |
| ------------------ | :----: | :------------------- |
| idToken            | string | The latest id token  |
| updatedDisplayName | string | The new display name |

**Response payload:**
| Property |  Type  | Description                               |
| -------- | :----: | :---------------------------------------- |
| status   | string | Should be "OK"                            |
| message  | string | Should be "Your display name is updated." |
</details>

<details>
<summary><h3 style="display: inline;">Add to favorites</h3></summary>

**Method:** PUT

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/favorites
```

**Request payload:**
**Request payload:**
| Property  |  Type  | Description                                    |
| --------- | :----: | :--------------------------------------------- |
| idToken   | string | The latest id token                            |
| podcastId | string | The id of the podcast to be added to favorites |

**Response payload:**
| Property |  Type  | Description                                  |
| -------- | :----: | :------------------------------------------- |
| status   | string | Should be "OK"                               |
| message  | string | Should be "Podcast added to your favorites." |
</details>

<details>
<summary><h3 style="display: inline;">Delete from favorites</h3></summary>

**Method:** DELETE

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/favorites
```

**Request payload:**
| Property  |  Type  | Description                                        |
| --------- | :----: | :------------------------------------------------- |
| idToken   | string | The latest id token                                |
| podcastId | string | The id of the podcast to be deleted from favorites |

**Response payload:**
| Property |  Type  | Description                                     |
| -------- | :----: | :---------------------------------------------- |
| status   | string | Should be "OK"                                  |
| message  | string | Should be "Podcast removed from your favorite." |
</details>

<br>

## Livestream

<details>
<summary><h3 style="display: inline;">Get all livestreams</h3></summary>

**Method:** GET

**Content-Type:** none

**Endpoint:**
```
{appUrl}/livestreams
```

**Response payload:**
An array of livestreams with the following properties:

| Property          |  Type  | Description                           |
| ----------------- | :----: | :------------------------------------ |
| livestreamId      | string | The id of the livestream              |
| title             | string | The title of the livestream           |
| description       | string | The description of the livestream     |
| artistName        | string | The streamer of the livestream        |
| streamerConnected | string | The connection status of the streamer |
</details>

<details>
<summary><h3 style="display: inline;">Access livestream details</h3></summary>

**Method:** GET

**Content-Type:** none

**Endpoint:**
```
{appUrl}/livestreams/:livestreamId
```

**Response payload:**
| Property          |  Type  | Description                           |
| ----------------- | :----: | :------------------------------------ |
| title             | string | The title of the livestream           |
| description       | string | The description of the livestream     |
| artistName        | string | The streamer of the livestream        |
| streamerConnected | string | The connection status of the streamer |
</details>

<details>
<summary><h3 style="display: inline;">Create livestream</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/livestreams
```
**Headers:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Request payload:**
| Property    |  Type  | Description                       |
| ----------- | :----: | :-------------------------------- |
| title       | string | The title of the livestream       |
| description | string | The description of the livestream |

**Response payload:**
| Property     |  Type  | Description              |
| ------------ | :----: | :----------------------- |
| livestreamId | string | The id of the livestream |
</details>

<details>
<summary><h3 style="display: inline;">Delete livestream</h3></summary>

**Method:** DELETE

**Content-Type:** none

**Endpoint:**
```
{appUrl}/livestreams/:livestreamId
```
**Headers:**
| Property |  Type  | Description         |
| -------- | :----: | :------------------ |
| idToken  | string | The latest id token |

**Response payload:**
| Property |  Type  | Description                                   |
| -------- | :----: | :-------------------------------------------- |
| status   | string | Should be "OK"                                |
| message  | string | Should be "Your livestream has been removed." |
</details>

<!-- Depreciated content (to be deleted) -->
<!-- Before using the livestream API, user must obtain a messaging token (registration token) from Firebase Cloud Messaging using this [guide](https://firebase.google.com/docs/cloud-messaging) with the [Vapid Key](https://vapidkeys.com/) `BKJQoJxKgPSCCw_h_aIj-q0M2QNftW_yAFwajXfxNFJgOYh3CihrPgotMhQNZOv95ab6DWM-AGRe7kschUhccVk`.

<details>
<summary><h3 style="display: inline;">Register Messaging Token</h3></summary>

**Method:** POST

**Content-Type:** application/json

**Endpoint:**
```
{appUrl}/users/info
```

**Request payload:**
| Property       |  Type  | Description                         |
| -------------- | :----: | :---------------------------------- |
| idToken        | string | The latest id token                 |
| messagingToken | string | The assigned FCM registration token |

**Response payload:**
| Property |  Type  | Description                                     |
| -------- | :----: | :---------------------------------------------- |
| status   | string | Should be "OK"                                  |
| message  | string | Should be "Your messaging token is registered." |
</details> -->

## TODO

- [x] CRUD for podcast
- [x] Cloud storage and syncing with Firestore
- [x] Stream link using signed url
- [x] Authentication and authorization
- [x] Provide artist name instead of artist id
- [x] Provide image link instead of image id
- [x] Remove podcast id in GET
- [x] Add user profile CRUD
- [x] Cloud messaging
- [x] Socket io media server
- [ ] Add reset password option

[go to media server documentation →](../media_server/README.md)

[← back to main documentation](../README.md)