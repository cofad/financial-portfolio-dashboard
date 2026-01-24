import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', function () {
  beforeEach(function () {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it('matches snapshot', function () {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    const { container } = render(
      <ConfirmDialog
        open={true}
        title="Delete asset"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
