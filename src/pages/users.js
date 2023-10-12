import React, { useEffect, useState } from "react";
import { useSongs } from "../lib/atlasHelper";

function Artists() {
  const { songs, xposters } = useSongs();
  const [usersWithSongs, setUsersWithSongs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserSongs, setSelectedUserSongs] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [covers, setCovers] = useState([]);

  useEffect(() => {
    const usersWithSongs = xposters.filter((xposter) => songs.some((song) => song.discordID === xposter.discordID));
    setUsersWithSongs(usersWithSongs);
  }, [xposters, songs]);

  useEffect(() => {
    if (selectedUser) {
      const userSongs = songs.filter((song) => song.discordID === selectedUser.discordID);
      userSongs.forEach((song) => {
        song.artist = song.artist.split(";").join(", ").trim();
      });

      let topSongs, topArtists, topAlbums;

      switch (selectedMetrics) {
        case "songs":
          topSongs = userSongs; // Directly assign if you need some other logic implement here
          setSelectedUserSongs(topSongs);
          break;

        case "artists":
          const artistCounts = userSongs.reduce((acc, song) => {
            acc[song.artist] = (acc[song.artist] || 0) + 1;
            return acc;
          }, {});
          topArtists = Object.keys(artistCounts)
            .map((artist) => ({ artist, count: artistCounts[artist] }))
            .sort((a, b) => b.count - a.count);
          setSelectedUserSongs(topArtists);
          break;

        case "albums":
          const albumCounts = userSongs.reduce((acc, song) => {
            acc[song.album] = (acc[song.album] || 0) + 1;
            return acc;
          }, {});
          topAlbums = Object.keys(albumCounts)
            .map((album) => ({ album, count: albumCounts[album] }))
            .sort((a, b) => b.count - a.count);
          setSelectedUserSongs(topAlbums);
          break;

        default:
          break;
      }
    } else {
      setSelectedUserSongs([]);
    }
  }, [selectedUser, songs, selectedMetrics]);

  const handleUserClick = (user) => {
    setSelectedUser(selectedUser?.discordID === user.discordID ? null : user);
  };

  const handleMetricsClick = (state) => {
    setSelectedMetrics(state);
  };

  return (
    <div className="flex justify-center h-screen mt-10">
      <div className="max-w-screen-xl h-auto w-3/4 rounded-3xl content">
        {/* available users */}
        {usersWithSongs.map((user, i) => (
          <button
            key={i}
            className={
              selectedUser?.discordID === user.discordID
                ? "bg-blue-400 rounded-full m-2 p-1 pr-2 pl-2"
                : "bg-blue-200 dark:bg-blue-900 rounded-full m-2 p-1 pr-2 pl-2"
            }
            onClick={() => handleUserClick(user)}>
            {user.username}
          </button>
        ))}

        {/* selector */}
        <div className="flex justify-center">
          {["songs", "artists", "albums"].map((metric, i) => (
            <button
              key={i}
              className={
                selectedMetrics === metric
                  ? "bg-green-700 rounded-full m-2 p-1 pr-2 pl-2"
                  : "bg-green-900 dark:bg-green-900 rounded-full m-2 p-1 pr-2 pl-2"
              }
              onClick={() => handleMetricsClick(metric)}>
              {metric}
            </button>
          ))}
        </div>

        {/* users songs */}
        <div className="mt-5">
          {selectedMetrics === "songs" &&
            selectedUserSongs.map((song, i) => (
              <div key={i} className="flex flex-row">
                <h1>
                  {song.artist} - {song.title}
                </h1>{" "}
                {/* Adjusted to show song title along with artist */}
              </div>
            ))}

          {selectedMetrics === "artists" &&
            selectedUserSongs.map((item, i) => (
              <div key={i} className="flex flex-row">
                <h1>
                  {item.artist} ({item.count} songs)
                </h1>{" "}
                {/* Adjusted to show artist and song count */}
              </div>
            ))}

          {selectedMetrics === "albums" &&
            selectedUserSongs.map((item, i) => (
              <div key={i} className="flex flex-row">
                <h1>
                  {item.album} ({item.count} songs)
                </h1>{" "}
                {/* Adjusted to show album and song count */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Artists;
