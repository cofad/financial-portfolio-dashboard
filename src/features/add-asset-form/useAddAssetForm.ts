import { useEffect, useState, type BaseSyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type FieldErrors, type SubmitHandler, type UseFormRegister } from 'react-hook-form';
import { getQuote, type SymbolLookupResult } from '@/services/finnhub/finnhub';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addHolding, type Holding } from '@/store/portfolioSlice';
import { useToast } from '@components/toast/useToast';

const normalizeSymbol = (value: string): string => value.trim().toUpperCase();

const getNowIso = (): string => new Date(Date.now()).toISOString();

const portfolioSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1, 'Symbol is required.')
    .transform((value) => value.toUpperCase()),
  quantity: z.coerce.number().positive('Quantity must be greater than 0.'),
  purchasePrice: z.coerce.number().positive('Purchase price must be greater than 0.'),
  purchaseDate: z
    .string()
    .min(1, 'Purchase date is required.')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Purchase date must be valid.'),
  assetType: z
    .string()
    .min(1, 'Asset type is required.'),
});

type PortfolioFormInput = z.input<typeof portfolioSchema>;
type PortfolioFormValues = z.infer<typeof portfolioSchema>;

const createDefaultValues = (): PortfolioFormInput => ({
  symbol: '',
  quantity: '',
  purchasePrice: '',
  purchaseDate: getNowIso(),
  assetType: '',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

interface UsePortfolioFormResult {
  register: UseFormRegister<PortfolioFormInput>;
  onSubmit: (event?: BaseSyntheticEvent) => void;
  errors: FieldErrors<PortfolioFormInput>;
  isValid: boolean;
  isSubmitting: boolean;
  symbolQuery: string;
  onSymbolChange: (value: string) => void;
  onSymbolSelect: (result: SymbolLookupResult) => void;
  purchasePriceDisplay: string;
  totalPriceDisplay: string;
  quoteIsFetching: boolean;
  quoteIsError: boolean;
}

export const useAddAssetForm = (): UsePortfolioFormResult => {
  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const { pushToast } = useToast();
  const [symbolQuery, setSymbolQuery] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PortfolioFormInput, Record<string, never>, PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: createDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const watchedPrice = useWatch({ control, name: 'purchasePrice', defaultValue: '' });
  const watchedQuantity = useWatch({ control, name: 'quantity', defaultValue: '' });
  const quantityNumber =
    typeof watchedQuantity === 'number'
      ? watchedQuantity
      : typeof watchedQuantity === 'string' && watchedQuantity.trim().length > 0
        ? Number(watchedQuantity)
        : NaN;

  const normalizedSelectedSymbol = normalizeSymbol(selectedSymbol);
  const quoteQuery = useQuery({
    queryKey: ['quote', normalizedSelectedSymbol],
    queryFn: () => getQuote(normalizedSelectedSymbol),
    enabled: normalizedSelectedSymbol.length > 0,
    staleTime: 30_000,
  });
  const quotePrice = quoteQuery.data?.c;

  useEffect(() => {
    if (!normalizedSelectedSymbol) {
      setValue('purchasePrice', '', { shouldValidate: true, shouldDirty: true });
      return;
    }

    if (typeof quotePrice === 'number' && Number.isFinite(quotePrice)) {
      setValue('purchasePrice', quotePrice, { shouldValidate: true, shouldDirty: true });
    }
  }, [normalizedSelectedSymbol, quotePrice, setValue]);

  const onSymbolChange = (value: string) => {
    const normalizedValue = normalizeSymbol(value);
    const normalizedSelected = normalizeSymbol(selectedSymbol);
    if (selectedSymbol && normalizedValue !== normalizedSelected) {
      setSelectedSymbol('');
      setValue('assetType', '', { shouldValidate: true, shouldDirty: true });
    }
    setSymbolQuery(value);
    setValue('symbol', value, { shouldValidate: true, shouldDirty: true });
    setValue('purchasePrice', '', { shouldValidate: true, shouldDirty: true });
  };

  const onSymbolSelect = (result: SymbolLookupResult) => {
    const nextSymbol = result.displaySymbol ?? result.symbol ?? '';
    const nextAssetType = result.type ?? '';
    setSymbolQuery(nextSymbol);
    setSelectedSymbol(nextSymbol);
    setValue('symbol', nextSymbol, { shouldValidate: true, shouldDirty: true });
    setValue('assetType', nextAssetType, { shouldValidate: true, shouldDirty: true });
    setValue('purchasePrice', '', { shouldValidate: true, shouldDirty: true });
  };

  const handleFormSubmit: SubmitHandler<PortfolioFormValues> = (data) => {
    const normalizedSymbol = normalizeSymbol(data.symbol);
    const isDuplicate = holdings.some((holding) => holding.symbol.trim().toUpperCase() === normalizedSymbol);

    if (isDuplicate) {
      pushToast({
        message: `${normalizedSymbol} already exists in your portfolio.`,
        variant: 'error',
      });
      return;
    }

    const payload: Holding = {
      ...data,
      purchaseDate: getNowIso(),
      symbol: normalizedSymbol,
    };

    dispatch(addHolding(payload));
    pushToast({
      message: `Added ${normalizedSymbol} to your portfolio.`,
      variant: 'success',
    });
    reset(createDefaultValues());
    setSymbolQuery('');
    setSelectedSymbol('');
  };

  const purchasePriceDisplay =
    typeof watchedPrice === 'number' && Number.isFinite(watchedPrice)
      ? currencyFormatter.format(watchedPrice)
      : '';
  const totalPrice =
    typeof watchedPrice === 'number' && Number.isFinite(watchedPrice) && Number.isFinite(quantityNumber)
      ? watchedPrice * quantityNumber
      : null;
  const totalPriceDisplay = typeof totalPrice === 'number' ? currencyFormatter.format(totalPrice) : '';

  return {
    register,
    onSubmit: (event?: BaseSyntheticEvent) => {
      event?.preventDefault();
      void handleSubmit(handleFormSubmit)(event);
    },
    errors,
    isValid,
    isSubmitting,
    symbolQuery,
    onSymbolChange,
    onSymbolSelect,
    purchasePriceDisplay,
    totalPriceDisplay,
    quoteIsFetching: quoteQuery.isFetching,
    quoteIsError: quoteQuery.isError,
  };
};
