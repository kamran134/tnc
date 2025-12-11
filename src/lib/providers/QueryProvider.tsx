'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Оптимальные настройки для нашего приложения
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Кэшируем данные на 5 минут
        staleTime: 5 * 60 * 1000,
        // Сохраняем кэш 10 минут
        gcTime: 10 * 60 * 1000,
        // Retry 1 раз при ошибке
        retry: 1,
        // Не рефетчим при фокусе окна (можно включить для dashboard)
        refetchOnWindowFocus: false,
        // Рефетчим при маунте если данные устарели
        refetchOnMount: true,
      },
      mutations: {
        // Retry мутаций не нужен
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: всегда создаём новый клиент
    return makeQueryClient();
  } else {
    // Browser: переиспользуем клиент
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
