# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Pierre Schutz | 272648 |
| Nathan Kammoun | 282625 |
| David Cian | 287967 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

The dataset we will explore in this project with the Spotify Web API [1] which contains songs, users, artists, 
and playlist data from Spotify audio streaming platform. 

According to Wikipedia, “Spotify offers digital copyright restricted recorded music and podcasts, 
including more than 70 million songs, from record labels and media companies.
As a freemium service, basic features are free with advertisements and limited control, 
while additional features, such as offline listening and commercial-free listening, 
are offered via paid subscriptions. Users can search for music based on artist, album, 
or genre, and can create, edit, and share playlists.” 

This data is high quality as it contains production ready data that are users by millions on customers everyday. 
We will not need pre-processing, or cleaning to use the data, and will query the API in real-time to build our website visualisation. 
Doing so, we can take profit of the possibility to fetch user playlists data using Spotify Login widgets. 

The Spotify API is big, we will therefore specify here the endpoints and objects that we will use through this project. 
Those can be found the the Spotify API Reference [2].

#### Get Playlists

In order to get playlist, we have 3 endpoints available to us: 

**Endpoints:**
- Get Featured Playlists: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-featured-playlists
- Get a Category's playlists: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-categories-playlists
- Get current user's playlists: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists


**Object:**
- PlaylistObject: https://developer.spotify.com/documentation/web-api/reference/#object-playlistobject

These endpoints enable us to fetch the features playlists, playlists by category, and users playlists.
We aims to use those to enable the use select multiple playlist he want to analyse and compare (user login will be optional).

#### Tracks and Artists

The playlists are a list of selected tracks, we can get details information about the 
tracks and their authors using the tracks and artists endpoints described below.

**Endpoints:**
- Get an artist: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-an-artist
- Get an artist's related artists: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-an-artists-related-artists
- Get a track: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-track

**Objects:**
- ArtistObject: https://developer.spotify.com/documentation/web-api/reference/#object-artistobject
- TrackObject: https://developer.spotify.com/documentation/web-api/reference/#object-trackobject

These endpoints enable us to get detailed information about the playlists' tracks and artists. 
The related artists endpoint will help us understand similarities between artists. 

#### Track's audio features

Finally, we most interesting feature of this Spotify API, the audio features. 
Spotify API provides a list of track features that we will use to analyse the tracks such as
'acousticness', 'danceability', or 'speechiness' (see AudioFeaturesObject for a detailed description of them)

**Endpoint:**
- Get Audio Features: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-audio-features
**Object:**
- AudioFeaturesObject: https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject


[1] Spotify Web API: https://developer.spotify.com/documentation/web-api/
[2] Spotify API Reference: https://developer.spotify.com/documentation/web-api/reference/#reference-index


### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work

The Spotify API is very popular. Spotify has a well documented API and provides a lot useful tools on a dedicated ‘Spotify for Developers’ website. 

Spotify showcase a broad panel of the works done through their API. It was a great source of inspiration as well as a big challenge in order to propose something original. A non exhaustive list of interesting projects and visualization with Spotify data can be found here : https://developer.spotify.com/community/showcase/. 

It is difficult to bring something new to all that has already been done but we believe that taking a playlist oriented approach is both meaningful and original. As a matter of fact, our visualization will take place on a website which brings a dimension of interaction with the user. Our approach will privilege user interaction with interactive visualizations, it will focus on visually revealing playlists features, possible links between playlists or what makes them different.  The user will be able to navigate by himself through the data to visualize what he wants. It will be all the more insightful if the user connects to Spotify through the Website to visualize his own playlists.



## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

