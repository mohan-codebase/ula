import type { Metadata } from 'next';
import pagesContent from '../data/pages-content.json';
import { PageView } from '../components/PageView';

type PageEntry = { title: string; description: string; mainHtml: string; hasTripDetails: boolean };
const pages = pagesContent as Record<string, PageEntry>;

export const metadata: Metadata = {
  title: pages['/'].title,
  description: pages['/'].description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <PageView html={pages['/'].mainHtml} />;
}
