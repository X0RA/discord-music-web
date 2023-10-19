import React, { useEffect, useState } from "react";
import { useSongs } from "../lib/atlasHelper";

const TopGames = () => {
  const { games, fetchGames, getSteamID, xposters } = useSongs();
  const [topGames, setTopGames] = useState([]);

  useEffect(() => {
    (async () => {
      let gamesCount = {};
      games.forEach((game) => {
        if (gamesCount[game.game]) {
          gamesCount[game.game].totalTime += game.duration;
          const foundUser = gamesCount[game.game].users.find((user) => user.name === game.discordID);

          if (foundUser) {
            foundUser.playtime += game.duration;
          } else {
            gamesCount[game.game].users.push({
              discordName: xposters.find((xposter) => xposter.discordID === game.discordID).username,
              name: game.discordID,
              playtime: game.duration,
            });
          }
        } else {
          gamesCount[game.game] = {
            totalTime: game.duration,
            users: [
              {
                name: game.discordID,
                discordName: xposters.find((xposter) => xposter.discordID === game.discordID).username,
                playtime: game.duration,
              },
            ],
          };
        }
      });

      console.log(gamesCount);

      const sortedGamesPromises = Object.keys(gamesCount).map(async (game) => ({
        name: game,
        steamID: await getSteamID(game),
        playTime: gamesCount[game].totalTime, // corrected to totalTime
        users: gamesCount[game].users, // added this to include the users and their playtimes
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
            {game.users.map((user, i) => (
              <p key={i} className="text-sm">
                {user.discordName} - {formatPlayTime(user.playtime)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopGames;
