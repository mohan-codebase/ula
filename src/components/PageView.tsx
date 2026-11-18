import React from 'react';

export function PageView({ html }: { html: string }) {
  return <main id="main" tabIndex={-1} dangerouslySetInnerHTML={{ __html: html }} />;
}
