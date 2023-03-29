import pbConfig from './pbConfig';

const PocketBase = require('pocketbase/cjs');


const pb = new PocketBase(pbConfig.url);

const authData = pb
	.collection('users')
	.authWithPassword(pbConfig.email, pbConfig.password)
	.then((data) => {
		console.log('Authenticated with PocketBase!');
		return data;
	})
	.catch((error) => {
		console.error('Error authenticating with PocketBase:', error);
	});

const getSongs = async () => {
	await authData;
	const records = await pb.collection('spotify').getFullList();
	return records;
};

const getTopArtistsByUser = async (user) => {
	// const songs = await getSongs();
	await authData
	const userSongs = await pb.collection('spotify').getFullList({filter: "username~'"+user+"'"})

	const artistCounts = userSongs.reduce((acc, item) => {
		// const artists = item.artist.split(";");

		const trimmedArtist = item.artist.replace(';', ', ').trim();
		if (acc[trimmedArtist]) {
			acc[trimmedArtist]++;
		  } else {
			acc[trimmedArtist] = 1;
		  }
		// artists.forEach((artist) => {
		//   const trimmedArtist = artist.trim();
	  
		//   if (acc[trimmedArtist]) {
		// 	acc[trimmedArtist]++;
		//   } else {
		// 	acc[trimmedArtist] = 1;
		//   }
		// });
	  
		return acc;
	  }, {});
	  
	const sortedArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]);

	console.log(sortedArtists);


	return sortedArtists
}

const getAllUsers = async (user) => {
	await authData
	const users = await pb.collection('spotify_users').getFullList();
	return users
}

const getAlbumArt = async () => {
	await authData;
	const records = await pb.collection('album_art').getFullList();
	return records;
}

function getTopArtists(songs) {
	const dict = {};

	songs.forEach(({ artist, album }) => {
		if (!dict[artist]) {
			dict[artist] = { albums: {} };
		}

		dict[artist]['albums'][album] = (dict[artist]['albums'][album] || 0) + 1;
	});

	const artistTotalListensArr = Object.entries(dict).map(([ artist, data
	]) => {
		const total_listens = Object.values(data.albums).reduce((a, b) => a + b, 0);
		return { name: artist, total_listens, albums: data.albums };
	});

	artistTotalListensArr.sort((a, b) => b.total_listens - a.total_listens);

	const sortedArray = [];
	artistTotalListensArr.forEach(({ name, total_listens, albums }) => {
		sortedArray.push({ name, total_listens, albums });
	});

	console.log(sortedArray);

	return sortedArray;
}

export { getSongs, getTopArtists, getTopArtistsByUser, getAllUsers, getAlbumArt};
