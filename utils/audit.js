const prisma = require('../db/prismaClient');

async function logAction(action, entityId, userId, metadata=null){

 await prisma.auditLog.create({
  data:{
   entityType:"PurchaseRequest",
   entityId,
   action,
   actorUserId:userId,
   metadata: metadata ? JSON.stringify(metadata) : null
  }
 });

}

module.exports = logAction;