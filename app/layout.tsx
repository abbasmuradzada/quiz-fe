import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { QuizProvider } from '@/context/quiz-context';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'QuizHub — Challenge Yourself',
  description: 'Take quizzes solo or challenge friends online across 10 topics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
