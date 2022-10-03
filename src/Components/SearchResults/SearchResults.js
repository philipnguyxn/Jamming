import React from "react";
import './SearchResults.css';
import { TrackList } from '../TrackList/TrackList';
import { Loading } from '../Loading/Loading';

export class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                { this.props.isLoading ? <Loading /> : <TrackList
                                                            tracks={this.props.tracks}
                                                            onAdd={this.props.onAdd}
                                                            isRemoval={false}
                                                            onPlay={this.props.onPlay} />
                }
            </div>
        );
    }
}
