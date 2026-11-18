import type { Metadata } from 'next';
import pagesContent from '../data/pages-content.json';
import { PageView } from '../components/PageView';

type PageEntry = { title: string; description: string; mainHtml: string; hasTripDetails: boolean };
const pages = pagesContent as Record<string, PageEntry>;

export const metadata: Metadata = {
  title: pages['/404'].title,
  description: pages['/404'].description,
  robots: 'noindex, nofollow',
};

export default function NotFoundPage() {
  return <PageView html={pages['/404'].mainHtml} />;
}
