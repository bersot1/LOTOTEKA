import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class loadingProvider {

    public isLoading = false;

    constructor(
        public loadingCtrl: LoadingController
    ) { }

    public async present() {
        this.isLoading = true;
        return await this.loadingCtrl.create({
            mode: 'ios',
            spinner: 'circles',
            message: 'Carregando',
            translucent: true,
            cssClass: 'cssLoading'
        }).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss();
                }
            });
        });
    }

    public async dismiss() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss();
    }
}