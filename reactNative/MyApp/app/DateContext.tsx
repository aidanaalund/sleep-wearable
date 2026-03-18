import React, { createContext, useContext, useState } from 'react';

interface DateContextType {
  globalSelectedDate: string;
  globalPreviousDate: string;
  globalNextDate: string;
  setGlobalSelectedDate: (date: string) => void;
  setGlobalPreviousDate: (date: string) => void;
  setGlobalNextDate: (date: string) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalSelectedDate, setGlobalSelectedDate] = useState('');
  const [globalPreviousDate, setGlobalPreviousDate] = useState('');
  const [globalNextDate, setGlobalNextDate] = useState('');

  return (
    <DateContext.Provider value={{
      globalSelectedDate, setGlobalSelectedDate,
      globalPreviousDate, setGlobalPreviousDate,
      globalNextDate,    setGlobalNextDate,
    }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error('useDateContext must be used within a DateProvider');
  return context;
};