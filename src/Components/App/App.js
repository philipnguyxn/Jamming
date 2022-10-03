import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
      isLoading: false
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  /**
   * addTrack method
   * Runs when the adding button in Search Results is clicked
   * Should add the selected track to the playlist
   * @param {Object} track 
   */
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    
    if (tracks.every(savedTrack => savedTrack.id !== track.id)) {
      tracks.push(track);
      this.setState({
        playlistTracks: tracks,
      });
    }
  }

  /**
   * removeTrack method
   * Runs when the removing button in Search Results is clicked
   * Should remove the selected track from the playlist
   * @param {Object} track 
   */
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      tracks.splice(tracks.indexOf(track), 1);
      this.setState({
        playlistTracks: tracks,
      });
    }
  }

  /**
   * updatePlaylistName method
   * Runs when the playlist name input is changed
   * Should save the new name to this.state.playlistName
   * @param {string} name 
   */
  updatePlaylistName(name) {
    this.setState({
      playlistName: name,
    });
  }

  /**
   * savePlaylist method
   * Runs when the save to Spotify button is clicked
   * Should save the new playlist with songs and names to Spotify
   */
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.URI);
    
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    })
  }

  /**
   * search method
   * Runs when the search button is clicked
   * Should return a list of tracks as the searching results
   * @param {string} searchTerm 
   */
  search(searchTerm) {
    this.loading();

    Spotify.search(searchTerm).then(searchResults => {
      this.setState({
        searchResults: searchResults,
        isLoading: false
      });
    })
  }

  /**
   * loading method
   * Runs when the search button is clicked
   * Should display a loading indicator until the search has finished
   */
  loading() {
    this.setState({
      isLoading: true
    });
  }

  playTrack(track) {
    //Spotify.playTrack(track.URI);
  }

  /**
   * render method
   * Runs when the server is started
   * Should display a list of components accordance with the React framework
   * @returns {JSX} div containing JSX tags and components
   */
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              tracks={this.state.searchResults}
              onAdd={this.addTrack}
              isLoading={this.state.isLoading}
              onPlay={this.playTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
