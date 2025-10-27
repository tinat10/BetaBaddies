import { v4 as uuidv4 } from 'uuid';
import database from './database.js';
import userService from './userService.js';
import profileService from './profileService.js';

class OAuthService {
  /**
   * Handle OAuth login - create or link account
   * @param {Object} oauthData - OAuth profile data
   * @returns {Promise<Object>} User and account info
   */
  async handleOAuthLogin(oauthData) {
    const {
      provider,
      providerId,
      email,
      displayName,
      firstName,
      lastName,
      profilePicture,
      headline,
      linkedinUrl,
      githubUrl,
      bio,
      accessToken,
      refreshToken,
      profileData,
    } = oauthData;

    try {
      console.log(`🔐 Processing OAuth login for ${email} via ${provider}`);

      // 1. Check if OAuth account already exists
      const existingOAuthAccount = await this.getOAuthAccount(provider, providerId);

      if (existingOAuthAccount) {
        console.log('✅ Found existing OAuth account, updating tokens');
        // Update tokens and profile data
        await this.updateOAuthAccount(existingOAuthAccount.id, {
          accessToken,
          refreshToken,
          profileData,
        });

        // Get user
        const user = await userService.getUserById(existingOAuthAccount.user_id);

        return {
          user,
          isNewUser: false,
          oauthAccount: existingOAuthAccount,
        };
      }

      // 2. Check if user with this email already exists
      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        console.log('✅ Found existing user, linking OAuth account');
        // Link OAuth account to existing user
        const oauthAccount = await this.createOAuthAccount({
          userId: existingUser.u_id,
          provider,
          providerId,
          accessToken,
          refreshToken,
          profileData,
        });

        // Update profile with OAuth data (if not already populated)
        await this.importProfileData(existingUser.u_id, oauthData);

        return {
          user: existingUser,
          isNewUser: false,
          oauthAccount,
          profileImported: true,
        };
      }

      // 3. Create new user
      console.log('📝 Creating new user from OAuth');
      const newUserId = uuidv4();
      const userQuery = `
        INSERT INTO users (u_id, email, password, oauth_provider, oauth_provider_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING u_id, email, created_at, updated_at
      `;

      const userResult = await database.query(userQuery, [
        newUserId,
        email,
        null, // No password for OAuth users
        provider,
        providerId,
      ]);

      const newUser = userResult.rows[0];

      // 4. Create OAuth account record
      const oauthAccount = await this.createOAuthAccount({
        userId: newUserId,
        provider,
        providerId,
        accessToken,
        refreshToken,
        profileData,
      });

      // 5. Create profile with OAuth data
      await this.importProfileData(newUserId, oauthData);

      console.log('✅ New user created successfully via OAuth');

      return {
        user: {
          u_id: newUser.u_id,
          email: newUser.email,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
        },
        isNewUser: true,
        oauthAccount,
        profileImported: true,
      };
    } catch (error) {
      console.error('❌ Error in handleOAuthLogin:', error);
      throw error;
    }
  }

  /**
   * Get OAuth account by provider and provider ID
   */
  async getOAuthAccount(provider, providerId) {
    const query = `
      SELECT * FROM oauth_accounts
      WHERE provider = $1 AND provider_user_id = $2
    `;
    const result = await database.query(query, [provider, providerId]);
    return result.rows[0] || null;
  }

  /**
   * Create OAuth account record
   */
  async createOAuthAccount({ userId, provider, providerId, accessToken, refreshToken, profileData }) {
    const query = `
      INSERT INTO oauth_accounts (
        user_id, provider, provider_user_id, access_token, 
        refresh_token, profile_data, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const result = await database.query(query, [
      userId,
      provider,
      providerId,
      accessToken,
      refreshToken,
      JSON.stringify(profileData),
    ]);

    return result.rows[0];
  }

  /**
   * Update OAuth account tokens
   */
  async updateOAuthAccount(accountId, { accessToken, refreshToken, profileData }) {
    const query = `
      UPDATE oauth_accounts
      SET 
        access_token = $1,
        refresh_token = $2,
        profile_data = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const result = await database.query(query, [
      accessToken,
      refreshToken,
      JSON.stringify(profileData),
      accountId,
    ]);

    return result.rows[0];
  }

  /**
   * Import profile data from OAuth provider
   */
  async importProfileData(userId, oauthData) {
    const {
      provider,
      firstName,
      lastName,
      profilePicture,
      headline,
      linkedinUrl,
      githubUrl,
      bio,
    } = oauthData;

    try {
      console.log(`📥 Importing profile data from ${provider}...`);
      
      // Check if profile already exists
      const existingProfile = await profileService.getProfileByUserId(userId);

      const profileData = {
        firstName: firstName || '',
        lastName: lastName || '',
        bio: bio || headline || '',
        profileImportedFrom: provider,
        lastImportedAt: new Date(),
      };

      // Add provider-specific URLs
      if (linkedinUrl) profileData.linkedinUrl = linkedinUrl;
      if (githubUrl) profileData.githubUrl = githubUrl;

      if (existingProfile) {
        // Update only if fields are empty
        const updates = {};
        if (!existingProfile.first_name && profileData.firstName) {
          updates.firstName = profileData.firstName;
        }
        if (!existingProfile.last_name && profileData.lastName) {
          updates.lastName = profileData.lastName;
        }
        if (!existingProfile.bio && profileData.bio) {
          updates.bio = profileData.bio;
        }
        if (linkedinUrl) updates.linkedinUrl = linkedinUrl;
        if (githubUrl) updates.githubUrl = githubUrl;

        if (Object.keys(updates).length > 0) {
          await profileService.updateProfile(userId, updates);
          console.log(`✅ Profile updated with ${Object.keys(updates).length} fields`);
        }
      } else {
        // Create new profile with OAuth data
        // Note: state is required, so we'll use a default
        await profileService.createProfile(userId, {
          ...profileData,
          state: 'NJ', // Default state, user can update later
        });
        console.log('✅ New profile created from OAuth data');
      }

      // Update profile picture if provided
      if (profilePicture && profilePicture !== '') {
        try {
          await profileService.updateProfilePicture(userId, profilePicture);
          console.log('✅ Profile picture set from OAuth');
        } catch (err) {
          console.warn('⚠️  Could not set profile picture:', err.message);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error importing profile data:', error);
      // Don't throw - profile import is not critical
      return false;
    }
  }

  /**
   * Get all OAuth accounts for a user
   */
  async getUserOAuthAccounts(userId) {
    const query = `
      SELECT id, provider, provider_user_id, created_at, updated_at
      FROM oauth_accounts
      WHERE user_id = $1
    `;
    const result = await database.query(query, [userId]);
    return result.rows;
  }

  /**
   * Unlink OAuth account
   */
  async unlinkOAuthAccount(userId, provider) {
    const query = `
      DELETE FROM oauth_accounts
      WHERE user_id = $1 AND provider = $2
      RETURNING *
    `;
    const result = await database.query(query, [userId, provider]);
    return result.rows[0];
  }
}

export default new OAuthService();

