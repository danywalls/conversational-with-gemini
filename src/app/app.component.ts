import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ChatModule,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import {GeminiService} from "./services/gemini.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,   ChatModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  geminiService = inject(GeminiService)
  user = this.geminiService.user;
  messages = this.geminiService.$messages

  async generate(event: SendMessageEvent) {
    await this.geminiService.generate(event);
  }


}
