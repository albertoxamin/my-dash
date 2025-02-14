import React, { Component } from 'react';

import api from '../../api.js';
import Loading from '../Loading.js';

export default class Unifi extends Component {
  state = {
    unifi: null
  };

  async fetch() {
    const unifi = await api(process.env.REACT_APP_UNIFI_ENDPOINT);
    this.setState({ unifi });
  }

  componentDidMount() {
    this.fetch();

    setInterval(() => {
      this.fetch();
    }, 5000);
  }

  render() {
    const { unifi } = this.state;

    return (
      <div className="lg:w-1/5 px-4">
        <h2>Unifi</h2>
        {!unifi ? (
          <Loading response={unifi} />
        ) : (
          unifi.data.map(system => {
            if (system.subsystem !== 'www') {
              return (
                <li className="box mb-8 flex flex-col" key={system.subsystem}>
                  <div className="justify-between flex w-full">
                    <span className="uppercase">{system.subsystem}</span>
                    <span className="text-gray-600 dark:text-gray-500 text-sm self-end">
                      {system.num_user && <span>Clients: {system.num_user}</span>}
                      {system.remote_user_num_active !== undefined && (
                        <span>Clients: {system.remote_user_num_active}</span>
                      )}
                      {system.wan_ip && <span>{system.wan_ip}</span>}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-500 text-xs">
                    {system['tx_bytes-r'] && <div>Tx: {system['tx_bytes-r'].toLocaleString()} bytes</div>}
                    {system['rx_bytes-r'] && <div>Rx: {system['rx_bytes-r'].toLocaleString()} bytes</div>}
                    {system.remote_user_num_active !== 0 &&
                      system.remote_user_tx_bytes !== undefined && (
                        <div>Tx: {system.remote_user_tx_bytes.toLocaleString()} bytes</div>
                      ) &&
                      system.remote_user_rx_bytes !== undefined && (
                        <div>Rx: {system.remote_user_rx_bytes.toLocaleString()} bytes</div>
                      )}
                  </div>
                </li>
              );
            } else {
              return null;
            }
          })
        )}
      </div>
    );
  }
}
