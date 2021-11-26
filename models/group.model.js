const { Schema, model } = require('mongoose');

const Group = new Schema({
   name: {
       type: String,
       required: true,
   },

   workspaceId: {
       type: Schema.Types.ObjectId,
       ref: 'Workspaces',
       required: true,
   },

   private: {
       type: Boolean,
       required: true,
   },

   userId: [{
       type: Schema.Types.ObjectId,
       ref: 'Users',
       required: true,
   }],
});

module.exports = model('Groups', Group);
