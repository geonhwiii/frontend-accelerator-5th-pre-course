import { Children, createContext, isValidElement, useContext, useState, type ReactNode } from 'react';
import { Tab } from 'tosslib';

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
  children: ReactNode;
};

export function Tabs({ defaultValue, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
}

type TriggerProps = {
  value: string;
  children: ReactNode;
};

function Trigger(_props: TriggerProps) {
  return null;
}

function List({ children }: { children: ReactNode }) {
  const { value, setValue } = useTabsContext();

  const items = Children.toArray(children)
    .filter(isValidElement<TriggerProps>)
    .map(child => ({
      value: child.props.value,
      label: child.props.children,
    }));

  return (
    <Tab onChange={setValue}>
      {items.map(item => (
        <Tab.Item key={item.value} value={item.value} selected={value === item.value}>
          {item.label}
        </Tab.Item>
      ))}
    </Tab>
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

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;
