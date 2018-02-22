import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast;
    constructor(private toast: ToastController) { }

  toastHandler(text: string){
		let txt = text;
		private toastHandle = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
		toastHandle.present();
  }
  favoriteToast(routeOrStop: string, isFave: boolean): void {
    if (this.faveToast) {
      this.faveToast.dismiss();
    }
    let txt = `${routeOrStop} ${isFave ? 'added to' : 'removed from'} Favorites`;
    this.faveToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.faveToast.present();
  }
  noOriginOrDestinationToast(): void{
    let txt = 'You must select an origin and destination from the autocomplete dropdowns above in order to search the schedule';
    private originDestination = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    originDestination.present();
  }
}
