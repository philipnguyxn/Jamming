import React from "react";
import './Loading.css';

export class Loading extends React.Component {
    render() {
        return (
            <div className="ring">Loading
                <span className='loading-span'></span>
            </div>
        );
    }
}

