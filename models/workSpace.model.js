const { Schema, model} = require('mongoose');

const Workspace = new Schema({
    
    idMembers: [{
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,  
    }],

    workspaceName: {
        type: String,
        required:true,
    },
});

module.exports = model('Workspaces', Workspace);