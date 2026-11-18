import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pagesContent from '../../data/pages-content.json';
import { PageView } from '../../components/PageView';

type PageEntry = { title: string; description: string; mainHtml: string; hasTripDetails: boolean };
const pages = pagesContent as Record<string, PageEntry>;

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((route) => route !== '/' && route !== '/404')
    .map((route) => ({
      slug: route.replace(/^\/|\/$/g, '').split('/'),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = `/${slug.join('/')}/`;
  const entry = pages[route];
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: route },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = `/${slug.join('/')}/`;
  const entry = pages[route];
  if (!entry) notFound();
  return <PageView html={entry.mainHtml} />;
}
