import { useEffect, useState, type BaseSyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type FieldErrors, type SubmitHandler, type UseFormRegister } from 'react-hook-form';
import { useHoldingsDispatch, useHoldingsSelector } from '@store/holdings/hooks';
import { addHolding, type Holding } from '@store/holdings/slice';
import { useToast } from '@components/toast/useToast';
import { normalizeSymbol } from '@utils/symbol';
import { getNowIso } from '@utils/date';
import { fetchQuote, type SearchResult } from '@/services/mock-api/mock-api';

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
  assetType: z.string().min(1, 'Asset type is required.'),
});

type AddAssetFormInput = z.input<typeof portfolioSchema>;
type AddAssetFormValues = z.infer<typeof portfolioSchema>;

const createDefaultValues = (): AddAssetFormInput => ({
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

interface UseAddAssetForm {
  register: UseFormRegister<AddAssetFormInput>;
  onSubmit: (event?: BaseSyntheticEvent) => void;
  errors: FieldErrors<AddAssetFormInput>;
  isValid: boolean;
  isSubmitting: boolean;
  symbolQuery: string;
  onSymbolChange: (value: string) => void;
  onSymbolSelect: (result: SearchResult) => void;
  purchasePriceDisplay: string;
  totalPriceDisplay: string;
  quoteIsFetching: boolean;
  quoteIsError: boolean;
}

export const useAddAssetForm = (): UseAddAssetForm => {
  const dispatch = useHoldingsDispatch();
  const holdings = useHoldingsSelector((state) => state.holdings.holdings);

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
  } = useForm<AddAssetFormInput, Record<string, never>, AddAssetFormValues>({
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
    queryFn: () => fetchQuote(normalizedSelectedSymbol),
    enabled: normalizedSelectedSymbol.length > 0,
  });

  const quotePrice = quoteQuery.data?.currentPrice;

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

  const onSymbolSelect = (result: SearchResult) => {
    const nextSymbol = result.name;
    const nextAssetType = result.type;

    setSymbolQuery(nextSymbol);
    setSelectedSymbol(nextSymbol);

    setValue('symbol', nextSymbol, { shouldValidate: true, shouldDirty: true });
    setValue('assetType', nextAssetType, { shouldValidate: true, shouldDirty: true });
    setValue('purchasePrice', '', { shouldValidate: true, shouldDirty: true });
  };

  const handleFormSubmit: SubmitHandler<AddAssetFormValues> = (data) => {
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
