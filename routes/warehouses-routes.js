import express from "express";
const router = express.Router();
import { findOne, index, remove, update, getStringMatchingRows, getInventoriesByWarehouseId } from "../controllers/warehouse-controller.js";


router.get("/", index);

router.route('/match/:s')
	.get(getStringMatchingRows)

router.get("/:id", findOne);

router.put("/:id", update);
router.delete("/:id", remove)

router.route('/:id/inventories')
  .get(getInventoriesByWarehouseId);

export default router;