import { Routes } from '@angular/router';
import { ArticleListComponent } from './features/article-list/article-list.component';
import { ArticleCreateComponent } from './features/article-create/article-create.component';
import { ArticleDetailComponent } from './features/article-detail/article-detail.component';
import { CommentsPanelComponent } from './features/comments/comments-panel.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Articles',
    component: ArticleListComponent,
  },
  {
    path: 'create',
    title: 'Create Article',
    component: ArticleCreateComponent,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'article/:id',
    title: 'Article',
    component: ArticleDetailComponent,
    children: [
      {
        path: 'comments',
        component: CommentsPanelComponent,
        outlet: 'side-panel',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];