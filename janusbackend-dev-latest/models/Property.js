// Imports
import mongoose from "mongoose";

// Schema
const PropertySchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  property_code: { type: String },
  legal_name: { type: String },
  name: { type: String },
  street_address: { type: String },
  zip_code: { type: String },
  postal_address: { type: String },
  district: { type: String },
  maintenance_area: { type: String },
  administrative_area: { type: String },
  listed_buildings: { type: String },
  municipal_sewage: { type: String },
  owned_property: { type: String },
  responsible_user: {
    type: String,
    set: (value) => value?.toLowerCase(),
  },
  contract_exist: { type: String },
  contract_includes: { type: String },
  contract_access_to_property: { type: String },
  contract_code: { type: String },
  changed_by: { type: String },
  // ....................
  owner: { type: String },
  area_lawn: { type: String },
  area_plantation: { type: String },
  area_land: { type: String },
  area_park: { type: String },
  area_hard: { type: String },
  area_water: { type: String },
  area_parking: { type: String },
  built_percentage: { type: String },
  sum_area_bta: { type: String },
  sum_area_bra: { type: String },
  sum_area_loa: { type: String },
  sum_area_ova: { type: String },
  sum_area_heating: { type: String },
  sum_area_boa: { type: String },
  sum_area_bia: { type: String },
  sum_no_of_apartments: { type: String },
  contract_sum: { type: String },
  contract_sum_sqm: { type: String },
  contract_excludes: { type: String },
  change_date: { type: String },
  image: {
    link: { type: String },
    createdAt: { type: Date, default: new Date() },
    format: { type: String },
    dimensions: { type: String },
    key: { type: String },
  },
});

// Export
export default mongoose.model("properties", PropertySchema);
