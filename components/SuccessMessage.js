import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

class SuccessMessage extends Component {
    render() {
        if (!this.props.message.header && !this.props.message.description) {
            return null;
        }

        return (
            <Message positive>
                <Message.Header>{ this.props.message.header }</Message.Header>
                <p>{ this.props.message.content }</p>
            </Message>
        );
    }
}

export default SuccessMessage;