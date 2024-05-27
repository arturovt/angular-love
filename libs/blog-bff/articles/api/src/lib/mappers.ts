import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

import {
  Anchor,
  AnchorType,
  anchorTypes,
  Article,
  ArticlePreview,
} from '@angular-love/contracts/articles';

import { WPPostDetailsDto, WPPostDto } from './dtos';
import {
  crayonCodeRewriter,
  removeEmptyParagraphs,
  rewriteHTML,
  wpCodeRewriter,
} from './utils';

export const toArticlePreviewList = (dtos: WPPostDto[]): ArticlePreview[] => {
  return (dtos || []).map((dto) => {
    const summary = cheerio.load(dto.excerpt.rendered || '');
    const title = cheerio.load(dto.title.rendered || '');

    return {
      slug: dto.slug || '',
      title: title.text(),
      excerpt: summary.text(),
      featuredImageUrl: dto.featured_image_url || '',
      publishDate: new Date(dto.date || '').toISOString(),
      readingTime: dto.acf.reading_time.toString() || '5',
      author: {
        slug: dto.author_details.slug || '',
        name: dto.author_details.name || '',
        avatarUrl: dto.author_details.avatar_url || '',
      },
    };
  });
};

export const toArticle = (dto?: WPPostDetailsDto): Article => {
  const title = cheerio.load(dto.title.rendered || '');
  const content = sanitizeHtml(dto?.content.rendered || '', {
    allowedClasses: {
      pre: ['lang:*'],
      div: ['crayon-line', 'crayon-syntax'],
    },
  });
  const $ = cheerio.load(content);

  rewriteHTML(wpCodeRewriter, crayonCodeRewriter, removeEmptyParagraphs)($);

  // add id to anchorTypes elements for anchor links
  const anchors: Anchor[] = Array.from($(anchorTypes.join(', '))).reduce(
    (anchors, element) => {
      const title = $(element).text();

      $(element).attr('id', title);

      return [
        ...anchors,
        {
          title,
          type: $(element).prop('tagName').toLowerCase() as AnchorType,
        },
      ];
    },
    [] as Anchor[],
  );

  const highlightedContent = $('body').html().trim();

  return {
    title: title.text(),
    publishDate: dto?.date || '',
    readingTime: dto.acf.reading_time.toString() || '5',
    author: {
      slug: dto?.author_details.slug || '',
      name: dto?.author_details.name || '',
      description: dto?.author_details.description || '',
      avatarUrl: dto?.author_details?.avatar_url || '',
      position: '',
    },
    content: highlightedContent,
    anchors: anchors,
  };
};
