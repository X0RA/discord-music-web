import React, { createContext, useState, useEffect, useContext } from "react";
import * as Realm from "realm-web";
import { fetchOldSongs } from "./firebaseHelper";

// Using this so we don't fill up on anon users
const userDetails = {
  username: "appuser@null.null",
  password: "QUR*vuz!hwj9qrw.kvq",
};

// // Creating the Song schema
// const SongSchema = {
//   name: "Song",
//   properties: {
//     _id: "objectId",
//     album: "string",
//     artist: "string",
//     dateTime: "date",
//     discordID: "string",
//     title: "string",
//     image: "string",
//   },
//   primaryKey: "_id",
// };

// const XposterSchema = {
//   "title": "xposter",
//   "properties": {
//     "_id": {
//       "bsonType": "objectId"
//     },
//     "avatar": {
//       "bsonType": "string"
//     },
//     "discordID": {
//       "bsonType": "string"
//     },
//     "username": {
//       "bsonType": "string"
//     }
//   }
// };

// Creating the context
export const SongsContext = createContext();

// Creating the provider component
export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [xposters, setXposters] = useState([]);
  const [games, setGames] = useState([]);
  const app = new Realm.App({ id: "xpostersfm-qfeqw" });
  const credentials = Realm.Credentials.emailPassword(userDetails.username, userDetails.password);

  const logIn = async () => {
    try {
      const user = await app.logIn(credentials);
      return user;
    } catch (err) {
      console.error("Failed to log in", err);
      return null;
    }
  };

  const fetchSongs = async () => {
    const user = await logIn();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const atlas = await user.mongoClient("mongodb-atlas");
    const songsCollection = atlas.db("xpostersfm").collection("songs");
    const records = await songsCollection.find();
    setSongs(records);
    fetchOldSongs().then((old_songs) => {
      if (old_songs) {
        setSongs([...records, ...old_songs]);
      }
    });
  };

  const fetchGames = async () => {
    const user = await logIn();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const atlas = await user.mongoClient("mongodb-atlas");
    const gamesCollection = atlas.db("xpostersfm").collection("games");
    const records = await gamesCollection.find();
    setGames(records);
  };

  const getSteamID = async (gameName) => {
    const user = await logIn();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const atlas = await user.mongoClient("mongodb-atlas");
    const gamesCollection = atlas.db("xpostersfm").collection("steam_game_ids");

    // Use a regular expression for a case-insensitive search
    const regex = new RegExp(`^${gameName}$`, "i");
    const records = await gamesCollection.findOne({ name: regex });
    if (!records) {
      console.error("No match found");
      return;
    }

    return records.appid;
  };

  const fetchXposters = async () => {
    const user = await logIn();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const atlas = await user.mongoClient("mongodb-atlas");
    const xpostersCollection = atlas.db("xpostersfm").collection("xposters");
    const records = await xpostersCollection.find();
    setXposters(records);
  };

  useEffect(() => {
    fetchSongs();
    fetchXposters();
    fetchGames();
  }, []);

  return (
    <SongsContext.Provider value={{ songs, fetchSongs, xposters, fetchXposters, games, fetchGames, getSteamID }}>
      {children}
    </SongsContext.Provider>
  );
};

// Custom hook to use the SongsContext
export const useSongs = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
};
