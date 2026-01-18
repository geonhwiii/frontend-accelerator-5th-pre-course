import { createContext, useContext, useState, type ReactNode } from 'react';
import { Tab } from 'tosslib';

type TabItem = {
  value: string;
  label: ReactNode;
};

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs 컴포넌트 내부에서 사용해주세요.');
  }
  return context;
}

type TabsProps = {
  defaultValue: string;
  items: TabItem[];
  children: ReactNode;
};

export function Tabs({ defaultValue, items, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <Tab onChange={setValue}>
        {items.map(item => (
          <Tab.Item key={item.value} value={item.value} selected={value === item.value}>
            {item.label}
          </Tab.Item>
        ))}
      </Tab>
      {children}
    </TabsContext.Provider>
  );
}

type ContentProps = {
  value: string;
  children: ReactNode;
};

function Content({ value, children }: ContentProps) {
  const { value: selectedValue } = useTabsContext();
  return selectedValue === value ? <>{children}</> : null;
}

Tabs.Content = Content;
