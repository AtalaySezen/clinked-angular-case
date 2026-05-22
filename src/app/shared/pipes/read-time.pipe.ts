import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readTime', standalone: true })
export class ReadTimePipe implements PipeTransform {
  transform(html: string): string {
    const text = html.replace(/<[^>]*>/g, ' ').trim();
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }
}
