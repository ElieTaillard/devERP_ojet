import RootViewModel from "../appController";
import * as ko from "knockout";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojtable";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";

class SaleOrderDetailViewModel {
  idSaleOrder: ko.Observable<string>;
  saleOrderDetail: ko.ObservableArray<any> = ko.observableArray();

  readonly dataprovider = new ArrayDataProvider(this.saleOrderDetail, {
    keyAttributes: "LineNumber"
  });
  
  constructor() {
    RootViewModel.afficheHeader(true);
    this.idSaleOrder = ko.observable(sessionStorage.getItem("idSaleOrder"));
    sessionStorage.removeItem("idSaleOrder");
    this.showDetail();
  }

  showDetail = () =>{
    this.callApi(this.idSaleOrder());
  }

  callApi = async (idSaleOrder: string): Promise<{ success: boolean, error: string }> => {
      const responseAPi = await window.fetch('https://jde925.inetum.group:20221/jderest/v3/orchestrator/LAB04_LAB06_GetSalesOrder', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            token: sessionStorage.getItem('APIToken'),
            deviceName: "Oracle Jet",
            OrderNumber: idSaleOrder 
        }),
    })
    return new Promise((resolve) => {
      setTimeout(() => {
          if (responseAPi.ok) {
              responseAPi.json().then((data) => {
                this.saleOrderDetail(data.LAB04_LAB06_RequestSalesOrder);
              })
              resolve({ success: true, error: '' });
          } else {
              resolve({ success: false, error: 'Erreur' });
          }
      }, 1000);
    });
  }


  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export = SaleOrderDetailViewModel;
