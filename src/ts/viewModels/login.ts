import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import RootViewModel from "../appController";

class LoginViewModel {
    public username: ko.Observable<string>;
    public password: ko.Observable<string>;
    
    constructor() {
        RootViewModel.afficheHeader(false);
        this.username = ko.observable('');
        this.password = ko.observable('');
    }
    public login = (): void => {
        const loginPromise = this.authenticate(this.username(), this.password());
        loginPromise.then((response) => {
            if (response.success) {
                RootViewModel.router.go({path:'dashboard'});
                RootViewModel.afficheHeader(true);
            }
        });
    }
    authenticate = async (username: string, password: string): Promise<{ success: boolean, error: string }> => {
        // // #### TEST MODE ####  
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //       if (username === 'test' && password === 'test') {
        //         resolve({ success: true, error: '' });
        //       } else {
        //         resolve({ success: false, error: 'Invalid username or password.' });
        //       }
        //     }, 1000);
        //   });
        

        // #### API MODE ####  
        const responseAPi = await window.fetch('https://jde925.inetum.group:20221/jderest/v3/orchestrator/jde-login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                deviceName: "Oracle Jet"
            }),
        })

        return new Promise((resolve) => {
            setTimeout(() => {
                if (responseAPi.ok) {
                    responseAPi.json().then((data) => {
                      console.log(data.userInfo);
                      RootViewModel.userData(data.userInfo);
                      RootViewModel.userLogin(data.userInfo.username);
                      window.sessionStorage.setItem("APIToken", data.userInfo.token);
                    })
                    resolve({ success: true, error: '' });
                } else {
                    resolve({ success: false, error: 'Invalid username or password.' });
                }
            }, 1000);
        });
    }
}
export = LoginViewModel;