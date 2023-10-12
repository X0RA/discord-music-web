import { useEffect, useState } from "react";
import { useSongs } from "../lib/atlasHelper";
import albumArt from "album-art";

// TODO: top three users instead of one


function TopArtists() {
  const { songs, xposters } = useSongs();
  const [topArtists, setTopArtists] = useState([]);
  const [topArtistCovers, setTopArtistCovers] = useState([]);

  useEffect(() => {
    let artistsCount = {};

    songs.forEach((song) => {
      let artist = song.artist.split(";").join(", ").trim();
      if (artistsCount[artist]) {
        artistsCount[artist].count++;
        artistsCount[artist].users[song.discordID] = (artistsCount[artist].users[song.discordID] || 0) + 1;

        if (artistsCount[artist].albums[song.album]) {
          artistsCount[artist].albums[song.album]++;
        } else {
          artistsCount[artist].albums[song.album] = 1;
        }
      } else {
        artistsCount[artist] = {
          count: 1,
          albums: { [song.album]: 1 },
          users: { [song.discordID]: 1 },
        };
      }
    });

    const sortedArtists = Object.keys(artistsCount)
      .map((artist) => {
        const topAlbum = Object.keys(artistsCount[artist].albums).sort(
          (a, b) => artistsCount[artist].albums[b] - artistsCount[artist].albums[a]
        )[0];

        const topUser = Object.keys(artistsCount[artist].users).sort(
          (a, b) => artistsCount[artist].users[b] - artistsCount[artist].users[a]
        )[0];

        return {
          name: artist,
          count: artistsCount[artist].count,
          topAlbum,
          topUser,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // This will limit the results to the top 10 artists

    setTopArtists(sortedArtists);
  }, [songs]);

  useEffect(() => {
    if (topArtists.length > 0) {
      const getAlbumArt = async () => {
        const albumArtPromises = topArtists.map(async (artist) => {
          // Try to get the album art from sessionStorage first
          const cachedArt = sessionStorage.getItem(artist.name + artist.topAlbum);

          if (cachedArt) {
            const newArt = JSON.parse(cachedArt);

            setTopArtistCovers((prevArts) => [...prevArts, newArt]);
            return newArt;
          } else {
            try {
              const url = await albumArt(artist.name, { album: artist.topAlbum, size: "medium" });
              const newArt = { artistName: artist.name, album: artist.topAlbum, album_art: url };

              // Save the fetched album art in sessionStorage
              sessionStorage.setItem(artist.name + artist.topAlbum, JSON.stringify(newArt));

              setTopArtistCovers((prevArts) => [...prevArts, newArt]);
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
  }, [topArtists]);

  return (
    <div className="flex justify-center min-h-max mt-10">
      <div className="max-w-screen-xl min-h-max w-3/4 rounded-3xl content">
        <h1 className="text-center text-2xl mb-10 mt-10">Top 12 Artists in the Xposters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topArtists.map((artist, i) => {
            const albumCover = Array.isArray(topArtistCovers)
              ? topArtistCovers.find((cover) => cover.artistName === artist.name)
              : null;
            const topXposter = xposters.find((xposter) => xposter.discordID === artist.topUser);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <img
                    src={albumCover ? albumCover.album_art : ""}
                    alt="album art"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <p>{topXposter ? topXposter.username : "User not found"}</p>
                <h1 className="mt-4 text-2xl font-medium">{artist.name}</h1>
                <h3 className="">{artist.count} listens</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TopArtists;