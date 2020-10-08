'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CandidateBasicInfoSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    gender: {
      type: String
    },
    date_of_birth: {
      type: Date
    },
    candidate_id: {
      type: String,
      required: true
    },
    title: {
      type: String
    }
  },
  {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: 'CandidateBasicInfo'
  }
);

const toJSONConfig = {transform: function transform(doc, ret) {
  ret._id = ret._id.toString();
}};

CandidateBasicInfoSchema.set('toJSON', toJSONConfig);

module.exports = mongoose.model('CandidateBasicInfo', CandidateBasicInfoSchema);
