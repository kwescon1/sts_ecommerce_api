/**
 * @class UserResource
 */
class UserResource {
  /**
   * Constructs an instance of UserResource with a user object.
   *
   * @param {Object} user - The user object containing data to be transformed.
   */
  constructor(user) {
    this.user = user;
  }

  /**
   * Transforms the user object into a JSON-friendly format
   * @returns {Object}
   */
  toJson() {
    return {
      id: this.user.id,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      username: this.user.username,
      email: this.user.email,
      dob: this.user.dob,
      image_url: this.user.image_url,
      image_identifier: this.user.image_identifier,
      is_admin: this.user.is_admin,
      is_suspended: this.user.is_suspended,
    };
  }
}

module.exports = UserResource;
