import React, { useEffect } from "react";
import { useState } from "react";
import { getAllUsers, getTopArtistsByUser } from "../lib/pocketbaseHelper";

export default function Artists() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userSongs, setUserSongs] = useState([]);

  const GetSongs = async (user) => {
    const songs = await getTopArtistsByUser(user);
    setUserSongs(songs);
  };

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
    });
  }, []);
  return (
    // <div className="flex justify-center  mt-10">
    <div className="flex justify-center h-screen mt-10">
      {/* <div className="max-w-screen-xl w-3/4 rounded-3xl bg-black"> */}
      <div className="max-w-screen-xl h-auto w-3/4 rounded-3xl content">
        {users.map((user, i) => {
          let bgColor = "bg-blue-200 dark:bg-blue-900";
          let clickEvent = () => {
            GetSongs(user.username);
            setSelectedUser(user.username);
          };
          if (selectedUser == user.username) {
            bgColor = "bg-blue-400";
            clickEvent = () => {
              setSelectedUser(null);
            };
          }
          return (
            <button
              key={i}
              className={bgColor + " rounded-full m-2 p-1 pr-2 pl-2"}
              onClick={() => clickEvent()}
            >
              {user.username}
            </button>
          );
        })}
        <div>
          {userSongs.map((song, i) => {
            return (
              <div key={i} className="flex flex-row">
                <h1>
                  {song[0]} - {song[1]}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
