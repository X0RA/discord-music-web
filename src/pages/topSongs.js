import { useEffect, useState } from "react";
import { useSongs } from "../lib/atlasHelper";
import albumArt from "album-art";


function TopSongs() {
  const { songs, xposters } = useSongs();
  const [topSongs, setTopSongs] = useState([]);
  const [songCovers, setSongCovers] = useState([]);

  useEffect(() => {
    let songCount = {};

    songs.forEach((song) => {
      let songTitle = song.title.trim();
      let artist = song.artist.trim();
      if (songCount[songTitle]) {
        songCount[songTitle].count++;
        songCount[songTitle].users[song.discordID] = (songCount[songTitle].users[song.discordID] || 0) + 1;
      } else {
        songCount[songTitle] = {
          count: 1,
          users: { [song.discordID]: 1 },
          artist: artist, // Added artist info for retrieving album art later
          album: song.album, // Added album info for retrieving album art later
        };
      }
    });

    const sortedSongs = Object.keys(songCount)
      .map((title) => {
        const topUser = Object.keys(songCount[title].users).sort(
          (a, b) => songCount[title].users[b] - songCount[title].users[a]
        )[0];

        return {
          title: title,
          count: songCount[title].count,
          topUser,
          artist: songCount[title].artist, // Pass artist info
          album: songCount[title].album, // Pass album info
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // This will limit the results to the top 12 songs

    setTopSongs(sortedSongs);
  }, [songs]);

  useEffect(() => {
    if (topSongs.length > 0) {
      const getAlbumArt = async () => {
        const albumArtPromises = topSongs.map(async (song) => {
          // Modifying the key used to store the data in sessionStorage
          const cachedArt = sessionStorage.getItem(song.artist + song.album + song.title);

          if (cachedArt) {
            const newArt = JSON.parse(cachedArt);
            setSongCovers((prevArts) => [...prevArts, newArt]);
            return newArt;
          } else {
            try {
              const url = await albumArt(song.artist, { album: song.album, size: "medium" });
              const newArt = { songTitle: song.title, album: song.album, album_art: url };

              // Modifying the key used to store the data in sessionStorage
              sessionStorage.setItem(song.artist + song.album + song.title, JSON.stringify(newArt));

              setSongCovers((prevArts) => [...prevArts, newArt]);
              return newArt;
            } catch (error) {
              console.error("Error fetching album art", error);
            }
          }
        });

        await Promise.all(albumArtPromises);
      };

      getAlbumArt();
    }
  }, [topSongs]);

  return (
    <div className="flex justify-center min-h-max mt-10">
      <div className="max-w-screen-xl min-h-max w-3/4 rounded-3xl content">
        <h1 className="text-center text-2xl mb-10 mt-10">Top 12 Songs in the Xposters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topSongs.map((song, i) => {
            const songCover = Array.isArray(songCovers)
              ? songCovers.find((cover) => cover.songTitle === song.title)
              : null;
            const topXposter = xposters.find((xposter) => xposter.discordID === song.topUser);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <img
                    src={songCover ? songCover.album_art : ""}
                    alt="album art"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <p>{topXposter ? topXposter.username : "User not found"}</p>
                <div className="relative mt-4 flex justify-center">
                  <h1 className="text-2xl font-medium inline-block" title={song.title}>
                    {song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title}
                  </h1>
                  <div className="absolute left-0 bg-black text-white text-sm rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    {song.title}
                  </div>
                </div>

                <h3 className="">{song.count} listens</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TopSongs;
