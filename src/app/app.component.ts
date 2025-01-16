import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProcessImagesComponent } from "./process-images/process-images.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProcessImagesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Khashaei';
}
