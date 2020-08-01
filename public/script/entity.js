/*
        Default AI
*/

var DefaultAI = {
    "entity/player":(entity) => {
        // Init
        if (!("animSprites" in entity) || !("animSpeed" in entity))
            return;
        if (!(entity.init))
        {
            entity.state = "default";
            entity.animFlip = false;
            entity.animFrame = 0;
            entity.init = true;
        }

        // Anim
        var realAnimState = entity.animFlip ? entity.state + "_flip" : entity.state;
        entity.animFrame += entity.animSpeed;
        if (entity.animFrame >= entity.animSprites[realAnimState].length)
            entity.animFrame = 0;
        entity.sprite = entity.animSprites[realAnimState][Math.floor(entity.animFrame)];
    }
}