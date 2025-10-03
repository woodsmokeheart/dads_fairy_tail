const WORDS_PER_MINUTE = 200;


function countWords(text: string): number {
  if (!text) return 0;
  
  const cleanText = text
    .replace(/<[^>]*>/g, '') 
    .replace(/\s+/g, ' ') 
    .trim();
  
  const words = cleanText.split(' ').filter(word => word.length > 0);
  
  return words.length;
}


export function calculateReadingTime(content: string): number {
  const wordCount = countWords(content);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  return Math.max(1, minutes);
}


export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 мин';
  } else if (minutes < 60) {
    return `${minutes} мин`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ч`;
    } else {
      return `${hours} ч ${remainingMinutes} мин`;
    }
  }
}


export function getReadingTime(content: string): string {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
}
