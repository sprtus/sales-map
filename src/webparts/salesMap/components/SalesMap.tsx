import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import Datamap from 'react-datamaps';

import styles from './SalesMap.module.scss';

export interface ISalesMapProps {
  context: WebPartContext;
}

export default class SalesMap extends React.Component<ISalesMapProps, {}> {
  public render(): React.ReactElement<ISalesMapProps> {
    return (
      <div className={styles.map}>
        <h1 className={styles.title}>Sales by State</h1>

        <Datamap
          scope="usa"
          fills={{
            defaultFill: '#eee',
            gt50: '#555',
          }}
          data={this.mapData()}
        />
      </div>
    );
  }

  private mapData(): any {
    return {
      VA: { fillKey: 'gt50' },
      CA: { fillKey: 'gt50' },
    };
  }
}
