import { Component } from '@angular/core';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [],
  templateUrl: 'first.component.html',
  styleUrl: 'first.component.css'
})
export class FirstComponent {

  untrustedContent: string = 'Template <script>alert("0wned")</script> <b>Syntax</b>';
  

}
