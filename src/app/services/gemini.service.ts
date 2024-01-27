import { Injectable, signal } from '@angular/core';
import {
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { environment } from '../../environments/environment';
import {
  Message,
  SendMessageEvent,
  User,
} from '@progress/kendo-angular-conversational-ui';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  #generativeAI = new GoogleGenerativeAI(environment.geminy_key);

  #model = this.#generativeAI.getGenerativeModel({
    model: 'gemini-pro',
  });
  #prompt =
    'you are a angular developer with experience with kendo provide nice and very short answer no more than 50 words, in format like a message without bullets point';

  readonly #kendoIA: User = {
    id: crypto.randomUUID(),
    name: 'Kendo UI',
    avatarUrl: './assets/kendo.png',
  };

  public readonly user = {
    id: crypto.randomUUID(),
    name: 'Dany',
    avatarUrl: './assets/dany.jpg',
  };

  $messages = signal<Message[]>([{
          author: this.#kendoIA,
          timestamp: new Date(),
          text: 'Hi! 👋 how I can help you with Kendo ?'
  }]);


  async generate(textInput: SendMessageEvent) {
    try {
      if (textInput.message.text && this.#model) {
        this.$messages.update((p) => [...p, textInput.message]);
        const parts = [
          {
            text: this.#prompt,
          },
          { text: textInput.message.text },
        ];

        const result = await this.#model.generateContent({
          contents: [{ role: 'user', parts }],
        });

        const response = result.response;
        const text = response.text();

        const message = {
          author: this.#kendoIA,
          timestamp: new Date(),
          text,
        };

        this.$messages.update((p) => [...p, message]);
      }
    } catch (e: any) {
      console.log(e);
    }
  }
}
