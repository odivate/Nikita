document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    let playlists = [
        { id: 1, name: "Favorites", description: "My all-time favorites", cover: "https://source.unsplash.com/random/300x300/?favorite", songs: [] },
        { id: 2, name: "Workout Mix", description: "Songs to keep me moving", cover: "https://source.unsplash.com/random/300x300/?workout", songs: [] },
        { id: 3, name: "Chill Vibes", description: "Relaxing tunes", cover: "https://source.unsplash.com/random/300x300/?chill", songs: [] }
    ];

    let currentPlaylist = null;
    let sampleSongs = [
        { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", cover: "https://source.unsplash.com/random/50x50/?weeknd" },
        { id: 2, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", duration: "3:35", cover: "https://source.unsplash.com/random/50x50/?tears" },
        { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", cover: "https://source.unsplash.com/random/50x50/?dua" },
        { id: 4, title: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:03", cover: "https://source.unsplash.com/random/50x50/?start" },
        { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", cover: "https://source.unsplash.com/random/50x50/?watermelon" },
        { id: 6, title: "Adore You", artist: "Harry Styles", album: "Fine Line", duration: "3:27", cover: "https://source.unsplash.com/random/50x50/?adore" },
        { id: 7, title: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", duration: "3:35", cover: "https://source.unsplash.com/random/50x50/?circles" },
        { id: 8, title: "Sunflower", artist: "Post Malone, Swae Lee", album: "Spider-Man: Into the Spider-Verse", duration: "2:38", cover: "https://source.unsplash.com/random/50x50/?sunflower" }
    ];

    // DOM Elements
    const playlistList = document.getElementById('playlist-list');
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistNameInput = document.getElementById('playlist-name');
    const playlistDescInput = document.getElementById('playlist-desc');
    const currentPlaylistSection = document.getElementById('current-playlist');
    const playlistTitle = document.getElementById('playlist-title');
    const playlistDescription = document.getElementById('playlist-description');
    const playlistCover = document.getElementById('playlist-cover');
    const playlistOwner = document.getElementById('playlist-owner');
    const playlistCount = document.getElementById('playlist-count');
    const songsList = document.getElementById('songs-list');
    const addSongModal = document.getElementById('add-song-modal');
    const closeModal = document.querySelector('.close-modal');
    const songSearchInput = document.getElementById('song-search');
    const addSongBtn = document.getElementById('add-song-btn');
    const searchResults = document.querySelector('.search-results');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nowPlayingArtist = document.getElementById('now-playing-artist');
    const nowPlayingCover = document.getElementById('now-playing-cover');
    const playPauseBtn = document.querySelector('.play-pause');
    const changeCoverBtn = document.getElementById('change-cover-btn');
    const playlistCoverPreview = document.getElementById('playlist-cover-preview');

    // Initialize the app
    function init() {
        renderPlaylists();
        setupEventListeners();
    }

    // Render playlists in sidebar
    function renderPlaylists() {
        playlistList.innerHTML = '';
        playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.textContent = playlist.name;
            li.dataset.id = playlist.id;
            li.addEventListener('click', () => viewPlaylist(playlist.id));
            playlistList.appendChild(li);
        });
    }

    // View a specific playlist
    function viewPlaylist(id) {
        currentPlaylist = playlists.find(p => p.id == id);
        if (!currentPlaylist) return;

        // Update UI
        playlistTitle.textContent = currentPlaylist.name;
        playlistDescription.textContent = currentPlaylist.description;
        playlistCover.src = currentPlaylist.cover;
        playlistOwner.textContent = "By You";
        playlistCount.textContent = `${currentPlaylist.songs.length} songs`;

        // Show playlist view
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        currentPlaylistSection.style.display = 'block';

        // Render songs
        renderSongs();
    }

    // Render songs in current playlist
    function renderSongs() {
        songsList.innerHTML = '';
        if (!currentPlaylist || currentPlaylist.songs.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px;">No songs in this playlist yet. Add some!</td>';
            songsList.appendChild(tr);
            return;
        }

        currentPlaylist.songs.forEach((song, index) => {
            const tr = document.createElement('tr');
            tr.dataset.id = song.id;
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="song-info-small">
                        <img src="${song.cover}" alt="${song.title}" width="40">
                        <div>
                            <p>${song.title}</p>
                            <p class="artist">${song.artist}</p>
                        </div>
                    </div>
                </td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td>${song.duration}</td>
            `;
            tr.addEventListener('click', () => playSong(song));
            songsList.appendChild(tr);
        });
    }

    // Create a new playlist
    function createPlaylist() {
        const name = playlistNameInput.value.trim();
        if (!name) {
            alert('Please enter a playlist name');
            return;
        }

        const newPlaylist = {
            id: Date.now(),
            name: name,
            description: playlistDescInput.value.trim(),
            cover: playlistCoverPreview.src,
            songs: []
        };

        playlists.push(newPlaylist);
        renderPlaylists();
        
        // Reset form
        playlistNameInput.value = '';
        playlistDescInput.value = '';
        playlistCoverPreview.src = 'https://source.unsplash.com/random/300x300/?music';
        
        // View the new playlist
        viewPlaylist(newPlaylist.id);
    }

    // Play a song
    function playSong(song) {
        nowPlayingTitle.textContent = song.title;
        nowPlayingArtist.textContent = song.artist;
        nowPlayingCover.src = song.cover;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    // Search for songs to add
    function searchSongs(query) {
        if (!query) return [];
        return sampleSongs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) || 
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Show add song modal
    function showAddSongModal() {
        addSongModal.style.display = 'flex';
        songSearchInput.value = '';
        searchResults.innerHTML = '<p>Search for songs to add</p>';
        songSearchInput.focus();
    }

    // Add song to current playlist
    function addSongToPlaylist(song) {
        if (!currentPlaylist) return;
        
        // Check if song already exists in playlist
        if (currentPlaylist.songs.some(s => s.id === song.id)) {
            alert('This song is already in the playlist');
            return;
        }
        
        currentPlaylist.songs.push(song);
        renderSongs();
        playlistCount.textContent = `${currentPlaylist.songs.length} songs`;
        closeModal.click();
    }

    // Change playlist cover
    function changePlaylistCover() {
        const randomNum = Math.floor(Math.random() * 1000);
        playlistCoverPreview.src = `https://source.unsplash.com/random/300x300/?music,cover,${randomNum}`;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Create playlist button
        createPlaylistBtn.addEventListener('click', createPlaylist);

        // Play/pause button
        playPauseBtn.addEventListener('click', function() {
            if (this.innerHTML.includes('play')) {
                this.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Add song button
        addSongBtn.addEventListener('click', showAddSongModal);

        // Close modal
        closeModal.addEventListener('click', function() {
            addSongModal.style.display = 'none';
        });

        // Search for songs
        songSearchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (!query) {
                searchResults.innerHTML = '<p>Search for songs to add</p>';
                return;
            }

            const results = searchSongs(query);
            if (results.length === 0) {
                searchResults.innerHTML = '<p>No songs found</p>';
                return;
            }

            searchResults.innerHTML = '';
            results.forEach(song => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}" width="50">
                    <div>
                        <p>${song.title}</p>
                        <p class="artist">${song.artist} • ${song.album}</p>
                    </div>
                    <button class="add-song-btn" data-id="${song.id}">Add</button>
                `;
                searchResults.appendChild(div);
            });

            // Add event listeners to add buttons
            document.querySelectorAll('.add-song-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const songId = parseInt(this.dataset.id);
                    const song = sampleSongs.find(s => s.id === songId);
                    if (song) addSongToPlaylist(song);
                });
            });
        });

        // Change cover button
        changeCoverBtn.addEventListener('click', changePlaylistCover);
    }

    // Initialize the app
    init();
});