import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProfitOrLoss from './ProfitOrLoss';

describe('ProfitOrLoss', function () {
  it('matches snapshot for type currency', function () {
    const { container } = render(<ProfitOrLoss value={1250.5} type="currency" />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for type percent', function () {
    const { container } = render(<ProfitOrLoss value={800} type="percent" />);

    expect(container).toMatchSnapshot();
  });
});
