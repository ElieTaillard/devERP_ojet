import RootViewModel from "../appController";
import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojinputnumber";
import "ojs/ojtable";
import ArrayDataProvider = require("ojs/ojarraydataprovider");


class SaleOrderCreationViewModel {
  public Quantity_Ordered: ko.Observable<number>;
  public Item_Number: ko.Observable<string>;

  saleOrderDetail: ko.ObservableArray<any> = ko.observableArray();

  readonly dataprovider = new ArrayDataProvider(this.saleOrderDetail, {
    keyAttributes: "LineNumber"
  });
  
  constructor() {
    RootViewModel.afficheHeader(true);
    this.Quantity_Ordered = ko.observable(0);
    this.Item_Number = ko.observable('');
  }
  public ValideForm = (): void => {
    this.saleOrderDetail.push({Quantity_Ordered: this.Quantity_Ordered(), Item_Number: this.Item_Number()})
  }

  public SendForm = (): void => {
      const promise = this.callApi()
      promise.then((response) => {
        if (response.success) {
            RootViewModel.router.go({path:'saleOrderDetail'});
            RootViewModel.afficheHeader(true);
        }
    });
  }


  callApi = async (): Promise<{ success: boolean, error: string }> => {
      const responseAPi = await window.fetch('https://jde925.inetum.group:20221/jderest/v3/orchestrator/LAB04_TestOrchestration', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            token: sessionStorage.getItem('APIToken'),
            deviceName: "Oracle Jet",
            Long_Address_Number: 1001,
            GridIn_1_3: this.saleOrderDetail()
        }),
    })
    return new Promise((resolve) => {
      setTimeout(() => {
          if (responseAPi.ok) {
              responseAPi.json().then((data) => {
                sessionStorage.setItem("idSaleOrder", data.PreviousOrder);
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

export = SaleOrderCreationViewModel;
