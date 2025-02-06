// services/mpService.js
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Instancia o cliente usando a nova classe de configuração
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACESS_TOKEN });

// Cria a instância da API de Preference
const preferenceService = new Preference(client);

/**
 * Cria a preferência de pagamento para um produto de R$209,70
 * permitindo parcelamento no cartão em até 3x (e excluindo boleto)
 */
const createPreferenceBasic = async (oauthId) => {
  const preference = {
    items: [
      {
        title: "Plano Basic",
        description: "Assinatura de 3 meses",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 209.70,
      },
    ],
    payment_methods: {
      installments: 3,
      excluded_payment_types: [{ id: "ticket" }],
    },
    metadata: {
      shop_oauth_id: oauthId,
    },
    external_reference: oauthId,
    back_urls: {
      success: `${process.env.URL_NGROK}/success`,
      failure: `${process.env.URL_NGROK}/failure`,
      pending: `${process.env.URL_NGROK}/pending`,
    },
    auto_return: "approved",
    
  };

  try {
    const response = await preferenceService.create({ body: preference });
    console.log("Resposta da API do MP:", response);
    // Se a resposta tiver a propriedade "body", retorne-a; caso contrário, retorne a própria resposta
    return response.body ? response.body : response;
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    throw error;
  }
};
const createPreferenceMedium = async (oauthId) => {
  const preference = {
    items: [
      {
        title: "Plano medio",
        description: "Assinatura de 6 meses",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 359.90,
      },
    ],
    payment_methods: {
      installments: 6,
      excluded_payment_types: [{ id: "ticket" }],
    },
    metadata: {
      shop_oauth_id: oauthId,
    },
    external_reference: oauthId,
    back_urls: {
      success: `${process.env.URL_NGROK}/success`,
      failure: `${process.env.URL_NGROK}/failure`,
      pending: `${process.env.URL_NGROK}/pending`,
    },
    auto_return: "approved",
    
  };

  try {
    const response = await preferenceService.create({ body: preference });
    console.log("Resposta da API do MP:", response);
    // Se a resposta tiver a propriedade "body", retorne-a; caso contrário, retorne a própria resposta
    return response.body ? response.body : response;
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    throw error;
  }
};
const createPreferencePremium = async (oauthId) => {
  const preference = {
    items: [
      {
        title: "Plano Premium",
        description: "Assinatura de 9 meses",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 539.90,
      },
    ],
    payment_methods: {
      installments: 9,
      excluded_payment_types: [{ id: "ticket" }],
    },
    metadata: {
      shop_oauth_id: oauthId,
    },
    external_reference: oauthId,
    back_urls: {
      success: `${process.env.URL_NGROK}/success`,
      failure: `${process.env.URL_NGROK}/failure`,
      pending: `${process.env.URL_NGROK}/pending`,
    },
    auto_return: "approved",
    
  };

  try {
    const response = await preferenceService.create({ body: preference });
    console.log("Resposta da API do MP:", response);
    // Se a resposta tiver a propriedade "body", retorne-a; caso contrário, retorne a própria resposta
    return response.body ? response.body : response;
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    throw error;
  }
};
module.exports = { createPreferenceBasic, createPreferenceMedium, createPreferencePremium };
