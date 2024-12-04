let isekai={};
isekai.startLife = function(res){
  player={name:res.name,surname:res.surname,gender:res.gender,traits:res.traits};
  log="While I was on my way back home, I caught up in a mysterious aura and ended up in another world of sword and sorcery.";
}
isekai.getPlayerCreationControls = function() {
    let face = FaceGen.getInputControls();
    let info = [{
            type: 'text',
            id: 'name',
            label: 'First Name',
            default: 'Shinji'
        },
        {
            type: 'text',
            id: 'surname',
            label: 'Last Name',
            default: 'Yamada'
        },
        {
            type: 'list',
            id: 'traits',
            label: 'Traits',
            options: ['Brave', 'Cunning', 'Charismatic', 'Wise', 'Curious', 'Navigator', 'Scholar', 'Elemental Affinity', 'Divine Favor', 'Diplomat', 'Gossiper']
        },
        {
            type: 'button',
            id: 'start',
            label: 'Start Life'
        },
        {
            type: 'button',
            id: 'cancel',
            label: 'Cancel'
        }
    ];
    return face.concat(info);
}
