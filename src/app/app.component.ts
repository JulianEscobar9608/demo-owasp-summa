import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { XssTutorialComponent } from './components/xss-tutorial/xss-tutorial.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, XssTutorialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'education-app';
}
