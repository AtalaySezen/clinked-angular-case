import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
  standalone: true,
})
export class ExcerptPipe implements PipeTransform {
  transform(value: string, limit = 150): string {
    if (!value) return '';
    const plainText = value.replace(/<[^>]*>/g, '');
    if (plainText.length <= limit) return plainText;
    return plainText.substring(0, limit).trimEnd() + '…';
  }
}
