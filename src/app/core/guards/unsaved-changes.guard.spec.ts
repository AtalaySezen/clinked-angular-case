import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { unsavedChangesGuard, HasUnsavedChanges } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  const makeComponent = (dirty: boolean): HasUnsavedChanges => ({
    hasUnsavedChanges: () => dirty,
  });

  const runGuard = (component: HasUnsavedChanges) =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(component, {} as any, {} as any, {} as any),
    );

  it('should return true immediately when there are no unsaved changes', () => {
    TestBed.configureTestingModule({});
    const result = runGuard(makeComponent(false));
    expect(result).toBe(true);
  });

  it('should open a dialog and return true when user confirms', async () => {
    const dialogRefMock = { afterClosed: () => of(true) } as MatDialogRef<unknown>;
    const dialogMock = { open: vi.fn().mockReturnValue(dialogRefMock) } as unknown as MatDialog;

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    });

    const result$ = runGuard(makeComponent(true)) as import('rxjs').Observable<boolean>;
    const value = await new Promise((resolve) => result$.subscribe(resolve));

    expect(dialogMock.open).toHaveBeenCalledOnce();
    expect(value).toBe(true);
  });

  it('should open a dialog and return false when user cancels', async () => {
    const dialogRefMock = { afterClosed: () => of(false) } as MatDialogRef<unknown>;
    const dialogMock = { open: vi.fn().mockReturnValue(dialogRefMock) } as unknown as MatDialog;

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    });

    const result$ = runGuard(makeComponent(true)) as import('rxjs').Observable<boolean>;
    const value = await new Promise((resolve) => result$.subscribe(resolve));

    expect(value).toBe(false);
  });
});
