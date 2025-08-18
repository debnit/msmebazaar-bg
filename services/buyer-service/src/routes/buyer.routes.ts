import { Router } from "express"
import { requireAuth } from "../middlewares/auth"
import { requireBuyerRole, requireBuyerPro } from "../middlewares/roleGating"
import { getProfileController, advancedSearchController } from "../controllers/buyer.controller"

const router = Router()
router.get("/profile", requireAuth, requireBuyerRole, getProfileController)
router.post("/advanced-search", requireAuth, requireBuyerRole, requireBuyerPro, advancedSearchController)
export default router
