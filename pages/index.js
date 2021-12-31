import React, { Component } from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {

    async componentDidMount() {
        console.log("Factory:", factory);
    }

    render () {
        return (<h1>Index page??? Oh shit!</h1>);
    }
}

export default CampaignIndex;
