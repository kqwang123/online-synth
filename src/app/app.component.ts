import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'OnlineSynth';

  constructor() {
    console.log('AppComponent initialized');
  }

  playSineWave() {
    console.log('Playing sine wave');
    (window as any).electron.playSineWave();
  }

  stopSineWave() {
    console.log('Stopping sine wave');
    (window as any).electron.stopSineWave();
  }
}
