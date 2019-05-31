import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { ISalesMapProps } from './components/SalesMap';
import SalesMap from './components/SalesMap';

export default class SalesMapWebPart extends BaseClientSideWebPart<{}> {
  public render(): void {
    const element: React.ReactElement<ISalesMapProps> = React.createElement(SalesMap, {
      context: this.context,
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
