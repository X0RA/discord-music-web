import React, { useEffect, useState } from "react";
import { useSongs } from "../lib/atlasHelper";

const TopGames = () => {
  const { games, fetchGames, getSteamID } = useSongs();
  const [topGames, setTopGames] = useState([]);

  useEffect(() => {
    (async () => {
      let gamesCount = {};
      games.forEach((game) => {
        if (gamesCount[game.game]) {
          gamesCount[game.game].playTime += game.duration;
          gamesCount[game.game].users.add(game.discordID);
        } else {
          gamesCount[game.game] = {
            playTime: game.duration,
            users: new Set([game.discordID]),
          };
        }
      });

      const sortedGamesPromises = Object.keys(gamesCount).map(async (game) => ({
        name: game,
        steamID: await getSteamID(game),
        playTime: gamesCount[game].playTime,
        userCount: gamesCount[game].users.size,
      }));

      const sortedGames = await Promise.all(sortedGamesPromises);

      setTopGames(sortedGames.sort((a, b) => b.playTime - a.playTime));
    })();
  }, [games]);

  const formatPlayTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours} hours ${minutes} minutes`;
  };

  return (
    <div className="flex justify-center min-h-max mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topGames.map((game, i) => (
          <div key={i} className="flex flex-col items-center  p-4 rounded">
            <img
              className="mt-4 rounded w-64 h-36 object-cover" // Added classes here
              src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steamID}/header.jpg`}
              alt={`${game.name} game header`}
            />
            <h1 className="mt-4 text-2xl font-medium">{game.name}</h1>
            <h3 className="">{formatPlayTime(game.playTime)} played</h3>
            <h3 className="">{game.userCount} players</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopGames;
