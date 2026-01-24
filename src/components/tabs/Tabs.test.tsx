import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tabs, { type Tab } from './Tabs';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', content: <div>Overview content</div> },
  { id: 'performance', label: 'Performance', content: <div>Performance content</div> },
  { id: 'risk', label: 'Risk', content: <div>Risk content</div> },
];

describe('Tabs', function () {
  it('matches snapshot', function () {
    const { container } = render(<Tabs tabs={tabs} defaultTabId="overview" />);

    expect(container).toMatchSnapshot();
  });
});
