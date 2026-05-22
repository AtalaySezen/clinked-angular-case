import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.hasUnsavedChanges()) return true;

  const dialog = inject(MatDialog);

  return dialog
    .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
      data: {
        title: 'Discard changes?',
        message: 'You have unsaved changes that will be lost if you leave this page.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
      },
      width: '380px',
      autoFocus: false,
      restoreFocus: false,
    })
    .afterClosed()
    .pipe(map((confirmed) => confirmed === true));
};
