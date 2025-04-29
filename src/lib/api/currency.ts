// Arquivo para integração com a API de moedas (freecurrencyapi.com)

// A chave da API deve ser armazenada em variáveis de ambiente
const API_KEY = process.env.NEXT_PUBLIC_FREECURRENCYAPI_KEY;
const API_BASE_URL = 'https://api.freecurrencyapi.com/v1';

export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyApiResponse {
  data: ExchangeRates;
}

/**
 * Obtém as taxas de câmbio atuais para a moeda base especificada
 * @param baseCurrency Código da moeda base (ex: USD, BRL)
 * @returns Objeto com as taxas de câmbio
 */
export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  if (!API_KEY) {
    console.warn('Chave da API Freecurrencyapi não configurada. Usando taxas de fallback.');
    return getFallbackRates(baseCurrency);
  }

  try {
    // Chamada real à API
    const response = await fetch(`${API_BASE_URL}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    
    const data: CurrencyApiResponse = await response.json();
    
    if (!data || !data.data) {
        throw new Error('Resposta da API inválida ou vazia.');
    }
    
    return data.data;
    
    // Código de simulação removido
    // return simulateApiResponse(baseCurrency);
  } catch (error) {
    console.error('Erro ao obter taxas de câmbio da API:', error);
    // Em caso de erro, retornamos taxas fixas de fallback
    return getFallbackRates(baseCurrency);
  }
}

/**
 * Converte um valor de uma moeda para outra
 * @param amount Valor a ser convertido
 * @param fromCurrency Moeda de origem
 * @param toCurrency Moeda de destino
 * @returns Objeto com o valor convertido e a taxa de câmbio
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ convertedAmount: number; exchangeRate: number }> {
  try {
    // Obtém as taxas de câmbio para a moeda de origem
    const rates = await getExchangeRates(fromCurrency);
    
    // Se a moeda de destino for igual à de origem, a taxa é 1
    if (fromCurrency === toCurrency) {
      return {
        convertedAmount: amount,
        exchangeRate: 1
      };
    }
    
    // Obtém a taxa de câmbio para a moeda de destino
    const rate = rates[toCurrency];
    
    if (rate === undefined || rate === null) {
      console.error(`Taxa de câmbio não encontrada para ${toCurrency} a partir de ${fromCurrency}. Usando fallback.`);
      // Tenta obter a taxa de fallback
      const fallbackRates = getFallbackRates(fromCurrency);
      const fallbackRate = fromCurrency === toCurrency ? 1 : (fallbackRates[toCurrency]);
      if (fallbackRate === undefined || fallbackRate === null) {
        throw new Error(`Taxa de câmbio de fallback também não encontrada para ${toCurrency}`);
      }
      const convertedAmountFallback = amount * fallbackRate;
      return {
        convertedAmount: parseFloat(convertedAmountFallback.toFixed(2)),
        exchangeRate: parseFloat(fallbackRate.toFixed(4))
      };
    }
    
    // Calcula o valor convertido
    const convertedAmount = amount * rate;
    
    return {
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      exchangeRate: parseFloat(rate.toFixed(4))
    };
  } catch (error) {
    console.error('Erro ao converter moeda:', error);
    
    // Em caso de erro geral, usamos taxas fixas de fallback
    const fallbackRates = getFallbackRates(fromCurrency);
    const rate = fromCurrency === toCurrency ? 1 : (fallbackRates[toCurrency] || 1); // Garante um valor padrão caso a moeda não exista no fallback
    
    return {
      convertedAmount: parseFloat((amount * rate).toFixed(2)),
      exchangeRate: parseFloat(rate.toFixed(4))
    };
  }
}

// Função de simulação mantida caso seja útil para testes futuros, mas não é chamada no fluxo normal
/**
 * Simula uma resposta da API com taxas de câmbio atualizadas
 * @param baseCurrency Moeda base
 * @returns Taxas de câmbio simuladas
 */
function simulateApiResponse(baseCurrency: string): ExchangeRates {
  const usdRates: ExchangeRates = {
    USD: 1,
    BRL: 5.05 + (Math.random() * 0.2 - 0.1),
    EUR: 0.92 + (Math.random() * 0.04 - 0.02),
    GBP: 0.78 + (Math.random() * 0.03 - 0.015),
    JPY: 107.5 + (Math.random() * 1 - 0.5),
    CAD: 1.35 + (Math.random() * 0.05 - 0.025),
    AUD: 1.48 + (Math.random() * 0.06 - 0.03),
    CNY: 7.15 + (Math.random() * 0.1 - 0.05),
  };
  
  if (baseCurrency === 'USD') {
    return usdRates;
  }
  
  const baseRate = usdRates[baseCurrency];
  if (!baseRate) {
    return getFallbackRates(baseCurrency);
  }
  
  const rates: ExchangeRates = {};
  Object.keys(usdRates).forEach(currency => {
    rates[currency] = usdRates[currency] / baseRate;
  });
  
  return rates;
}

/**
 * Retorna taxas de câmbio fixas de fallback em caso de erro na API
 * @param baseCurrency Moeda base
 * @returns Taxas de câmbio fixas
 */
function getFallbackRates(baseCurrency: string): ExchangeRates {
  const usdRates: ExchangeRates = {
    USD: 1,
    BRL: 5.00,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 107.0,
    CAD: 1.35,
    AUD: 1.48,
    CNY: 7.15,
  };
  
  if (baseCurrency === 'USD') {
    return usdRates;
  }
  
  const baseRate = usdRates[baseCurrency];
  if (!baseRate) {
    console.warn(`Moeda base de fallback não encontrada: ${baseCurrency}. Retornando apenas USD.`);
    return { USD: 1 }; 
  }
  
  const rates: ExchangeRates = {};
  Object.keys(usdRates).forEach(currency => {
    rates[currency] = usdRates[currency] / baseRate;
  });
  
  return rates;
}
