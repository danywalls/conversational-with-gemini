import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';
import {
  Message,
  SendMessageEvent,
  User,
} from '@progress/kendo-angular-conversational-ui';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  public readonly user = {
    id: crypto.randomUUID(),
    name: 'Dany',
    avatarUrl: './assets/dany.jpg',
  };
  #generativeAI = new GoogleGenerativeAI(environment.geminy_key);
  #model = this.#generativeAI.getGenerativeModel({
    model: 'gemini-pro',
  });
  #prompt =
    'Pretend you are a angular developer with experience with kendo provide nice and very short answer no more than 50 words, ' +
    'in format like a message without bullets point';
  readonly #kendoIA: User = {
    id: crypto.randomUUID(),
    name: 'Kendo UI',
    avatarUrl: './assets/kendo.png',
  };
  $messages = signal<Message[]>([
    {
      author: this.#kendoIA,
      timestamp: new Date(),
      text: 'Hi! 👋 how I can help you with Kendo ?',
    },
  ]);

  #chatSession = this.#model.startChat({
    history: [
      {
        role: 'user',
        parts: this.#prompt,
      },
      {
        role: 'model',
        parts: "Yes, I'm a Angular expert with Kendo UI",
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  async generate(textInput: SendMessageEvent) {
    try {
      if (textInput.message.text && this.#chatSession) {
        this.$messages.update((p) => [...p, textInput.message]);

        const result = await this.#chatSession.sendMessage(
          textInput.message.text,
        );

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
