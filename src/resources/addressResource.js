/**
 * @class CategoryResource
 */
class AddressResource {
  /**
   * Constructs an instance of AddressResource with a address object.
   *
   * @param {Object} category - The category object containing data to be transformed.
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * Transforms the address object into a JSON-friendly format
   * @returns {Object}
   */
  toJson() {
    return {
      id: this.address.id,
      street_address: this.address?.street_address,
      city: this.address?.city,
      state: this.address?.state,
      postal_code: this.address?.postal_code,
      country: this.address?.country,
    };
  }
}

module.exports = AddressResource;
