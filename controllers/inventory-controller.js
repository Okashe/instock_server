import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getAllInventoryItems = async (_req, res) => {
  try {
    const inventoryItems = await knex('inventories')
      .select(
        'inventories.id', 
        'inventories.item_name', 
        'inventories.description', 
        'inventories.category', 
        'inventories.status', 
        'inventories.quantity', 
        'inventories.created_at', 
        'inventories.updated_at',
        'warehouses.warehouse_name'  
      )
      .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id');

    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(400).send(`Error getting inventory items: ${error}`);
  }
};

// Get a single inventory item by ID
export const getInventoryItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const inventoryItem = await knex('inventories')
      .select(
        'inventories.id', 
        'warehouses.warehouse_name',
        'inventories.item_name', 
        'inventories.description', 
        'inventories.category', 
        'inventories.status', 
        'inventories.quantity'
      )
      .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
      .where('inventories.id', id)
      .first();

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found." });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(400).send(`Error getting inventory item: ${error}`);
  }
};

export const add = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } = req.body;

  if (!warehouse_id || !item_name || !description || !category || !status || !quantity ) {
    return res.status(400).json({
      message: "Please provide missing data"
    });
  }
  const warehouse = await knex("warehouses")
    .where({id : warehouse_id})
    .first();

  if (!warehouse) {
    return res.status(400).json({
      message: "Invalid warehouse id"
    })
  }

  if (isNaN(quantity) || Number(quantity) < 0){
    return res.status(400).json({
      message: "Quantity value must be a number"
    })
  }

  try {
    const result = await knex("inventories")
      .insert({
        id:null,
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity
      });
    
    const [ id ] = result;
    const newRecord = await knex("inventories")
      .where({ id })
      .first()
    
    res.status(201).json(newRecord)
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new inventory item: ${error}`
    });
  }
};
