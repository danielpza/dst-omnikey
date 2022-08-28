local exports = {}

local Image = require("widgets/image")
local ImageButton = require("widgets/imagebutton")
local Button = require("widgets/button")

local IMAGE_SIZE = 68
local VERTICAL_OFFSET = 160

function exports.InventoryButton(params)
	local onClick
	local text
	local position
	local image
	image = params.image
	position = params.position
	text = params.text
	onClick = params.onClick
	local button = ImageButton("images/hud.xml", "inv_slot.tex")
	local x = IMAGE_SIZE * (-10 + position)
	button:SetPosition(x, VERTICAL_OFFSET, 0)
	button:SetOnClick(onClick)
	button:MoveToFront()
	if image then
		local icon = button:AddChild(Image(GetInventoryItemAtlas(image .. ".tex"), image .. ".tex"))
		icon:SetScale(0.8, 0.8, 0.8)
		icon:MoveToFront()
	end
	if text then
		local letter = button:AddChild(Button())
		letter:SetText(text)
		letter:SetPosition(5, 0, 0)
		letter:SetFont("stint-ucr")
		letter:SetTextColour(1, 1, 1, 1)
		letter:SetTextFocusColour(1, 1, 1, 1)
		letter:SetTextSize(50)
		letter:MoveToFront()
	end
	return button
end

return exports
