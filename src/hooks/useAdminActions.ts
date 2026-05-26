import { useCallback, useState } from 'react';

function actionErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Action failed. Please try again.';
}

export function useAdminActions() {
  const [processingKey, setProcessingKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isProcessing = useCallback(
    (key: string) => processingKey === key,
    [processingKey]
  );

  const isBusy = processingKey !== null;

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const runAction = useCallback(
    async (key: string, action: () => Promise<void>, successMessage?: string) => {
      if (processingKey !== null) return false;
      setProcessingKey(key);
      setError('');
      setSuccess('');
      try {
        await action();
        if (successMessage) {
          setSuccess(successMessage);
        }
        return true;
      } catch (err) {
        setError(actionErrorMessage(err));
        return false;
      } finally {
        setProcessingKey(null);
      }
    },
    [processingKey]
  );

  return {
    processingKey,
    isProcessing,
    isBusy,
    error,
    success,
    setError,
    setSuccess,
    clearMessages,
    runAction,
  };
}
