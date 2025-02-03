// controllers/mpController.js
const { createPreferenceBasic , createPreferenceMedium , createPreferencePremium } = require('../services/mpService');

/**
 * Controller para criação da preferência.
 * Retorna ao cliente os dados da preferência (como o init_point para redirecionamento).
 */
const createPreferenceBasicController = async (req, res) => {
  try {
    // Obtenha o oauthId do usuário autenticado (via token JWT)
    const oauthId = req.user.oauthId;

    if (!oauthId) {
      return res.status(400).json({ error: "Usuário não autenticado ou oauthId não encontrado" });
    }

    const preference = await createPreferenceBasic(oauthId); // Passe o oauthId
    return res.status(200).json({
      preferenceId: preference.id,
      init_point: preference.init_point
    });
  } catch (error) {
    console.error("Erro no controller:", error);
    return res.status(500).json({ error: "Erro ao criar preferência de pagamento 3 meses" });
  }
};
const createPreferenceMediumController = async (req, res) => {
  try {
    // Obtenha o oauthId do usuário autenticado (via token JWT)
    const oauthId = req.user.oauthId;

    if (!oauthId) {
      return res.status(400).json({ error: "Usuário não autenticado ou oauthId não encontrado" });
    }

    const preference = await createPreferenceMedium(oauthId);
    // O init_point é a URL para onde o usuário deve ser redirecionado para o Checkout Pro
    return res.status(200).json({
      preferenceId: preference.id,
      init_point: preference.init_point
    });
  } catch (error) {
    console.error("Erro no controller:", error);
    return res.status(500).json({ error: "Erro ao criar preferência de pagamento 6 meses" });
  }
};
const createPreferencePremiumController = async (req, res) => {
  try {
    // Obtenha o oauthId do usuário autenticado (via token JWT)
    const oauthId = req.user.oauthId;

    if (!oauthId) {
      return res.status(400).json({ error: "Usuário não autenticado ou oauthId não encontrado" });
    }

    const preference = await createPreferencePremium(oauthId);
    // O init_point é a URL para onde o usuário deve ser redirecionado para o Checkout Pro
    return res.status(200).json({
      preferenceId: preference.id,
      init_point: preference.init_point
    });
  } catch (error) {
    console.error("Erro no controller:", error);
    return res.status(500).json({ error: "Erro ao criar preferência de pagamento 9 meses" });
  }
};

module.exports = { createPreferenceBasicController, createPreferenceMediumController, createPreferencePremiumController };
