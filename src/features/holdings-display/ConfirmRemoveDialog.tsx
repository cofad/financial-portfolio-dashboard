import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import { useHoldingsDisplayContext } from '@/features/holdings-display/HoldingsDisplayProvider';

function ConfirmRemoveDialog() {
  const { pendingRemove, confirmRemove, clearPendingRemove } = useHoldingsDisplayContext();

  if (!pendingRemove) {
    return null;
  }

  return (
    <ConfirmDialog
      open={Boolean(pendingRemove)}
      title="Remove holding?"
      description={`Remove ${pendingRemove.symbol} from your portfolio? This cannot be undone.`}
      confirmLabel="Remove"
      cancelLabel="Cancel"
      onConfirm={() => {
        confirmRemove();
      }}
      onCancel={() => {
        clearPendingRemove();
      }}
    />
  );
}

export default ConfirmRemoveDialog;
