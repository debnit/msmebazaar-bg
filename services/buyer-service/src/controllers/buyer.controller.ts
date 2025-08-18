import { Request, Response } from "express"
import { getBuyerProfile, advancedSearch } from "../services/buyer.service"
import { advancedSearchSchema } from "../validation/buyer.schema"

export async function getProfileController(req: Request, res: Response) {
  const profile = await getBuyerProfile(req.user.id)
  res.json(profile)
}

export async function advancedSearchController(req: Request, res: Response) {
  const result = advancedSearchSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: "Invalid input" })

  const data = await advancedSearch(result.data.query, result.data.filters)
  res.json({ data })
}
