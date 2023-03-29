import { useEffect, useState } from "react";
import { getSongs, getTopArtists, getAlbumArt } from "../lib/pocketbaseHelper";

function App() {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    async function processSongs() {
      const tempSongs = await getSongs();
      const tempAlbumArts = await getAlbumArt();
      const tempTopArtists = await getTopArtists(tempSongs);

      if (topArtists.length > 0) {
        return;
      }

      for (let index = 0; index < tempTopArtists.length; index++) {
        const element = tempTopArtists[index];
        const topAlbum = Object.entries(element.albums).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        let artists = element.name
          .split(";")
          .map((artist) => {
            return artist.trim();
          })
          .join(", ");
        let search_term = topAlbum + " by " + artists;

        let foundObject = await tempAlbumArts.find(
          (obj) => obj.album_artist === search_term
        );
        if (foundObject !== undefined)
          tempTopArtists[index].album_art = foundObject.url;
      }
      await setTopArtists(tempTopArtists);
    }

    processSongs();
  }, []);

  return (
    // <div className="flex justify-center  mt-10">
    <div className="flex justify-center min-h-max mt-10">
      {/* <div className="max-w-screen-xl w-3/4 rounded-3xl bg-black"> */}
      <div className="max-w-screen-xl min-h-max w-3/4 rounded-3xl content">
        <h1 className="text-center text-2xl mb-10 mt-10">
          Top 10 Artists in the Xposters
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topArtists.map((artist, i) => {
            if (i > 10) return;
            const topAlbum = Object.keys(artist.albums).reduce((a, b) =>
              artist.albums[a] > artist.albums[b] ? a : b
            );
            return (
              <div key={artist.name} className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <img
                    src={artist.album_art}
                    alt="album art"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <h1 className="mt-4 text-2xl font-medium">{artist.name}</h1>
                <h2 className="text-xl font-medium mb-2">{topAlbum}</h2>
                <h3 className="">{artist.total_listens} listens</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
