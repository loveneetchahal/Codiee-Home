import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <>
                <header>
                        <h2> <Link to="/" >My Meetings</Link></h2>
                </header>
            </>
        );
    }
}

export default Header;