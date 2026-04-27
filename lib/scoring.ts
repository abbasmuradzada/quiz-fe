import type { GradeInfo } from './types';

export function speedBonus(timeLeft: number): number {
  if (timeLeft >= 8) return 50;
  if (timeLeft >= 6) return 30;
  if (timeLeft >= 4) return 15;
  return 5;
}

export function getGrade(percentage: number): GradeInfo {
  if (percentage >= 95) return { letter: 'S', color: '#F59E0B', label: 'Legendary! 🏆' };
  if (percentage >= 80) return { letter: 'A', color: '#10B981', label: 'Excellent! 🎉' };
  if (percentage >= 65) return { letter: 'B', color: '#3B82F6', label: 'Great job! 👏' };
  if (percentage >= 50) return { letter: 'C', color: '#F59E0B', label: 'Not bad! 👍' };
  if (percentage >= 35) return { letter: 'D', color: '#F97316', label: 'Keep trying! 💪' };
  return { letter: 'F', color: '#DC2626', label: 'Study more! 📚' };
}
