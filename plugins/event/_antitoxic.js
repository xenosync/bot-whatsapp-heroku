exports.run={
    main:async(m,{func,mecha,groups,setting,isPrem})=>{
        if(m.budy&&groups.antitoxic&&!m.isAdmin&&!isPrem&&!m.isPrefix){
            let array=m.budy.toLowerCase().split(' ');
            let status=func.removeDuplicateLetters(array).map(words=>setting.toxic.some(badword=>badword===words)).filter(state=>state);
            if(status.length>0){
                await mecha.sendMessage(m.chat,{
                    delete:{
                        remoteJid:m.chat,
                        fromMe:false,
                        id:m.key.id,
                        participant:m.sender
                    }
                });
            }
        }
    },
    group:true,
    botAdmin:true
};