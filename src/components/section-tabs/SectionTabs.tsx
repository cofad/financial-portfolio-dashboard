import { useMemo, useState, type ReactNode } from 'react';

export interface SectionTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface SectionTabsProps {
  tabs: SectionTab[];
  defaultTabId?: string;
}

const SectionTabs = ({ tabs, defaultTabId }: SectionTabsProps) => {
  const initialTabId = useMemo(() => {
    if (defaultTabId && tabs.some((tab) => tab.id === defaultTabId)) {
      return defaultTabId;
    }
    return tabs[0]?.id ?? '';
  }, [defaultTabId, tabs]);

  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? null;

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="flex w-full gap-0 overflow-x-auto border-b border-slate-800 whitespace-nowrap"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              onClick={() => {
                setActiveTabId(tab.id);
              }}
              className={`-mb-px flex-1 px-3 py-2 text-[14px] font-semibold transition sm:min-w-[140px] sm:px-4 sm:py-3 ${
                isActive
                  ? 'border-b-2 border-emerald-300 text-emerald-100'
                  : 'border-b-2 border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              <span className="mx-auto">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab ? (
        <div
          role="tabpanel"
          id={`${activeTab.id}-panel`}
          aria-labelledby={`${activeTab.id}-tab`}
          className="flex flex-col gap-4"
        >
          {activeTab.content}
        </div>
      ) : null}
    </section>
  );
};

export default SectionTabs;
