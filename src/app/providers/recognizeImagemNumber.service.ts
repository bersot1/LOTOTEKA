import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';




@Injectable({
    providedIn: 'root'
})
export class recognizeImagemNumberProvider {

    constructor() { }


    // reconizeImage() {


    //     var input = {
    //         "image": "https://imgur.com/a/sFwOaQ5",
    //         "language": "eng"
    //     };
    //     Algorithmia.client("simAbKAF3iGodjwdXRRP7K1R3A61")
    //         .algo("character_recognition/tesseract/0.3.0?timeout=300") // timeout is optional
    //         .pipe(input)
    //         .then(function (response) {
    //             console.log(response.get());
    //         });
    // }
}