import { Component } from '@angular/core';
import { HeaderComponent } from './components/partials/header/header.component'; // Adjust the path as necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [HeaderComponent] 
})
export class AppComponent { }
