import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

export type Layout = 'compact' | 'hero';

// TODO rethink this card
@Component({
  selector: 'al-article-hero-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    RouterLink,
    DatePipe,
    IconComponent,
    UiDifficultyComponent,
    LocalizeRouterModule,
  ],
  templateUrl: './article-hero-card.component.html',
})
export class ArticleHeroCardComponent {
  article = input.required<ArticleCard>();
}
