// components/Ordering/ItemSelection.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useOrder } from '@/context/OrderContext';
import { OrderItem } from '@/types';
import { getAddonsApi, getExtrasApi } from '@/api/orders';
import { appSettingConfig } from '@/lib/config';

interface QuantitySelectorProps {
  item: OrderItem;
  updateQuantity: (item: OrderItem, quantity: number) => void;
  currentQuantity: number;
}

const QuantitySelector = ({ item, updateQuantity, currentQuantity }: QuantitySelectorProps) => {
    const handleDecrement = () => {
        if (currentQuantity > 0) {
            updateQuantity(item, currentQuantity - 1);
        }
    };

    const handleIncrement = () => {
        updateQuantity(item, currentQuantity + 1);
    };

    return (
        <div className="flex items-center space-x-3">
            <button onClick={handleDecrement} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300">-</button>
            <span className="text-lg font-semibold w-8 text-center">{currentQuantity}</span>
            <button onClick={handleIncrement} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300">+</button>
        </div>
    );
};


interface ItemSelectionProps {
  title: string;
  itemType: 'addon' | 'dessert';
  onNext: () => void;
  onBack: () => void;
}

export const ItemSelection = ({ title, itemType, onNext, onBack }: ItemSelectionProps) => {
  const { order, updateAddonQuantity, updateDessertQuantity } = useOrder();
  const { data: session, status } = useSession();

  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (status !== 'authenticated') {
        if (status === 'unauthenticated') setError("Authentication required.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        let fetchedData: OrderItem[] = [];
        const jwtToken = (session as any)?.jwtToken;
        const apiBaseUrl = appSettingConfig.nutraPrepsApi || '';

        if (itemType === 'addon') {
          const addonsFromApi = await getAddonsApi(jwtToken, apiBaseUrl);
          fetchedData = addonsFromApi.map(addon => ({
              id: addon.id,
              name: addon.meal.name,
              price: parseFloat(addon.meal.supplement),
          }));
        } 
        else if (itemType === 'dessert') {
          const extrasFromApi = await getExtrasApi(jwtToken, apiBaseUrl);
          fetchedData = extrasFromApi.map(extra => ({
              id: extra.id,
              name: extra.name,
              price: parseFloat(extra.price),
          }));
        }

        setItems(fetchedData);
      } catch (err) {
        console.error(err);
        setError(`Failed to load ${itemType}s.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [itemType, status, session]);


  if (isLoading) {
    return <div className="p-8 w-full max-w-7xl text-center">Loading {itemType}s...</div>;
  }
  
  if (error) {
    return <div className="p-8 w-full max-w-7xl text-center text-red-600">{error}</div>;
  }

  const renderAddonSelector = () => (
    <div className="space-y-4">
        {items.map(item => {
            const sundayQuantity = order.addons.sunday.find(ci => ci.item.id === item.id)?.quantity || 0;
            const wednesdayQuantity = order.addons.wednesday.find(ci => ci.item.id === item.id)?.quantity || 0;
            return (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                            <p className="text-gray-500">£{item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-x-4">
                            <label className="font-medium">Sunday:</label>
                            <QuantitySelector item={item} updateQuantity={(item, quantity) => updateAddonQuantity(item, quantity, 'sunday')} currentQuantity={sundayQuantity} />
                        </div>
                        <div className="flex items-center gap-x-4">
                            <label className="font-medium">Wednesday:</label>
                            <QuantitySelector item={item} updateQuantity={(item, quantity) => updateAddonQuantity(item, quantity, 'wednesday')} currentQuantity={wednesdayQuantity} />
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
  );

  const renderDessertSelector = () => (
    <div className="space-y-4">
        {items.map(item => {
            const currentQuantity = order.desserts.find(ci => ci.item.id === item.id)?.quantity || 0;
            return (
                <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                        <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                        <p className="text-gray-500">£{item.price.toFixed(2)}</p>
                    </div>
                    <QuantitySelector item={item} updateQuantity={(item, quantity) => updateDessertQuantity(item, quantity)} currentQuantity={currentQuantity} />
                </div>
            );
        })}
    </div>
  );
  
  return (
    <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-7xl animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
        {itemType === 'addon' ? renderAddonSelector() : renderDessertSelector()}
        <div className="mt-8 flex justify-between">
             <button onClick={onBack} className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                ← Back
            </button>
            <button onClick={onNext} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                {itemType === 'addon' ? 'Next: Desserts →' : 'Review Your Box ✓'}
            </button>
        </div>
    </div>
  );
};