import React, { Component } from "react";
import { Icon, Menu } from "semantic-ui-react";

class Header extends Component {
    render() {
        return (
            <Menu style={ {marginTop: '16px'} }>
                <Menu.Item>KickStart</Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item>Campaigns</Menu.Item>
                    <Menu.Item>+</Menu.Item>
                    </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;