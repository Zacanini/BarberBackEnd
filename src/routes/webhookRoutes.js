const express = require('express');
const router = express.Router();
const { Shop, Payment } = require('../../models');

router.post('/webhook', async (req, res) => {
  console.log("Webhook recebido:", req.body);

  const notification = req.body;

  try {
    if (notification && notification.type === "payment") {
      const paymentId = notification.data.id;
      const paymentStatus = notification.data.status;

      // Obtenha o metadata enviado na criação da preferência
      const metadata = notification.data.metadata;
      const shopOauthId = metadata.shop_oauth_id;

      if (paymentStatus === "approved" && shopOauthId) {
        // Encontre o Shop pelo oauthId
        const shop = await Shop.findOne({ where: { oauthId: shopOauthId } });

        if (shop) {
          // Atualize o status da assinatura e a data de término
          shop.subscription_status = 'active';
          shop.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Exemplo: 30 dias de assinatura
          await shop.save();

          // Crie o registro do pagamento no banco de dados
          await Payment.create({
            shop_id: shop.id, // Use o ID do Shop
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