const supabase = require("../config/supabase");

// Create instance before exporting
const userController = new (class UserController {
    async getAllUsers(req, res) {
        try {
            const { data, error } = await supabase
                .from("users")
                .select(`
                    id,
                    first_name,
                    last_name,
                    email,
                    user_profiles (
                        date_of_birth,
                        bio
                    )
                `);

            if (error) {
                throw error;
            }

            return res.json(data);

        } catch (error) {
            console.error("Error in getAllUsers:", error);
            res.status(400).json({ error: error.message });
        }
    }

  async getUser(req, res) {
    try {
      const userId = req.params.id;

      const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            first_name,
            last_name,
            email,
            user_profiles (
                date_of_birth,
                bio
            )
        `)
        .eq("id", userId);

      if (error && error.code !== "PGRST116") {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        return res.json(data);
      }
      
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(400).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    const { first_name, last_name, email, bio, date_of_birth } = req.body;
    console.log(date_of_birth);

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          first_name,
          last_name,
          email
        })
        .select("*")
        .single();

      if (userError) {
        throw userError;
      }

      console.log(userData.id);

      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: userData.id,
          bio: bio,
          date_of_birth: date_of_birth
        });  

      if (profileError) {
        throw profileError;
      }

      return res.json(userData);

    } catch (error) {
      console.error("Create user error", error);
    }
  }
})

// Add debug logging
console.log("Available controller methods:", Object.keys(userController));

// Export the controller instance
module.exports = userController;