import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import Datamap from 'react-datamaps';

import { Sale } from '../Sale';
import styles from './SalesMap.module.scss';

export interface ISalesMapProps {
  context: WebPartContext;
}

export interface ISalesMapState {
  loading: boolean;
  sales: Sale[];
  totals: StateTotals;
}

export interface StateTotals {
  [index: string]: {
    total: number;
    percent: number;
  };
}

export default class SalesMap extends React.Component<ISalesMapProps, ISalesMapState> {
  constructor (props: ISalesMapProps) {
    super(props);

    // Bind methods
    this.mapData = this.mapData.bind(this);

    // State
    this.state = {
      loading: true,
      sales: [],
      totals: {},
    };
  }

  public render(): React.ReactElement<ISalesMapProps> {
    return (
      <div className={styles.map}>
        <h1 className={styles.title}>Sales by State</h1>

        <Datamap
          scope="usa"
          geographyConfig={{
            highlightFillColor: '#65D1FD',
            highlightBorderColor: '#fff',
						highlightBorderWidth: 2,
						popupTemplate: (geography, data) => `<div class="hoverinfo"><strong>${geography.properties.name}</strong><br>$${data.total}</div>`,
					}}
          fills={{
            defaultFill: '#eee',
            gt15: '#EA685C',
            gt30: '#E98B42',
            gt45: '#FFD454',
            gt60: '#DAE358',
            gt75: '#9ED963',
            gt90: '#7DC938',
          }}
          data={this.mapData()}
        />
      </div>
    );
  }

  // Get sales data on mount
  public componentDidMount(): void {
    this.refresh();
  }

  // Refresh data
  private async refresh(): Promise<void> {
    await this.getSalesData();
    this.calculateTotals();
  }

  // Get sales data
  private async getSalesData(): Promise<void> {
    // Loading
    this.setState({ loading: true });

    // Get sales data
    const response = await this.props.context.spHttpClient.get(`${this.props.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('Sales')/items?$select=ORDERDATE,SALES,STATE,COUNTRY&$orderby=ORDERDATE&$top=5000`, SPHttpClient.configurations.v1);
    const json = await response.json();

    // Update state
    this.setState({
      sales: json.value,
      loading: false,
    });
  }

  // Calculate totals from sales data
  private calculateTotals(): void {
    // Calculate state totals
    const totals: StateTotals = {};
    let maxValue = 0;
    this.state.sales.forEach(sale => {
      // Not in US
      if (sale.COUNTRY !== 'USA') return;

      // Init state total
      if (!totals[sale.STATE]) totals[sale.STATE] = {
        total: 0,
        percent: 0,
      };

      // Increment total
      totals[sale.STATE].total += Math.round(sale.SALES);

      // Track max value
      if (totals[sale.STATE].total > maxValue) maxValue = totals[sale.STATE].total;
    });

    // Interpolate percent
    Object.keys(totals).forEach(state => {
      totals[state].percent = totals[state].total / maxValue;
    });

    // Update state
    this.setState({ totals });
  }

  private mapData(): any {
    // State data
    const data = {};
    Object.keys(this.state.totals).forEach(state => {
      // Fill based on sales strength
      let fillKey = 'defaultFill';
      if (this.state.totals[state].percent > .9) fillKey = 'gt90';
      else if (this.state.totals[state].percent > .15) fillKey = 'gt15';
      else if (this.state.totals[state].percent > .3) fillKey = 'gt30';
      else if (this.state.totals[state].percent > .45) fillKey = 'gt45';
      else if (this.state.totals[state].percent > .0) fillKey = 'gt60';
      else if (this.state.totals[state].percent > .75) fillKey = 'gt75';
      else if (this.state.totals[state].percent > .9) fillKey = 'gt90';

      // Set state data
      data[state] = {
        fillKey,
        total: Math.round(this.state.totals[state].total),
      };
    });

    return data;
  }
}
