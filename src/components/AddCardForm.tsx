import { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

const cardElementStyle = {
  base: {
    fontSize: '14px',
    color: '#1e293b',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    '::placeholder': { color: '#94a3b8' },
  },
  invalid: { color: '#ef4444' },
};

interface AddCardFormProps {
  activeToken: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddCardForm({ activeToken, onSuccess, onCancel }: AddCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setSaving(true);

    try {
      const siRes = await fetch('/api/payment-methods/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      });

      if (!siRes.ok) throw new Error('Erro ao criar setup intent.');
      const { clientSecret } = await siRes.json();

      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error('Elemento de cartão não encontrado.');

      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardNumber },
      });

      if (stripeError) throw new Error(stripeError.message);
      if (!setupIntent?.payment_method) throw new Error('Método de pagamento não retornado.');

      const saveRes = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          stripePaymentMethodId: setupIntent.payment_method,
          isDefault,
        }),
      });

      if (!saveRes.ok) {
        const data = await saveRes.json();
        throw new Error(data?.message || 'Erro ao salvar cartão.');
      }

      toast.success('Cartão salvo com sucesso!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erro inesperado.');
      setError(err.message || 'Erro inesperado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Número do cartão
        </label>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#6AB092] transition-shadow">
          <CardNumberElement options={{ style: cardElementStyle }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Validade</label>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#6AB092] transition-shadow">
            <CardExpiryElement options={{ style: cardElementStyle }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">CVC</label>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#6AB092] transition-shadow">
            <CardCvcElement options={{ style: cardElementStyle }} />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="w-4 h-4 rounded accent-[#6AB092]"
        />
        <span className="text-sm text-slate-600 font-medium">Definir como cartão padrão</span>
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving || !stripe}
          className="flex-1 bg-[#5EBA91] hover:bg-[#4EAB82] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-full transition-colors shadow-sm cursor-pointer"
        >
          {saving ? 'Salvando...' : 'Salvar cartão'}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-full transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
