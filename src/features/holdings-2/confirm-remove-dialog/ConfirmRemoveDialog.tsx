import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import { useHoldings2Context } from '@features/holdings-2/holdings-2-provider/Holdings2Provider';

function ConfirmRemoveDialog() {
  const { pendingRemove, confirmRemove, clearPendingRemove } = useHoldings2Context();

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
