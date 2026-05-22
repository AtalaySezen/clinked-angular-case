import { ExcerptPipe } from './excerpt.pipe';

describe('ExcerptPipe', () => {
  const pipe = new ExcerptPipe();

  it('should strip HTML tags', () => {
    const result = pipe.transform('<p>Hello <strong>world</strong></p>');
    expect(result).toBe('Hello world');
  });

  it('should truncate text exceeding the limit', () => {
    const long = 'a'.repeat(200);
    const result = pipe.transform(long, 150);
    expect(result).toBe('a'.repeat(150) + '…');
  });

  it('should not truncate text within the limit', () => {
    const short = 'Short text';
    expect(pipe.transform(short, 150)).toBe('Short text');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should decode &nbsp; entities', () => {
    expect(pipe.transform('<p>&nbsp;Hello</p>')).toBe('Hello');
  });

  it('should decode common HTML entities', () => {
    expect(pipe.transform('<p>&amp; &lt;tag&gt; &quot;quote&quot;</p>')).toBe('& <tag> "quote"');
  });
});
