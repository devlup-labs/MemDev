import Dexie from "dexie"

export const db =new Dexie("MemDevDB")


db.version(1).stores({

  pending_saves:
    "memoryId, status, created_at, retry_count"

})


export async function queueMemory(
  memory
) {

  const existing =await db.pending_saves.get(
      memory.memoryId
    )

  if (existing) {
    return
  }


  await db.pending_saves.add({

    memoryId:
      memory.memoryId,

    memory,

    status:
      "pending",

    created_at:
      Date.now(),

    retry_count:
      0

  })

}