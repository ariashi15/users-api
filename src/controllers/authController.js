const supabase = require("../config/supabase");

class AuthController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      res.json({
        message: "Signup successful! Check your email for verification.",
        user: data.user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      res.json({
        message: "Login successful",
        session: data.session,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProtectedData(req, res) {
    res.json({
      message: "This is protected data!",
      user: req.user,
    });
  }
}

module.exports = new AuthController();