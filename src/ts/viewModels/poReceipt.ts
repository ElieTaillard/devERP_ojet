import RootViewModel from "../appController";
import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojinputnumber";
import 'ojs/ojlabelvalue';

class POReceiptViewModel {
  public MMCU: ko.Observable<string>;
  public DCTO: ko.Observable<string>;
  public DOCO: ko.Observable<string>;
  public LNID1: ko.Observable<string>;

  public LNID2: ko.Observable<string>;
  public LITM: ko.Observable<string>;
  public PDDJ: ko.Observable<string>;
  public DL01: ko.Observable<string>;
  public UOPN: ko.Observable<string>;
  public UOM: ko.Observable<string>;

  public Empl: ko.Observable<string>;
  public Lot: ko.Observable<string>;
  public QtRecue: ko.Observable<string>;

  public ValideButtonDisabled: ko.Observable<boolean>;
  
  constructor() {
    RootViewModel.afficheHeader(true);

    this.MMCU = ko.observable('');
    this.DCTO = ko.observable('');
    this.DOCO = ko.observable('');
    this.LNID1 = ko.observable('');

    this.LNID2 = ko.observable('');
    this.LITM = ko.observable('');
    this.PDDJ = ko.observable('');
    this.DL01 = ko.observable('');
    this.UOPN = ko.observable('');
    this.UOM = ko.observable('');

    this.Empl = ko.observable('');
    this.Lot = ko.observable('');
    this.QtRecue = ko.observable('');

    this.ValideButtonDisabled = ko.observable(false);
  }

  SearchReceipt = () =>{
    this.callApi1(this.MMCU(),this.DCTO(),this.DOCO(),this.LNID1());
  }

  ValidateReceipt = () =>{
    this.ValideButtonDisabled(true);
    this.callApi2(this.DOCO(),this.DCTO(),this.MMCU(),this.Lot(),this.QtRecue(),this.Empl(),this.LNID2());
  }

  callApi1 = async (MMCU: string, DCTO: string, DOCO: string, LNID: string): Promise<{ success: boolean, error: string }> => {
      const responseAPi = await window.fetch('https://jde925.inetum.group:20221/jderest/v3/orchestrator/LAB06_LAB04_PO_Receipt', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            token: sessionStorage.getItem('APIToken'),
            deviceName: "Oracle Jet",
            "OrderNumber": DOCO,
            "OrTy": DCTO,
            "LineNumber": LNID,
            "BusinessUnit": MMCU
        }),
    })
    return new Promise((resolve) => {
      setTimeout(() => {
          if (responseAPi.ok) {
              responseAPi.json().then((data) => {
                this.LNID2(this.LNID1());
                this.LITM(data["2ndItemNumber"]);
                this.PDDJ(data.SchedPick);
                this.DL01(data.Description);
                this.UOPN(data.QuantityOpen);
                this.UOM(data.UM);
                this.QtRecue(data.QuantityOpen);
              })
              resolve({ success: true, error: '' });
          } else {
              resolve({ success: false, error: 'Erreur' });
          }
      }, 1000);
    });
  }

  callApi2 = async (doco: string, dcto: string, mmcu: string, Lot: string, QtRecue: string, Empl: string, lnid: string): Promise<{ success: boolean, error: string }> => {
    const responseAPi = await window.fetch('https://jde925.inetum.group:20221/jderest/v3/orchestrator/LAB04_LAB06_PO_Receipt_p2', {
      method: 'POST',
      headers: {
          'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        token: sessionStorage.getItem('APIToken'),
        deviceName: "Oracle Jet",
        "Order_Number": doco,
        "Or_Ty": dcto,
        "Branch_Plant": mmcu,
        "Line_Number": lnid,
        "GridIn_1_2": [
          {
            "Row_Number_for_Update": lnid,
            "Quantity": QtRecue,
            "Location": Empl,
            "Lot_Serial": Lot
          }
        ]
      }),
      
  })
  return new Promise((resolve) => {
    setTimeout(() => {
        if (responseAPi.ok) {
            responseAPi.json().then((data) => {
              this.ValideButtonDisabled(false);
              alert("Réception validée");
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

export = POReceiptViewModel;
