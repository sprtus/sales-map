import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import styles from './SalesMap.module.scss';

export interface ISalesMapProps {
  context: WebPartContext;
}

export default class SalesMap extends React.Component<ISalesMapProps, {}> {
  public render(): React.ReactElement<ISalesMapProps> {
    return (
      <div className={styles.map}>
        <h1>Map</h1>
      </div>
    );
  }
}
