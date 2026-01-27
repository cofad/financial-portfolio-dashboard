import { useMemo, useRef, useState, type ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

function Tabs({ tabs, defaultTabId }: TabsProps) {
  const initialTabId = useMemo(() => {
    if (defaultTabId && tabs.some((tab) => tab.id === defaultTabId)) {
      return defaultTabId;
    }

    return tabs[0]?.id ?? '';
  }, [defaultTabId, tabs]);

  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? null;
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="flex w-full gap-0 overflow-x-auto overflow-y-hidden border-b border-slate-800 whitespace-nowrap lg:overflow-x-visible"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                setActiveTabId(tab.id);
              }}
              onKeyDown={(event) => {
                const { key } = event;
                if (key === 'Enter' || key === ' ') {
                  event.preventDefault();

                  setActiveTabId(tab.id);
                  return;
                }

                let nextIndex: number | null = null;

                if (key === 'ArrowRight') {
                  nextIndex = (index + 1) % tabs.length;
                } else if (key === 'ArrowLeft') {
                  nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (key === 'Home') {
                  nextIndex = 0;
                } else if (key === 'End') {
                  nextIndex = tabs.length - 1;
                }

                if (nextIndex !== null) {
                  event.preventDefault();
                  const nextTab = tabs[nextIndex];
                  setActiveTabId(nextTab.id);
                  tabButtonRefs.current[nextIndex]?.focus();
                }
              }}
              ref={(element) => {
                tabButtonRefs.current[index] = element;
              }}
              className={`-mb-px flex-1 px-3 py-2 text-[16px] font-semibold transition focus:outline-none focus-visible:bg-slate-700/60 focus-visible:outline-none sm:min-w-35 sm:px-4 sm:py-3 ${
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
}

export default Tabs;
