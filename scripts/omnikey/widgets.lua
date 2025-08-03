local OmnikeyWidgets = {}

local TEMPLATES = require("widgets/templates")

local IMAGE_SIZE = 68

---@param image string
---@param text string
---@param onclick fun()
---@param offset integer
function OmnikeyWidgets.InventoryButton(image, text, onclick, offset)
   local image_name = image .. ".tex"
   local atlas = GetInventoryItemAtlas(image_name)
   local x = IMAGE_SIZE * offset

   local button = TEMPLATES.IconButton(atlas, image_name, text, nil, nil, onclick)

   button.icon:SetScale(0.7)
   button:SetScale(1.25)
   button:SetPosition(x, 0, 0)
   button:MoveToFront()

   return button
end

return OmnikeyWidgets
