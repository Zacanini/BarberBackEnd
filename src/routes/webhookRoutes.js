const express = require('express');
const router = express.Router();
const { Shop, Payment: PaymentModel } = require('../../models');
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Cria uma instância do cliente do Mercado Pago com o token de acesso
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACESS_TOKEN });

router.post('/webhook', async (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));
  const notification = req.body;

  try {
    if (notification && notification.type === "payment") {
      const paymentId = notification.data.id;
      const paymentStatus = notification.data.status;
      
      // Tenta extrair o oauthId do metadata ou external_reference do payload
      let shopOauthId = (notification.data.metadata && notification.data.metadata.shop_oauth_id) 
                          || notification.data.external_reference;
      
      // Se não encontrar, tenta buscar os detalhes completos do pagamento via API do MP
      if (!shopOauthId) {
        console.log(`Metadata ou external_reference ausentes no webhook. Buscando detalhes do pagamento ${paymentId}...`);
        try {
          // Utiliza a instância mpClient para buscar os detalhes do pagamento
          const paymentDetailResponse = await Payment.get(paymentId, mpClient);
          if (paymentDetailResponse.body && paymentDetailResponse.body.metadata) {
            shopOauthId = paymentDetailResponse.body.metadata.shop_oauth_id;
          }
        } catch (err) {
          console.error("Erro ao buscar detalhes do pagamento no Mercado Pago:", err);
        }
      }
      
      if (!shopOauthId) {
        console.error("Identificador do shop (oauthId) não fornecido no payload ou na consulta à API.");
        return res.status(400).send("Metadata inválido ou ausente");
      }

      if (paymentStatus === "approved") {
        // Procura o Shop pelo oauthId
        const shop = await Shop.findOne({ where: { oauthId: shopOauthId } });
        if (shop) {
          // Atualiza o status da assinatura e a data de término (30 dias de assinatura, por exemplo)
          shop.subscription_status = 'active';
          shop.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await shop.save();

          // Cria o registro do pagamento no banco de dados
          await PaymentModel.create({
            shop_id: shop.id,
            mp_payment_id: paymentId,
            amount: notification.data.transaction_amount,
            currency: notification.data.currency_id,
            status: paymentStatus,
            payment_method: notification.data.payment_method_id,
            invoice_url: notification.data.invoice_url
          });

          console.log(`Pagamento aprovado e assinatura atualizada para o Shop OAuth ID: ${shopOauthId}`);
        } else {
          console.error(`Shop com OAuth ID ${shopOauthId} não encontrado.`);
        }
      }
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro ao processar webhook");
  }
});

module.exports = router;
